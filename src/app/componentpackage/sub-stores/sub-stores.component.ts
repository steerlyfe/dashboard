import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog, MatSnackBar } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { MyCookies } from 'src/app/utilpackages/my-cookies';
import { CommonMethods } from 'src/app/utilpackages/common-methods';
import { CommonWebApiService } from 'src/app/CommonMethods/CommonApis';
import { MyRoutingMethods } from 'src/app/utilpackages/my-routing-methods';
import { ViewSubStore, StoreStatus } from 'src/app/CommonMethods/CommonInterface';
import { DailogboxComponent } from '../dailogbox/dailogbox.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ChangeStoreStatus } from 'src/app/modelspackages/change-store-status';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sub-stores',
  templateUrl: './sub-stores.component.html',
  styleUrls: ['./sub-stores.component.css']
})
export class SubStoresComponent implements OnInit, ViewSubStore,StoreStatus {

  Tag = "SubStoresComponent"
  modalReference: NgbModalRef;
  subStoreList: Array<any>
  isloading = false
  changeSubStoreModal:ChangeStoreStatus
  storeId: string;
  storename: string
  LoginAccountType: string
  currentStatusIcon:string
  dailogMessage:string
  urlaccountType=""
  @ViewChild('childModal1', { static: false }) content: NgbModal;
  constructor(public router: Router, public httpclient: HttpClient, public cookiesservice: CookieService,
    public spinner: NgxSpinnerService, public dialog: MatDialog, public activatedRouter: ActivatedRoute,
    public modalService:NgbModal,public ngZone:NgZone,public snackBar:MatSnackBar,private location:Location) {
    this.isloading = false
    this.subStoreList = []
    this.storeId = ""
    this.storename = ""
    this.LoginAccountType = ""
    this.currentStatusIcon=""
    this.dailogMessage=""
    this.changeSubStoreModal= new ChangeStoreStatus("","sub_store","")
    
    this.checkLoginStatus()
  }
  checkLoginStatus() {
    var loginstatus = MyCookies.checkLoginStatus(this.cookiesservice)

    if (loginstatus) {
      this.LoginAccountType=MyCookies.getAccountType(this.cookiesservice)

      this.activatedRouter.params.subscribe(params => {
        CommonMethods.showconsole(this.Tag, "Show account Type :- " + params['accountype'])
        this.urlaccountType = params['accountype']
      })
      if (this.LoginAccountType == this.urlaccountType) {

        if (this.LoginAccountType == "super_admin") {
          this.activatedRouter.params.subscribe(params => {
            this.storeId = params['storeAcountId']
             CommonMethods.showconsole(this.Tag,"Store ID :- "+this.storeId)
             this.cookiesservice.set("store_account_id",this.storeId)
          })
        }
        else {
          this.storeId = MyCookies.getStoreAccountId(this.cookiesservice);
          this.storename = MyCookies.getStoreName(this.cookiesservice)
        }
        CommonWebApiService.viewSubStore(this.spinner, this.httpclient, this.cookiesservice, this, this.storeId,this.snackBar)  
      } else {
        CommonMethods.showconsole(this.Tag, "Else is working")
        this.location.back()
      }

    
    }
    else {

      MyRoutingMethods.gotoLogin(this.router)
    }
  }

  onResponseViewSubStore(status: string, allSubStoreList: Array<any>) {
    switch (status) {
      case "1":
        this.spinner.hide()
        this.isloading = true

        this.subStoreList = allSubStoreList;

        break;
      case "10":
      CommonMethods.showErrorDialog(this.snackBar,"Session Time Out")
      MyCookies.deletecookies(this.cookiesservice)
      MyRoutingMethods.gotoLogin(this.router)
        break
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


  tConvert (time) {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
     let timeformat= time[0]+time[1]+time[2]+time[5] ;
    // return time.join (''); // return adjusted time or original string
    return timeformat;
  }






  openModal(content) {
    this.modalReference = this.modalService.open(content,{ centered: true });
    //  this. modalReference.componentInstance.actionMessage = this.actionmessage;
  }
  JoinAndClose() {
    this.modalReference.close();
  }
  ngOnInit() {
  }


  accountStatus(Userstatus: string, userAccountId: string, content) {
    this.ngZone.run(() => {
      this.changeSubStoreModal.accountPublicId = userAccountId
       CommonMethods.showconsole(this.Tag,"before api Status:- "+Userstatus)
      if (Userstatus == 'inactive') {
        this.changeSubStoreModal.changeStatus = 'active'
        this.dailogMessage = "Do you want to activated this  sub store ?"
      } else {
        this.changeSubStoreModal.changeStatus = 'inactive'
        this.dailogMessage = "Do you want to deactivated this sub store ?"
      }
      this.openModal(content)
    })
  }

   changeStarusApiCall()
   {
     CommonWebApiService.changeStoreStatus(this.spinner,this.httpclient,this.cookiesservice,this.changeSubStoreModal,this,this.snackBar)
   }
   onResponseStoreStatus(status:string,message:string)
   {
    switch (status) {
      case "1":
        // this.spinner.hide();
        this.modalReference.close();
          CommonMethods.showSuccessDialog(this.snackBar,message)
             CommonMethods.showconsole(this.Tag,"")
              CommonMethods.showconsole(this.Tag,"Account id:- "+this.changeSubStoreModal.accountPublicId)
               for(var i=0;i<this.subStoreList.length;i++)
               {
                       CommonMethods.showconsole(this.Tag,"Accountid:- "+this.subStoreList[i].storeAccountId)
                    if(this.subStoreList[i].storeAccountId == this.changeSubStoreModal.accountPublicId )
                    {
                       CommonMethods.showconsole(this.Tag,"Updated Status:- "+this.subStoreList[i]['storeStatus'])
                       this.subStoreList[i]['storeStatus']=this.changeSubStoreModal.changeStatus
                      break;
                    }
                    
               }
              break;
      case "10":
      CommonMethods.showErrorDialog(this.snackBar,"Session Time Out")
      MyCookies.deletecookies(this.cookiesservice)
      MyRoutingMethods.gotoLogin(this.router)
        break;
      default:
        alert("Error Occured, Please try again");
        break;

    }
   }


  getColor(status) {

    switch (status) {
      case 'inactive':
      this.currentStatusIcon="visibility_off" 
        return 'red';
      case 'active':
      this.currentStatusIcon="visibility"
        return 'green';
    }
  }



}
