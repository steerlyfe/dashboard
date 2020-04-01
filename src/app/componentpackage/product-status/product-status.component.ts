import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MyCookies } from 'src/app/utilpackages/my-cookies';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { MyRoutingMethods } from 'src/app/utilpackages/my-routing-methods';
import { CommonMethods } from 'src/app/utilpackages/common-methods';

@Component({
  selector: 'app-product-status',
  templateUrl: './product-status.component.html',
  styleUrls: ['./product-status.component.css']
})
export class ProductStatusComponent implements OnInit {

  Tag = "ProductStatusComponent"
  accountType = ""
  urlAccountType = ""
  orderId = ""
  orderstatus = ""
  orderdate: string
  productList: Array<any>
  orderstatuslist:Array<any>
  orderStepactive=false
  packedStepactive=false
  shippingStepactive=false
  deliverStepactive=false

  constructor(public router: Router, public activatedRouter: ActivatedRoute, public spinner: NgxSpinnerService,
    public cookiesServices: CookieService, public httpclient: HttpClient, private location: Location) {
    this.orderId = ""
    this.orderdate = ""
    this.orderStepactive=false
    this.packedStepactive=false
    this.shippingStepactive=false
    this.deliverStepactive=false
    this.productList = []
    this.orderstatuslist=[]

    this.checkLoginStatus()
  }

  checkLoginStatus() {
    let loginStatus = MyCookies.checkLoginStatus(this.cookiesServices)
    if (loginStatus) {
      this.accountType = MyCookies.getAccountType(this.cookiesServices)

      this.activatedRouter.params.subscribe(parmas => {
        this.urlAccountType = parmas['accountype']
      })

      if (this.urlAccountType == this.accountType) {
        this.activatedRouter.params.subscribe(parmas => {
          // this.orderId = parmas['order_Id']
        })
        this.orderId="15795152895e257d99aee08"
        this.orderstatus = "Delivered"
        this.orderdate = "22-jan-2020  12:00 pm"
        // this.productList.push(
        //   {
        //     "productPublicId":"15795152895e257d99aee08",
        //     "productImage":"https://firebasestorage.googleapis.com/v0/b/steerlyfe-e2405.appspot.com/o/store-logo%2F1578978734599?alt=media&token=278b6731-af20-4682-9bd4-e2cc56bbee5f",
        //     "productName":"Hemp Pain Relief Cream ",
        //     "productQunatity":6,
        //     "productUnitType":"100mg",
        //     "sellerName":"Napworks",
        //     "productPrice":9,
            
        //   }
        // )

        // $("#advance").on("click", function() {
        //   var $bar = $(".ProgressBar");
        //   if ($bar.children(".is-current").length > 0) {
        //     $bar.children(".is-current").removeClass("is-current").addClass("is-complete").next().addClass("is-current");
        //   } else {
        //     $bar.children().first().addClass("is-current");
        //   }
        // });
        this.orderstatuslist.push("order","packed","shipping","delivered")
            CommonMethods.showconsole(this.Tag,"Array Orderstatus list:- "+JSON.stringify(this.orderstatuslist))
            var setcurrent=false  
            for(var i=0;i<this.orderstatuslist.length;i++)
               {
                
                  if( this.orderstatuslist[i] == "order")
                  {
                     CommonMethods.showconsole(this.Tag,"If is working ")
                        setTimeout(() => {
                           document.getElementById('orderstatus').classList.add('is-current')
                          
                        }, 500);
                        
                  }
                  else if(this.orderstatuslist[i] == "packed"){
                    CommonMethods.showconsole(this.Tag,"If is working packed ")
                    setTimeout(() => {
                      
                      
                      document.getElementById('orderstatus').classList.remove('is-current')
                      document.getElementById('packedstatus').classList.add('is-current')
                      
                    this.orderStepactive=true
                    }, 1000);
                    // 
                    
               
                  }
                  else if(this.orderstatuslist[i] == "shipping"){
                    setTimeout(() => {

                     
                      document.getElementById('packedstatus').classList.remove('is-current')
                      document.getElementById('shippedstatus').classList.add('is-current')
                      // 
                      this.packedStepactive=true
                    }, 2000);
                   
                  }
                  else{
                    setTimeout(() => {
                      document.getElementById('shippedstatus').classList.remove('is-current')
                      this.shippingStepactive=true
                      this.deliverStepactive=true
                    }, 3009);
                  }

               }
      } else {
        this.location.back()
      }
    } else {
      MyRoutingMethods.gotoLogin(this.router)
    }
  }


  getColor(status) {

    switch (status) {
      case 'Delivered':

        return 'green';
      case 'Cancel':

        return 'red';
      case 'Pedning':

        return 'red';
    }
  }
  ngOnInit() {
  }
}
