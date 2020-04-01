import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatSnackBar, MatTableDataSource } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { MyCookies } from 'src/app/utilpackages/my-cookies';
import { CookieService } from 'ngx-cookie-service';
import { CommonMethods } from 'src/app/utilpackages/common-methods';
import { MyRoutingMethods } from 'src/app/utilpackages/my-routing-methods';
import { CommonWebApiService } from 'src/app/CommonMethods/CommonApis';
import { Location } from '@angular/common';
import { GetWooCommerceKey, AddProductFromWeb, CheckBeforeAddProductFromWeb, GetWooCommerceKeyDetailById } from 'src/app/CommonMethods/CommonInterface';
import { SelectionModel, DataSource } from '@angular/cdk/collections';


@Component({
  selector: 'app-shrink-products-web',
  templateUrl: './shrink-products-web.component.html',
  styleUrls: ['./shrink-products-web.component.css']
})
export class ShrinkProductsWebComponent implements OnInit, GetWooCommerceKeyDetailById, AddProductFromWeb, CheckBeforeAddProductFromWeb {
  Tag = "ShrinkProductsWebComponent"
  newrray: Array<any>
  displayedColumns: string[] = ['select', 'sr_no', 'product_image', 'product_name', 'product_price'];
  dataSource: Array<any>
  selection = new SelectionModel(true, []);


  keyPublicId: string
  accountType: string
  urlaccountType: string
  consumer_key: string
  consumerSecret: string
  domain: string
  isLoading = false
  pagepercount = 10
  pagenumber = 1
  allselected = false
  selectedListItem: Array<any>
  // reachedLastPage = false
  listIsLOading = false
  showPreviousButton = false
  showNextButton = true
  constructor(public spinner: NgxSpinnerService, public httpClient: HttpClient, public snackBar: MatSnackBar,
    public router: Router, public activatedRouter: ActivatedRoute, public cookiesService: CookieService, public location: Location) {
    this.keyPublicId = ""
    this.accountType = ""
    this.urlaccountType = ""
    this.consumer_key = ""
    this.domain = ""
    this.isLoading = false
    this.consumerSecret = ""
    this.dataSource = []
    this.allselected = false
    this.selectedListItem = []
    this.pagepercount = 10
    this.pagenumber = 1
    this.listIsLOading = false
    // this.reachedLastPage = false
    this.showPreviousButton = false
    this.showNextButton = true
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
      this.activatedRouter.params.subscribe(params => {
        CommonMethods.showconsole(this.Tag, "Show account Type :- " + params['accountype'])
        this.urlaccountType = params['accountype']
      })
      if (this.accountType == this.urlaccountType) {
        this.activatedRouter.params.subscribe(params => {
          this.keyPublicId = params['woocommerceKey']
          CommonMethods.showconsole(this.Tag, "Public Key:- " + this.keyPublicId)
        })

        if (this.keyPublicId != undefined) {
          CommonWebApiService.getWooCommerceByPublicKey(this.spinner, this.httpClient, this.cookiesService, this.snackBar,this, this.keyPublicId)
        }

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
   * GetWooCommerce by public key api calling response Handle
   * 
   */
  onResponseGetWooCommerceKeyDetailByIdInterface(status: any, keyDataList: any) {

    switch (status) {
      case "1":
        // this.spinner.hide();

        this.consumer_key = keyDataList.consumerKey
        this.consumerSecret = keyDataList.consumerSecret
        this.domain = keyDataList.domain


        CommonMethods.showconsole(this.Tag, "consumer Key:- " + this.consumer_key)
        CommonMethods.showconsole(this.Tag, "consumer Secret:- " + this.consumerSecret)
        CommonMethods.showconsole(this.Tag, "Domain:- " + this.domain)

        this.syncProductsFromWooCommerce()
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
   * Sync  Products From Woo Commerce 
   */

  syncProductsFromWooCommerce() {
    // if (this.reachedLastPage == false) {
    this.listIsLOading = false
    CommonMethods.showconsole(this.Tag, "If Call Api ")
    this.spinner.show();
    const params = new HttpParams()
      .set("consumer_key", this.consumer_key)
      .set("consumer_secret", this.consumerSecret)
      .set("per_page", "" + this.pagepercount)
      .set("page", "" + this.pagenumber)
      .set("min_price", "0.1")
    this.httpClient.get(this.domain + "/wp-json/wc/v3/products", { params })
      .subscribe((responseData) => {
        CommonMethods.showconsole(this.Tag, "Response Data :- " + responseData)
        var obj = JSON.stringify(responseData);
        var arrayconvertedResponse = JSON.parse(obj)

        var demoIdsArray: Array<any> = []

        for (var i = 0; i < arrayconvertedResponse.length; i++) {
          demoIdsArray.push(arrayconvertedResponse[i].id)
        }
        CommonMethods.showconsole(this.Tag, "Length of array :- " + arrayconvertedResponse.length)
        this.dataSource = arrayconvertedResponse
        // checkWoocommerceProducts Response Api caLLING
        CommonWebApiService.checkAddBeforeWooCommerceProduct(this.spinner, this.httpClient, this.cookiesService, this.snackBar, this, demoIdsArray)
        // CommonMethods.showconsole(this.Tag, "Length of array :- " + JSON.stringify(demoIdsArray))

      },
        response => {
          this.spinner.hide();
          CommonMethods.showErrorDialog(this.snackBar, "Some Error Occured ,Please try again or refresh the page ")
          CommonMethods.showconsole(this.Tag, response);
        },
        () => {
          // this.spinner.hide();
          CommonMethods.showconsole(this.Tag, 'Finish')
        })


  }


  /**
   * 
   * Healding checkWoocommerceProducts Response Api
   * 
   */

  onResponseCheckBeforeAddProductFromWebInterface(status: string, alreadyPrductIdsList: Array<any>) {
    switch (status) {
      case "1":

        this.selectedListItem = []
        // this.allselected = false

        CommonMethods.showconsole(this.Tag, "Data Into Json:- " + JSON.stringify(alreadyPrductIdsList))
        CommonMethods.showconsole(this.Tag, "Data Into Json  length:- " + this.dataSource.length)
        var count = 0
        for (var i = 0; i < alreadyPrductIdsList.length; i++) {
          for (var j = 0; j < this.dataSource.length; j++) {
            if (this.dataSource[j].id == alreadyPrductIdsList[i]) {
              CommonMethods.showconsole(this.Tag, " Matched  Value")
              this.dataSource[j].already = true
            }
          }
        }



        if (this.dataSource.length != this.pagepercount) {

          CommonMethods.showconsole(this.Tag, "PAge Per Count If Conditioon is wortking")
          // this.reachedLastPage = true
          this.showNextButton = false
        } else {
          this.showNextButton = true
        }

        // if (this.selectedListItem.length != 0) {
        //   for (var i = 0; i < this.selectedListItem.length; i++) {
        //     for (var j = 0; j < this.dataSource.length; j++) {

        //       if (this.selectedListItem[i].id == this.dataSource[j].id) {
        //         CommonMethods.showconsole(this.Tag, "Match ID:-")
        //         this.dataSource[j].state = true
        //         count++
        //       }

        //     }
        //   }
        // }
        //  if(count == 10){
        //   this.allselected = true
        //  }
        CommonMethods.showconsole(this.Tag, "Count:- " + count)
        CommonMethods.showconsole(this.Tag, "Data Into Json:- " + JSON.stringify(this.dataSource))
        // CommonMethods.showSuccessDialog(this.snackBar, message)
        CommonMethods.showconsole(this.Tag, "Show this.isLoading = true;:- " + this.listIsLOading)
        this.isLoading = true
        this.listIsLOading = true
        // this.isLoading = true;
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


  /**
   * 
   * Handle   Header CheckBox All   Method 
   *  
   */


  checkAll(ev, ischeckValue: any) {
    CommonMethods.showconsole(this.Tag, "Value :- " + ischeckValue)
    CommonMethods.showconsole(this.Tag, "length of array selected :- " + this.selectedListItem.length)
    if (ischeckValue == true) {
      this.dataSource.forEach(x => {
        x.state = true
      })
      if (this.selectedListItem.length == 0) {
        CommonMethods.showconsole(this.Tag, "if is working")
        for (var i = 0; i < this.dataSource.length; i++) {

          this.selectedListItem.push(this.dataSource[i])
        }

      } else {
        CommonMethods.showconsole(this.Tag, "Else is working")
        for (var i = 0; i < this.dataSource.length; i++) {
          var idExit = false
          for (var j = 0; j < this.selectedListItem.length; j++) {


            if (this.dataSource[i].id == this.selectedListItem[j].id) {
              CommonMethods.showconsole(this.Tag, "index data source:- " + i + "  index of lower case:- " + j + "  id of datasouce:- " + this.dataSource[i].id
                + "  selected item id :- " + this.selectedListItem[j].id)
              idExit = true
            }
          }
          if (idExit == false) {
            CommonMethods.showconsole(this.Tag, "if is working:- " + i)
            this.selectedListItem.push(this.dataSource[i])
          }

        }
      }


    } else {
      this.dataSource.forEach(x => {
        x.state = false
      })
      if (this.selectedListItem.length != 0) {
        for (var i = 0; i < this.selectedListItem.length; i++) {
          for (var j = 0; j < this.dataSource.length; j++) {

            if (this.selectedListItem[i].id == this.dataSource[j].id) {
              this.selectedListItem.splice(i, 1)
            }

          }
        }
      }
    }
    CommonMethods.showconsole(this.Tag, "length of array selected:- " + this.selectedListItem.length)

  }


  /**
   * 
   *  Handle  header Checkbox same Method 
   */

  isAllChecked() {
    return this.dataSource.every(_ => _.state);
  }

  /**
   * 
   *  Handle table particular Checkbox function
   */


  isCheckboxIsChecked(isCheckBoxId: any, state: any) {
    CommonMethods.showconsole(this.Tag, "Value of Checked :- " + isCheckBoxId)
    CommonMethods.showconsole(this.Tag, "Value of Checked :- " + state)
    if (state == true) {

      for (var i = 0; i < this.dataSource.length; i++) {
        if (this.dataSource[i].id == isCheckBoxId) {
          this.selectedListItem.push(this.dataSource[i])
        }
      }
    } else {
      for (var i = 0; i < this.selectedListItem.length; i++) {
        if (this.selectedListItem[i].id == isCheckBoxId) {
          this.selectedListItem.splice(i, 1)
        }
      }
    }


    CommonMethods.showconsole(this.Tag, "Array  length:- " + this.selectedListItem.length)
    CommonMethods.showconsole(this.Tag, ":- " + JSON.stringify(this.selectedListItem))
  }

  /**
   * 
   * check validation  checkBox before add  product 
   * 
   */

  validation() {
    if (this.selectedListItem.length == 0) {
      CommonMethods.showErrorDialog(this.snackBar, "Select aleast one product")
      return false
    }
    else {
      return true
    }
  }



  /**
   * 
   *Add Product  From Woo Commerce  web Api Call 
   * 
   */

  addTowebsite() {
    if (this.validation()) {
      CommonWebApiService.addWooCommerceProduct(this.spinner, this.httpClient, this.cookiesService, this.snackBar, this, this.selectedListItem)

    }
  }



  /**
   * 
   * Handle Response Of  AddProductfrom woo Commerce 
   * 
   */
  onResponseAddProductFromWebInterface(status: string, message: string) {

    switch (status) {
      case "1":

        // this.pagenumber++;
        // this.dataSource = [];
        this.selectedListItem = [];
        CommonMethods.showSuccessDialog(this.snackBar, message)
        this.allselected = false
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

  /**
   * 
   *   Next Method Pagination
   */

  next() {
    this.pagenumber++
    this.showPreviousButton = true
    this.syncProductsFromWooCommerce()
  }

  /**
 * 
 *   Prevoius Method Pagination
 */


  previous() {
    this.pagenumber--
    if (this.pagenumber == 1) {
      this.showPreviousButton = false
    }
    this.syncProductsFromWooCommerce()
  }


  /**
   * 
   *  Ng Style Condition Of Previous
   */

  visibilityConditionPrevious() {
    if (this.showPreviousButton == true) {
      return "unset";
    } else {
      return "hidden";
    }


  }

  /**
 * 
 *  Ng Style Condition Of Next
 */
  visibilityConditionNext() {
    if (this.showNextButton == true) {
      return "unset";
    } else {
      return "hidden";
    }


  }


}
