import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MyCookies } from 'src/app/utilpackages/my-cookies';
import { CommonMethods } from 'src/app/utilpackages/common-methods';
import { MyRoutingMethods } from 'src/app/utilpackages/my-routing-methods';
import { CommonWebApiService } from 'src/app/CommonMethods/CommonApis';
import { AllStoreList, StoreStatus } from 'src/app/CommonMethods/CommonInterface';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DailogboxComponent } from '../dailogbox/dailogbox.component';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeStoreStatus } from 'src/app/modelspackages/change-store-status';
import { Location } from '@angular/common';

@Component({
  selector: 'app-allstores',
  templateUrl: './allstores.component.html',
  styleUrls: ['./allstores.component.css']
})
export class AllstoresComponent implements OnInit, AllStoreList, StoreStatus {
  @ViewChild('store', { static: false }) activebutton;
  Tag = "AllstoresComponent"
  modalReference: NgbModalRef;
  changeStoreStatus: ChangeStoreStatus
  storeList: Array<any>
  mystoreList: Array<any>
  isloading = false
  buttonclick = false
  currentStatusIcon: string
  buttonstoreclick = false
  dailogMessage: String;
  successmessage: string
  activeListtype: string
  accountType:string
  urlaccountType: string
  @ViewChild('childModal1', { static: false }) content: NgbModal;
  constructor(public router: Router, public httpclient: HttpClient, public cookiesservice: CookieService,
    public spinner: NgxSpinnerService, public dialog: MatDialog, public modalService: NgbModal,
    public ngZone: NgZone, public snackBar: MatSnackBar, public activatedRouter: ActivatedRoute, private location: Location) {
    this.isloading = false
    this.buttonclick = true
    this.buttonstoreclick = false
    this.currentStatusIcon = ""
    this.dailogMessage = ""
    this.successmessage = ""
    this.activeListtype = "store"
    this.storeList = []
    this.mystoreList = []
    this.changeStoreStatus = new ChangeStoreStatus("", "store", "")
    this.urlaccountType = ""
    this.accountType=""
    this.checkLogin()
  }
  ngAfterViewInit() {
    // this.grid.nativeElement.then(grid => {
    //   this.vaadinGrid = grid;
    // });
    setTimeout(() => {
      // this.activebutton.classList.add("active")
      // console.log(this.abc.nativeElement.innerText);
    }, 2000);

  }
  ngOnInit() {
    // document.getElementById("store").classList.add("active")
  }
  checkLogin() {
    CommonMethods.showconsole(this.Tag, "Check Login Status into all store")

    var loginstatus = MyCookies.checkLoginStatus(this.cookiesservice)

    if (loginstatus) {
       this.accountType = MyCookies.getAccountType(this.cookiesservice)

      this.activatedRouter.params.subscribe(params => {
        CommonMethods.showconsole(this.Tag, "Show account Type :- " + params['accountype'])
        this.urlaccountType = params['accountype']
      })
      if (this.accountType == this.urlaccountType) {
        CommonWebApiService.getAllStoreList(this.spinner, this.httpclient, this.cookiesservice, this,this.snackBar)
      } else {
        CommonMethods.showconsole(this.Tag, "Else is working")
        this.location.back()
      }
    }
    else {
      MyRoutingMethods.gotoLogin(this.router)
    }
  }

  onResponseAllStoreList(status: string, allStoreList: Array<any>) {
    switch (status) {
      case "1":
        this.spinner.hide()
        this.isloading = true

        this.mystoreList = allStoreList;
        for (var i = 0; i < allStoreList.length; i++) {
          if (allStoreList[i]['type'] == "store") {
            CommonMethods.showconsole(this.Tag, "Type:- " + allStoreList[i]['type'])
            this.storeList.push(
              {
                "storeId": allStoreList[i]['storeId'],
                "storeAccountId": allStoreList[i]['storeAccountId'],
                "storeName": allStoreList[i]['storeName'],
                "imageUrl": allStoreList[i]['imageUrl'],
                "type": allStoreList[i]['type'],
                "storeStatus": allStoreList[i]['storeStatus']
              }
            )
          }
        }
        //  if(this.buttonclick==true){
        //   document.getElementById("store").classList.add("active")
        //  }
        CommonMethods.showconsole(this.Tag, "Array:- " + JSON.stringify(allStoreList))

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


  openDialog(): void {
    const dialogRef = this.dialog.open(DailogboxComponent, {
      data: { message: "Session Time Out" }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // this.animal = result;
    });
  }
  selectedStroe() {
    if (this.buttonclick == false) {
      this.activeListtype = "Store"
      this.storeList = []
      // this.mystoreList
      for (var i = 0; i < this.mystoreList.length; i++) {
        if (this.mystoreList[i]['type'] == "store") {
          CommonMethods.showconsole(this.Tag, "Type:- " + this.mystoreList[i]['type'])
          this.storeList.push(
            {
              "storeId": this.mystoreList[i]['storeId'],
              "storeAccountId": this.mystoreList[i]['storeAccountId'],
              "storeName": this.mystoreList[i]['storeName'],
              "imageUrl": this.mystoreList[i]['imageUrl'],
              "type": this.mystoreList[i]['type'],
              "storeStatus": this.mystoreList[i]['storeStatus']
            }
          )
        }
      }
      document.getElementById("brand").classList.remove("active")
      document.getElementById("store").classList.add("active")
      // this.buttonName="Add Store"
      this.buttonclick = true
      this.buttonstoreclick = false
      // this.storemodal.type="store"
    }

  }
  selectedBrand() {


    if (this.buttonstoreclick == false) {
      this.activeListtype = "Brand"
      this.storeList = []
      //  this.mystoreList
      for (var i = 0; i < this.mystoreList.length; i++) {
        if (this.mystoreList[i]['type'] == "brand") {
          CommonMethods.showconsole(this.Tag, "Type:- " + this.mystoreList[i]['type'])
          this.storeList.push(
            {
              "storeId": this.mystoreList[i]['storeId'],
              "storeAccountId": this.mystoreList[i]['storeAccountId'],
              "storeName": this.mystoreList[i]['storeName'],
              "imageUrl": this.mystoreList[i]['imageUrl'],
              "type": this.mystoreList[i]['type'],
              "storeStatus": this.mystoreList[i]['storeStatus']
            }
          )
        }
      }
      document.getElementById("store").classList.remove("active")
      document.getElementById("brand").classList.add("active")
      // this.buttonName="Add Brand"
      this.buttonstoreclick = true
      this.buttonclick = false
      // this.storemodal.type="brand"
    }



  }




  openModal(content) {
    this.modalReference = this.modalService.open(content, { centered: true });
    //  this. modalReference.componentInstance.actionMessage = this.actionmessage;
  }
  JoinAndClose() {
    this.modalReference.close();
  }



  changeStoreStatusFunction(Userstatus: string, userAccountId: string, content) {
    CommonMethods.showconsole(this.Tag, "USer status:- " + Userstatus)
    CommonMethods.showconsole(this.Tag, "USer accounid :- " + userAccountId)
    this.ngZone.run(() => {
      this.changeStoreStatus.accountPublicId = userAccountId
      CommonMethods.showconsole(this.Tag, "before api Status:- " + Userstatus)
      if (Userstatus == 'inactive') {
        this.changeStoreStatus.changeStatus = 'active'
        CommonMethods.showconsole(this.Tag, "Active List type :- " + this.activeListtype)
        if (this.activeListtype == "Brand") {
          this.dailogMessage = "Do you want to active this brand ?"
        }
        else {
          this.dailogMessage = "Do you want to active this store ?"
        }

      } else {
        this.changeStoreStatus.changeStatus = 'inactive'
        CommonMethods.showconsole(this.Tag, "Active List type :- " + this.activeListtype)
        if (this.activeListtype == "Brand") {
          this.dailogMessage = "Do you want to deactive this brand ?"
        } else {
          this.dailogMessage = "Do you want to deactive this store ?"
        }

      }
      this.openModal(content)
    })
  }

  changeStarusApiCall() {
    CommonWebApiService.changeStoreStatus(this.spinner, this.httpclient, this.cookiesservice, this.changeStoreStatus, this,this.snackBar)
  }

  onResponseStoreStatus(status: string, message: string) {
    switch (status) {
      case "1":

        this.modalReference.close();
        if (this.activeListtype == "Brand") {
          this.successmessage = "Brand status changed"
        } else {
          this.successmessage = "Store status changed"

        }
        CommonMethods.showSuccessDialog(this.snackBar, this.successmessage)

        CommonMethods.showconsole(this.Tag, "Account id:- " + this.changeStoreStatus.accountPublicId)
        for (var i = 0; i < this.storeList.length; i++) {
          CommonMethods.showconsole(this.Tag, "Accountid:- " + this.storeList[i].storeAccountId)
          if (this.storeList[i].storeAccountId == this.changeStoreStatus.accountPublicId) {
            CommonMethods.showconsole(this.Tag, "Updated Status:- " + this.storeList[i]['storeStatus'])
            this.storeList[i]['storeStatus'] = this.changeStoreStatus.changeStatus
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
    //  CommonMethods.showconsole(this.Tag,"status :- "+status)
    switch (status) {
      case 'inactive':
        this.currentStatusIcon = "visibility_off"
        return 'red';
      case 'active':
        this.currentStatusIcon = "visibility"
        return 'green';
    }
  }




}
