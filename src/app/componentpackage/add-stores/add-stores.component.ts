import { Component, OnInit } from '@angular/core';
import { AddStoreMadal } from 'src/app/modelspackages/add-strore';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CommonMethods } from 'src/app/utilpackages/common-methods';
import { AngularFireStorage } from '@angular/fire/storage';
import { PhotouploadfirebaseService } from 'src/app/firebaseconsole/photouploadfirebase.service';
import { MyConstants } from 'src/app/utilpackages/constant';
import { UploadImageUrl, AddStore } from 'src/app/CommonMethods/CommonInterface';
import { MatDialog } from '@angular/material/dialog';
import { DailogboxComponent } from '../dailogbox/dailogbox.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonWebApiService } from 'src/app/CommonMethods/CommonApis';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { MyRoutingMethods } from 'src/app/utilpackages/my-routing-methods';
import { MyCookies } from 'src/app/utilpackages/my-cookies';
import { Location } from '@angular/common';
@Component({
  selector: 'app-add-stores',
  templateUrl: './add-stores.component.html',
  styleUrls: ['./add-stores.component.css']
})
export class AddStoresComponent implements OnInit, UploadImageUrl, AddStore {
  Tag = "AddStoresComponent";
  storemodal: AddStoreMadal
  sucessMessage: string;
  firebaseiimageurl: string
  buttonclick = false
  buttonstoreclick = false
  buttonName = ""
  accountType:string
  urlaccountType:string
  constructor(public activeRouter: ActivatedRoute, public router: Router, private storage: AngularFireStorage,
    public uploadservice: PhotouploadfirebaseService, public dialog: MatDialog, private snackBar: MatSnackBar, public cookiesService: CookieService,
    public httpClient: HttpClient, public spinner: NgxSpinnerService,public activatedRouter:ActivatedRoute,private location:Location) {
    this.sucessMessage = ""
    this.firebaseiimageurl = ""
    this.buttonclick = true
    this.buttonstoreclick = false
    this.buttonName = "Add Store"
    this.storemodal = new AddStoreMadal("", " ", "", "")
    this.storemodal.type = "store"
    this.storemodal.imageUrl = "assets/images/gallery.png"
    this.accountType=""
    this.urlaccountType=""
    this.checkLogin()
  }

  ngOnInit() {
    document.getElementById("store").classList.add("active")
  }
  checkLogin() {
      let loginstatus=MyCookies.checkLoginStatus(this.cookiesService)
      if(loginstatus){
         this.accountType=MyCookies.getAccountType(this.cookiesService)
            // if(this.account)
            // {

            // }
            this.activatedRouter.params.subscribe( params =>{
                 CommonMethods.showconsole(this.Tag,"Show account Type :- "+params['accountype'])
                 this.urlaccountType=params['accountype']
                })
            if(this.accountType == this.urlaccountType )
            {

            }else{
               CommonMethods.showconsole(this.Tag,"Else is working")
               this.location.back()
            }

         
      }
      else{
       MyRoutingMethods.gotoLogin(this.router)
      }
  }

  showErrorDialog(message: string) {
    this.snackBar.open(message, "", {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: ['blue-snackbar']
    });
  }

  validation() {
    if (this.storemodal.selectedImageUrl.length === 0) {
      this.showErrorDialog("Select Image")
      return false
    }
    else if (this.storemodal.storeName.trim().length === 0) {
      if (this.storemodal.type == 'store') {
        this.showErrorDialog("Enter Store Name")

      }
      else {
        this.showErrorDialog("Enter Brand Name")
      }
      return false

    }
    else {
      return true
    }
  }


  onSelectFile(event) {
    this.firebaseiimageurl = ""
    if (event.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (innerEvent) => {
        this.storemodal.imageUrl = (<FileReader>innerEvent.target).result;
        this.storemodal.selectedImageUrl = event.target.files[0]
      }
    }
  }


  addStoreApi() {
    if (this.validation()) {

      if (this.firebaseiimageurl.length === 0) {

        this.uploadservice.signIn().then(res => {
          this.spinner.show()
          CommonMethods.uploadPhoto(MyConstants.FOLDER_PATH_FIREBASE_STORE, this.storemodal.selectedImageUrl, this.storage, this)
        }).catch(res => {
          CommonMethods.showconsole(this.Tag, "Working  on error:- " + res)
        })
      }
      else {
        CommonWebApiService.addStore(this.spinner, this.cookiesService, this.firebaseiimageurl, this.storemodal, this.httpClient, this,this.snackBar)

      }

    }
  }


  onUploadImageResponse(firebaseimageurl: string) {

    this.firebaseiimageurl = firebaseimageurl
    CommonWebApiService.addStore(this.spinner, this.cookiesService, firebaseimageurl, this.storemodal, this.httpClient, this,this.snackBar)
  }
  onResponseAddStore(status: string, message: string) {
    switch (status) {
      case "1":

        if (this.storemodal.type == "store") {
          this.snackBar.open("New store added successfully", "", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['sucess-snackbar']
          });
        }
        else {
          this.snackBar.open("New brand added successfully", "", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['sucess-snackbar']
          });
        }

        MyRoutingMethods.gotoStoreLists(this.router,this.accountType)
        break;
      case "10":
        CommonMethods.showErrorDialog(this.snackBar, "Session Time Out")
        MyCookies.deletecookies(this.cookiesService)
        MyRoutingMethods.gotoLogin(this.router)
        break;
      case "11":
        this.showErrorDialog(message)

        break;
      case "0":
        this.showErrorDialog(message)

        break;
      default:
        alert("Error Occured, Please try again");
        break;
    }

  }




  openDialog(): void {
    const dialogRef = this.dialog.open(DailogboxComponent, {
      data: { message: "Session Time Out" }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // this.animal = result;
    });
  }




  selectedStroe() {
    if (this.buttonclick == false) {
      document.getElementById("brand").classList.remove("active")
      document.getElementById("store").classList.add("active")
      this.buttonName = "Add Store"
      this.buttonclick = true
      this.buttonstoreclick = false
      this.storemodal.type = "store"
    }

  }
  selectedBrand() {


    if (this.buttonstoreclick == false) {
      document.getElementById("store").classList.remove("active")
      document.getElementById("brand").classList.add("active")
      this.buttonName = "Add Brand"
      this.buttonstoreclick = true
      this.buttonclick = false
      this.storemodal.type = "brand"
    }



  }



}
