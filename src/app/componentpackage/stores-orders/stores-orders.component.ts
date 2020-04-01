import { Component, OnInit } from '@angular/core';
import { MyCookies } from 'src/app/utilpackages/my-cookies';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MyRoutingMethods } from 'src/app/utilpackages/my-routing-methods';
import { Location } from '@angular/common';
import { CommonWebApiService } from 'src/app/CommonMethods/CommonApis';
import { MatSnackBar } from '@angular/material';
import { GetBrandOrders, GetStoreOrderCount, GetStoreOrders } from 'src/app/CommonMethods/CommonInterface';
import { CommonMethods } from 'src/app/utilpackages/common-methods';

@Component({
  selector: 'app-stores-orders',
  templateUrl: './stores-orders.component.html',
  styleUrls: ['./stores-orders.component.css']
})
export class StoresOrdersComponent implements OnInit, GetBrandOrders, GetStoreOrderCount,GetStoreOrders {
  Tag = "StoresOrdersComponent"
  isLoading = false
  urlaccountType: any
  accountType: any
  activeCardTotal = true
  activeCardcomplete = false
  activeCardpending = false
  activeCancelled = false
  storeOrderList: Array<any>
  order_status = ""
  count: number
  total_count = 0
  total_cancel = 0
  total_pending = 0
  total_complete = 0
  isTableLoading=false

  pageLimit: number
  showpreviousButton = false
  shownextButton = false
  countboolean = false


  constructor(public spinner: NgxSpinnerService, public cookiesService: CookieService, public activatedRouter: ActivatedRoute,
    public httpClient: HttpClient, public router: Router, public location: Location, public snackBar: MatSnackBar) {
    this.isLoading = false
    this.activeCardTotal = true
    this.activeCardcomplete = false
    this.activeCardpending = false
    this.activeCancelled = false
    this.urlaccountType = ""
    this.order_status = "all"
    this.accountType = ""
    this.count = 0
    this.isTableLoading=false

    this.storeOrderList = []
    this.checkLoginStatus()
  }

/*
     Check Login  Into Cookies Method 

*/

  checkLoginStatus() {
    var loginStatus = MyCookies.checkLoginStatus(this.cookiesService)
    if (loginStatus) {
      this.accountType = MyCookies.getAccountType(this.cookiesService)
      this.activatedRouter.params.subscribe(params => {
        this.urlaccountType = params['accountype']
      })
      if (this.urlaccountType == this.accountType) {
        CommonWebApiService.getBrandOrderCounts(this.spinner, this.httpClient, this.cookiesService, this.snackBar, this)
        
          if(MyCookies.getStoreType(this.cookiesService) == 'store'){
             CommonMethods.showconsole(this.Tag,"If working STORE")
            CommonWebApiService.getStoreBrandOrder(this.spinner, this.httpClient, this.cookiesService, this.snackBar, this.count, this, this.order_status)
          }else{
            CommonMethods.showconsole(this.Tag,"ELSE working BRAND")
            CommonWebApiService.getBrandOrder(this.spinner, this.httpClient, this.cookiesService, this.snackBar, this.count, this, this.order_status)
          }
        
       
      } else {
        this.location.back()
      }
    } else {
      MyRoutingMethods.gotoLogin(this.router)
    }
  }



  /* 
     
    Get Order Brand List Api Response Method

  */

  onResponseGetBrandOrdersInterface(status: string, orderList: Array<any>, pagePerLimit: any) {
    switch (status) {
      case "1":


        CommonMethods.showconsole(this.Tag, "Show Array :- " + JSON.stringify(orderList))
        this.storeOrderList = orderList
        this.pageLimit = pagePerLimit;
        if (this.count !== 0) {
          this.showpreviousButton = true
        }
        else {
          this.showpreviousButton = false
        }
        if (this.storeOrderList.length < this.pageLimit) {
          this.shownextButton = false
        }
        else {
          this.shownextButton = true;
        }
        this.spinner.hide();
        this.isLoading = true;
        //  setTimeout(() => {
          this.isTableLoading=true
        //  }, 3000);
        


        break;
      case "10":
        CommonMethods.showErrorDialog(this.snackBar, "Session Time Out")
        MyCookies.deletecookies(this.cookiesService)
        MyRoutingMethods.gotoLogin(this.router)
        break;
      default:
        alert('Error Occured, Please try again');
        break;
    }
  }

   /* 
     
    Get Order Store List Api Response Method

  */

  onResponseGetStoreOrdersInterface(status: string, orderList: Array<any>, pagePerLimit: any) {
    switch (status) {
      case "1":


        CommonMethods.showconsole(this.Tag, "Show Array :- " + JSON.stringify(orderList))
        this.storeOrderList = orderList
        this.pageLimit = pagePerLimit;
        if (this.count !== 0) {
          this.showpreviousButton = true
        }
        else {
          this.showpreviousButton = false
        }
        if (this.storeOrderList.length < this.pageLimit) {
          this.shownextButton = false
        }
        else {
          this.shownextButton = true;
        }
        this.spinner.hide();
        this.isLoading = true;
        this.isTableLoading=true

        break;
      case "10":
        CommonMethods.showErrorDialog(this.snackBar, "Session Time Out")
        MyCookies.deletecookies(this.cookiesService)
        MyRoutingMethods.gotoLogin(this.router)
        break;
      default:
        alert('Error Occured, Please try again');
        break;
    }
  }





  /* 
       
    Store Count  Api Response Method

    */

  onResponseGetStoreOrderCountInterface(status: string, countTotal: any, countComplete: any, countCancalled: any, countPending: any) {
    switch (status) {
      case "1":
        this.total_count = countTotal
        this.total_complete = countComplete
        this.total_pending = countPending
        this.total_cancel = countCancalled

        break;
      case "10":
        CommonMethods.showErrorDialog(this.snackBar, "Session Time Out")
        MyCookies.deletecookies(this.cookiesService)
        MyRoutingMethods.gotoLogin(this.router)
        break;
      default:
        alert('Error Occured, Please try again');
        break;
    }
  }
  ngOnInit() {
  }


  /* 
       
    Change Color According Status Method

    */


  getColor(status) {

    switch (status) {
      case 'completed':

        return 'green';
      case 'cancelled':

        return 'red';
      case 'pending':

        return 'orange';
    }
  }

  /* 
     
  Count Type  Method

  */

  getList(cardName: string) {
    CommonMethods.showconsole(this.Tag, "CardNAme :- " + cardName)
    this.order_status = cardName
    // this.countboolean = true
    this.storeOrderList = []

    if (cardName == "completed") {
      this.activeCardpending = false
      this.activeCardTotal = false
      this.activeCardcomplete = true
      this.activeCancelled = false



    } else if (cardName == "pending") {
      this.activeCardpending = true
      this.activeCardcomplete = false
      this.activeCardTotal = false
      this.activeCancelled = false



    } else if (cardName == "cancelled") {
      this.activeCardpending = false
      this.activeCardcomplete = false
      this.activeCardTotal = false
      this.activeCancelled = true

    } else {
      this.activeCardpending = false
      this.activeCardcomplete = false
      this.activeCardTotal = true
      this.activeCancelled = false

    }
    if(MyCookies.getStoreType(this.cookiesService) == 'store'){
      CommonMethods.showconsole(this.Tag,"If working STORE")
     CommonWebApiService.getStoreBrandOrder(this.spinner, this.httpClient, this.cookiesService, this.snackBar, this.count, this, this.order_status)
   }else{
     CommonMethods.showconsole(this.Tag,"ELSE working BRAND")
     CommonWebApiService.getBrandOrder(this.spinner, this.httpClient, this.cookiesService, this.snackBar, this.count, this, this.order_status)
   }
    // CommonWebApiService.getOrdersList(this.spinner, this.httpClient, this.cookiesService, this.snackBar, this, this.count, this.subStoreAccountId, this.order_status)

  }





  next() {
    this.count = this.count + this.pageLimit
    if(MyCookies.getStoreType(this.cookiesService) == 'store'){
      CommonMethods.showconsole(this.Tag,"If working STORE")
     CommonWebApiService.getStoreBrandOrder(this.spinner, this.httpClient, this.cookiesService, this.snackBar, this.count, this, this.order_status)
   }else{
     CommonMethods.showconsole(this.Tag,"ELSE working BRAND")
     CommonWebApiService.getBrandOrder(this.spinner, this.httpClient, this.cookiesService, this.snackBar, this.count, this, this.order_status)
   }
  }
  previous() {
    this.count = this.count - this.pageLimit
    if(MyCookies.getStoreType(this.cookiesService) == 'store'){
      CommonMethods.showconsole(this.Tag,"If working STORE")
     CommonWebApiService.getStoreBrandOrder(this.spinner, this.httpClient, this.cookiesService, this.snackBar, this.count, this, this.order_status)
   }else{
     CommonMethods.showconsole(this.Tag,"ELSE working BRAND")
     CommonWebApiService.getBrandOrder(this.spinner, this.httpClient, this.cookiesService, this.snackBar, this.count, this, this.order_status)
   }

  }





}
