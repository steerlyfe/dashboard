import { Component, OnInit } from '@angular/core';
import { Image } from '@ks89/angular-modal-gallery';
import { ProductDetails } from 'src/app/modelspackages/product-details';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonMethods } from 'src/app/utilpackages/common-methods';
import { CookieService } from 'ngx-cookie-service';
import { MyCookies } from 'src/app/utilpackages/my-cookies';
import { MyRoutingMethods } from 'src/app/utilpackages/my-routing-methods';
import { CommonWebApiService } from 'src/app/CommonMethods/CommonApis';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog, MatSnackBar } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { GetProductDetails } from 'src/app/CommonMethods/CommonInterface';
import { DailogboxComponent } from 'src/app/componentpackage/dailogbox/dailogbox.component';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit,GetProductDetails {
     Tag="ProductDetailsComponent"
   productDetailsModal:ProductDetails
  gallaryImageArray:Array<Image>
  isloading=false

   modalselectedvalue=false
  


  constructor(public activatedRouter:ActivatedRoute,public cookiesService:CookieService,public router:Router,
    public spinner:NgxSpinnerService,public matdialog:MatDialog,public httpClient:HttpClient,public snackBar:MatSnackBar) {
      this.isloading=false
      this.modalselectedvalue=true
      this.productDetailsModal =new ProductDetails("",[],"",[],"","","","","",[],[],[],[])
    this.gallaryImageArray=[]
      
    this.checkLoginstatus()
      // this.getproductdetails()
     
      
  }

  checkLoginstatus()
  {
     var loginstatus= MyCookies.checkLoginStatus(this.cookiesService)
    if (loginstatus) {

      this.activatedRouter.params.subscribe(params =>{
        this.productDetailsModal.productId = params['id']
        CommonMethods.showconsole(this.Tag,"Product Id :- "+this.productDetailsModal.productId)
           })
      CommonWebApiService.getProductDetails(this.spinner,this.httpClient,this.cookiesService,this,this.productDetailsModal,this.snackBar)
    }
    else{
       MyRoutingMethods.gotoLogin(this.router)
    }
  }



  onResponseGetProductDetails(status:string,apiResponse:any)
  { switch(status)
    {
        case"1":
         for(var i=0;i<apiResponse['productImages'].length;i++)
         {
          this.gallaryImageArray.push(
            new Image(
              i,
              {
                img: apiResponse['productImages'][i]
                // description: 'Description 1'
              },
              { img: apiResponse['productImages'][i]
             }
            )
          );
         }
       


        this.isloading =true
           CommonMethods.showconsole(this.Tag,"IMage array1 :- "+this.productDetailsModal.productImages);
           CommonMethods.showconsole(this.Tag,"IMage array :- "+apiResponse['productImages']);
           CommonMethods.showconsole(this.Tag,"additional_features array :- "+apiResponse['additional_features']);
        this.productDetailsModal.productName= apiResponse['productName']
        this.productDetailsModal.productCategory=apiResponse['categories']
        this.productDetailsModal.productPrice=apiResponse['actualPrice']
        this.productDetailsModal.productSaleprice=apiResponse['salePrice']
        this.productDetailsModal.productBarcode=apiResponse['barcode']
        this.productDetailsModal.productDescription=apiResponse['description']
        this.productDetailsModal.productadditionalinfo=apiResponse['product_info']
        this.productDetailsModal.productadditionOptionList=apiResponse['additional_features']
        this.productDetailsModal.product_availability_list =apiResponse['product_availability']
        
        
     
      
        // CommonMethods.showconsole(this.Tag,"Product Image Price  :- "+JSON.stringify(apiResponse['productImages']))
        break;
        case "10":
        CommonMethods.showErrorDialog(this.snackBar,"Session Time Out")
        MyCookies.deletecookies(this.cookiesService)
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

  getproductdetails(){
      //  this.productDetailsModal.productName="Fair & Handsome"
       
  //     this.productDetailsModal.productImages.push("https://firebasestorage.googleapis.com/v0/b/steerlyfe-e2405.appspot.com/o/product-image%2F1577872994550?alt=media&token=b5859a71-f536-4e4e-a49b-146d616b425d","https://thepop.app/steerlyfe/images/category/pets.jpg",
  //     "https://thepop.app/steerlyfe/images/category/beauties.jpg","https://thepop.app/steerlyfe/images/category/beauties.jpg")
  // //  CommonMethods.showconsole(this.Tag,"")
  //     for(var i=0;i<this.productDetailsModal.productImages.length;i++)
  //      {
  //         CommonMethods.showconsole(this.Tag,"Image Url :- "+this.productDetailsModal.productImages[i]+"index:- "+i)
  //        this.gallaryImageArray.push(new Image(i, { 
  //          img:this.productDetailsModal.productImages[i]
  //        },
  //        { img: this.productDetailsModal.productImages[i] }
         
  //        ))
  //      }
        // this.productDetailsModal.productColorArray.push("black,blue")
        // this.productDetailsModal.productsizeArray.push(1,2,3,4)
        // this.productDetailsModal.productquantitytype.push()
        // // this.productDetailsModal.productCategory.push("Oil","Beard","Non-veg")
        // this.productDetailsModal.productadditionalinfo.push({
        //   "title":"Type",
        //   "answer":"Answer"
        // })

     
        
  }



  ngOnInit() {
  }

}
