import { Component, OnInit } from '@angular/core';
import { CommonMethods } from 'src/app/utilpackages/common-methods';
import { CreatePost } from 'src/app/modelspackages/create-post';
import { MatSnackBar } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { MyConstants } from 'src/app/utilpackages/constant';
import { AngularFireStorage } from '@angular/fire/storage';
import { PhotouploadfirebaseService } from 'src/app/firebaseconsole/photouploadfirebase.service';
import { MyCookies } from 'src/app/utilpackages/my-cookies';
import { CookieService } from 'ngx-cookie-service';
import { MyRoutingMethods } from 'src/app/utilpackages/my-routing-methods';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonWebApiService } from 'src/app/CommonMethods/CommonApis';
import { AddPost } from 'src/app/CommonMethods/CommonInterface';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit, AddPost {
  Tag = "CreatePostComponent"
  addPostModal: CreatePost
  indexupload: number
  categoryList: Array<any>
  categoryIds: any
  accountType: string
  urlaccountType = ""
  constructor(public snackbar: MatSnackBar, public httpClient: HttpClient, public spinner: NgxSpinnerService,
    private storage: AngularFireStorage, public uploadService: PhotouploadfirebaseService, public cookiesSerivce: CookieService,
    public router: Router, public snackBar: MatSnackBar, public activatedRouter: ActivatedRoute, private location: Location) {
    this.indexupload = 0
    this.categoryList = []
    this.categoryIds = ""
    this.accountType = ""
    this.addPostModal = new CreatePost("", [], [], [], [], "")
    this.checkLoginStatus()
  }
  ngOnInit() {
  }


  checkLoginStatus() {

    var loginstatus = MyCookies.checkLoginStatus(this.cookiesSerivce)
    if (loginstatus) {
      // let accountType = MyCookies.getAccountType(this.cookiesservice)
      // // this.addproduct.storeAccounId=MyCookies.getStoreAccountId(this.cookiesservice)      
      // if (accountType == "admin" || accountType == "manager") {
      //   this.updated.substoreAccounId = ""
      // } else if (accountType == "sub_admin" || accountType == "sub_manager") {
      //   this.addproduct.substoreAccounId = MyCookies.getSubStoreAccountId(this.cookiesservice)
      // }
      // else {

      // }
      this.accountType = MyCookies.getAccountType(this.cookiesSerivce)


      this.activatedRouter.params.subscribe(params => {
        CommonMethods.showconsole(this.Tag, "Show account Type :- " + params['accountype'])
        this.urlaccountType = params['accountype']
      })
      if (this.accountType == this.urlaccountType) {
        this.httpClient.get(MyConstants.BASEURL + 'categoryList.php').subscribe(responseData => {
          let status = responseData['status']
          switch (status) {
            case '1':
              this.categoryList = responseData['categoriesList']
              break;
            default:
              alert("Error Occured, Please try again");
              break
          }
        },
          response => {
            CommonMethods.showconsole(this.Tag, "Response Error:- " + response)
          },
          () => {
            CommonMethods.showconsole(this.Tag, 'Finish');
          }
        )
        if (this.accountType == "admin" || this.accountType == "manager") {
          this.activatedRouter.params.subscribe(params => {
            this.addPostModal.subStoreAccountId = params['SubStoreAccountId']
            CommonMethods.showconsole(this.Tag, "Show account id :- " + this.addPostModal.subStoreAccountId)
          })
          if (this.addPostModal.subStoreAccountId == undefined) {
            this.addPostModal.subStoreAccountId = ""
          }
        }
        else if (this.accountType == "sub_admin" || this.accountType == "sub_manager") {
          this.addPostModal.subStoreAccountId = MyCookies.getSubStoreAccountId(this.cookiesSerivce)
        }
      } else {
        CommonMethods.showconsole(this.Tag, "Else is working")
        this.location.back()
      }


    }

    else {
      MyRoutingMethods.gotoLogin(this.router)
    }


  }




  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        CommonMethods.showconsole(this.Tag, "IMage filr name :- " + JSON.stringify(event.target.files[i]))
        this.addPostModal.selectedImageUrl.push({
          "filepath": event.target.files[i],
          "uploadImage": false
        })
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[i]);
        reader.onload = (innerEvent) => {
          this.addPostModal.imageUrl.push((<FileReader>innerEvent.target).result);
        }
      }
      event.srcElement.value = null
    }
    CommonMethods.showconsole(this.Tag, "Selected  Images :- " + JSON.stringify(this.addPostModal.selectedImageUrl))
  }

  // Remove Images
  imageremove(imageurl: any) {
    const index1 = this.addPostModal.selectedImageUrl.indexOf(imageurl)
    this.addPostModal.selectedImageUrl.splice(index1, 1)
    const index = this.addPostModal.imageUrl.indexOf(imageurl)
    this.addPostModal.imageUrl.splice(index, 1)
    // this.addproduct.firebaseimageurl.splice(index, 1)
    if (this.indexupload != 0) {
      this.indexupload--
    }
  }

  vaildation() {
    if (this.addPostModal.selectedImageUrl.length == 0) {
      CommonMethods.showErrorDialog(this.snackbar, "Select post images")
      return false
    } else if (this.addPostModal.content.trim().length == 0) {
      CommonMethods.showErrorDialog(this.snackbar, "Enter content")
      return false
    } else if (this.categoryIds.length == 0) {
      CommonMethods.showErrorDialog(this.snackbar, "Select Category")
      return false
    } else {
      return true
    }
  }
  uploadPhotoIntoFirebase() {
    // CommonMethods.uploadPhoto()
    CommonMethods.showconsole(this.Tag, "Index of upload into upload :- " + this.indexupload)
    if (this.addPostModal.selectedImageUrl[this.indexupload].uploadImage == false) {

      CommonMethods.uploadPhoto(MyConstants.FOLDER_PATH_FIREBASE_POST, this.addPostModal.selectedImageUrl[this.indexupload].filepath, this.storage, this)
      CommonMethods.showconsole(this.Tag, "If is working uloaded:-0 " + this.addPostModal.selectedImageUrl[this.indexupload].uploadImage)
    }
  }



  callAddPostApi() {
    if (this.vaildation()) {
      this.spinner.show()
      for (var i = 0; i < this.categoryIds.length; i++) {

        this.addPostModal.categoryId.push(this.categoryIds[i])

      }

      CommonMethods.showconsole(this.Tag, "Validation :- " + this.vaildation())
      if (this.addPostModal.selectedImageUrl.length != this.indexupload) {
        CommonMethods.showconsole(this.Tag, "if is working")
        this.uploadService.signIn().then(res => {
          this.uploadPhotoIntoFirebase();
        }).catch(error => {
          CommonMethods.showconsole(this.Tag, "Error" + error)
        })
      } else {
        CommonMethods.showconsole(this.Tag, "else is working")
        CommonWebApiService.createPost(this.spinner, this.httpClient, this.cookiesSerivce, this.addPostModal, this,this.snackBar)

      }

    }
  }

  onUploadImageResponse(url: string) {

    CommonMethods.showconsole(this.Tag, 'FirebAse Url :- ' + url);
    this.addPostModal.firebaseUploadImage.push(url)
    this.addPostModal.selectedImageUrl[this.indexupload].uploadImage = true
    this.indexupload++

    if (this.addPostModal.selectedImageUrl.length == this.indexupload) {
      CommonMethods.showconsole(this.Tag, "If is working ")
      CommonMethods.showconsole(this.Tag, "Fire Upload image array :- " + JSON.stringify(this.addPostModal.firebaseUploadImage))
      CommonMethods.showconsole(this.Tag, "Show tiotle:- " + this.addPostModal.content)
      CommonMethods.showconsole(this.Tag, "Show category:- " + JSON.stringify(this.addPostModal.categoryId))
      CommonWebApiService.createPost(this.spinner, this.httpClient, this.cookiesSerivce, this.addPostModal, this,this.snackBar)
    }
    else {
      CommonMethods.showconsole(this.Tag, "Else Works")
      this.uploadPhotoIntoFirebase();

    }

  }
  onResponseAddPost(status: string, message: string) {
    switch (status) {
      case "1":

        this.snackBar.open(message, "", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['sucess-snackbar']
        });
        if (this.accountType == "admin" || this.accountType == "manager") {
          if (this.addPostModal.subStoreAccountId != "") {
            MyRoutingMethods.gotoSubStorePostView(this.router, this.addPostModal.subStoreAccountId,this.accountType)

          } else {
            MyRoutingMethods.gotoPostView(this.router,this.accountType)
          }
        } else {
          MyRoutingMethods.gotoPostView(this.router,this.accountType)
        }

        break;
      case "10":
        CommonMethods.showErrorDialog(this.snackBar, "Session Time Out")
        MyCookies.deletecookies(this.cookiesSerivce)
        MyRoutingMethods.gotoLogin(this.router)
        break;
      case "11":
        CommonMethods.showErrorDialog(this.snackBar, message)

        break;
      case "0":
        CommonMethods.showErrorDialog(this.snackBar, message)
        break;
      default:
        alert("Error Occured, Please try again");
        break;
    }
  }









}
