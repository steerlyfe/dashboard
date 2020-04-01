import { Component, OnInit } from '@angular/core';
import { AddECommerceKey } from 'src/app/modelspackages/add-ecommerce-key';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { CommonMethods } from 'src/app/utilpackages/common-methods';
import { MyCookies } from 'src/app/utilpackages/my-cookies';
import { CommonWebApiService } from 'src/app/CommonMethods/CommonApis';
import { MyRoutingMethods } from 'src/app/utilpackages/my-routing-methods';
import { Location } from '@angular/common';
import { AddWooCommerceKey } from 'src/app/CommonMethods/CommonInterface';
@Component({
  selector: 'app-add-shopify-key',
  templateUrl: './add-shopify-key.component.html',
  styleUrls: ['./add-shopify-key.component.css']
})
export class AddShopifyKeyComponent implements OnInit {

  Tag="AddShopifyKeyComponent"
  addeCommerceKey: AddECommerceKey
  accountType:string
  urlaccountType:string
  constructor(public spinner: NgxSpinnerService, public router: Router, public activatedRouter: ActivatedRoute,
    public cookiesService: CookieService, public httpClient: HttpClient, public snackBar: MatSnackBar,
    public location:Location) {
      this.accountType=""
      this.urlaccountType=""
    this.addeCommerceKey = new AddECommerceKey("", "", "","","")
    this.checkLoginStatus() 
  }

  ngOnInit() {
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
      this.activatedRouter.params.subscribe(params => {
        CommonMethods.showconsole(this.Tag, "Show account Type :- " + params['accountype'])
        this.urlaccountType = params['accountype']
      })
      if (this.accountType == this.urlaccountType) {

        //calling getWoocommerceApi

        // CommonWebApiService.getWooCommerceKey(this.spinner, this.httpClient, this.cookiesService, this.snackBar, this)

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
   *  Validation
   * 
   */

  validation() {
    if (this.addeCommerceKey.consumer_key.trim().length == 0) {
      CommonMethods.showErrorDialog(this.snackBar, "Enter consumer key ")
      return false
    } else if (this.addeCommerceKey.consumer_secret.trim().length == 0) {
      CommonMethods.showErrorDialog(this.snackBar, "Enter consumer secret key ")
      return false
    } else if (this.addeCommerceKey.domain.trim().length == 0) {
      CommonMethods.showErrorDialog(this.snackBar, "Enter  domain ")
      return false
    } 
    // else if( !this.validateDomain(this.addeCommerceKey.domain.trim())){
    //   CommonMethods.showErrorDialog(this.snackBar, "Enter Valid domain ")
    //   return false
    // }
    else {
      return true
    }
  }


/**
 * 
 *  Domain Validation  Check  
 * 
 */
//  validateDomain(the_domain) {
//     // strip off "http://" and/or "www."
//     the_domain = the_domain.replace("http://", "");
//     the_domain = the_domain.replace("www.", "");
  
//     var reg = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
//     return reg.test(the_domain);
//   }

    /**
     * 
     *   Calling Add key Api 
     * 
     */

   addKeyApiCall()
   {
        // check Validation method

         if(this.validation())
         {
            //  CommonWebApiService.addWoCommerceKey(this.spinner,this.httpClient,this.cookiesService,this.snackBar,this,this.addeCommerceKey)
         }


   }

   onResponseUpdatePostInterface(status:string,message:string)
   {
    switch (status) {
      case "1":
        this.spinner.hide();
        MyRoutingMethods.gotoKeyList(this.router,this.accountType,)
         CommonMethods.showSuccessDialog(this.snackBar,message)
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

}
