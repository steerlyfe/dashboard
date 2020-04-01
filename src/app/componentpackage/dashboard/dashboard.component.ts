import { Component, OnInit } from '@angular/core';
import { MyCookies } from 'src/app/utilpackages/my-cookies';
import { CookieService } from 'ngx-cookie-service';
import { CommonMethods } from 'src/app/utilpackages/common-methods';
import { CommonWebApiService } from 'src/app/CommonMethods/CommonApis';
import { MyRoutingMethods } from 'src/app/utilpackages/my-routing-methods';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  Tag="DashboardComponent"
  constructor( public cookiesservice:CookieService,public router:Router) {
    this.checkLoginStatus()
  }

  ngOnInit() {
  }
  checkLoginStatus()
     {
      var loginstatus = MyCookies.checkLoginStatus(this.cookiesservice)
  
      if(loginstatus)
      {
        // CommonWebApiService.getAllStoreList(this.spinner,this.httpclient,this.cookiesservice,this)
      }
      else{
     
        MyRoutingMethods.gotoLogin(this.router)
      }
     }
}
