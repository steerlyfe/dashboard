import { Component, OnInit, NgZone } from '@angular/core';
import { ViewProduct, ProductStatus, AddStockInterface } from 'src/app/CommonMethods/CommonInterface';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonMethods } from 'src/app/utilpackages/common-methods';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DailogboxComponent } from 'src/app/componentpackage/dailogbox/dailogbox.component';
import { MyCookies } from 'src/app/utilpackages/my-cookies';
import { MyRoutingMethods } from 'src/app/utilpackages/my-routing-methods';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonWebApiService } from 'src/app/CommonMethods/CommonApis';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeProductStatus } from 'src/app/modelspackages/change-product-status';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit, ViewProduct, ProductStatus,AddStockInterface {
  Tag = "ViewProductComponent"
  modalReference: NgbModalRef
  changeProductStatus: ChangeProductStatus
  productLists: Array<any>
  isLoading = false
  count: number
  pageLimit: number
  shownextButton = false;
  showpreviousButton = false
  currentStatusIcon: string
  dailogMessage: string
  accountType: string
  storeAccountId: string
  additionStockList: Array<any>
  urlaccountType=""
  constructor(public spinner: NgxSpinnerService, public httpclient: HttpClient, public cookiesservice: CookieService,
    public matdialog: MatDialog, public router: Router, public modalService: NgbModal, public ngZone: NgZone, public activedRouter: ActivatedRoute,
    public snackBar: MatSnackBar,public activatedRouter:ActivatedRoute,private location:Location) {
    this.productLists = []
    this.additionStockList = []
    this.count = 0
    this.isLoading = false;
    this.shownextButton = false
    this.showpreviousButton = false
    this.currentStatusIcon = ""
    this.dailogMessage = ""
    this.accountType = ""
    this.storeAccountId = ""
    this.changeProductStatus = new ChangeProductStatus("", "")
    this.checkLoginStatus()
  }

  checkLoginStatus() {

    if (MyCookies.checkLoginStatus(this.cookiesservice)) {
      this.accountType = MyCookies.getAccountType(this.cookiesservice)

      this.activatedRouter.params.subscribe( params =>{
        CommonMethods.showconsole(this.Tag,"Show account Type :- "+params['accountype'])
        this.urlaccountType=params['accountype']
       })
   if(this.accountType == this.urlaccountType )
   {
    if (this.accountType == "super_admin") {
      this.activedRouter.params.subscribe(params => {
        this.storeAccountId = params['store_Account_id']
      })
      if (this.storeAccountId == undefined) {
        MyRoutingMethods.gotoLogin(this.router)
      }
      else {
        CommonWebApiService.viewProducts(this.spinner, this.httpclient, this.cookiesservice, this, this.count, this.storeAccountId,this.snackBar)

      }
    } else {
      this.storeAccountId = MyCookies.getStoreAccountId(this.cookiesservice)
      CommonWebApiService.viewProducts(this.spinner, this.httpclient, this.cookiesservice, this, this.count, this.storeAccountId,this.snackBar)
    }
   }else{
      CommonMethods.showconsole(this.Tag,"Else is working")
      this.location.back()
   }
      
      // CommonMethods.showconsole(this.Tag, "store id :- " + this.storeAccountId)
    }
    else {
      MyRoutingMethods.gotoLogin(this.router)
    }
  }



  onResponseViewProduct(status: string, allProductsList: Array<any>, pagenumberLimit: number) {
    switch (status) {
      case "1":
        this.spinner.hide();
        this.isLoading = true;
        this.productLists = allProductsList;
        //  CommonMethods.showconsole(this.Tag, "Array:- "+JSON.stringify(this.productLists))


        this.pageLimit = pagenumberLimit;
        if (this.count !== 0) {
          this.showpreviousButton = true
        }
        else {
          this.showpreviousButton = false
        }
        if (this.productLists.length < this.pageLimit) {
          this.shownextButton = false
        }
        else {
          this.shownextButton = true;
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
  openDialog(): void {
    const dialogref = this.matdialog.open(DailogboxComponent, {
      data: { message: "Session time Out" }
    });
    dialogref.afterClosed().subscribe(result => {

    })
  }


  next() {
    this.count = this.count + this.pageLimit
    CommonWebApiService.viewProducts(this.spinner, this.httpclient, this.cookiesservice, this, this.count, this.storeAccountId,this.snackBar)
  }
  previous() {
    this.count = this.count - this.pageLimit
    CommonWebApiService.viewProducts(this.spinner, this.httpclient, this.cookiesservice, this, this.count, this.storeAccountId,this.snackBar)

  }


  openModal(content) {
    this.modalReference = this.modalService.open(content, { centered: true });
    //  this. modalReference.componentInstance.actionMessage = this.actionmessage;
  }
  JoinAndClose() {
    this.modalReference.close();
  }
  ngOnInit() {
  }


  accountStatus(Userstatus: string, userProductId: string, content) {
    this.ngZone.run(() => {
      this.changeProductStatus.productPublicId =""
      this.changeProductStatus.productPublicId = userProductId
      CommonMethods.showconsole(this.Tag, "before api Status:- " + Userstatus)
      if (Userstatus == 'inactive') {
        this.changeProductStatus.changeStatus = 'active'
        this.dailogMessage = "Do you want to activated this  product ?"
      } else {
        this.changeProductStatus.changeStatus = 'inactive'
        this.dailogMessage = "Do you want to deactivated this product ?"
      }
      this.openModal(content)
    })
  }

  changeStarusApiCall() {
    CommonWebApiService.changeProductStatus(this.spinner, this.httpclient, this.cookiesservice, this.changeProductStatus, this)
  }
  onResponseProductStatus(status: string, message: string) {
    switch (status) {
      case "1":

        this.modalReference.close();

        CommonMethods.showconsole(this.Tag, "Account id:- " + this.changeProductStatus.productPublicId)
        for (var i = 0; i < this.productLists.length; i++) {
          CommonMethods.showconsole(this.Tag, "Accountid:- " + this.productLists[i].productPublicId)
          if (this.productLists[i].productPublicId == this.changeProductStatus.productPublicId) {
            CommonMethods.showconsole(this.Tag, "Updated Status:- " + this.productLists[i]['currentStatus'])
            this.productLists[i]['currentStatus'] = this.changeProductStatus.changeStatus
            break;
          }

        }
        break;
      case "10":
        CommonMethods.showErrorDialog(this.snackBar, "Session Time Out")
        MyCookies.deletecookies(this.cookiesservice)
        MyRoutingMethods.gotoLogin(this.router)
        break;
      default:
        alert("Error Occured, Please try again");
        break;

    }
  }




  getColor(status) {

    switch (status) {
      case 'inactive':
        this.currentStatusIcon = "visibility_off"
        return 'red';
      case 'active':
        this.currentStatusIcon = "visibility"
        return 'green';
    }
  }




  AddStockDailog(productAccountId: string, addstock) {
    this.additionStockList = []
    CommonMethods.showconsole(this.Tag, "Show Product Id :- " + productAccountId)
    this.changeProductStatus.productPublicId=""
    this.changeProductStatus.productPublicId=productAccountId
    for (var i = 0; i < this.productLists.length; i++) {
      if (this.productLists[i]['productPublicId'] == productAccountId) {
        // this.additionFeatureList=""additional_features
        CommonMethods.showconsole(this.Tag, "Show Array :- " + JSON.stringify(this.productLists[i]['additional_features']))
        for (var j = 0; j < this.productLists[i]['additional_features'].length; j++) {
          this.additionStockList.push({
            "unitType": this.productLists[i]['additional_features'][j]['unitType'],
            "value": this.productLists[i]['additional_features'][j]['value'],
            "stock": ""
          })
        }
        break
      }
    }
    this.stockDailog(addstock)
    CommonMethods.showconsole(this.Tag, "Ad stock Array :- " + JSON.stringify(this.additionStockList))
  }

  validation() {
    if (this.checkAddStock() == false) {
      CommonMethods.showErrorDialog(this.snackBar, "Enter Stock atleast one")
      return false
    } else {
      return true
    }
  }
  checkAddStock(): boolean {
    let isValid = false
    for (var i = 0; i < this.additionStockList.length; i++) {
      if (this.additionStockList[i]['stock'].trim().length > 0) {
        isValid = true
        return isValid
      }
    }

    return isValid
  }


  AddStockApiCall() {
    CommonMethods.showconsole(this.Tag, "Validation:- " + this.validation())
    // CommonMethods.showErrorDialog(this.snackBar,"Hello")
   

    if(this.validation())
    {
      for (var i = 0; i < this.additionStockList.length; i++) {
        if (this.additionStockList[i]['stock'] == "") {
             this.additionStockList[i]['stock']=0
        }
      }
      CommonMethods.showconsole(this.Tag, "Ad stock Array :- " + JSON.stringify(this.additionStockList))
      CommonMethods.showconsole(this.Tag,"product Bulic Id :- "+this.changeProductStatus.productPublicId)
     CommonWebApiService.addStockApi(this.spinner,this.httpclient,this.cookiesservice,this.changeProductStatus.productPublicId,this.additionStockList,this,this.snackBar)
    }
  }

 onResponseGetAddStockInterface(status:string,message:string){
    switch(status)
    {
        case"1":
        this.modalReference.close()
         CommonMethods.showSuccessDialog(this.snackBar,message)
        break;
        case"10":
        CommonMethods.showErrorDialog(this.snackBar, "Session Time Out")
        MyCookies.deletecookies(this.cookiesservice)
        MyRoutingMethods.gotoLogin(this.router)
        break;
        default:
        alert("Error Occured, Please try again")
        break;
    }
 }

  stockDailog(addstock) {
    // this.modalReference = this.modalService.open(addstock,{ centered: true ,size: 'lg'});
    this.modalReference = this.modalService.open(addstock, { centered: true, scrollable: true });
  }
  // JoinAndClose() {
  //   this.modalReference.close();
  // }
  keyPress(event: any) {
    const patt = /^[0-9]{1,4}(\.[0-9][0-9])?$/
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !patt.test(inputChar)) {
      event.preventDefault();
    }
  }
}
