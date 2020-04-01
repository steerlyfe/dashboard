import { Component, OnInit, NgZone } from '@angular/core';
import { CommonMethods } from 'src/app/utilpackages/common-methods';
import { MyCookies } from 'src/app/utilpackages/my-cookies';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MyRoutingMethods } from 'src/app/utilpackages/my-routing-methods';
import { Location } from '@angular/common';
import { CommonWebApiService } from 'src/app/CommonMethods/CommonApis';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material';
import { GetCouponList, ChangeCouponStatus } from 'src/app/CommonMethods/CommonInterface';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-promocode-list',
  templateUrl: './promocode-list.component.html',
  styleUrls: ['./promocode-list.component.css']
})
export class PromocodeListComponent implements OnInit, GetCouponList ,ChangeCouponStatus {
  Tag = "PromocodeListComponent"
  promoCodeList: Array<any>
  modalReference: NgbModalRef
  accountType: any
  urlaccountType: any
  count: any
  isLoading = false
  currentStatusIcon: any
  CouponId: any
  couponStatusAction: any
  dailogMessage:any


  constructor(public cookiesservice: CookieService, public activedRouter: ActivatedRoute, public location: Location,
    public router: Router, public httpClient: HttpClient, public spinner: NgxSpinnerService, public snackBar: MatSnackBar,
    public modalService: NgbModal, public ngZone: NgZone) {
    this.promoCodeList = []
    this.accountType = ""
    this.urlaccountType = ""
    this.currentStatusIcon = ""
    this.CouponId = ""
    this.couponStatusAction = ""
    this.dailogMessage=""
    this.count = 0
    this.isLoading = false
    this.checkLoginStatus()
  }



  checkLoginStatus() {

    if (MyCookies.checkLoginStatus(this.cookiesservice)) {
      this.accountType = MyCookies.getAccountType(this.cookiesservice)

      this.activedRouter.params.subscribe(params => {
        CommonMethods.showconsole(this.Tag, "Show account Type :- " + params['accountype'])
        this.urlaccountType = params['accountype']
      })
      if (this.accountType == this.urlaccountType) {
        CommonWebApiService.getCouponList(this.spinner, this.httpClient, this.cookiesservice, this.snackBar, this, this.count)

      } else {
        CommonMethods.showconsole(this.Tag, "Else is working")
        this.location.back()
      }

      // CommonMethods.showconsole(this.Tag, "store id :- " + this.storeAccountId)
    }
    else {
      MyRoutingMethods.gotoLogin(this.router)
    }
  }




  onResponseGetCouponListInterface(status: any, couponList: Array<any>, pagepercount: any) {
    switch (status) {
      case "1":
        this.spinner.hide();
        this.isLoading = true
        // this.isLoading = true;
        CommonMethods.showconsole(this.Tag, "Array List :- " + JSON.stringify(couponList))
        this.promoCodeList = couponList
        break;
      case "10":
        CommonMethods.showErrorDialog(this.snackBar, "Session Time Out")
        MyCookies.deletecookies(this.cookiesservice)
        MyRoutingMethods.gotoLogin(this.router)
        break;
      default:
        alert('Error Occured, Please try again');
        break;
    }
  }




  openModal(content) {
    this.modalReference = this.modalService.open(content, { centered: true });
    //  this. modalReference.componentInstance.actionMessage = this.actionmessage;
  }
  JoinAndClose() {
    this.modalReference.close();
  }


  couponStatus(couponStatus: string, couponPublicId: string, content) {
    this.ngZone.run(() => {
      this.CouponId = ""
      this.CouponId = couponPublicId
      
      CommonMethods.showconsole(this.Tag, "before api Status:- " + this.CouponId)
      CommonMethods.showconsole(this.Tag, "before api Status:- " + couponStatus)
      if (couponStatus == 'inactive') {
        this.couponStatusAction = 'active'
        this.dailogMessage = "Do you want to activated this  coupon ?"
      } else {
        this.couponStatusAction = 'inactive'
        this.dailogMessage = "Do you want to deactivated this coupon ?"
      }
      this.openModal(content)
    })
  }

  changeStarusApiCall() {
    // CommonWebApiService.changeProductStatus(this.spinner, this.httpclient, this.cookiesservice, this.changeProductStatus, this)
       CommonWebApiService.updateCouponStatus(this.spinner,this.httpClient,this.cookiesservice,this.snackBar,this,this.CouponId,this.couponStatusAction) 
  }
  onResponseChangeCouponStatusInterface(status: string, message: string) {
    switch (status) {
      case "1":

        this.modalReference.close();

        CommonMethods.showconsole(this.Tag, "Coupon id:- " + this.CouponId)
        for (var i = 0; i < this.promoCodeList.length; i++) {
          CommonMethods.showconsole(this.Tag, "Accountid:- " + this.promoCodeList[i].couponId)
          if (this.promoCodeList[i].couponId == this.CouponId) {
            CommonMethods.showconsole(this.Tag, "Updated Status:- " + this.promoCodeList[i]['current_status'])
            this.promoCodeList[i]['current_status'] = this.couponStatusAction
            break;
          }
        }
        CommonMethods.showSuccessDialog(this.snackBar,message)
        break;
      case "10":
        CommonMethods.showErrorDialog(this.snackBar, "Session Time Out")
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
        this.currentStatusIcon = "visibility_off"
        return 'red';
      case 'active':
        this.currentStatusIcon = "visibility"
        return 'green';
    }
  }

  ngOnInit() {
  }


  changeCouponTypeValue(value:any){
    var changevalue= value.split('_')
     CommonMethods.showconsole(this.Tag,"Change Value:- "+changevalue[0])
      var couponTypeValue=changevalue[0]+" "+changevalue[1]
     return couponTypeValue
  }

}
