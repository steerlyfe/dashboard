import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MyRoutingMethods } from 'src/app/utilpackages/my-routing-methods';
import { MyCookies } from 'src/app/utilpackages/my-cookies';
import { CookieService } from 'ngx-cookie-service';
import { Location, JsonPipe } from '@angular/common';
import { CommonWebApiService } from 'src/app/CommonMethods/CommonApis';
import { MatSnackBar } from '@angular/material';
import { GetStoreOrderDetails, ChangeAppOrderStatus } from 'src/app/CommonMethods/CommonInterface';
import { CommonMethods } from 'src/app/utilpackages/common-methods';
import { OrderDetailModal, ProductInfoDetails } from 'src/app/modelspackages/orderDetail';
import { ProductStatus } from 'src/app/modelspackages/current_product_status';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateBrandOrdersStatus } from 'src/app/modelspackages/update_brand_order_status';

@Component({
  selector: 'app-stores-orders-details',
  templateUrl: './stores-orders-details.component.html',
  styleUrls: ['./stores-orders-details.component.css']
})
export class StoresOrdersDetailsComponent implements OnInit,GetStoreOrderDetails,ChangeAppOrderStatus {
  Tag="StoresOrdersDetailsComponent"
  modalReference: NgbModalRef
  urlAccountType: any;
  accountType: any
  orderId: any
  productList: Array<ProductInfoDetails>
  isLoading = false
  OrderDetail: OrderDetailModal
  productStatus: ProductStatus
  progressIndex: any
  productIndex: any
  changeProducctStatus: any
  dailogMessage: any
  updateProductStatus:UpdateBrandOrdersStatus

  
  constructor(public spinner: NgxSpinnerService, public httpClient: HttpClient, public activatedRouter: ActivatedRoute,
    public router: Router, public cookiesServices: CookieService,public location:Location,public snackBar:MatSnackBar,public modalService: NgbModal) {
    this.urlAccountType = "";
    this.accountType = "";
    this.orderId = ""
    this.progressIndex = ""
    this.productIndex = ""
    this.changeProducctStatus = ""
    this.dailogMessage=""
    this.isLoading= false
    this.productList=[]
    this.OrderDetail = new OrderDetailModal("", "", "", "", "", "", "", "", "", "", "", [], "")
    this.productStatus = new ProductStatus("", "", "", "", "", "")
    this.updateProductStatus = new UpdateBrandOrdersStatus("","","","")
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
          this.orderId = parmas['storeOrderId']
        })
           CommonMethods.showconsole(this.Tag,"Get Order Id : "+this.orderId)
         CommonWebApiService.getStoreOrderDetails(this.spinner,this.httpClient,this.cookiesServices,this.snackBar,this,this.orderId)

      } else {
        this.location.back()
      }
    } else {
      MyRoutingMethods.gotoLogin(this.router)
    }
  }


  onResponseGetStoreOrderDetailsInterface(status:string,orderdetails:any){
    switch (status) {
      case "1":

      
           CommonMethods.showconsole(this.Tag,"Order Details :- "+JSON.stringify(orderdetails))
             this.OrderDetail.order_id=orderdetails.web_order_public_id



              this.updateProductStatus.web_order_public_id=orderdetails.web_order_public_id
             this.OrderDetail.order_time=orderdetails.order_time
             this.OrderDetail.orderStatus=orderdetails.order_status
             this.OrderDetail.address_Details=orderdetails.address
             var productArray=orderdetails.order_info

                      productArray.forEach(prodcutItems => {
     
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
                       // if (prodcutItems.product_availability != 'in_store') {
                       //   this.showAddressBoolean = true
             
                       // }
             
                       // if (prodcutItems.product_availability == "deliver_now") {
                       //   CommonMethods
                       //   this.deliverBoolean = true
                       //   this.deliverValue = this.deliverValue + prodcutItems.product_availability_price
                       // } else if (prodcutItems.product_availability == "shipping") {
                       //   this.shippingChargesBoolean = true
                       //   this.shippingValue = this.shippingValue + prodcutItems.product_availability_price
                       // }
               
                     });

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

            //  this.OrderDetail.orderStatus=

        //  for(var i=0;i<orderdetails.length;i++)
        //  {
        //        if(orderdetails[i].order_id == this.orderId)
        //        {
                
        //         CommonMethods.showconsole(this.Tag, "Show Array :- " +JSON.stringify(orderdetails[i]) )
        //         this.OrderDetail.order_time=orderdetails[i].order_time
        //         this.OrderDetail.order_id=orderdetails[i].order_id
        //         this.OrderDetail.orderStatus=orderdetails[i].order_status
        //          var productArray=orderdetails[i].order_info

        //          productArray.forEach(prodcutItems => {

        //           this.productList.push(new ProductInfoDetails(
        //             prodcutItems.product_id,
        //             prodcutItems.product_name,
        //             prodcutItems.product_image,
        //             prodcutItems.actual_price,
        //             prodcutItems.sale_price,
        //             prodcutItems.store_id,
        //             prodcutItems.store_name,
        //             prodcutItems.sub_store_id,
        //             prodcutItems.sub_store_address,
        //             prodcutItems.product_availability,
        //             prodcutItems.product_availability_price,
        //             prodcutItems.additional_feature,
        //             prodcutItems.additional_feature_price,
        //             prodcutItems.quantity,
        //             prodcutItems.status, ""))
        //           // if (prodcutItems.product_availability != 'in_store') {
        //           //   this.showAddressBoolean = true
        
        //           // }
        
        //           // if (prodcutItems.product_availability == "deliver_now") {
        //           //   CommonMethods
        //           //   this.deliverBoolean = true
        //           //   this.deliverValue = this.deliverValue + prodcutItems.product_availability_price
        //           // } else if (prodcutItems.product_availability == "shipping") {
        //           //   this.shippingChargesBoolean = true
        //           //   this.shippingValue = this.shippingValue + prodcutItems.product_availability_price
        //           // }
          
        //         });

        //  }
        // }
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

  ngOnInit() {
  }

  getOrderStatus(orderStatus: string) {
    // CommonMethods.showconsole(this.Tag,"Order Status:- "+orderStatus)
    let newvalue = orderStatus.split('_')
    let newStringOrderStatus = ""
    if (newvalue.length == 1) {
      newStringOrderStatus = newvalue[0]
    } else {
      newStringOrderStatus = newvalue[0] + " " + newvalue[1]
    }

    return newStringOrderStatus
  }

  getColor(status) {
    let newvalue = status.split('_')
    let newStringOrderStatus = ""
    if (newvalue.length == 1) {
      newStringOrderStatus = newvalue[0]
    } else {
      newStringOrderStatus = newvalue[0] + " " + newvalue[1]
    }

    switch (newStringOrderStatus) {
      case 'order placed':

        return 'green';
      case 'cancalled':

        return 'red';
      case 'dispatched':

        return 'orange';
      case 'pending':

        return 'orange';
      case 'processing':

        return 'orange';
      case 'delivered':

        return 'green';
      case 'product received':

        return 'green';
    }
  }


  updateStatus(index: any, productIndex: any, statusname: string, content) {

    if (this.accountType == "admin" || this.accountType == "manager" ) {
         if(MyCookies.getStoreType(this.cookiesServices) == 'brand')
         {
          this.progressIndex = index;
          this.productIndex = productIndex
          this.changeProducctStatus = statusname
            CommonMethods.showconsole(this.Tag,"JSON Array  of product List:- "+JSON.stringify(this.productList))
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

  }

  changeStatusApiCall() {

    this.JoinAndClose()
      
      
       this.updateProductStatus.product_id=this.productList[this.productIndex]['product_id']
       this.updateProductStatus.additional_feature=this.productList[this.productIndex]['additional_feature']
       this.updateProductStatus.status_to_update=this.changeProducctStatus


        CommonMethods.showconsole(this.Tag,"Order Public Id :- "+this.updateProductStatus.web_order_public_id)
        CommonMethods.showconsole(this.Tag,"Product Id :- "+this.updateProductStatus.product_id)
        CommonMethods.showconsole(this.Tag,"additional feature :- "+this.updateProductStatus.additional_feature)
        CommonMethods.showconsole(this.Tag,"change Status  :- "+this.updateProductStatus.status_to_update)
        CommonWebApiService.statusUpdateOrdersBrand(this.spinner,this.httpClient,this.cookiesServices,this.snackBar,this,this.updateProductStatus)

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
