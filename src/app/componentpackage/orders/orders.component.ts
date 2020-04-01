import { Component, OnInit } from '@angular/core';
import { MyCookies } from 'src/app/utilpackages/my-cookies';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { MyRoutingMethods } from 'src/app/utilpackages/my-routing-methods';
import { Location } from '@angular/common';
import { CommonMethods } from 'src/app/utilpackages/common-methods';
import { CommonWebApiService } from 'src/app/CommonMethods/CommonApis';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material';
import { GetOrderList, GetOrderCount } from 'src/app/CommonMethods/CommonInterface';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, GetOrderList,GetOrderCount {
  Tag = "OrdersComponent"
  orderList: Array<any>
  urlaccountType = ""
  accountType = ""
  activeCardTotal = true
  activeCardcomplete = false
  activeCardpending = false
  isLoading = false
  activeCancelled = false
  pageLimit: number
  count = 0
  showpreviousButton = false
  shownextButton = false
  order_status = ""
  subStoreAccountId: string
  countboolean = false
  total_count=0
  total_cancel=0
  total_pending=0
  total_complete=0
  constructor(public cookiesService: CookieService, public router: Router, public activatedRouter: ActivatedRoute,
    public location: Location, public httpClient: HttpClient, public spinner: NgxSpinnerService, public snackBar: MatSnackBar) {
    this.orderList = []
    this.activeCardTotal = true
    this.activeCardcomplete = false
    this.activeCardpending = false
    this.isLoading = false
    this.activeCancelled = false
    this.order_status = "all"
    this.countboolean = false
    this.checkLoginStatus()
  }
  checkLoginStatus() {
    var loginStatus = MyCookies.checkLoginStatus(this.cookiesService)
    if (loginStatus) {
      this.accountType = MyCookies.getAccountType(this.cookiesService)
      this.activatedRouter.params.subscribe(params => {
        this.urlaccountType = params['accountype']
      })
      if (this.accountType == 'admin' || this.accountType == 'manager') {
        this.activatedRouter.params.subscribe(params => {
          this.subStoreAccountId = params['subStoreAccountId']
          CommonMethods.showconsole(this.Tag, "Sub Store  Account Id :- " + this.subStoreAccountId)
        })
      } else if (this.accountType == 'sub_admin' || this.accountType == 'sub_manager' || this.accountType == 'sub_employee') {
        this.subStoreAccountId = MyCookies.getSubStoreAccountId(this.cookiesService)
      } else if (this.accountType == 'super_admin') {
        this.activatedRouter.params.subscribe(params => {
          this.subStoreAccountId = params['subStoreAccountId']
          CommonMethods.showconsole(this.Tag, "Sub Store  Account Id :- " + this.subStoreAccountId)
        })
      }

       CommonWebApiService.getOrderTotalCount(this.spinner,this.httpClient,this.cookiesService,this.snackBar,this.subStoreAccountId,this)
      CommonWebApiService.getOrdersList(this.spinner, this.httpClient, this.cookiesService, this.snackBar, this, this.count, this.subStoreAccountId, this.order_status)



      if (this.urlaccountType == this.accountType) {
        // this.orderList.push(
        //   {
        //     "id":'15795152895e257d99aee08',
        //     "orderNo": "#201",
        //     "address": "696 New Inida Colony manimajra",
        //     "deliveryDAte": "12-jan-2020",
        //     "deliveryTime": "3:00 Pm",
        //     "Ammount": "$12",
        //     "CustomerName": "Avinash Kumar",
        //     "status": "Delivered"
        //   },
        //   {
        //     "id":'15795152895e257d99aee08',
        //     "orderNo": "#202",
        //     "address": "696 New Inida Colony manimajra",
        //     "deliveryDAte": "12-jan-2020",
        //     "deliveryTime": "3:00 Pm",
        //     "Ammount": "$12",
        //     "CustomerName": "Avinash Kumar",
        //     "status": "Pedning"
        //   }
        // )
      } else {
        this.location.back()
      }
    } else {
      MyRoutingMethods.gotoLogin(this.router)
    }
  }

  ngOnInit() {
  }
  

  onResponseGetOrderCountInterface(status:string,countTotal :any,countComplete:any,countCancalled:any,countPending:any){
    switch (status) {
      case "1":
        this.total_count=countTotal
        this.total_complete=countComplete
        this.total_pending=countPending
        this.total_cancel=countCancalled

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

  onResponseGetOrderListInterface(status: string, apiOrderList: Array<any>, peginationCount: number) {
    switch (status) {
      case "1":

        for (var i = 0; i < apiOrderList.length; i++) {
          CommonMethods.showconsole(this.Tag, "List :- " + apiOrderList[i])
          this.orderList.push(
            {
              "store_order_id": apiOrderList[i].store_order_id,
              "orderNo": apiOrderList[i].order_id,
              "address": apiOrderList[i].order_id,
              "order_public_id": apiOrderList[i].store_order_public_id,
              "deliveryDate": apiOrderList[i].order_time,
              "deliveryTime": apiOrderList[i].order_time,
              "Ammount": apiOrderList[i].total_amount,
              "CustomerName": apiOrderList[i].full_name,
              "order_status": apiOrderList[i].order_status,
              "user_Id": apiOrderList[i].user_id
            }
          )
        }
        CommonMethods.showconsole(this.Tag, "Show Array :- " + JSON.stringify(apiOrderList))
        this.pageLimit = peginationCount;
        if (this.count !== 0) {
          this.showpreviousButton = true
        }
        else {
          this.showpreviousButton = false
        }
        if (this.orderList.length < this.pageLimit) {
          this.shownextButton = false
        }
        else {
          this.shownextButton = true;
        }
        this.spinner.hide();
        this.isLoading = true;

          //  if(this.countboolean == false)
          //  {
          //     this.total_count=this.orderList.length
          //     CommonMethods.showconsole(this.Tag,"Total count:- "+this.total_count)
          //      for(var i=0;i<this.orderList.length;i++){
          //          if(this.orderList[i].order_status == "pending")
          //          {
          //                this.total_pending++
          //          }else if(this.orderList[i].order_status == "completed"){
          //                this.total_complete++
          //          }
          //          else{
          //             this.total_cancel++
          //          }
          //      }

          //  }

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


  next() {
    this.count = this.count + this.pageLimit
    CommonWebApiService.getOrdersList(this.spinner, this.httpClient, this.cookiesService, this.snackBar, this, this.count, this.subStoreAccountId, this.order_status)
  }
  previous() {
    this.count = this.count - this.pageLimit
    CommonWebApiService.getOrdersList(this.spinner, this.httpClient, this.cookiesService, this.snackBar, this, this.count, this.subStoreAccountId, this.order_status)

  }

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
  // all/pending/completed/cancelled
  getList(cardName: string) {
    CommonMethods.showconsole(this.Tag, "CardNAme :- " + cardName)
    this.order_status = cardName
    // this.countboolean = true
    this.orderList = []

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
    CommonWebApiService.getOrdersList(this.spinner, this.httpClient, this.cookiesService, this.snackBar, this, this.count, this.subStoreAccountId, this.order_status)

  }


}
