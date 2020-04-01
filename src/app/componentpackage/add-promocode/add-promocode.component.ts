import { Component, OnInit } from '@angular/core';
import { CommonWebApiService } from 'src/app/CommonMethods/CommonApis';
import { CommonMethods } from 'src/app/utilpackages/common-methods';
import { MyCookies } from 'src/app/utilpackages/my-cookies';
import { MyRoutingMethods } from 'src/app/utilpackages/my-routing-methods';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location, DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material';
import { GetCouponProductList, AddCoupon, GetCouponDetails } from 'src/app/CommonMethods/CommonInterface';
import { AddCouponModal } from 'src/app/modelspackages/add-coupon'
@Component({
  selector: 'app-add-promocode',
  templateUrl: './add-promocode.component.html',
  styleUrls: ['./add-promocode.component.css']
})
export class AddPromocodeComponent implements OnInit, GetCouponProductList, AddCoupon, GetCouponDetails {

  Tag = "AddPromocodeComponent"
  accountType: any
  urlaccountType: any
  count: any
  productList: Array<any>
  productIds: any
  CouponUsedType: any
  showProductList = false
  showCountField = false
  amountDiscountType = false
  percentageDiscountType = false
  addPromoCode: AddCouponModal
  couponStartTime: any
  couponEndTime: any
  couponPublicId: any
  couponId :any




  constructor(public spinner: NgxSpinnerService, public cookiesservice: CookieService,
    public activedRouter: ActivatedRoute, public httpclient: HttpClient, public location: Location,
    public router: Router, public snackBar: MatSnackBar,public datePipe:DatePipe) {
    this.accountType = ""
    this.urlaccountType = ""
    this.count = 0
    this.productIds = []

    this.CouponUsedType = ""
    this.productList = []
    this.showProductList = false
    this.amountDiscountType = false
    this.percentageDiscountType = false
    this.couponStartTime = ""
    this.couponEndTime = ""
    this.couponPublicId = ""
    this.couponId = ""
    this.addPromoCode = new AddCouponModal("", "", "", "", "", "", "", "", "", "", "", [])
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
        // if (this.accountType == "super_admin") {
        this.activedRouter.params.subscribe(params => {
          this.couponPublicId = params['couponId']
          CommonMethods.showconsole(this.Tag, "Coupon Public ID urrrr :- " + this.couponPublicId)
        })

        if (this.couponPublicId == undefined) {
          CommonMethods.showconsole(this.Tag, "Coupon Public ID urrrr if")
        }
        else {
          CommonWebApiService.getCouponDetails(this.spinner, this.httpclient, this.cookiesservice, this.snackBar, this, this.couponPublicId)
        }

        //   if (this.storeAccountId == undefined) {
        //     MyRoutingMethods.gotoLogin(this.router)
        //   }
        //   else {
        //     CommonWebApiService.viewProducts(this.spinner, this.httpclient, this.cookiesservice, this, this.count, this.storeAccountId, this.snackBar)

        //   }
        // } else {
        //   this.storeAccountId = MyCookies.getStoreAccountId(this.cookiesservice)
        // }

        CommonWebApiService.getAllProductList(this.spinner, this.httpclient, this.cookiesservice, this.snackBar, this)

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





  onResponseGetCouponDetailsInterface(status: string, couponData: any) {
    switch (status) {
      case "1":
        this.spinner.hide();
        CommonMethods.showconsole(this.Tag, "allProductsList:- " + JSON.stringify(couponData))

        this.addPromoCode.coupon_code = couponData['couponCode']
        this.addPromoCode.coupon_type = couponData['coupon_type']

         this.couponStartTime =  this.datePipe.transform(couponData['couponStartTime'] * 1000 ,'yyyy-MM-ddThh:mm')
         this.couponEndTime =  this.datePipe.transform(couponData['couponEndTime'] * 1000 ,'yyyy-MM-ddThh:mm')
         this.couponId=couponData['couponId']
         CommonMethods.showconsole(this.Tag,"Start Time:- "+ this.couponStartTime)
         CommonMethods.showconsole(this.Tag,"end Time :- "+ this.couponEndTime)
         CommonMethods.showconsole(this.Tag,"Coupon Type:- "+ this.addPromoCode.coupon_type)
        if (this.addPromoCode.coupon_type == "selected_products") {
          this.showProductList = true
          var selectedProductList = couponData['selectedProductList']
          for (var i = 0; i < selectedProductList.length; i++) {
            this.productIds.push(selectedProductList[i].product_id)
          }
          CommonMethods.showconsole(this.Tag, "Categories Id:- " + this.productIds)
        }
        this.addPromoCode.usedby_count_or_end_date = couponData['usedbyCountOrEndDate']
        if (this.addPromoCode.usedby_count_or_end_date == "count") {
          this.showCountField = true
          this.addPromoCode.number_of_coupon = couponData['numberOfCoupon']
        }
        this.addPromoCode.more_then_amount = couponData['moreThenAmount']
        this.addPromoCode.discount_type=couponData['discountType']

        if( this.addPromoCode.discount_type == "amount")
        {
          this.amountDiscountType=true
          this.addPromoCode.discount_amount=couponData['discountAmount']
        }else{
            this.percentageDiscountType=true
             CommonMethods.showconsole(this.Tag,"discountPercentageAmountUpto: "+couponData['discountPercentageAmountUpto'])
             CommonMethods.showconsole(this.Tag,"discountPercentage: "+couponData['discountPercentage'])
            this.addPromoCode.discount_percentage_amount_upto=couponData['discountPercentageAmountUpto']
            this.addPromoCode.discount_percentage=couponData['discountPercentage']
        }
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
  onResponseGetCouponProductListInterface(status: string, allProductsList: Array<any>) {
    switch (status) {
      case "1":
        this.spinner.hide();
        // CommonMethods.showconsole(this.Tag, "allProductsList:- " + JSON.stringify(allProductsList))
        this.productList = allProductsList
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


  OnChangeCouponType(changeType: string) {
    CommonMethods.showconsole(this.Tag, "CHnage Value Oof Content Type:- " + changeType)
    if (changeType == "selected_products") {
      
      this.showProductList = true
      if(this.productList.length == 0){
          alert("You want coupon for selected product add product first")
          this.addPromoCode.coupon_type=""
      }
    } else {
      this.showProductList = false
      this.productIds=[]
    }
  }

  OnChangeCouponUsedType(numberOfcouponType: any) {

    CommonMethods.showconsole(this.Tag, "number of Coupon type is used :- " + numberOfcouponType)
    if (numberOfcouponType == "count") {
      this.showCountField = true
     
    }
    else {
      this.showCountField = false
      this.addPromoCode.number_of_coupon=""
    }
  }

  OnChangeDiscountType(discountTypeValue: any) {
    CommonMethods.showconsole(this.Tag, "Discount Type  value :- " + discountTypeValue)
    if (discountTypeValue == "amount") {
      this.amountDiscountType = true
      this.percentageDiscountType = false
      this.addPromoCode.discount_percentage=""
      this.addPromoCode.discount_percentage_amount_upto=""
    } else {
      this.amountDiscountType = false
      this.percentageDiscountType = true
      this.addPromoCode.discount_amount=""
    }
  }


  vaildation() {

    if (this.addPromoCode.coupon_code.trim().length == 0) {
      CommonMethods.showErrorDialog(this.snackBar, "Enter the coupon code")
      return false
    } else if (this.couponStartTime.trim().length == 0) {
      CommonMethods.showErrorDialog(this.snackBar, "Enter start coupon time")
      return false
    } else if (this.couponEndTime.trim().length == 0) {
      CommonMethods.showErrorDialog(this.snackBar, "Enter end coupon time")
      return false
    } else if (this.checkTimeStampValidation() == false) {
      CommonMethods.showErrorDialog(this.snackBar, " Enter valid end date")
      return false
    } else if (this.addPromoCode.coupon_type.trim().length == 0) {
      CommonMethods.showErrorDialog(this.snackBar, "Select coupon type")
      return false
    } else if (this.productIds.length == 0 && this.showProductList == true) {
      CommonMethods.showErrorDialog(this.snackBar, "Select products")
      return false
    } else if (this.addPromoCode.usedby_count_or_end_date.trim().length == 0) {
      CommonMethods.showErrorDialog(this.snackBar, "Select coupon used type")
      return false
    } else if (this.addPromoCode.number_of_coupon.length == 0 && this.showCountField == true) {
      CommonMethods.showErrorDialog(this.snackBar, "Enter coupon count")
      return false
    } else if (this.addPromoCode.number_of_coupon == "0" && this.showCountField == true) {
      CommonMethods.showErrorDialog(this.snackBar, "coupon count  can't be 0")
      return false
    } else if (this.addPromoCode.more_then_amount.length == 0) {
      CommonMethods.showErrorDialog(this.snackBar, "Enter the coupon amount limit")
      return false
    } else if (this.addPromoCode.more_then_amount == "0") {
      CommonMethods.showErrorDialog(this.snackBar, "Coupon amount limit can't be 0")
      return false
    } else if (this.addPromoCode.discount_type.trim().length == 0) {
      CommonMethods.showErrorDialog(this.snackBar, "Select discount type")
      return false
    } else if (this.addPromoCode.discount_amount.length == 0 && this.amountDiscountType == true) {
      CommonMethods.showErrorDialog(this.snackBar, "Enter discount amount")
      return false
    } else if (this.addPromoCode.discount_amount == "0" && this.amountDiscountType == true) {
      CommonMethods.showErrorDialog(this.snackBar, "Discount amount can't be 0")
      return false
    } else if (this.addPromoCode.discount_percentage.length == 0 && this.percentageDiscountType == true) {
      CommonMethods.showErrorDialog(this.snackBar, "Enter Discount percentage")
      return false
    } else if (this.addPromoCode.discount_percentage == "0" && this.percentageDiscountType == true) {
      CommonMethods.showErrorDialog(this.snackBar, "Discount percentage can't be 0")
      return false
    } else if (parseInt(this.addPromoCode.discount_percentage) > 100 && this.percentageDiscountType == true) {
      CommonMethods.showErrorDialog(this.snackBar, "Discount percentage less then 100")
      return false
    } else if (this.addPromoCode.discount_percentage_amount_upto.length == 0 && this.percentageDiscountType == true) {
      CommonMethods.showErrorDialog(this.snackBar, "Enter discount percentage amount")
      return false
    } else if (this.addPromoCode.discount_percentage_amount_upto == "0" && this.percentageDiscountType == true) {
      CommonMethods.showErrorDialog(this.snackBar, " Discount percentage amount can't be 0")
      return false
    } else {
      return true
    }
  }



  checkTimeStampValidation() {
    var timestamStartTime = (new Date(this.couponEndTime)).getTime() / 1000
    var timestamEndTime = (new Date(this.couponStartTime)).getTime() / 1000

    CommonMethods.showconsole(this.Tag, "Start TIme:- " + this.couponEndTime)
    CommonMethods.showconsole(this.Tag, "Start TIme:- " + timestamStartTime)
    CommonMethods.showconsole(this.Tag, "End TIme:- " +this.couponStartTime)
    CommonMethods.showconsole(this.Tag, "End TIme:- " + timestamEndTime)


    if (timestamEndTime >= timestamStartTime) {
      CommonMethods.showconsole(this.Tag, "Working")
      return false
    } else {
      CommonMethods.showconsole(this.Tag, "else Working")
      return true
    }
  }


  addCoupon() {
    if (this.vaildation()) {

      this.addPromoCode.products_list = []

      CommonMethods.showconsole(this.Tag, "Working")

      CommonMethods.showconsole(this.Tag, "Array:- " + this.productIds)
      for (var i = 0; i < this.productIds.length; i++) {

        CommonMethods.showconsole(this.Tag, "this product :- " + this.productIds[i])
        this.addPromoCode.products_list.push(this.productIds[i])
      }

      if (this.amountDiscountType == false) {
        this.addPromoCode.discount_amount = 0
      }
      if (this.percentageDiscountType == false) {
        this.addPromoCode.discount_percentage_amount_upto = 0
        this.addPromoCode.discount_percentage = 0
      }



      CommonMethods.showconsole(this.Tag, "coupon count:- " + this.addPromoCode.coupon_code)
      CommonMethods.showconsole(this.Tag, "start time:- " + this.addPromoCode.coupon_start_time)
      CommonMethods.showconsole(this.Tag, "end coupon time:- " + this.addPromoCode.coupon_end_time)
      CommonMethods.showconsole(this.Tag, "coupon type:- " + this.addPromoCode.coupon_type)
      CommonMethods.showconsole(this.Tag, "product list:- " + JSON.stringify(this.addPromoCode.products_list))
      CommonMethods.showconsole(this.Tag, "select couponlist:- " + this.addPromoCode.usedby_count_or_end_date)
      CommonMethods.showconsole(this.Tag, "coount:= " + this.addPromoCode.number_of_coupon)
      CommonMethods.showconsole(this.Tag, "more_then_amount:- " + this.addPromoCode.more_then_amount)
      CommonMethods.showconsole(this.Tag, "IDscount type:- " + this.addPromoCode.discount_type)
      CommonMethods.showconsole(this.Tag, "discount ammount:- " + this.addPromoCode.discount_amount)
      CommonMethods.showconsole(this.Tag, "discount percentage:- " + this.addPromoCode.discount_percentage)
      CommonMethods.showconsole(this.Tag, "discount amount:- " + this.addPromoCode.discount_percentage_amount_upto)


      var timestamStartTime = (new Date(this.couponStartTime)).getTime() / 1000
      this.addPromoCode.coupon_start_time = timestamStartTime
      var timestamEndTime = (new Date(this.couponEndTime)).getTime() / 1000
      this.addPromoCode.coupon_end_time = timestamEndTime

      CommonMethods.showconsole(this.Tag, "start timestamp:- " + timestamStartTime)
      CommonMethods.showconsole(this.Tag, "end  timestamp:- " + timestamEndTime)
      CommonWebApiService.addCoupon(this.spinner, this.httpclient, this.cookiesservice, this.snackBar, this, this.addPromoCode)
    }
  }

  updateCouponApi(){
    if (this.vaildation()) {

      this.addPromoCode.products_list = []

      CommonMethods.showconsole(this.Tag, "Working")

      CommonMethods.showconsole(this.Tag, "Array:- " + this.productIds)
      for (var i = 0; i < this.productIds.length; i++) {

        CommonMethods.showconsole(this.Tag, "this product :- " + this.productIds[i])
        this.addPromoCode.products_list.push(this.productIds[i])
      }

      if (this.amountDiscountType == false) {
        this.addPromoCode.discount_amount = 0
      }
      if (this.percentageDiscountType == false) {
        this.addPromoCode.discount_percentage_amount_upto = 0
        this.addPromoCode.discount_percentage = 0
      }



      CommonMethods.showconsole(this.Tag, "coupon count:- " + this.addPromoCode.coupon_code)
      CommonMethods.showconsole(this.Tag, "start time:- " + this.addPromoCode.coupon_start_time)
      CommonMethods.showconsole(this.Tag, "end coupon time:- " + this.addPromoCode.coupon_end_time)
      CommonMethods.showconsole(this.Tag, "coupon type:- " + this.addPromoCode.coupon_type)
      CommonMethods.showconsole(this.Tag, "product list:- " + JSON.stringify(this.addPromoCode.products_list))
      CommonMethods.showconsole(this.Tag, "select couponlist:- " + this.addPromoCode.usedby_count_or_end_date)
      CommonMethods.showconsole(this.Tag, "coount:= " + this.addPromoCode.number_of_coupon)
      CommonMethods.showconsole(this.Tag, "more_then_amount:- " + this.addPromoCode.more_then_amount)
      CommonMethods.showconsole(this.Tag, "IDscount type:- " + this.addPromoCode.discount_type)
      CommonMethods.showconsole(this.Tag, "discount ammount:- " + this.addPromoCode.discount_amount)
      CommonMethods.showconsole(this.Tag, "discount percentage:- " + this.addPromoCode.discount_percentage)
      CommonMethods.showconsole(this.Tag, "discount amount:- " + this.addPromoCode.discount_percentage_amount_upto)
      var timestamStartTime = (new Date(this.couponStartTime)).getTime() / 1000
      this.addPromoCode.coupon_start_time = timestamStartTime
      var timestamEndTime = (new Date(this.couponEndTime)).getTime() / 1000
      this.addPromoCode.coupon_end_time = timestamEndTime

      CommonMethods.showconsole(this.Tag, "start timestamp:- " + timestamStartTime)
      CommonMethods.showconsole(this.Tag, "end  timestamp:- " + timestamEndTime)
         
       CommonWebApiService.updateCoupon(this.spinner,this.httpclient,this.cookiesservice,this.snackBar,this,this.addPromoCode,this.couponId)
      
    }
  }

  onResponseAddCouponInterface(status: any, message: string) {
    switch (status) {
      case "1":
        this.spinner.hide();
        CommonMethods.showSuccessDialog(this.snackBar, message)
        MyRoutingMethods.gotoCouponPreviews(this.router, this.accountType)
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




  ngOnInit() {
  }




}
