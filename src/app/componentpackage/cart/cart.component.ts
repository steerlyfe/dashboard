import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MyCookies } from 'src/app/utilpackages/my-cookies';
import { CommonMethods } from 'src/app/utilpackages/common-methods';
import { Location } from '@angular/common';
import { MyRoutingMethods } from 'src/app/utilpackages/my-routing-methods';
import { MatSnackBar, MatStepper } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { CommonWebApiService } from 'src/app/CommonMethods/CommonApis';
import { ViewSubStore, GetCartProductById, webOrderPlaced, CouponForApplyList, CountCheckWithOrderId } from 'src/app/CommonMethods/CommonInterface';
import { OrderPlacedModal, ProductOrderInfoDetails } from 'src/app/modelspackages/order-placed';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, ViewSubStore, GetCartProductById, webOrderPlaced ,CouponForApplyList,
CountCheckWithOrderId {

  Tag = "CartComponent"
  modalRef:NgbModalRef
  accountType: string
  urlaccountType: string
  cartList: Array<any>
  count = 0
  totalPrice = 0
  deliverCharges = 0
  shippingCharges = 0
  deliverBoolean = false
  shippingChargesBoolean = false
  storeAccountId = ""
  substoreId = ""
  substoreList: Array<any>
  grandTotal = 0
  isLoading = false
  orderPlacedModal: OrderPlacedModal
  productListArray: Array<ProductOrderInfoDetails>
  cartProductList: Array<any>
  orderProductArray: Array<any>
  couponList:Array<any>
  bandId=""
  couponAppliedBoolean=false
  discountValue:any
  newGrandTotal:any

  // SpreedlyExpress:SpreedlyExpress
  @ViewChild('stepper', { static: false }) stepper: MatStepper;
  // @ViewChild('stepper', { static: false }) SpreedlyExpress: SpreedlyExpress;
  constructor(public cookiesservice: CookieService, public router: Router, public activatedRouter: ActivatedRoute,
    public location: Location, public snackBar: MatSnackBar, public spinner: NgxSpinnerService, public htppClient: HttpClient,
    public modalService:NgbModal) {
    this.accountType = ""
    this.urlaccountType = ""
    this.deliverBoolean = false
    this.shippingChargesBoolean = false
    this.cartList = []
    this.substoreList = []
    this.couponList=[]
    // this.address = {}
    this.isLoading = false
    this.orderProductArray = []
    this.cartProductList = []
    this.productListArray = []
    this.couponAppliedBoolean=false
    this.discountValue=""
    this.newGrandTotal=""
    
    this.orderPlacedModal = new OrderPlacedModal("", [], [],"","","","","")
    this.orderPlacedModal.couponCount="no"
    this.orderPlacedModal.couponUsed="no"
    // SpreedlyExpress.init("C7cRfNJGODKh4Iu5Ox3PToKjniY", {
    //   "amount": "$9.83",
    //   "company_name": "Acme Widgets",
    //   "sidebar_top_description": "Providing quality widgets since 2015",
    //   "sidebar_bottom_description": "Your order total today",
    //   "full_name": "First Last"
    // }, {
    //   "email": "customer@gmail.com"
    // });
    // SpreedlyExpress.openView();
  
    this.checkLoginStatus()
  }

  ngOnInit() {
  
  }


  checkLoginStatus() {

    if (MyCookies.checkLoginStatus(this.cookiesservice)) {
      this.accountType = MyCookies.getAccountType(this.cookiesservice)

      this.activatedRouter.params.subscribe(params => {
        CommonMethods.showconsole(this.Tag, "Show account Type :- " + params['accountype'])
        this.urlaccountType = params['accountype']
      })
      if (this.accountType == this.urlaccountType) {
        if (this.cookiesservice.check('cartItems') == true) {
          CommonMethods.showconsole(this.Tag, "Function Is work")
          var orderList = this.cookiesservice.get('cartItems')
          this.cartList = JSON.parse(this.cookiesservice.get('cartItems'))
          CommonMethods.showconsole(this.Tag, "Array array :- " + orderList)
          CommonMethods.showconsole(this.Tag, "Array cartlist :- " + JSON.stringify(this.cartList))
          CommonWebApiService.getCartList(this.spinner, this.htppClient, this.cookiesservice, this.snackBar, orderList, this)

        }else{
          this.isLoading=true
        }

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








  onResponseGetCartProductByIdInterface(status: string, productList: Array<any>) {
    // this.productsLits = []

    CommonMethods.showconsole(this.Tag, "isLoadinig:- " + this.isLoading)
    switch (status) {
      case "1":
      this.isLoading = true
        this.spinner.hide();

        // for (var i = 0; i < this.cartList.length; i++) {
        //   CommonMethods.showconsole(this.Tag, "I at : " + i)
        //   // CommonMethods.showconsole(this.Tag,"CART PRICE : "+JSON.stringify(this.cartList[i].product_availability))
        //   for (var j = i; j < productList.length; j++) {
        //     CommonMethods.showconsole(this.Tag, "J at : " + j)
        //     // CommonMethods.showconsole(this.Tag,"AV PRICE : "+JSON.stringify(productList[j].product_availability))
        //     var productavailability = productList[j].product_availability
        //     for (var k = 0; k < productavailability.length; k++) {
        //       if (this.cartList[i].product_availability == productavailability[k].type) {
        //         CommonMethods.showconsole(this.Tag, "Match at  : " + i + " j " + j + " k : " + k)
        //         this.cartProductList.push(
        //           {
        //             "product_id": productList[j].product_id,
        //             "product_public_id": productList[j].product_public_id,
        //             "product_availability": productavailability[k].type,
        //             "product_availability_price": parseFloat(productavailability[k].price) ,
        //             "quantity": productList[j].quantity,
        //             "product_value": productList[j].product_value,
        //             "additional_feature_price": productList[j].additional_feature_price,
        //             "unit_type": productList[j].unit_type,
        //             "product_name": productList[j].product_name,
        //             "brand_id": productList[j].brand_id,
        //             "description": productList[j].description,
        //             "actual_price": productList[j].actual_price,
        //             "sale_price": productList[j].sale_price,
        //             "image_url": productList[j].image_url,
        //           })

        //         break;
        //       }
        //     }
        //     break;
        //   }
        // }
        this.cartProductList = productList

        CommonMethods.showconsole(this.Tag, "Array Component:- " + JSON.stringify(this.cartProductList))
            
          this.bandId= this.cartProductList[0]['brand_id']
          CommonMethods.showconsole(this.Tag,"Brand Id:- "+this.bandId);
        this.totalAmmount()
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


  addQuantity(cartindex: any) {
    this.count = this.cartProductList[cartindex].quantity
    this.count++
    CommonMethods.showconsole(this.Tag, " if is working")
    this.cartProductList[cartindex].quantity = this.count
    this.cartList[cartindex].quantity = this.count
    this.cookiesservice.set("cartItems", JSON.stringify(this.cartList))
    CommonMethods.showconsole(this.Tag, "Show cookies data:- " + this.cookiesservice.get('cartItems'))
    this.totalAmmount()
  }

  subtractQunatity(cartIndex: any) {
    this.count = this.cartProductList[cartIndex].quantity
    if (this.count != 1) {
      this.count--
      this.cartProductList[cartIndex].quantity = this.count
      this.cartList[cartIndex].quantity = this.count
      this.cookiesservice.set("cartItems", JSON.stringify(this.cartList))
      CommonMethods.showconsole(this.Tag, "Show cookies data:- " + this.cookiesservice.get('cartItems'))
    } else {
      CommonMethods.showconsole(this.Tag, "else is work")
      this.cartProductList.splice(cartIndex, 1)
      this.cartList.splice(cartIndex, 1)
      this.cookiesservice.set("cartItems", JSON.stringify(this.cartList))


      if (this.cartList.length == 0) {
        CommonMethods.showconsole(this.Tag, "Cookies delete function is working")
        this.cookiesservice.delete('cartItems')
      }

      // CommonMethods.showconsole(this.Tag, "product index :- " + productIndex)
      CommonMethods.showconsole(this.Tag, "array :- " + JSON.stringify(this.cartList))
      CommonMethods.showconsole(this.Tag, "Length of array :- " + this.cartList.length)

    }
    this.totalAmmount()

  }


  removeItem(cartIndex: any) {
    this.cartList.splice(cartIndex, 1)
    this.cartProductList.splice(cartIndex, 1)
    this.cookiesservice.set("cartItems", JSON.stringify(this.cartList))
    CommonMethods.showSuccessDialog(this.snackBar, "Item is removed into cart successfully")
    if (this.cartList.length == 0) {
      CommonMethods.showconsole(this.Tag, "Cookies delete function is working")
      this.cookiesservice.delete('cartItems')
    }
    this.totalAmmount()
  }


  totalAmmount() {
    this.totalPrice = 0
    this.deliverCharges = 0
    this.shippingCharges = 0
    this.grandTotal=0



    for (var i = 0; i < this.cartProductList.length; i++) {
      // CommonMethods.showconsole(this.Tag, "Cart cookies Value Show :- " + this.cartProductList[i].product_availability.length)

      // var productavailability = this.cartProductList[i].product_availability
      // CommonMethods.showconsole(this.Tag, "Product Size:- " + productavailability.length)
      // for (var j = 0; j < productavailability.length; j++) {
      //   CommonMethods.showconsole(this.Tag, "AVAILABILITY:- " + productavailability[j].type + " at :  " + j + " price : " + productavailability[j].price)
      //   if (productavailability[j].type == "deliver_now" && productavailability[j].available == true) {
      //     this.deliverCharges = this.deliverCharges + parseFloat(productavailability[j].price);
      //     CommonMethods.showconsole(this.Tag, "Deliver Chrages:- " + this.deliverCharges)
      //     this.deliverBoolean = true

      //   } else if (productavailability[j].type == "shipping" && productavailability[j].available == true) {
      //     this.shippingCharges = this.shippingCharges + parseFloat(productavailability[j].price)
      //     this.shippingChargesBoolean = true
      //   }

      // }
      this.grandTotal += (this.cartProductList[i].sale_price + this.cartProductList[i].additional_feature_price) * this.cartProductList[i].quantity

    }
    // CommonMethods.showconsole(this.Tag, "Show Total:- " + this.totalPrice)
    // if (this.deliverCharges != 0) {
    //   CommonMethods.showconsole(this.Tag, "if is working")
    //   if (this.shippingCharges != 0) {
    //     CommonMethods.showconsole(this.Tag, "Shipping Method:- " + this.totalPrice)
    //     this.grandTotal = this.totalPrice + this.deliverCharges + this.shippingCharges
    //   } else {
    //     this.grandTotal = this.totalPrice + this.deliverCharges
    //   }
    // } else {
    //   CommonMethods.showconsole(this.Tag, "else is working")
    //   this.grandTotal = this.totalPrice
    // }
    //  for(var i=0;i<this.cartProductList.length;i++)
    //  {
    //   this.grandTotal += ((this.cartProductList[i].sale_price + this.cartProductList[i].additional_feature_price  ) * this.cartProductList[i].quantity)+this.cartProductList[i].product_availability_price
    //     CommonMethods.showconsole(this.Tag," total  of  all product "+((this.cartProductList[i].sale_price + this.cartProductList[i].additional_feature_price  ) * this.cartProductList[i].quantity)+this.cartProductList[i].product_availability_price)
    //      CommonMethods.showconsole(this.Tag,"Grand Total:- "+this.grandTotal)
    //   }


    CommonMethods.showconsole(this.Tag, "Total ammount:- " + this.totalPrice)

  }


  validation() {
    if (this.orderPlacedModal.substoreId.trim().length == 0) {
      CommonMethods.showErrorDialog(this.snackBar, "Select stroe address")
      return false
    } else {
      return true
    }
  }



  stepClick(ev) {
    // CommonMethods.showconsole(this.Tag,"Stepper Address"+ ev)
  }

  clickOnCheckOut() {
    this.productListArray = []
    this.storeAccountId = MyCookies.getStoreAccountId(this.cookiesservice)
    CommonWebApiService.getCouponApplyForList(this.spinner,this.htppClient,this.cookiesservice,this.snackBar,this,this.bandId)
    CommonWebApiService.viewSubStore(this.spinner, this.htppClient, this.cookiesservice, this, this.storeAccountId, this.snackBar)
   
  
    // for (var i = 0; i < this.cartProductList.length; i++) {
    //   var productavailability = this.cartProductList[i].product_availability
    //   for (var j = 0; j < productavailability.length; j++) {

    //     if (productavailability[j].type == "in_store" && productavailability[j].available == true) {
    //       CommonMethods.showconsole(this.Tag, "If is working in_store" + " " + i)
    //       this.productListArray.push(new ProductOrderInfoDetails(this.cartProductList[i].product_id, this.cartProductList[i].product_name, this.cartProductList[i].image_url, this.cartProductList[i].actual_price
    //         , this.cartProductList[i].sale_price, this.cartProductList[i].brand_id, MyCookies.getStoreName(this.cookiesservice), productavailability[j].type,
    //         productavailability[j].price, (this.cartProductList[i].product_value + " " + this.cartProductList[i].unit_type), this.cartProductList[i].additional_feature_price, this.cartProductList[i].quantity))
    //     }
    //     if (productavailability[j].type == "deliver_now" && productavailability[j].available == true) {
    //       CommonMethods.showconsole(this.Tag, "If is working deliver_now" + " " + i)
    //       this.productListArray.push(new ProductOrderInfoDetails(this.cartProductList[i].product_id, this.cartProductList[i].product_name, this.cartProductList[i].image_url, this.cartProductList[i].actual_price
    //         , this.cartProductList[i].sale_price, this.cartProductList[i].brand_id, MyCookies.getStoreName(this.cookiesservice), productavailability[j].type,
    //         productavailability[j].price, (this.cartProductList[i].product_value + " " + this.cartProductList[i].unit_type), this.cartProductList[i].additional_feature_price, this.cartProductList[i].quantity))
    //     }
    //     if (productavailability[j].type == "shipping" && productavailability[j].available == true) {
    //       CommonMethods.showconsole(this.Tag, "If is working shipping" + " " + i)
    //       this.productListArray.push(new ProductOrderInfoDetails(this.cartProductList[i].product_id, this.cartProductList[i].product_name, this.cartProductList[i].image_url, this.cartProductList[i].actual_price
    //         , this.cartProductList[i].sale_price, this.cartProductList[i].brand_id, MyCookies.getStoreName(this.cookiesservice), productavailability[j].type,
    //         productavailability[j].price, (this.cartProductList[i].product_value + " " + this.cartProductList[i].unit_type), this.cartProductList[i].additional_feature_price, this.cartProductList[i].quantity))
    //     }
    //   }
    // }

    for (var i = 0; i < this.cartProductList.length; i++) {
      this.productListArray.push(new ProductOrderInfoDetails(this.cartProductList[i].product_id, this.cartProductList[i].product_name, this.cartProductList[i].image_url, this.cartProductList[i].actual_price
        , this.cartProductList[i].sale_price, this.cartProductList[i].brand_id, MyCookies.getStoreName(this.cookiesservice),
        (this.cartProductList[i].product_value + " " + this.cartProductList[i].unit_type), this.cartProductList[i].additional_feature_price, this.cartProductList[i].quantity))
    }



    CommonMethods.showconsole(this.Tag, "Final Array Z:- " + JSON.stringify(this.productListArray))

    // SpreedlyExpress.init("C7cRfNJGODKh4Iu5Ox3PToKjniY", {
    //   "amount": "$9.83",
    //   "company_name": "Acme Widgets",
    //   "sidebar_top_description": "Providing quality widgets since 2015",
    //   "sidebar_bottom_description": "Your order total today",
    //   "full_name": "First Last"
    // }, {
    //   "email": "customer@gmail.com"
    // });

  }


  onResponseCouponForApplyListInterface(status: string, allCouponList: Array<any>){
    switch (status) {
      case "1":
        this.spinner.hide()
        // this.substoreList = allSubStoreList;
        //  CommonMethods.showconsole(this.Tag,"Array Sub Store:- "+JSON.stringify(this.substoreList))
        // this.stepper.selected.completed = true;
        // this.stepper.next();
        // couponList
        // CommonMethods.showconsole(this.Tag,"couponList: - "+JSON.stringify(allCouponList))
        this.couponList=allCouponList
        CommonMethods.showconsole(this.Tag,"couponList: - "+JSON.stringify(this.couponList))
        break;
      case "10":
        CommonMethods.showErrorDialog(this.snackBar, "Session Time Out")
        MyCookies.deletecookies(this.cookiesservice)
        MyRoutingMethods.gotoLogin(this.router)
        break
      default:
        alert("Error Occured, Please try again");
        break;
    }
  }

  onResponseViewSubStore(status: string, allSubStoreList: Array<any>) {
    switch (status) {
      case "1":
        this.spinner.hide()
        this.substoreList = allSubStoreList;
         CommonMethods.showconsole(this.Tag,"Array Sub Store:- "+JSON.stringify(this.substoreList))
        this.stepper.selected.completed = true;
        this.stepper.next();
        break;
      case "10":
        CommonMethods.showErrorDialog(this.snackBar, "Session Time Out")
        MyCookies.deletecookies(this.cookiesservice)
        MyRoutingMethods.gotoLogin(this.router)
        break
      default:
        alert("Error Occured, Please try again");
        break;
    }

  }

  pressBack() {
    this.stepper.selected.completed = true;
    this.stepper.previous();
  }
  orderPlaceApiCall() {
    if (this.validation()) {
      // CommonMethods.showconsole(this.Tag, "substoreId:- " + this.substoreId)
      if(this.newGrandTotal != "")
      {
        this.orderPlacedModal.total_amount = this.newGrandTotal
      }else{
        this.orderPlacedModal.total_amount = this.grandTotal
      }
      
      this.orderPlacedModal.order_info = this.productListArray
      this.stepper.selected.completed = true;
      
      CommonMethods.showconsole(this.Tag, "Sub Store Api:- " + this.orderPlacedModal.substoreId)
      CommonMethods.showconsole(this.Tag, "total Ammount:- " + this.orderPlacedModal.total_amount)
      CommonMethods.showconsole(this.Tag, "total payment info :- " + JSON.stringify(this.orderPlacedModal.payment_info))
      CommonMethods.showconsole(this.Tag, "total order INfo:- " + JSON.stringify(this.orderPlacedModal.order_info))
     
    
      CommonWebApiService.orderPlacedApi(this.spinner, this.htppClient, this.cookiesservice, this.snackBar, this.orderPlacedModal, this)

    }


  }


  onResponsewebOrderPlacedInterface(status: string, message: string) {
    switch (status) {
      case "1":
        CommonMethods.showSuccessDialog(this.snackBar, message)
        this.cookiesservice.delete('cartItems')
        MyRoutingMethods.gotoStoreOrder(this.router, this.accountType)
        break;
      case "10":
        CommonMethods.showErrorDialog(this.snackBar, "Session Time Out")
        MyCookies.deletecookies(this.cookiesservice)
        MyRoutingMethods.gotoLogin(this.router)
        break;
      case "11":
        CommonMethods.showErrorDialog(this.snackBar, message)
        break;
      case "0":
        CommonMethods.showErrorDialog(this.snackBar, message)
        break;
      default:
        alert("Error Occured, Please try again");
        break;
    }
  }


openModal(coupon){

this.modalRef=this.modalService.open(coupon, { centered: true })
}


JoinAndClose()
{
    this.modalRef.close()
}

  applyCoupon(coupon){
    this.openModal(coupon)
  }


  CheckcouponWithOder(CouponId){
      
        CommonMethods.showconsole(this.Tag,"Coupon Id :- "+CouponId)
        this.orderPlacedModal.couponId=CouponId
        this.orderPlacedModal.couponUsed="yes"
        CommonMethods.showconsole(this.Tag, "Array cartlist :- " + JSON.stringify(this.cartList))
        var orderInfo=[] 
        for(var i=0;i<this.cartList.length;i++)
        {
             orderInfo.push(this.cartList[i]["productId"])
        }
        CommonMethods.showconsole(this.Tag,"order Info :- "+JSON.stringify(orderInfo))
        CommonMethods.showconsole(this.Tag,"Coupon Id :- "+this.grandTotal)
         CommonWebApiService.checkCouponWithOrder(this.spinner,this.htppClient,this.cookiesservice,this.snackBar,this,CouponId,orderInfo,this.grandTotal)
  }
  onResponsecountCheckWithOrderIdInterface(status:string,payableAmountAfterDiscount:any,message:any,discountAmount:any,couponCountCheck:any){
    

    switch (status) {
      case "1":
        CommonMethods.showSuccessDialog(this.snackBar, message)
        this.couponAppliedBoolean=true
        this.discountValue=discountAmount
        this.newGrandTotal=payableAmountAfterDiscount
        this.orderPlacedModal.couponDiscount=discountAmount
        this.orderPlacedModal.couponCount=couponCountCheck
        break;
      case "10":
        CommonMethods.showErrorDialog(this.snackBar, "Session Time Out")
        MyCookies.deletecookies(this.cookiesservice)
        MyRoutingMethods.gotoLogin(this.router)
        break;
      case "11":
        CommonMethods.showErrorDialog(this.snackBar, message)
        break;
      case "0":
        CommonMethods.showErrorDialog(this.snackBar, message)
        break;
      default:
        alert("Error Occured, Please try again");
        break;
    }

  }

  removeCoupon(){
  CommonMethods.showconsole(this.Tag,"Remove Wis working")
  this.couponAppliedBoolean=false
  this.orderPlacedModal.couponDiscount=""
  this.orderPlacedModal.couponCount="no"
  this.orderPlacedModal.couponId=""
  this.orderPlacedModal.couponUsed="no"
  }

}
