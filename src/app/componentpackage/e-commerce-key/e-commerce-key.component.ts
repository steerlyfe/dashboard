import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MyCookies } from 'src/app/utilpackages/my-cookies';
import { CookieService } from 'ngx-cookie-service';
import { MyRoutingMethods } from 'src/app/utilpackages/my-routing-methods';
import { HttpClient } from '@angular/common/http';
import { CommonMethods } from 'src/app/utilpackages/common-methods';
import { MatSnackBar } from '@angular/material';
import { Location } from '@angular/common';
import { CommonWebApiService } from 'src/app/CommonMethods/CommonApis';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetWooCommerceKey, DeleteWooCommerceKey } from 'src/app/CommonMethods/CommonInterface';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-e-commerce-key',
  templateUrl: './e-commerce-key.component.html',
  styleUrls: ['./e-commerce-key.component.css']
})
export class ECommerceKeyComponent implements OnInit, GetWooCommerceKey,DeleteWooCommerceKey {
  Tag = "ECommerceKeyComponent"
  modalReference: NgbModalRef
  accountType: any
  urlaccountType: any
  woocommerceLIst: Array<any>
  shopifyList: Array<any>
  bigCommerceList: Array<any>
  deleteKeyId:string
  isLoading = false
  constructor(public activetedRouter: ActivatedRoute, public cookiesService: CookieService, public router: Router,
    public httpClient: HttpClient, public snackBar: MatSnackBar, public location: Location, public spinner: NgxSpinnerService,
    public modalService: NgbModal, public ngZone: NgZone,) {
    this.accountType = ""
    this.isLoading = false
    this.deleteKeyId=""
    this.woocommerceLIst = []
    this.shopifyList=[]
    this.bigCommerceList=[]
    this.accountType = MyCookies.getAccountType(this.cookiesService)

    // calling Login status Method

    this.checkLoginStatus()
  }

  /**
   * 
   * Check Login Status 
   * 
   */
  checkLoginStatus() {

    var loginstatus = MyCookies.checkLoginStatus(this.cookiesService)
    if (loginstatus) {
      this.accountType = MyCookies.getAccountType(this.cookiesService)
      this.activetedRouter.params.subscribe(params => {
        CommonMethods.showconsole(this.Tag, "Show account Type :- " + params['accountype'])
        this.urlaccountType = params['accountype']
      })
      if (this.accountType == this.urlaccountType) {

        //calling getWoocommerceApi

        CommonWebApiService.getWooCommerceKey(this.spinner, this.httpClient, this.cookiesService, this.snackBar, this)


      } else {

        this.location.back()
      }


    }

    else {
      MyRoutingMethods.gotoLogin(this.router)
    }
  }


  /**
   * 
   * Hendle response wocommerce Api
   * 
   */

  onResponseGetWooCommerceKeyInterface(status: any, wooCommerce: any,bigCommerce:any) {
    this.woocommerceLIst = []
    switch (status) {
      case "1":
        this.spinner.hide();
        this.isLoading = true;
         if(wooCommerce.length !=0)
         {
          this.woocommerceLIst.push({
            "id": wooCommerce.id,
            "publicId": wooCommerce.publicId,
            "consumerKey": wooCommerce.consumerKey,
            "consumerSecret": wooCommerce.consumerSecret,
            "createdTime": wooCommerce.createdTime,
            "updateTime": wooCommerce.updateTime,
            "currentStatus": wooCommerce.currentStatus
          })
         }
        
        if(bigCommerce.length != 0){
          this.bigCommerceList.push({
            "id": bigCommerce.id,
            "publicId": bigCommerce.publicId,
            "consumerKey": bigCommerce.consumerKey,
            "consumerSecret": bigCommerce.consumerSecret,
            "createdTime": bigCommerce.createdTime,
            "updateTime": bigCommerce.updateTime,
            "currentStatus": bigCommerce.currentStatus
          })
        }
       
         CommonMethods.showconsole(this.Tag,"wooCommerce List:- "+JSON.stringify(wooCommerce))
         CommonMethods.showconsole(this.Tag,"bigCommerce List:- "+JSON.stringify(bigCommerce))
        break;
      case "10":
        CommonMethods.showErrorDialog(this.snackBar, "Session Time Out")
        MyCookies.deletecookies(this.cookiesService)
        MyRoutingMethods.gotoLogin(this.router)
        break;
        case "0":
        this.isLoading = true;
        break;
      default:
        alert('Error Occured, Please try again');
        break;
    }
  }

    /**
     * 
     * Open Delete Modal Function 
     */
    openDeleteModal(deleteKeycontent) {
      this.modalReference = this.modalService.open(deleteKeycontent, { centered: true });
      //  this. modalReference.componentInstance.actionMessage = this.actionmessage;
    }

    /**
     * 
     * close Modal Function 
     */

    JoinAndClose() {
      this.modalReference.close();
    }

  /**
   * 
   *  Delete Key Function Call
   * 
   */
  delteWoocommerceKey(KeyId:any,deleteKeycontent)
  {
          CommonMethods.showconsole(this.Tag,"ID :- "+KeyId)
          this.deleteKeyId=KeyId
          this.openDeleteModal(deleteKeycontent)
  }
   /**
    * 
    * call delete Api 
    */
   deleteApiCall(){
    this.modalReference.close();
       CommonWebApiService.deleteWooCommerceKey(this.spinner,this.httpClient,this.cookiesService,this.snackBar,this,this.deleteKeyId)
   }

    /**
    * 
    * handle Response delete Api call 
    */
    onResponseDeleteWooCommerceKeyInterface(status:string,message:string)
    {
      switch (status) {
        case "1":
          this.spinner.hide();
           CommonMethods.showSuccessDialog(this.snackBar,message)
            for(var i=0;i<this.woocommerceLIst.length;i++)
            {
               if(this.woocommerceLIst[i].id == this.deleteKeyId)
               {
                   this.woocommerceLIst.splice(i,1);
               }
            }
            for(var i=0;i<this.bigCommerceList.length;i++)
            {
               if(this.bigCommerceList[i].id == this.deleteKeyId)
               {
                   this.bigCommerceList.splice(i,1);
               }
            }
          break;
        case "10":
          CommonMethods.showErrorDialog(this.snackBar, "Session Time Out")
          MyCookies.deletecookies(this.cookiesService)
          MyRoutingMethods.gotoLogin(this.router)
          break;
          case "0":
          CommonMethods.showSuccessDialog(this.snackBar,message)
          break;
        default:
          alert('Error Occured, Please try again');
          break;
      } 
    }


  ngOnInit() {
  }

}
