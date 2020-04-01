import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { MyCookies } from 'src/app/utilpackages/my-cookies';
import { MyRoutingMethods } from 'src/app/utilpackages/my-routing-methods';
import { Location } from '@angular/common';
import { CommonWebApiService } from 'src/app/CommonMethods/CommonApis';
import { MatSnackBar } from '@angular/material';
import { GetOrderDetails, ChangeAppOrderStatus } from 'src/app/CommonMethods/CommonInterface';
import { CommonMethods } from 'src/app/utilpackages/common-methods';
import { ProductInfoDetails, OrderDetailModal } from 'src/app/modelspackages/orderDetail';
import { ProductStatus } from 'src/app/modelspackages/current_product_status';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MobileAppOrderStatusUpdate } from 'src/app/modelspackages/mobile-order-status-update';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit, GetOrderDetails,ChangeAppOrderStatus {

  Tag = "OrderDetailsComponent"
  modalReference: NgbModalRef
  accountType = ""
  urlAccountType = ""
  orderId = ""
  orderstatus = ""
  orderdate: string
  productList: Array<ProductInfoDetails>
  isLoading = false
  showAddressBoolean = false
  deliverValue = 0
  shippingValue = 0
  deliverBoolean = false
  shippingChargesBoolean = false
  OrderDetail: OrderDetailModal
  progressList: Array<any>
  productStatus: ProductStatus
  previousDivId = ""
  buttonBoolean = false
  productStatusDate: any
  statusarray: Array<any>
  progressIndex: any
  productIndex: any
  changeProducctStatus: any
  dailogMessage: any
  updateAppStatusModal:MobileAppOrderStatusUpdate
  constructor(public router: Router, public activatedRouter: ActivatedRoute, public spinner: NgxSpinnerService,
    public cookiesServices: CookieService, public httpclient: HttpClient, private location: Location, public snackBar: MatSnackBar,
    public modalService: NgbModal) {
    this.orderId = ""
    this.orderdate = ""
    this.productList = []
    this.progressList = []
    this.statusarray = []
    this.showAddressBoolean = false
    this.deliverBoolean = false
    this.previousDivId = ""
    this.buttonBoolean = false
    this.shippingChargesBoolean = false
    this.productStatusDate = ""
    this.progressIndex = ""
    this.productIndex = ""
    this.changeProducctStatus = ""
    this.dailogMessage = ""
    this.OrderDetail = new OrderDetailModal("", "", "", "", "", "", "", "", "", "", "", [], "")
    this.productStatus = new ProductStatus("", "", "", "", "", "")
    this.updateAppStatusModal= new MobileAppOrderStatusUpdate("","","","","")
    this.checkLoginStatus()
  }

  checkLoginStatus() {
    let loginStatus = MyCookies.checkLoginStatus(this.cookiesServices)
    if (loginStatus) {
      this.accountType = MyCookies.getAccountType(this.cookiesServices)

      this.activatedRouter.params.subscribe(parmas => {
        this.urlAccountType = parmas['accountype']
      })

      if (this.urlAccountType == this.accountType) {
        this.activatedRouter.params.subscribe(parmas => {
          this.orderId = parmas['order_Id']
        })



        CommonWebApiService.getOrderDetails(this.spinner, this.httpclient, this.cookiesServices, this.snackBar, this.orderId, this)
        // this.productList.push(
        //   {
        //     "productPublicId":"15795152895e257d99aee08",
        //     "productImage":"https://firebasestorage.googleapis.com/v0/b/steerlyfe-e2405.appspot.com/o/store-logo%2F1578978734599?alt=media&token=278b6731-af20-4682-9bd4-e2cc56bbee5f",
        //     "productName":"Hemp Pain Relief Cream ",
        //     "productQunatity":6,
        //     "productUnitType":"100mg",
        //     "sellerName":"Napworks",
        //     "productPrice":9,

        //   }
        // )
      } else {
        this.location.back()
      }
    } else {
      MyRoutingMethods.gotoLogin(this.router)
    }
  }



  onResponseGetOrderDetailsterface(status: string, responseData: any) {

    switch (status) {
      case "1":



        CommonMethods.showconsole(this.Tag, "Reponse Data:- " + JSON.stringify(responseData))

        this.orderstatus = "Delivered"
        this.updateAppStatusModal.order_public_id=responseData['order_public_id'];
        this.OrderDetail.store_order_id = responseData['store_order_id']
        this.OrderDetail.store_order_public_id = responseData['store_order_public_id']
        this.OrderDetail.store_id = responseData['store_id']
        this.OrderDetail.sub_store_id = responseData['sub_store_id']
        this.OrderDetail.order_id = responseData['order_id']
        this.OrderDetail.full_name = responseData['full_name']
        this.OrderDetail.order_time = responseData['order_time']
        this.OrderDetail.phone_number = responseData['phone_number']
        this.OrderDetail.pincode = responseData['pincode']
        this.OrderDetail.address_Details = responseData['address_detail']
        this.OrderDetail.total_amount = responseData['total_amount']
        this.OrderDetail.orderStatus = responseData['order_status']

        responseData['order_info'].forEach(prodcutItems => {

          this.productList.push(new ProductInfoDetails(
            prodcutItems.product_id,
            prodcutItems.product_name,
            prodcutItems.product_image,
            prodcutItems.actual_price,
            prodcutItems.sale_price,
            prodcutItems.store_id,
            prodcutItems.store_name,
            prodcutItems.sub_store_id,
            prodcutItems.sub_store_address,
            prodcutItems.product_availability,
            prodcutItems.product_availability_price,
            prodcutItems.additional_feature,
            prodcutItems.additional_feature_price,
            prodcutItems.quantity,
            prodcutItems.status, ""))
          if (prodcutItems.product_availability != 'in_store') {
            this.showAddressBoolean = true

          }

          if (prodcutItems.product_availability == "deliver_now") {
            CommonMethods
            this.deliverBoolean = true
            this.deliverValue = this.deliverValue + prodcutItems.product_availability_price
          } else if (prodcutItems.product_availability == "shipping") {
            this.shippingChargesBoolean = true
            this.shippingValue = this.shippingValue + prodcutItems.product_availability_price
          }
          // this.orderstatus =prodcutItems.status['currentStatus'].split('_')


        });

        CommonMethods.showconsole(this.Tag, "Product Array :- " + JSON.stringify(this.productList))
        for (var i = 0; i < this.productList.length; i++) {
          var timzeArray = this.productList[i]['producttsatus']['logsList']
          for (var j = 0; j < timzeArray.length; j++) {
            // CommonMethods.showconsole(this.Tag,"Time zone   "+ JSON.stringify(this.productList[i]['producttsatus']['logsList']) )
            if (this.productList[i]['producttsatus'].currentStatus == timzeArray[j].type) {
              CommonMethods.showconsole(this.Tag, "Time zone   " + timzeArray[j].time)
              this.productList[i].productstatusTime = timzeArray[j].time
            }

          }
        }
        this.spinner.hide();
        this.isLoading = true;


        break;
      case "10":
        CommonMethods.showErrorDialog(this.snackBar, "Session Time Out")
        MyCookies.deletecookies(this.cookiesServices)
        MyRoutingMethods.gotoLogin(this.router)
        break;
      default:
        alert('Error Occured, Please try again');
        break;
    }
  }




  getOrderStatus(orderStatus: string) {
    // CommonMethods.showconsole(this.Tag,"Order Status:- "+orderStatus)
    let newvalue = orderStatus.split('_')
    let newStringOrderStatus = ""
    if (newvalue.length == 1) {
      newStringOrderStatus = newvalue[0]
    } else if(newvalue.length == 2) {
      newStringOrderStatus = newvalue[0] + " " + newvalue[1]
    }else{
      newStringOrderStatus = newvalue[0] + " " + newvalue[1]+" "+ newvalue[2]
    }
    return newStringOrderStatus
  }

  getColor(status) {
    let newvalue = status.split('_')
    let newStringOrderStatus = ""
    if (newvalue.length == 1) {
      newStringOrderStatus = newvalue[0]
    }  else if(newvalue.length == 2) {
      newStringOrderStatus = newvalue[0] + " " + newvalue[1]
    }else{
      newStringOrderStatus = newvalue[0] + " " + newvalue[1]+" "+ newvalue[2]
    }

    switch (newStringOrderStatus) {
      case 'order placed':

        return 'green';
      case 'cancalled':

        return 'red';
      case 'dispatched':

        return 'orange';
      case 'ready to pick':

        return 'orange';
      case 'pending':

        return 'orange';
      case 'processing':

        return 'orange';
      case 'delivered':

        return 'green';
      case 'product received':

        return 'green';
      case 'completed':

        return 'green';
    }
  }
  ngOnInit() {
  }



  showProductStatus(buttunId: any) {

    CommonMethods.showconsole(this.Tag, "index:- " + buttunId)
    CommonMethods.showconsole(this.Tag, "previous index:- " + this.previousDivId)
    CommonMethods.showconsole(this.Tag, "button truefalse:- " + this.buttonBoolean)

    if (this.previousDivId != buttunId) {
      CommonMethods.showconsole(this.Tag, "if Function Is working")
      if (this.previousDivId == "") {
        document.getElementById(buttunId).classList.remove("hidedivProgress")
      } else {
        document.getElementById(this.previousDivId).classList.add("hidedivProgress")
        document.getElementById(buttunId).classList.remove("hidedivProgress")
      }
      this.previousDivId = buttunId



    } else {
      CommonMethods.showconsole(this.Tag, "else is working")
      this.previousDivId = buttunId
      if (this.buttonBoolean == false) {

        document.getElementById(buttunId).classList.add("hidedivProgress")
        this.buttonBoolean = true
      }
      else {
        document.getElementById(buttunId).classList.remove("hidedivProgress")
        this.buttonBoolean = false
      }

    }

  }

  updateStatus(index: any, productIndex: any, statusname: string, content) {

    if (this.accountType == "sub_admin" || this.accountType == "sub_manager" || this.accountType == "sub_manager") {

      this.progressIndex = index;
      this.productIndex = productIndex
      this.changeProducctStatus = statusname
      if (this.progressIndex != 0) {
        CommonMethods.showconsole(this.Tag, "product this.progressIndex :- " + this.productIndex + " " + "Progress index :- " + this.progressIndex)
        var indexvalue = this.productList[this.productIndex]['producttsatus']['logsList'][this.progressIndex].value
        if (indexvalue == false) {
          var checkPreviousBoolean = this.productList[this.productIndex]['producttsatus']['logsList'][this.progressIndex - 1].value
          CommonMethods.showconsole(this.Tag, "Show Previous boolean:- " + checkPreviousBoolean)
          if (checkPreviousBoolean != false) {
            this.dailogMessage = " Do you want to upgrade this product status ?"
            this.openModal(content)
          }
        }
      }
    }

  }

  changeStatusApiCall() {

    this.JoinAndClose()
      
       this.updateAppStatusModal.product_availability=this.productList[this.productIndex]['product_availability']
       this.updateAppStatusModal.product_id=this.productList[this.productIndex]['product_id']
       this.updateAppStatusModal.additional_feature=this.productList[this.productIndex]['additional_feature']
       this.updateAppStatusModal.status_to_update=this.changeProducctStatus


        CommonMethods.showconsole(this.Tag,"Order Public Id :- "+this.updateAppStatusModal.order_public_id)
        CommonMethods.showconsole(this.Tag,"Product availability :- "+this.updateAppStatusModal.product_availability)
        CommonMethods.showconsole(this.Tag,"Product Id :- "+this.updateAppStatusModal.product_id)
        CommonMethods.showconsole(this.Tag,"additional feature :- "+this.updateAppStatusModal.additional_feature)
        CommonMethods.showconsole(this.Tag,"change Status  :- "+this.updateAppStatusModal.status_to_update)
        CommonWebApiService.statusUpdateOrdersAppMobile(this.spinner,this.httpclient,this.cookiesServices,this.snackBar,this,this.updateAppStatusModal)

  }



  onResponseChangeAppOrderStatusInterface(status:string,message:string)
  {
       switch(status)
       {
         case "1":
         
            CommonMethods.showconsole(this.Tag ,"Function is working")
            CommonMethods.showSuccessDialog(this.snackBar,message)
            var timeStamp = Math.round(new Date().getTime() / 1000);
            this.productList[this.productIndex]['producttsatus']['logsList'][this.progressIndex].value = true
            this.productList[this.productIndex]['producttsatus']['logsList'][this.progressIndex].time = timeStamp
            this.productList[this.productIndex]['producttsatus'].currentStatus = this.changeProducctStatus
            this.productList[this.productIndex]['productstatusTime'] = timeStamp
            CommonMethods.showconsole(this.Tag, "Show Time Stamp:- " + timeStamp)
         break;
         case "10":
         CommonMethods.showErrorDialog(this.snackBar, "Session Time Out")
         MyCookies.deletecookies(this.cookiesServices)
         MyRoutingMethods.gotoLogin(this.router)
         break;
         case "0":
       
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

}
