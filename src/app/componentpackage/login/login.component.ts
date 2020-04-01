import { Component, OnInit } from '@angular/core';
import { LoginDetail } from 'src/app/modelspackages/login-details';
import { Router } from '@angular/router';
import { HttpParams, HttpClient } from '@angular/common/http';
import { CommonWebApiService } from 'src/app/CommonMethods/CommonApis';
import { Login } from 'src/app/CommonMethods/CommonInterface';
import { NgxSpinnerService } from 'ngx-spinner';
import { MyRoutingMethods } from 'src/app/utilpackages/my-routing-methods';
import { CookieService } from 'ngx-cookie-service';
import { CommonMethods } from 'src/app/utilpackages/common-methods';
import { MyCookies } from 'src/app/utilpackages/my-cookies';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,Login {
  Tag="LoginComponent"
  loginData: LoginDetail;
  constructor( public router:Router,public httpclient:HttpClient,public spinner:NgxSpinnerService,
   public cookiesservice:CookieService,public snackbar:MatSnackBar) { 
    this.loginData = new LoginDetail('', '', '', false, '');
    this.checkLoginStatus();

  }

checkLoginStatus()
{
   CommonMethods.showconsole(this.Tag,"Working Login COmponent ")
    var loginstatus = MyCookies.checkLoginStatus(this.cookiesservice)
    CommonMethods.showconsole(this.Tag,"status Into Login Component :- "+loginstatus)
    if(loginstatus)
    {
      
      MyRoutingMethods.gotoDashboard(this.router,MyCookies.getAccountType(this.cookiesservice))
    }
    else{
    
      MyRoutingMethods.gotoLogin(this.router)
    }
}

  


  validateForm(email: any, password: any): boolean {
    if (email.trim().length === 0) {
       CommonMethods.showErrorDialog(this.snackbar,"Please Enter Email!")
        return false
    } else if (password.trim().length === 0) {
      CommonMethods.showErrorDialog(this.snackbar,"Please Enter Password!")
        return false
    } else if (!this.loginData.termsChecked) {
        CommonMethods.showErrorDialog(this.snackbar,"Please Accept Privacy Policy!")
        return false
    } else {
        return true
    }
}






onLoginEmail() {
  this.loginData.errorMessage = '';
  if (this.validateForm(this.loginData.email, this.loginData.password)) {
          // this.router.navigate(['dashboard'])
            // this.cookiesservice.set("Demo Cookies Check ","Hello i am Avinash Kumar")
          this.loginApi()
  }
}
loginApi(){
   CommonWebApiService.login(this.httpclient,this.loginData,this.spinner,this.router,this.cookiesservice,this,this.snackbar)
}
onLoginResponse(status:string,errorMessage:string)
{
       switch(status)
       {
         case '0':
          CommonMethods.showErrorDialog(this.snackbar,errorMessage)
         break
         default:
         break

       }
}


showPassword(){
  
  if((document.getElementById('password') as HTMLInputElement).type == 'password')
  {
    (document.getElementById('password') as HTMLInputElement).type ='text';
    (document.getElementById('myiconconfirm') as HTMLInputElement).className="fa fa-eye";
  }
  else{
    (document.getElementById('password') as HTMLInputElement).type = "password";
    (document.getElementById('myiconconfirm') as HTMLInputElement).className="fa fa-eye-slash";
  }
}



  ngOnInit() {
  }

}
