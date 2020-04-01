import { Component, OnInit } from '@angular/core';
import { ChangeProfileSetting } from 'src/app/modelspackages/change-profile';
import { CommonMethods } from 'src/app/utilpackages/common-methods';
import { MyRoutingMethods } from 'src/app/utilpackages/my-routing-methods';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import { MyCookies } from 'src/app/utilpackages/my-cookies';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material';
import { PhotouploadfirebaseService } from 'src/app/firebaseconsole/photouploadfirebase.service';
import { MyConstants } from 'src/app/utilpackages/constant';
import { NgxSpinnerService } from 'ngx-spinner';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-change-profile',
  templateUrl: './change-profile.component.html',
  styleUrls: ['./change-profile.component.css']
})
export class ChangeProfileComponent implements OnInit {
  Tag = "ChangeProfileComponent"
  bannerurl: any
  chnageProfileModal: ChangeProfileSetting;
  urlaccountType: any
  accountType: any
  sub_store_account_id: any
  storeAccountId: any
  accountTypelist: Array<any>

  constructor(public cookiesservice: CookieService, public router: Router, public activatedRouter: ActivatedRoute,
    public location: Location, public snackBar: MatSnackBar,public uploadservice: PhotouploadfirebaseService,public spinner:NgxSpinnerService,
    private storage: AngularFireStorage,) {

    this.chnageProfileModal = new ChangeProfileSetting("", "", "", "")
    // this.bannerurl = ""
    // this.bannerurl = "https://firebasestorage.googleapis.com/v0/b/steerlyfe-e2405.appspot.com/o/store-logo%2FGroup%202.png?alt=media&token=14dafba1-0217-4ceb-b7e0-53eb2e717c32"
    this.checkLoginStatus()
  }

  ngOnInit() {
  }

  /**
   * 
   *  Check login  value 
   * 
   */
  checkLoginStatus() {

    var loginstatus = MyCookies.checkLoginStatus(this.cookiesservice)

    if (loginstatus) {
      this.accountType = MyCookies.getAccountType(this.cookiesservice)
      this.activatedRouter.params.subscribe(params => {
        CommonMethods.showconsole(this.Tag, "Show account Type :- " + params['accountype'])
        this.urlaccountType = params['accountype']
        CommonMethods.showconsole(this.Tag, "Url Account Type; " + this.urlaccountType)
      })
      if (this.accountType == this.urlaccountType) {

        this.chnageProfileModal.imageUrl = MyCookies.getStoreImage(this.cookiesservice)
        this.chnageProfileModal.name = MyCookies.getUserName(this.cookiesservice)


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
   *  Select Image Set Into Image Url 
   * 
   */

  onSelectFile(event) {
    // this.firebaseiimageurl=""
    if (event.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (innerEvent) => {
        this.chnageProfileModal.imageUrl = (<FileReader>innerEvent.target).result;
        // this.addSubStoreModel.selectbannerurl = event.target.files[0]
      }
    }
  }

  /**
   * 
   * Validation Fields
   * 
   */

  validation() {


    if (this.chnageProfileModal.name.trim().length === 0) {
      CommonMethods.showErrorDialog(this.snackBar, "Enter Name")
      return false
    } else {
      return true
    }
  }


  /**
   * 
   *   Update Profile  Api Call 
   * 
   */
  updateProfile() {
       if(this.validation())
       {
           if(this.chnageProfileModal.selectedImageUrl.length != 0)
           {
            this.uploadservice.signIn().then(res => {
              this.spinner.show()
              CommonMethods.uploadPhoto(MyConstants.FOLDER_PATH_FIREBASE_BANNER, this.chnageProfileModal.selectedImageUrl, this.storage, this)
            }).catch(res => {
              CommonMethods.showconsole(this.Tag, "Working  on error:- " + res)
            })    
           }else{

           }
       }
  }




  onUploadImageResponse(firebaseimageurl: string) {
    CommonMethods.showconsole(this.Tag, "Fire Image Url :- " + firebaseimageurl)
    this.chnageProfileModal.firbaseUrl = firebaseimageurl
    // CommonWebApiService.addSubStore(this.spinner, this.httpClient, this.cookiesService, this, this.addSubStoreModel, firebaseimageurl,this.snackBar)

  }

  // onResponseAddSubStore(status: string, message: string) {
  //   switch (status) {
  //     case "1":
  //       CommonMethods.showSuccessDialog(this.snackBar, message)
  //       if (MyCookies.getAccountType(this.cookiesservice) == "super_admin") {
  //         // MyRoutingMethods.gotoSuperadminviewSubStore(this.router, this.addSubStoreModel.storeId,this.accountType)
  //       }
  //       else {
  //         MyRoutingMethods.gotoviewSubStore(this.router,this.accountType)
  //       }
  //       break;
  //     case "10":
  //     CommonMethods.showErrorDialog(this.snackBar,"Session Time Out")
  //     MyCookies.deletecookies(this.cookiesService)
  //     MyRoutingMethods.gotoLogin(this.router)
  //       break;
  //     case "11":
  //       CommonMethods.showErrorDialog(this.snackBar, message)
  //       break;
  //     case "0":
  //       CommonMethods.showErrorDialog(this.snackBar, message)
  //       break;
  //     default:
  //       alert("Error Occured, Please try again");
  //       break;
  //   }
  // }





}
