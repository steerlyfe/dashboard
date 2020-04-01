import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonMethods } from 'src/app/utilpackages/common-methods';
import { NgxSpinnerService } from 'ngx-spinner';
import { MyCookies } from 'src/app/utilpackages/my-cookies';
import { CookieService } from 'ngx-cookie-service';
import { MyRoutingMethods } from 'src/app/utilpackages/my-routing-methods';
import { CommonWebApiService } from 'src/app/CommonMethods/CommonApis';
import { ViewAccount, ChangeStatus } from 'src/app/CommonMethods/CommonInterface';
import { DailogboxComponent } from '../dailogbox/dailogbox.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeAccountStatus } from 'src/app/modelspackages/change-account-status';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-accounts',
  templateUrl: './view-accounts.component.html',
  styleUrls: ['./view-accounts.component.css']
})
export class ViewAccountsComponent implements OnInit, ViewAccount, ChangeStatus {
  Tag = "ViewAccountsComponent"
  modalReference: NgbModalRef;
  storeAccountId = ""
  accountType = ""
  accountlist: Array<any>
  isloading = false
  dailogMessage: string
  changeStatusModal: ChangeAccountStatus
  isdivview = false
  previousButtonId: string
  currentStatusIcon: string
  loginAccountId: string
  urlaccountType = ""
  @ViewChild('childModal1', { static: false }) content: NgbModal;
  constructor(public spinner: NgxSpinnerService, public activatedRouter: ActivatedRoute, public httpClient: HttpClient,
    public cookiesservice: CookieService, public router: Router, public dialog: MatDialog,
    public ngZone: NgZone, public modalService: NgbModal, private snackBar: MatSnackBar, public location: Location) {
    this.isloading = false
    this.changeStatusModal = new ChangeAccountStatus("", "admin", "")
    this.accountlist = []
    this.accountType = ""
    this.dailogMessage = ""
    this.isdivview = false
    this.previousButtonId = ""
    this.currentStatusIcon = ""
    this.loginAccountId = MyCookies.getAccountId(this.cookiesservice)
    this.checkloginstatus()
  }



  checkloginstatus() {



    var loginstatus = MyCookies.checkLoginStatus(this.cookiesservice)

    if (loginstatus) {
      this.accountType = MyCookies.getAccountType(this.cookiesservice)
      let newaccountype = this.accountType.replace("_", " ")
      CommonMethods.showconsole(this.Tag, "Show After Slipt User type:- " + newaccountype)

      this.activatedRouter.params.subscribe(params => {
        CommonMethods.showconsole(this.Tag, "Show account Type :- " + params['accountype'])
        this.urlaccountType = params['accountype']
      })
      if (this.accountType == this.urlaccountType) {

        if (this.accountType == 'admin') {
          this.activatedRouter.params.subscribe(params => {
            this.storeAccountId = params['sub_storeId']
          })
          if (this.storeAccountId != undefined) {
            this.changeStatusModal.type = "sub_admin"
            this.previousButtonId = "sub_admin"
            this.isdivview = true
          }
          else {
            this.changeStatusModal.type = "admin"
            this.storeAccountId = MyCookies.getStoreAccountId(this.cookiesservice)
            this.previousButtonId = "admin"
            this.isdivview = false
          }

        } else if (this.accountType == 'manager') {
          this.changeStatusModal.type = "employee"
          this.storeAccountId = MyCookies.getStoreAccountId(this.cookiesservice)

        } else if (this.accountType == 'sub_admin') {
          this.storeAccountId = MyCookies.getSubStoreAccountId(this.cookiesservice)
          this.changeStatusModal.type = "sub_admin"
          this.previousButtonId = "sub_admin"

        } else if (this.accountType == 'sub_manager') {
          this.storeAccountId = MyCookies.getSubStoreAccountId(this.cookiesservice)
          this.changeStatusModal.type = "sub_employee"
          // this.previousButtonId="sub_admin"

        } else {
          this.activatedRouter.params.subscribe(params => {
            this.storeAccountId = params['storeid']

          })
          if (this.storeAccountId == undefined) {
            CommonMethods.showconsole(this.Tag, "If is working")
            this.activatedRouter.params.subscribe(params => {
              this.storeAccountId = params['sub_storeId']
            })
            //  CommonMethods.showconsole(this.Tag, "Store id :- " + this.storeAccountId)
            this.changeStatusModal.type = "sub_admin"
            this.previousButtonId = "sub_admin"
            this.isdivview = true
          }
          else {
            CommonMethods.showconsole(this.Tag, "else  is working")
            CommonMethods.showconsole(this.Tag, "Store id :- " + this.storeAccountId)
            this.previousButtonId = "admin"
            this.changeStatusModal.type = "admin"
            this.isdivview = false
          }
        }

        CommonWebApiService.viewaccounts(this.spinner, this.httpClient, this.cookiesservice, this.storeAccountId, this.changeStatusModal.type, this,this.snackBar)
      } else {
        CommonMethods.showconsole(this.Tag, "Else is working")
        this.location.back()
      }



    } else {
      MyRoutingMethods.gotoLogin(this.router)
    }
  }

  showSuccessDialog(message: string) {
    this.snackBar.open(message, "", {
      duration: 2000,
      panelClass: ['sucess-snackbar'],
      verticalPosition: 'top'
    });
  }
  selectedUsersList(listType: string) {
    CommonMethods.showconsole(this.Tag, "Listype:- " + listType)
    document.getElementById(this.previousButtonId).classList.remove("active")
    document.getElementById(listType).classList.add("active")
    if (listType == "manager") {
      this.previousButtonId = listType
      this.changeStatusModal.type = "manager"

      // document.getElementById("brand").classList.remove("active")
      //     document.getElementById("store").classList.add("active")
    } else if (listType == "employee") {
      this.previousButtonId = listType
      this.changeStatusModal.type = "employee"
    } else if (listType == "sub_admin") {

      this.previousButtonId = listType
      this.changeStatusModal.type = "sub_admin"
    } else if (listType == "sub_manager") {

      this.previousButtonId = listType
      this.changeStatusModal.type = "sub_manager"
    } else if (listType == "sub_employee") {
      this.previousButtonId = listType
      this.changeStatusModal.type = "sub_employee"
    } else {
      this.previousButtonId = listType
      this.changeStatusModal.type = "admin"

    }

    CommonWebApiService.viewaccounts(this.spinner, this.httpClient, this.cookiesservice, this.storeAccountId, this.changeStatusModal.type, this,this.snackBar)

  }


  onResponseViewAccount(status: string, accountList: Array<any>) {
    switch (status) {
      case "1":
        this.isloading = true
        this.spinner.hide()
        this.accountlist = accountList

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

  openModal(content) {
    this.modalReference = this.modalService.open(content, { centered: true });
    //  this. modalReference.componentInstance.actionMessage = this.actionmessage;
  }
  JoinAndClose() {
    this.modalReference.close();
  }
  ngOnInit() {
  }


  accountStatus(Userstatus: string, userAccountId: string, content) {
    this.ngZone.run(() => {
      this.changeStatusModal.accountPublicId = userAccountId
      CommonMethods.showconsole(this.Tag, "before api Status:- " + Userstatus)
      if (Userstatus == 'inactive') {
        this.changeStatusModal.changeStatus = 'active'
        this.dailogMessage = "Do you want to activated this  account ?"
      } else {
        this.changeStatusModal.changeStatus = 'inactive'
        this.dailogMessage = "Do you want to deactivated this account ?"
      }
      this.openModal(content)
    })
  }

  changeStarusApiCall() {
    CommonWebApiService.changeAccountStatus(this.spinner, this.httpClient, this.cookiesservice, this.changeStatusModal, this,this.snackBar)
  }
  onResponseChangeAccountStatus(status: string, message: string) {
    switch (status) {
      case "1":

        this.modalReference.close();
        this.showSuccessDialog(message)
        CommonMethods.showconsole(this.Tag, "Account id:- " + this.changeStatusModal.accountPublicId)
        for (var i = 0; i < this.accountlist.length; i++) {
          CommonMethods.showconsole(this.Tag, "Accountid:- " + this.accountlist[i].accountPublicId)
          if (this.accountlist[i].accountPublicId == this.changeStatusModal.accountPublicId) {
            CommonMethods.showconsole(this.Tag, "Updated Status:- " + this.accountlist[i]['currentStatus'])
            this.accountlist[i]['currentStatus'] = this.changeStatusModal.changeStatus
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


  openDialog(): void {
    const dialogRef = this.dialog.open(DailogboxComponent, {
      data: { message: "Session Time Out" }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  getNewAccounTypeValue(accountType:string){
        var newaccountype = accountType.replace("_"," ")
        return newaccountype
  }



}
