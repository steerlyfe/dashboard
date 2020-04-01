import { Component, OnInit } from '@angular/core';
import { MyCookies } from 'src/app/utilpackages/my-cookies';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonMethods } from 'src/app/utilpackages/common-methods';
import { Location } from '@angular/common';
import { MyRoutingMethods } from 'src/app/utilpackages/my-routing-methods';
import { CommonWebApiService } from 'src/app/CommonMethods/CommonApis';
import { HttpClient } from '@angular/common/http';
import { MyConstants } from 'src/app/utilpackages/constant';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material';
import { GetBrandProduct } from 'src/app/CommonMethods/CommonInterface';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.css']
})
export class BrandListComponent implements OnInit, GetBrandProduct {
  Tag = "BrandListComponent"
  accountType: string
  urlaccountType: string
  categoriesList: Array<any>
  productsLits: Array<any>
  count: number
  listisloading = false
  isLoading=false
  cartArray: Array<any>
  previousPosition: number
  listCount: any;
  categoryId: any;
  endReached = false;
  pagePerItemList: number;
  onscollLoadingapical = true
  onscollLoading = false
  responseList: Array<any>
  previousButtonType: string
  constructor(public cookiesservice: CookieService, public router: Router, public activatedRouter: ActivatedRoute,
    public location: Location, public httpClient: HttpClient, public spinner: NgxSpinnerService, public snackBar: MatSnackBar) {
    this.accountType = ""
    this.urlaccountType = ""
    this.endReached = false;
    this.productsLits = []
    this.cartArray = []
    this.responseList = []
    this.previousButtonType = "in_store"
    this.previousPosition = 0
    this.pagePerItemList = 0
    this.listisloading = false
    this.isLoading=false
    this.onscollLoadingapical = true
    this.onscollLoading = false
    this.count = 1
    this.listCount = 0
    this.categoryId = "1"
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

        this.getCategories()

        CommonWebApiService.getBrandProduct(this.spinner, this.httpClient, this.cookiesservice, this.snackBar, this.categoryId, this.listCount, this)



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


  onResponseGetBrandProductInterface(status: string, brandProductList: Array<any>, pagePerItem: any) {
    // this.productsLits = []
    switch (status) {
      case "1":

        // this.isLoading = true;
        this.responseList = brandProductList
        for (var i = 0; i < brandProductList.length; i++) {
          var productavailability = brandProductList[i].product_availability
          // for (var j = 0; j < productavailability.length; j++) {
          //   if (productavailability[j].type == this.previousButtonType && productavailability[j].available == true) {
              this.productsLits.push(
                {
                  "product_id": brandProductList[i].product_id,
                  "category_id": brandProductList[i].category_id,
                  "product_public_id": brandProductList[i].product_public_id,
                  "product_value": brandProductList[i].product_value,
                  "additional_feature_price": brandProductList[i].additional_feature_price,
                  "unit_type": brandProductList[i].unit_type,
                  "product_name": brandProductList[i].product_name,
                  "brand_id": brandProductList[i].brand_id,
                  "product_availability": brandProductList[i].product_availability,
                  // "product_availability": productavailability[j].type,
                  // "product_availability_price":  productavailability[j].price,
                  "description": brandProductList[i].description,
                  "actual_price": brandProductList[i].actual_price,
                  "sale_price": brandProductList[i].sale_price,
                  "image_url": brandProductList[i].image_url,
                  "quantity": 0

                })
          //   }
          // }

        }

        // this.productsLits.push(this.responseList) ;
        this.pagePerItemList = pagePerItem
        // CommonMethods.showconsole(this.Tag, "Array length:- " + this.productsLits.length)
        CommonMethods.showconsole(this.Tag, "Array:- " + JSON.stringify(this.productsLits))



        this.isLoading=true


        setTimeout(() => {
         
          this.listisloading = true

        }, 100);
        CommonMethods.showconsole(this.Tag, "Length Of list Is :- " + this.productsLits.length)
        CommonMethods.showconsole(this.Tag, "pageperlimt:- " + this.listCount)
        if (this.productsLits.length < this.listCount.count) {
          CommonMethods.showconsole(this.Tag, "onscollLoadingapical  working")
          this.onscollLoadingapical = false
        }

        // this.pageLimit = pagenumberLimit;
        // if (this.count !== 0) {
        //   this.showpreviousButton = true
        // }
        // else {
        //   this.showpreviousButton = false
        // }
        // if (this.productLists.length < this.pageLimit) {
        //   this.shownextButton = false
        // }
        // else {
        //   this.shownextButton = true;
        // }

        if (this.cookiesservice.check('cartItems') != false) {
          CommonMethods.showconsole(this.Tag, "If is working cart cookies")
          var cookiesarray = JSON.parse(this.cookiesservice.get('cartItems'))
          this.cartArray = cookiesarray

          CommonMethods.showconsole(this.Tag, "cookies array:- " + JSON.stringify(this.cartArray))
          for (var i = 0; i < this.productsLits.length; i++) {
            CommonMethods.showconsole(this.Tag, "For Is working product list")
            let cartbuttonId = 'addcartbutton_' + i
            let divId = 'isQuantity_' + i;
            let productavailable = this.productsLits[i].product_availability
            CommonMethods.showconsole(this.Tag, "For IS cartbutton :-  working:- " + cartbuttonId)
            CommonMethods.showconsole(this.Tag, "For IS divId working:- " + divId)
            CommonMethods.showconsole(this.Tag, "For IS working")
            for (var j = 0; j < this.cartArray.length; j++) {

              CommonMethods.showconsole(this.Tag, "For IS  inside for working")
              if (this.cartArray[j].productId == this.productsLits[i].product_id &&
                this.cartArray[j].product_value == this.productsLits[i].product_value
              ) {

                // if (this.cartArray[j].product_availability == this.previousButtonType) {
                  CommonMethods.showconsole(this.Tag, "if IS into for working")
                  CommonMethods.showconsole(this.Tag, "For IS product_public_id cart working:- " + this.cartArray[j].productId)
                  CommonMethods.showconsole(this.Tag, "For IS product_public_id product working:- " + this.productsLits[i].product_id)

                  CommonMethods.showconsole(this.Tag, "Show  Console : " + this.productsLits[i] + "   index:- " + i)

                  this.productsLits[i].quantity = this.cartArray[j].quantity
                  this.count = this.cartArray[j].quantity
                  setTimeout(() => {
                    document.getElementById(cartbuttonId).classList.add('cartbutton');
                    document.getElementById(divId).classList.remove('quantity');
                  }, 600);
                // }


              }

            }

          }
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



  /*
   product Availability According LIst
  */
  productType(buttunId: string) {
    this.productsLits = []
    this.listCount = 0
    this.listisloading = false
    if (buttunId == this.previousButtonType) {
      CommonWebApiService.getBrandProduct(this.spinner, this.httpClient, this.cookiesservice, this.snackBar, this.categoryId, this.listCount, this)
    } else {
      document.getElementById(this.previousButtonType).classList.remove("productactive")
      document.getElementById(buttunId).classList.add("productactive")
      this.previousButtonType = buttunId
      CommonWebApiService.getBrandProduct(this.spinner, this.httpClient, this.cookiesservice, this.snackBar, this.categoryId, this.listCount, this)

    }

  }



  /*  

  Get Categories  Api Call  
  
  */

  getCategories() {
    this.spinner.show()
    this.httpClient.get(MyConstants.BASEURL + 'categoryList.php').subscribe(responseData => {
      let status = responseData['status']
      switch (status) {

        case '1':
          this.categoriesList = responseData['categoriesList']
          CommonMethods.showconsole(this.Tag, "Show Categories:- " + JSON.stringify(this.categoriesList))
          setTimeout(() => {
            let buttonid = "catregory_" + this.previousPosition;
            CommonMethods.showconsole(this.Tag, "Button id :- " + buttonid);
            document.getElementById(buttonid).classList.add("active")
          }, 50);
          break;
        default:
          alert("Error Occured, Please try again");
          break
      }
    },
      response => {
        CommonMethods.showconsole(this.Tag, "Response Error:- " + response)
      },
      () => {
        // this.spinner.hide()
        CommonMethods.showconsole(this.Tag, 'Finish');


        // setTimeout(() => {
        //   let buttonid = "catregory_" + this.previousPosition;
        //   CommonMethods.showconsole(this.Tag, "Button id :- " + buttonid);
        //   document.getElementById(buttonid).classList.add("active")
        // }, 1000);
    
      }
    )
  }



  showCategoryAccodingList(position: number, categoryId: any) {
    this.productsLits = []
    CommonMethods.showconsole(this.Tag, "category id :- " + categoryId)
    if (this.previousPosition != position) {
      let previousbuttonid = "catregory_" + this.previousPosition
      let currentbuttonid = "catregory_" + position
      this.listisloading = false
      this.listCount = 0
      document.getElementById(previousbuttonid).classList.remove("active")
      document.getElementById(currentbuttonid).classList.add("active")
      this.previousPosition = position
      this.categoryId = categoryId
      this.count = 0
      CommonWebApiService.getBrandProduct(this.spinner, this.httpClient, this.cookiesservice, this.snackBar, this.categoryId, this.listCount, this)

    }
  }



  /**   Add Item into  Cart  function */


  addToCartFunction(productPublicId: string, index: any, unitType: string, unitTypeValue: any) {

    var isProductExistInCart = false

    this.count = 1
    CommonMethods.showconsole(this.Tag, "Index : " + index)
    CommonMethods.showconsole(this.Tag, "Quantity at Index :  " + this.productsLits[index].quantity)
    this.productsLits[index].quantity = this.count
    CommonMethods.showconsole(this.Tag, "length Of Cart Item Array :- " + this.cartArray.length)

    let divId = 'isQuantity_' + index
    let cartbuttonId = 'addcartbutton_' + index

    if (this.cartArray.length != 0) {
      CommonMethods.showconsole(this.Tag, "Items Exist in cart ")

      for (var i = 0; i < this.cartArray.length; i++) {
        CommonMethods.showconsole(this.Tag, "Avaiability : " + this.previousButtonType)
        if (this.cartArray[i].productId == this.productsLits[index].product_id &&
          this.cartArray[i].product_value == this.productsLits[index].product_value ) {
          isProductExistInCart = true
        }
      }

      if (!isProductExistInCart) {
        CommonMethods.showconsole(this.Tag, "Product Not Exists ")
        this.cartArray.push(
          {
            "product_public_id": this.productsLits[index].product_public_id,
            "productId": this.productsLits[index].product_id,
            "unitType": this.productsLits[index].unit_type,
            "product_value": this.productsLits[index].product_value,
            "quantity": this.productsLits[index].quantity,
          })
      }
    }
    else {
      CommonMethods.showconsole(this.Tag, "Items Not Exist in cart ")
      CommonMethods.showconsole(this.Tag, "Additional Feature : " + this.productsLits[index].product_value + " " + this.productsLits[index].unit_type + "  Quantity : " + this.productsLits[index].quantity + " Availability : " + this.previousButtonType)
      this.cartArray.push(
        {
          "product_public_id": this.productsLits[index].product_public_id,
          "productId": this.productsLits[index].product_id,
          "unitType": this.productsLits[index].unit_type,
          "product_value": this.productsLits[index].product_value,
          "quantity": this.productsLits[index].quantity,
        })
    }

    this.cookiesservice.set("cartItems", JSON.stringify(this.cartArray))
    CommonMethods.showconsole(this.Tag, "Array into cookies:- " + this.cookiesservice.get("cartItems"))
    setTimeout(() => {
      document.getElementById(cartbuttonId).classList.add('cartbutton');
      document.getElementById(divId).classList.remove('quantity');
    }, 400);


  }



  
  /* Increase Quantity Function */


  addQuantity(productIndex: any, productpublicId: any) {
    this.count = this.productsLits[productIndex].quantity
    this.count++
    this.productsLits[productIndex].quantity = this.count
    CommonMethods.showconsole(this.Tag, "Product Quantity: and id and :- " + this.count)
    for (var i = 0; i < this.cartArray.length; i++) {

      // if (this.cartArray[i].product_availability == this.previousButtonType) {
        if (this.cartArray[i].productId == productpublicId && this.cartArray[i].product_value == this.productsLits[productIndex].product_value) {
          CommonMethods.showconsole(this.Tag, " if is working")

          this.cartArray[i].quantity = this.count
          this.cookiesservice.set("cartItems", JSON.stringify(this.cartArray))
        }
      // }

    }
    CommonMethods.showconsole(this.Tag, "Show cookies data:- " + this.cookiesservice.get('cartItems'))
  }


  /*
       decrement  product Quantity Function 
  */


  subtractQunatity(productIndex: any, divID: any, productPublicId: any) {
    let cartbuttonId = 'addcartbutton_' + productIndex
    this.count = this.productsLits[productIndex].quantity
    if (this.count != 1) {
      this.count--
      this.productsLits[productIndex].quantity = this.count
      for (var i = 0; i < this.cartArray.length; i++) {

        // if (this.cartArray[i].product_availability == this.previousButtonType) {
          if (this.cartArray[i].productId == productPublicId && this.cartArray[i].product_value == this.productsLits[productIndex].product_value) {
            CommonMethods.showconsole(this.Tag, " if is working")

            this.cartArray[i].quantity = this.count
            this.cookiesservice.set("cartItems", JSON.stringify(this.cartArray))
          }
        // }

      }
      CommonMethods.showconsole(this.Tag, "Show cookies data:- " + this.cookiesservice.get('cartItems'))
    } else {
      CommonMethods.showconsole(this.Tag, "else is work")
      document.getElementById(divID).classList.add('quantity');
      document.getElementById(cartbuttonId).classList.remove('cartbutton');
      this.productsLits[productIndex].quantity = 0
      CommonMethods.showconsole(this.Tag, "Product Id :- " + productPublicId)
      for (var i = 0; i < this.cartArray.length; i++) {
        // if (this.cartArray[i].product_availability == this.previousButtonType) {
          if (this.cartArray[i].productId == productPublicId && this.cartArray[i].product_value == this.productsLits[productIndex].product_value) {
            CommonMethods.showconsole(this.Tag, "Product Id :- " + this.cartArray[i].productId)
            CommonMethods.showconsole(this.Tag, "if is sdfsdf   " + i)
            this.cartArray.splice(i, 1)
            this.cookiesservice.set("cartItems", JSON.stringify(this.cartArray))
          }
        // }

      }
      if (this.cartArray.length == 0) {
        CommonMethods.showconsole(this.Tag, "Cookies delete function is working")
        this.cookiesservice.delete('cartItems')
      }

      // CommonMethods.showconsole(this.Tag, "product index :- " + productIndex)
      CommonMethods.showconsole(this.Tag, "array :- " + JSON.stringify(this.cartArray))
      CommonMethods.showconsole(this.Tag, "Length of array :- " + this.cartArray.length)

    }


  }



  updateScrollPos(e) {
    // console.log(e);
    // this.curScrollPos = e.pos;
    this.endReached = e.endReached;
    CommonMethods.showconsole(this.Tag, "On End Scroll :- " + this.endReached)

    if (e.endReached == true) {

      CommonMethods.showconsole(this.Tag, "Show console onscollLoadingapical value:- " + this.endReached)
      if (this.onscollLoadingapical == true) {
        this.onscollLoading = true
        CommonMethods.showconsole(this.Tag, "Count on end scroll before:- " + this.listCount)
        this.listCount = this.listCount + this.pagePerItemList
        //     CommonMethods.showconsole(this.Tag, "Count on end scroll:after- " + this.getPostMOdal.count)
        //     CommonWebApiService.getPost(this.spinner, this.httpClient, this.cookiesService, this.getPostMOdal, this, this.snackBar)
        CommonWebApiService.getBrandProduct(this.spinner, this.httpClient, this.cookiesservice, this.snackBar, this.categoryId, this.listCount, this)
        this.onscollLoading = false
      }




    }

  }



}
