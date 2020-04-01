import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { CommonMethods } from 'src/app/utilpackages/common-methods';
import { MyCookies } from 'src/app/utilpackages/my-cookies';
import { MyRoutingMethods } from 'src/app/utilpackages/my-routing-methods';
import { AddAccountModal } from 'src/app/modelspackages/add-accounts';
import { CommonWebApiService } from 'src/app/CommonMethods/CommonApis';
import { AddAccount } from 'src/app/CommonMethods/CommonInterface';
import { MatSnackBar, MatDialog } from '@angular/material';
import { DailogboxComponent } from '../dailogbox/dailogbox.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-accounts',
  templateUrl: './add-accounts.component.html',
  styleUrls: ['./add-accounts.component.css']
})
export class AddAccountsComponent implements OnInit, AddAccount {
  Tag = "AddAccountsComponent"

  accountTypelist: Array<any>
  addaccountmodel: AddAccountModal
  accountType = ""
  urlaccountType = ""
  constructor(public router: Router, public activatedRouter: ActivatedRoute, public spinner: NgxSpinnerService,
    public httpClient: HttpClient, public cookiesservice: CookieService,
    private snackBar: MatSnackBar, public dialog: MatDialog, private location: Location) {
    this.addaccountmodel = new AddAccountModal("", "", "", "", "", "", "")
    this.accountTypelist = []
    this.accountType = MyCookies.getAccountType(this.cookiesservice)

    this.checkLoginStatus()

  }


  checkLoginStatus() {

    var loginstatus = MyCookies.checkLoginStatus(this.cookiesservice)

    if (loginstatus) {

      this.activatedRouter.params.subscribe(params => {
        CommonMethods.showconsole(this.Tag, "Show account Type :- " + params['accountype'])
        this.urlaccountType = params['accountype']
      })
      if (this.accountType == this.urlaccountType) {

        CommonMethods.showconsole(this.Tag, "Login Status is working")
      if (this.accountType == "admin") {
        this.activatedRouter.params.subscribe(params => {
          this.addaccountmodel.sub_store_account_id = params['sub_storeId'];
          CommonMethods.showconsole(this.Tag, "Sub substore id:- " + this.addaccountmodel.sub_store_account_id)
        })
        if (this.addaccountmodel.sub_store_account_id != undefined) {
          this.addaccountmodel.storeAccountId = MyCookies.getStoreAccountId(this.cookiesservice)
          CommonMethods.showconsole(this.Tag, "if  is working")
          this.addaccountmodel.accountType = "sub_admin"
          // this.accountTypelist.push(
          //   { value: 'sub_admin', viewValue: 'sub_admin' },
          //   { value: 'sub_manager', viewValue: 'sub_manager' },
          //   { value: 'sub_employee', viewValue: 'sub_employee' });
        } else {
          CommonMethods.showconsole(this.Tag, "Else is working")
          this.addaccountmodel.storeAccountId = MyCookies.getStoreAccountId(this.cookiesservice)
          this.addaccountmodel.sub_store_account_id = ""
          this.accountTypelist.push(
            { value: 'admin', viewValue: 'Admin' },
            { value: 'manager', viewValue: 'Manager' },
            { value: 'employee', viewValue: 'Employee' }
          );
        }
      } else if (this.accountType == "manager") {
        this.addaccountmodel.storeAccountId = MyCookies.getStoreAccountId(this.cookiesservice)
        this.addaccountmodel.accountType = "employee"
      } else if (this.accountType == "sub_admin") {
        this.addaccountmodel.sub_store_account_id = MyCookies.getSubStoreAccountId(this.cookiesservice)
        this.addaccountmodel.storeAccountId = MyCookies.getStoreAccountId(this.cookiesservice)
        this.accountTypelist.push(
          { value: 'sub_admin', viewValue: 'Sub Admin' },
          { value: 'sub_manager', viewValue: 'Sub Manager' },
          { value: 'sub_employee', viewValue: 'Sub Employee' });
      } else if (this.accountType == "sub_manager") {
        this.addaccountmodel.sub_store_account_id = MyCookies.getSubStoreAccountId(this.cookiesservice)
        this.addaccountmodel.storeAccountId = MyCookies.getStoreAccountId(this.cookiesservice)
        this.addaccountmodel.accountType = "sub_employee"
      } else {
        this.activatedRouter.params.subscribe(params => {
          this.addaccountmodel.storeAccountId = params['storeid'];
        })
        if (this.addaccountmodel.storeAccountId == undefined) {
          CommonMethods.showconsole(this.Tag, "If is working")
          this.activatedRouter.params.subscribe(params => {
            this.addaccountmodel.sub_store_account_id = params['sub_storeId'];
            this.addaccountmodel.storeAccountId = this.cookiesservice.get('store_account_id')

            CommonMethods.showconsole(this.Tag, "Store id:- " + this.addaccountmodel.storeAccountId)
            CommonMethods.showconsole(this.Tag, "Store sub id:- " + this.addaccountmodel.sub_store_account_id)
          })
          this.accountTypelist.push(
            { value: 'sub_admin', viewValue: 'Sub Admin' },
            { value: 'sub_manager', viewValue: 'Sub Manager' },
            { value: 'sub_employee', viewValue: 'Sub Employee' });


        } else {
          CommonMethods.showconsole(this.Tag, "else is working")
          this.accountTypelist.push(
            { value: 'admin', viewValue: 'Admin' },
            { value: 'manager', viewValue: 'Manager' },
            { value: 'employee', viewValue: 'Employee' }
          );


        }
        // this.addaccountmodel.storeAccountId = this.cookiesservice.get('storeId')
        // this.addaccountmodel.accountType = "employee"
      }

      } else {
        CommonMethods.showconsole(this.Tag, "Else is working")
        this.location.back()
      }

      
    }
    else {
      MyRoutingMethods.gotoLogin(this.router)
    }
  }


  showErrorDialog(message: string) {
    this.snackBar.open(message, "", {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: ['blue-snackbar']
    });
  }
  showSuccessDialog(message: string) {
    this.snackBar.open(message, "", {
      duration: 2000,
      panelClass: ['sucess-snackbar'],
      verticalPosition: 'top'
    });
  }

  validation() {


    var EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.addaccountmodel.accountName.trim().length === 0) {
      this.showErrorDialog("Enter Name")
      return false
    }
    else if (this.addaccountmodel.email.trim().length === 0) {
      this.showErrorDialog("Enter Email")
      return false
    }
    else if (!EMAIL_REGEXP.test(this.addaccountmodel.email)) {
      this.showErrorDialog("Email is inValid")
      return false
    }

    else if (this.addaccountmodel.password.trim().length === 0) {
      this.showErrorDialog("Enter Password")
      return false
    }
    else if (this.addaccountmodel.conPassword.trim().length === 0) {
      this.showErrorDialog("Enter Confirm Password")

      return false;
    }
    else if (this.addaccountmodel.password.trim() !== this.addaccountmodel.conPassword.trim()) {
      this.showErrorDialog("Password is Not Match")
      return false;
    }
    else if (!this.checkSelectedSpinnerValidation()) {
      CommonMethods.showconsole(this.Tag, "this.checkSelectedSpinnerValidation(): " + this.checkSelectedSpinnerValidation())
      return false
    }

    else {

      return true
    }
  }

  checkSelectedSpinnerValidation(): boolean {
    let isvalid = true
    if (this.accountType == "admin" || this.accountType == "super_admin" || this.accountType == "sub_admin") {
      CommonMethods.showconsole(this.Tag, "Function IS working")
      let SubstoreAccountId = this.addaccountmodel.sub_store_account_id
      if (SubstoreAccountId == undefined || SubstoreAccountId == "") {
        if (this.addaccountmodel.accountType.length === 0) {
          this.showErrorDialog("Select Account Type")
          isvalid = false
          return isvalid
        }
        else {
          return isvalid
        }
      }
      else {
        CommonMethods.showconsole(this.Tag, "Else is working")
        if (this.accountType == "super_admin" || this.accountType == "sub_admin") {
          if (this.addaccountmodel.accountType.length === 0) {
            this.showErrorDialog("Select Account Type")
            isvalid = false
            return isvalid
          }
          else {
            return isvalid
          }
        }
        else {
          return isvalid
        }
      }
    }
    else {
      return isvalid
    }

  }


  ngOnInit() {

  }


  showPassword() {

    if ((document.getElementById('password') as HTMLInputElement).type == 'password') {
      (document.getElementById('password') as HTMLInputElement).type = 'text';
      (document.getElementById('myicon') as HTMLInputElement).className = "fa fa-eye";
    }
    else {
      (document.getElementById('password') as HTMLInputElement).type = "password";
      (document.getElementById('myicon') as HTMLInputElement).className = "fa fa-eye-slash";
    }
  }
  showConfirmPassword() {

    if ((document.getElementById('conpassword') as HTMLInputElement).type == 'password') {
      (document.getElementById('conpassword') as HTMLInputElement).type = 'text';
      (document.getElementById('myiconconfirm') as HTMLInputElement).className = "fa fa-eye";
    }
    else {
      (document.getElementById('conpassword') as HTMLInputElement).type = "password";
      (document.getElementById('myiconconfirm') as HTMLInputElement).className = "fa fa-eye-slash";
    }
  }


  addAccount() {
    if (this.validation()) {
      CommonMethods.showconsole(this.Tag, "Condition is Working")
      CommonWebApiService.addAccounts(this.spinner, this.httpClient, this.cookiesservice, this.addaccountmodel, this,this.snackBar)
    }
  }
  onResponseAddAccount(status: string, message: string) {
    switch (status) {
      case "1":
        this.showSuccessDialog("Add Account Successfully")
        if (this.accountType == 'admin') {
          if (this.addaccountmodel.sub_store_account_id != "") {
              CommonMethods.showconsole(this.Tag,"If is working")
              CommonMethods.showconsole(this.Tag,"stroe Id:- "+this.addaccountmodel.sub_store_account_id)
              CommonMethods.showconsole(this.Tag,"account type:L- "+this.accountType)

            MyRoutingMethods.gotoSubStoreViewAccounts(this.router, this.addaccountmodel.sub_store_account_id,this.accountType)
          }
          else {
             CommonMethods.showconsole(this.Tag,"Else is working  ")
            MyRoutingMethods.gotoAdminviewAccount(this.router,this.accountType)
          }

        } else if (this.accountType == 'manager') {
          MyRoutingMethods.gotoManagerviewAccount(this.router)
        } else if (this.accountType == 'sub_admin') {
          MyRoutingMethods.gotoSub_StoreAdminViewAccount(this.router)
        } else if (this.accountType == 'sub_manager') {
          MyRoutingMethods.gotoSub_StoreManagerViewAccount(this.router)
        } else {
          if (this.addaccountmodel.sub_store_account_id != "") {
            MyRoutingMethods.gotoSubStoreViewAccounts(this.router, this.addaccountmodel.sub_store_account_id,this.accountType)
          }
          else {
            MyRoutingMethods.gotoviewAccount(this.router, this.addaccountmodel.storeAccountId,this.accountType)
          }
        }

        break;
      case "10":
        CommonMethods.showErrorDialog(this.snackBar, "Session Time Out")
        MyCookies.deletecookies(this.cookiesservice)
        MyRoutingMethods.gotoLogin(this.router)
        break;
      case "11":
        this.showErrorDialog(message)
        break;
      case "0":
        this.showErrorDialog(message)
        break;
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





}
