import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatSnackBar } from '@angular/material';
import { CreatePost } from 'src/app/modelspackages/create-post';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { PhotouploadfirebaseService } from 'src/app/firebaseconsole/photouploadfirebase.service';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import { MyCookies } from 'src/app/utilpackages/my-cookies';
import { MyConstants } from 'src/app/utilpackages/constant';
import { CommonMethods } from 'src/app/utilpackages/common-methods';
import { MyRoutingMethods } from 'src/app/utilpackages/my-routing-methods';
import { CommonWebApiService } from 'src/app/CommonMethods/CommonApis';
import { GetEditPostData, UpdatePost } from 'src/app/CommonMethods/CommonInterface';
import { Location } from '@angular/common';
import { UpadtePost } from 'src/app/modelspackages/update-post';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit, GetEditPostData, UpdatePost {

  Tag = "CreatePostComponent"
  addPostModal: CreatePost
  indexupload: number
  categoryList: Array<any>
  categoryIds: any
  postPublicId: any
  urlaccountType: any
  accountType: any
  isimageUloaded = false
  // categoryIds:any
  updatePostModal: UpadtePost
  constructor(public snackbar: MatSnackBar, public httpClient: HttpClient, public spinner: NgxSpinnerService,
    private storage: AngularFireStorage, public uploadService: PhotouploadfirebaseService, public cookiesSerivce: CookieService,
    public router: Router, public activatedRouter: ActivatedRoute, public location: Location) {
    this.indexupload = 0
    this.categoryList = []
    this.categoryIds = ""
    this.postPublicId = ""
    this.urlaccountType = ""
    this.accountType = ""
    this.isimageUloaded = false
    this.addPostModal = new CreatePost("", [], [], [], [], "")
    this.updatePostModal = new UpadtePost([], [], [], "", [],"")
    this.checkLoginStatus()
  }
  ngOnInit() {
  }


  checkLoginStatus() {

    var loginstatus = MyCookies.checkLoginStatus(this.cookiesSerivce)
    if (loginstatus) {
      this.accountType = MyCookies.getAccountType(this.cookiesSerivce)
      // // // this.addproduct.storeAccounId=MyCookies.getStoreAccountId(this.cookiesservice)      
      // // if (accountType == "admin" || accountType == "manager") {
      // //   this.updated.substoreAccounId = ""
      // // } else if (accountType == "sub_admin" || accountType == "sub_manager") {
      // //   this.addproduct.substoreAccounId = MyCookies.getSubStoreAccountId(this.cookiesservice)
      // // }postId
      // // else {

      // // }









      this.activatedRouter.params.subscribe(params => {
        CommonMethods.showconsole(this.Tag, "Show account Type :- " + params['accountype'])
        this.urlaccountType = params['accountype']
      })


      this.activatedRouter.params.subscribe(params => {

        this.postPublicId = params['postId']
        CommonMethods.showconsole(this.Tag, "POst Public ID :- " + this.postPublicId)
      })

      if (this.accountType == this.urlaccountType) {

        /**
         * 
         *  Call Get category Mathod 
         * 
         */
        this.getCategoreis()

        /**
         * 
         *  Calling  Get   Post Method 
         * 
         */
        this.getPostMethod()
      } else {
        CommonMethods.showconsole(this.Tag, "Else is working")
        this.location.back()
      }





    }
    else {
      MyRoutingMethods.gotoLogin(this.router)
    }
  }


  /**
   * 
   * Get Category Data Method
   * 
   */

  getCategoreis() {
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
  }
  /*
  
  get post Data and Set Data  Method
  
  */

  getPostMethod() {
    CommonWebApiService.getPostParticularPPostData(this.spinner, this.httpClient, this.cookiesSerivce, this.snackbar, this, this.postPublicId)
  }


  /**
   * 
   * Response Hendle Of Get post Data  
   * 
   */

  onResponsegetEditPostDataInterface(status: any, dataListPost: any) {
    switch (status) {
      case "1":
        CommonMethods.showconsole(this.Tag, "Data list Pos:- " + JSON.stringify(dataListPost))
        this.updatePostModal.post_id=dataListPost.postId
         CommonMethods.showconsole(this.Tag,"POst Id :- "+this.updatePostModal.post_id)
        this.categoryIds = dataListPost['categoryList']
        this.updatePostModal.imagesurl = dataListPost['postImages']
        // this.updatePostModal.firebaseImage=dataListPost['postImages']
        this.updatePostModal.content = dataListPost['title']


        for (var i = 0; i < dataListPost['postImages'].length; i++) {
          this.updatePostModal.firebaseImage.push(dataListPost['postImages'][i])
        }

        break;
      case "10":
        CommonMethods.showErrorDialog(this.snackbar, "Session Time Out")
        MyCookies.deletecookies(this.cookiesSerivce)
        MyRoutingMethods.gotoLogin(this.router)
        break;
      default:
        alert('Error Occured, Please try again');
        break;
    }
  }


  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        CommonMethods.showconsole(this.Tag, "IMage filr name :- " + JSON.stringify(event.target.files[i]))
        this.updatePostModal.selectedImageUrl.push({
          "filepath": event.target.files[i],
          "uploadImage": false
        })
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[i]);
        reader.onload = (innerEvent) => {
          this.updatePostModal.imagesurl.push((<FileReader>innerEvent.target).result);
        }
      }
      event.srcElement.value = null
    }
    CommonMethods.showconsole(this.Tag, "Selected  Images :- " + JSON.stringify(this.addPostModal.selectedImageUrl))

    this.isimageUloaded = true
  }

  // Remove Images
  imageremove(imageurl: any) {
    const index1 = this.updatePostModal.selectedImageUrl.indexOf(imageurl)
    this.updatePostModal.selectedImageUrl.splice(index1, 1)
    const index = this.updatePostModal.imagesurl.indexOf(imageurl)
    this.updatePostModal.imagesurl.splice(index, 1)
    this.updatePostModal.firebaseImage.splice(index, 1)

    if (this.updatePostModal.selectedImageUrl.length == 0) {
      this.isimageUloaded = false
    }
    if (this.indexupload != 0) {
      this.indexupload--
    }
  }

  vaildation() {
    if (this.updatePostModal.imagesurl.length == 0) {
      CommonMethods.showErrorDialog(this.snackbar, "Select post images")
      return false
    } else if (this.updatePostModal.content.trim().length == 0) {
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
    // CommonMethods.showconsole(this.Tag, "Index of upload into upload :- " + this.indexupload)
    // if (this.addPostModal.selectedImageUrl[this.indexupload].uploadImage == false) {

    //   CommonMethods.uploadPhoto(MyConstants.FOLDER_PATH_FIREBASE_POST, this.addPostModal.selectedImageUrl[this.indexupload].filepath, this.storage, this)
    //   CommonMethods.showconsole(this.Tag, "If is working uloaded:-0 " + this.addPostModal.selectedImageUrl[this.indexupload].uploadImage)
    // }

    if (this.updatePostModal.selectedImageUrl[this.indexupload].uploadImage == false) {
      CommonMethods.uploadPhoto(MyConstants.FOLDER_PATH_FIREBASE_PRODUCT, this.updatePostModal.selectedImageUrl[this.indexupload].filepath, this.storage, this)
      CommonMethods.showconsole(this.Tag, "If is working uloaded:-0 " + this.updatePostModal.selectedImageUrl[this.indexupload].uploadImage)
    }
  }

  onUploadImageResponse(url: string) {


    CommonMethods.showconsole(this.Tag, 'FirebAse Url :- ' + url);
    // CommonMethods.showconsole(this.Tag, "Upload image array :- " + JSON.stringify(this.updatePostModal.firebaseImage))
    this.updatePostModal.firebaseImage.push(url)
    this.updatePostModal.selectedImageUrl[this.indexupload].uploadImage = true
    this.indexupload++

    if (this.updatePostModal.selectedImageUrl.length == this.indexupload) {
      CommonMethods.showconsole(this.Tag, "If Works")
      this.isimageUloaded = false
      CommonMethods.showconsole(this.Tag, "Image Url:- " + JSON.stringify(this.updatePostModal.firebaseImage))
      CommonMethods.showconsole(this.Tag, "categories:- " + JSON.stringify(this.updatePostModal.categories))
      CommonMethods.showconsole(this.Tag, "conent:- " + this.updatePostModal.content)
      // CommonWebApiService.updateProduct(this.spinner, this.httpClient, this.cookiesSerivce, this.updatePostModal, this,this.snackbar)

    }
    else {
      CommonMethods.showconsole(this.Tag, "Else Works")

      CommonWebApiService.updatePostApi(this.spinner, this.httpClient, this.cookiesSerivce, this.snackbar, this,  this.updatePostModal)
      // this.uploadPhotoIntoFirebase();

    }


    // CommonMethods.showconsole(this.Tag, 'FirebAse Url :- ' + url);
    // this.addPostModal.firebaseUploadImage.push(url)
    // this.addPostModal.selectedImageUrl[this.indexupload].uploadImage = true
    // this.indexupload++

    // if (this.addPostModal.selectedImageUrl.length == this.indexupload) {
    //   this.spinner.hide()
    //   CommonMethods.showconsole(this.Tag, "If is working ")
    //   CommonMethods.showconsole(this.Tag, "Fire Upload image array :- " + JSON.stringify(this.addPostModal.firebaseUploadImage))
    // }
    // else {
    //   CommonMethods.showconsole(this.Tag, "Else Works")
    //   this.uploadPhotoIntoFirebase();

    // }

  }

  callUpdatePostApi() {
    this.updatePostModal.categories = []
    if (this.vaildation()) {
       this.spinner.show()
      for (var i = 0; i < this.categoryIds.length; i++) {

        this.updatePostModal.categories.push(this.categoryIds[i])

      }
      // this.spinner.show()


      if (this.isimageUloaded == true) {

        this.uploadService.signIn().then(res => {
          // this.spinner.show()
          this.uploadPhotoIntoFirebase();

        }).catch(res => {
          CommonMethods.showconsole(this.Tag, "Working on error:- " + res)
        })

      }
      else {
        CommonMethods.showconsole(this.Tag, "Image Url:- " + JSON.stringify(this.updatePostModal.firebaseImage))
        CommonMethods.showconsole(this.Tag, "categories:- " + JSON.stringify(this.updatePostModal.categories))
        CommonMethods.showconsole(this.Tag, "conent:- " + this.updatePostModal.content)
        CommonMethods.showconsole(this.Tag, "Phpoto Uloaded Alerady ")


        CommonWebApiService.updatePostApi(this.spinner, this.httpClient, this.cookiesSerivce, this.snackbar, this, this.updatePostModal)
      }


      // CommonMethods.showconsole(this.Tag, "Validation :- " + this.vaildation())
      // if (this.addPostModal.selectedImageUrl.length != this.indexupload) {
      //   CommonMethods.showconsole(this.Tag, "if is working")
      //   this.uploadService.signIn().then(res => {
      //     this.uploadPhotoIntoFirebase();
      //   }).catch(error => {
      //     CommonMethods.showconsole(this.Tag, "Error" + error)
      //   })
      // } else {
      //   CommonMethods.showconsole(this.Tag, "else is working")
      // }

    }
  }
  onResponseUpdatePostInterface(status: string, message: string) {
    switch (status) {
      case "1":

        // this.snackbar.open(message, "", {
        //   duration: 2000,
        //   verticalPosition: 'top',
        //   panelClass: ['sucess-snackbar']
        // });

        CommonMethods.showSuccessDialog(this.snackbar, message)
        MyRoutingMethods.gotoPostView(this.router, this.accountType)
        break;
      case "10":
        CommonMethods.showErrorDialog(this.snackbar, "Session Time Out")
        MyCookies.deletecookies(this.cookiesSerivce)
        MyRoutingMethods.gotoLogin(this.router)
        break;
      case "11":
        CommonMethods.showErrorDialog(this.snackbar, message)
        break;
      case "0":
        CommonMethods.showErrorDialog(this.snackbar, message)
        break;
      default:
        alert("Error Occured, Please try again");
        break;
    }
  }

}
