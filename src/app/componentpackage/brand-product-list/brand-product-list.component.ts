import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MyCookies } from 'src/app/utilpackages/my-cookies';
import { CommonMethods } from 'src/app/utilpackages/common-methods';
import { MyRoutingMethods } from 'src/app/utilpackages/my-routing-methods';

@Component({
  selector: 'app-brand-product-list',
  templateUrl: './brand-product-list.component.html',
  styleUrls: ['./brand-product-list.component.css']
})
export class BrandProductListComponent implements OnInit {

  Tag = "BrandProductListComponent"
  accountType: string
  urlaccountType: string
  productsLits: Array<any>
  previousIndex: any
  count: number
  cartArray: Array<any>
  constructor(public cookiesservice: CookieService, public router: Router, public activatedRouter: ActivatedRoute,
    public location: Location) {
    this.accountType = ""
    this.urlaccountType = ""
    this.productsLits = []
    this.cartArray = []
    this.previousIndex = ""
    this.count = 1
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
        this.productsLits.push(
          {
            "productId": "44",
            "productPublicId": "15795244495e25a1612372a",
            "productName": "Cdb",
            "actualPrice": 10,
            "salePrice": 9,
            "description": "Hemp oil Extract, MCT oil, Natural Flavors, Terpenes.",
            "productImage": "https://firebasestorage.googleapis.com/v0/b/steerlyfe-e2405.appspot.com/o/product-image%2F1579524445458?alt=media&token=f3ee08b3-1bda-45db-ae5f-be65b7724e25",
            "currentStatus": "active",
            "additional_feature_price": 0,
            "additional_feature": "100 ML",
            "product_availability": "in_store",
            "product_availability_price": 0,
            "createdTime": 1579524449,
            "updatedTime": 1580724124,
            "quantity": 0
          },
          {
            "productId": "46",
            "productPublicId": "15795924885e26ab28ea45b",
            "productName": "EarPhone",
            "actualPrice": 10,
            "salePrice": 6,
            "description": "Good",
            "productImage": "https://firebasestorage.googleapis.com/v0/b/steerlyfe-e2405.appspot.com/o/product-image%2F1579592486667?alt=media&token=aca74225-2ae9-4132-8fbb-b49e3872b290",
            "currentStatus": "active",
            "createdTime": 1579592488,
            "updatedTime": 1579592488,
            "additional_feature_price": 0,
            "additional_feature": "100 ML",
            "product_availability": "in_store",
            "product_availability_price": 0,
            "quantity": 0
          },
          {
            "productId": "40",
            "productPublicId": "15789188045e1c63940c945",
            "productName": "Evo Naturals Hemp Gummies",
            "actualPrice": 30,
            "salePrice": 29,
            "description": "Evo Naturals 140,000 Hemp Oil Gummies are specially created for those who seek for a delicious and powerful health supplement. Useful, high-quality ingredients professionally blended to promote not only a restful sleep but also deal with insomnia, anxiety, depression, nausea, and more! Simple and extremely cute shape specially designed to bring you happiness and a sharp desire to try them immediately.",
            "productImage": "https://firebasestorage.googleapis.com/v0/b/steerlyfe-e2405.appspot.com/o/product-image%2F1578918796348?alt=media&token=ce9d7f91-94f7-46ad-b3be-61665e01f5aa",
            "currentStatus": "active",
            "createdTime": 1578918804,
            "updatedTime": 1579524364,
            "additional_feature_price": 0,
            "additional_feature": "100 ML",
            "product_availability": "in_store",
            "product_availability_price": 0,
            "quantity": 0
          },
          {
            "productId": "41",
            "productPublicId": "15789190985e1c64ba4ae4d",
            "productName": "Hemp Oil",
            "actualPrice": 29,
            "salePrice": 28,
            "description": "Our omega supplement of hemp oil gives you a natural way to relieve chronic pain, inflammation, and more using the benefits of the hemp plant. It also provides anxiety & stress relief, & promotes better sleep patterns.",
            "productImage": "https://firebasestorage.googleapis.com/v0/b/steerlyfe-e2405.appspot.com/o/product-image%2F1578919090218?alt=media&token=05a2976b-c3ad-4b8c-ac43-7ef49222e292",
            "currentStatus": "active",
            "createdTime": 1578919098,
            "updatedTime": 1578919177,
            "additional_feature_price": 0,
            "additional_feature": "100 ML",
            "product_availability": "in_store",
            "product_availability_price": 0,
            "quantity": 0
          },
          {
            "productId": "39",
            "productPublicId": "15789160255e1c58b9ad52b",
            "productName": "Hemp Pain Relief Cream",
            "actualPrice": 32,
            "salePrice": 30,
            "description": "Pain Relief Corp. 60,000 MG is the highest-grade quality Hemp cream available, supporting optimal pain management & healthy wellbeing. Powerful Relief Cream is a great source of countless essentials beneficial to your skin & health! Perfect for everyone!",
            "productImage": "https://firebasestorage.googleapis.com/v0/b/steerlyfe-e2405.appspot.com/o/product-image%2F1578916015002?alt=media&token=62aecfb3-8b37-4bf4-8b28-4955a3cb4ef0",
            "currentStatus": "active",
            "createdTime": 1578916025,
            "updatedTime": 1578919185,
            "additional_feature_price": 0,
            "additional_feature": "100 ML",
            "product_availability": "in_store",
            "product_availability_price": 0,
            "quantity": 0
          },
          {
            "productId": "42",
            "productPublicId": "15791687555e2033f318fbe",
            "productName": "Sephora Launched Line",
            "actualPrice": 10,
            "salePrice": 9,
            "description": "One of the latest industries to make this transformation has been the skincare industry, where CBD is fast becoming one of the hottest beauty and wellness trends.\n\nWhen you consider that CBD products can be used to help with skin conditions like acne, as well as reducing the impact of aging, it’s no surprise that many companies are turning towards this ingredient for their latest products.",
            "productImage": "https://firebasestorage.googleapis.com/v0/b/steerlyfe-e2405.appspot.com/o/product-image%2F1579168752088?alt=media&token=e83ee745-7968-4490-a7e4-7042913c6aed",
            "currentStatus": "active",
            "createdTime": 1579168755,
            "updatedTime": 1579168791,
            "additional_feature_price": 0,
            "additional_feature": "100 ML",
            "product_availability": "deliver_now",
            "product_availability_price": 10,
            "quantity": 0
          },
          {
            "productId": "43",
            "productPublicId": "15795205415e25921db5d62",
            "productName": "Vanilla CBD Oil",
            "actualPrice": 100,
            "salePrice": 99,
            "description": "For those trying to buy CBD Tincture, it can feel almost impossible to actually find what you are looking for. Thankfully, there are a myriad of ways to look online to try and find CBD Tinctures (300mg Vanilla flavor or otherwise) -- especially if you don't mind putting your trust in more than one brand.",
            "productImage": "https://firebasestorage.googleapis.com/v0/b/steerlyfe-e2405.appspot.com/o/product-image%2F1579520537656?alt=media&token=66be909e-24e5-41e4-9387-49e2f03369d7",
            "currentStatus": "active",
            "createdTime": 1579520541,
            "updatedTime": 1580724019,
            "additional_feature_price": 0,
            "additional_feature": "100 ML",
            "product_availability": "shipping",
            "product_availability_price": 20,
            "quantity": 0
          }
        )
        CommonMethods.showconsole(this.Tag, "Show Array :- " + JSON.stringify(this.productsLits))

        if (this.cookiesservice.check('cartItems') != false) {
          var cookiesarray = JSON.parse(this.cookiesservice.get('cartItems'))
          this.cartArray = cookiesarray
          for (var i = 0; i < this.productsLits.length; i++) {
            let cartbuttonId = 'addcartbutton_' + i
            let divId = 'isQuantity_' + i;

            for (var j = 0; j < this.cartArray.length; j++) {

              if (this.cartArray[j].productPublicId == this.productsLits[i].productPublicId) {
                CommonMethods.showconsole(this.Tag, "Show  Console : " + this.productsLits[i] + "   index:- " + i)

                this.productsLits[i].quantity = this.cartArray[j].quantity
                this.count = this.cartArray[j].quantity
                setTimeout(() => {
                  document.getElementById(divId).classList.remove('quantity');
                  document.getElementById(cartbuttonId).classList.add('cartbutton');


                }, 500);
              }

            }

          }
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


  addToCartFunction(productPublicId: string, index: any) {
    this.count = 1
    CommonMethods.showconsole(this.Tag, "Function IS working:- " + productPublicId + " INdex " + index)
    CommonMethods.showconsole(this.Tag, "this.previousIndex:- " + this.previousIndex)
    // if (this.previousIndex != index.toString()) {
    CommonMethods.showconsole(this.Tag, "If is working")
    let divId = 'isQuantity_' + index
    let cartbuttonId = 'addcartbutton_' + index
    CommonMethods.showconsole(this.Tag, "divId:- " + divId)

    this.productsLits[index].quantity
    CommonMethods.showconsole(this.Tag, "Qunaityt value:- " + this.productsLits[index].quantity)
    this.cartArray.push(
      {
        "productId": this.productsLits[index].productId,
        "productPublicId": this.productsLits[index].productPublicId,
        "productImage": this.productsLits[index].productImage,
        "productName": this.productsLits[index].productName,
        "store_id": MyCookies.getStoreId(this.cookiesservice),
        "store_name": MyCookies.getStoreName(this.cookiesservice),
        "productSalePrice": this.productsLits[index].salePrice,
        "productAcutalPrice": this.productsLits[index].actualPrice,
        "quantity": this.productsLits[index].quantity = this.count,
        "additional_feature_price": this.productsLits[index].additional_feature_price,
        "additional_feature": this.productsLits[index].additional_feature,
        "product_availability": this.productsLits[index].product_availability,
        "product_availability_price": this.productsLits[index].product_availability_price,
      })
    CommonMethods.showconsole(this.Tag, "Array save into cookies:- " + JSON.stringify(this.cartArray))
    this.cookiesservice.set("cartItems", JSON.stringify(this.cartArray))
    // this.previousIndex = index
    setTimeout(() => {

      document.getElementById(cartbuttonId).classList.add('cartbutton');
      document.getElementById(divId).classList.remove('quantity');
    }, 400);


    // } else {
    //   CommonMethods.showconsole(this.Tag, "else is working")
    //   alert("This Item Is already Add into Cart")
    //   this.previousIndex = index

    // }

  }
  addQuantity(productIndex: any, productpublicId: any) {
    this.count = this.productsLits[productIndex].quantity
    this.count++
    this.productsLits[productIndex].quantity = this.count

    for (var i = 0; i < this.cartArray.length; i++) {
      if (this.cartArray[i].productPublicId == productpublicId) {
        CommonMethods.showconsole(this.Tag, " if is working")

        this.cartArray[i].quantity = this.count
        this.cookiesservice.set("cartItems", JSON.stringify(this.cartArray))
      }
    }
    CommonMethods.showconsole(this.Tag, "Show cookies data:- " + this.cookiesservice.get('cartItems'))
  }

  subtractQunatity(productIndex: any, divID: any, productPublicId: any) {
    let cartbuttonId = 'addcartbutton_' + productIndex
    this.count = this.productsLits[productIndex].quantity
    if (this.count != 1) {
      this.count--
      this.productsLits[productIndex].quantity = this.count
      for (var i = 0; i < this.cartArray.length; i++) {
        if (this.cartArray[i].productPublicId == productPublicId) {
          CommonMethods.showconsole(this.Tag, " if is working")

          this.cartArray[i].quantity = this.count
          this.cookiesservice.set("cartItems", JSON.stringify(this.cartArray))
        }
      }
      CommonMethods.showconsole(this.Tag, "Show cookies data:- " + this.cookiesservice.get('cartItems'))
    } else {
      CommonMethods.showconsole(this.Tag, "else is work")
      document.getElementById(divID).classList.add('quantity');
      document.getElementById(cartbuttonId).classList.remove('cartbutton');
      this.productsLits[productIndex].quantity = 0
      CommonMethods.showconsole(this.Tag, "Product Id :- " + productPublicId)
      for (var i = 0; i < this.cartArray.length; i++) {

        if (this.cartArray[i].productPublicId == productPublicId) {
          CommonMethods.showconsole(this.Tag, "Product Id :- " + this.cartArray[i].productPublicId)
          CommonMethods.showconsole(this.Tag, "if is sdfsdf   " + i)
          this.cartArray.splice(i, 1)
          this.cookiesservice.set("cartItems", JSON.stringify(this.cartArray))
        }
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
}
