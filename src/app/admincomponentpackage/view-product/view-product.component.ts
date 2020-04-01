import { Component, OnInit } from '@angular/core';
import { ViewProduct } from 'src/app/CommonMethods/CommonInterface';
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

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit,ViewProduct {
  Tag="ViewProductComponent"
  productLists:Array<any>
  isLoading=false
  count:number
  pageLimit:number
  shownextButton=false;
  showpreviousButton=false
  storeAccountId:string
  constructor(public spinner:NgxSpinnerService,public httpclient:HttpClient,public cookiesservice:CookieService,
  public matdialog:MatDialog,public router:Router,public activatedRouter:ActivatedRoute,public snackBar:MatSnackBar ) {
    this.productLists=[]
    this.count=0
    this.isLoading=false;
    this.shownextButton=false
    this.showpreviousButton=false
    this.checkLoginStatus()
   }

   checkLoginStatus()
   {
     
      if(MyCookies.checkLoginStatus(this.cookiesservice))
      {
        let accountType=MyCookies.getAccountType(this.cookiesservice)
        if(accountType == "super_admin"){
           this.activatedRouter.params.subscribe(params =>{
             this.storeAccountId=params['store_Account_id']
           })
        }else{
             this.storeAccountId=MyCookies.getStoreAccountId(this.cookiesservice)
        }
          // CommonWebApiService.viewProducts(this.spinner,this.httpclient,this.cookiesservice,this,this.count,this.storeAccountId)
      }
      else{
          MyRoutingMethods.gotoLogin(this.router)
      }
   }

  
  
   onResponseViewProduct(status:string,allProductsList:Array<any>,pagenumberLimit:number)
   {
      switch(status)
      {
          case"1":
                this.spinner.hide(); 
                this.isLoading=true;
                this.productLists=allProductsList;  
                //  CommonMethods.showconsole(this.Tag,"Array:- "+JSON.stringify(this.productLists))
                

               this.pageLimit =pagenumberLimit;
                if(this.count !== 0)
               {
                  this.showpreviousButton=true
               }
               else{
                    this.showpreviousButton=false
               }
               if(this.productLists.length < this.pageLimit)
               {
                   this.shownextButton=false
               }
               else{
                  this.shownextButton=true;
               }
          break;
          case "10":
          CommonMethods.showErrorDialog(this.snackBar,"Session Time Out")
          MyCookies.deletecookies(this.cookiesservice)
          MyRoutingMethods.gotoLogin(this.router)
          break;
          default:
          alert('Error Occured, Please try again');
          break;
      }
   }
   openDialog():void{
      const dialogref = this.matdialog.open(DailogboxComponent,{
        data:{message:"Session time Out"}
      });
      dialogref.afterClosed().subscribe(result =>{

      })
   }


   next() {
    this.count = this.count + this.pageLimit
    CommonWebApiService.viewProducts(this.spinner,this.httpclient,this.cookiesservice,this,this.count,this.storeAccountId,this.snackBar)
  }
  previous(){
       this.count= this.count - this.pageLimit
    CommonWebApiService.viewProducts(this.spinner,this.httpclient,this.cookiesservice,this,this.count,this.storeAccountId,this.snackBar)

      }

  
  ngOnInit() {
  }




}
