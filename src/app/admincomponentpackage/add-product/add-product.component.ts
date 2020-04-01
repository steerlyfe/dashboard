import { Component, OnInit } from '@angular/core';
import { AddProductModel } from 'src/app/modelspackages/add-product';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { MyCookies } from 'src/app/utilpackages/my-cookies';
import { CommonMethods } from 'src/app/utilpackages/common-methods';
import { MyConstants } from 'src/app/utilpackages/constant';
import { MyRoutingMethods } from 'src/app/utilpackages/my-routing-methods';
import { Router } from '@angular/router';
import { PhotouploadfirebaseService } from 'src/app/firebaseconsole/photouploadfirebase.service';
import { UploadImageUrl, AddProduct } from 'src/app/CommonMethods/CommonInterface';
import { AngularFireStorage } from '@angular/fire/storage';
import { CommonWebApiService } from 'src/app/CommonMethods/CommonApis';
import { MatSnackBar, MatDialog } from '@angular/material';
import { DailogboxComponent } from 'src/app/componentpackage/dailogbox/dailogbox.component';
import { element } from 'protractor';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit, UploadImageUrl, AddProduct {
  Tag = "AddProductComponent"
  addproduct: AddProductModel
  categoryList: Array<any>
  fileList: FileList
  categoryIds: any
  indexupload = 0
  isdeliver_nowdiv = false
  isShipping = false
  in_stockif = false
  deliver_nowif = false
  additionInformationbutton: Array<any>
  constructor(public spinner: NgxSpinnerService, public httpclient: HttpClient,
    public cookiesservice: CookieService, public router: Router, public uploadservice: PhotouploadfirebaseService,
    private storage: AngularFireStorage, public snackBar: MatSnackBar, public matdialog: MatDialog) {
    this.categoryList = []
    this.categoryIds = ""
    this.isdeliver_nowdiv = false
    this.isShipping = false
    this.in_stockif = false
    this.deliver_nowif = false
    this.indexupload = 0
    this.additionInformationbutton = [];
    this.additionInformationbutton.push(
      {
        "button_Name": "Color",
        "type": "color",

      },
      {
        "button_Name": "Size(ex:L, M, XL)",
        "type": "size",

      },
      {
        "button_Name": "Quantity(ex:5Kg, 500gm)",
        "type": "quantity",

      },
      {
        "button_Name": "Quantity(ex:5l,500ml)",
        "type": "Ml",

      }
    )
    this.addproduct = new AddProductModel([], "", "", "", "", "", "", [], [], "", "", [], [], [], [], [], false, false, false, "", "")
    // this.addproduct.selectedImagesValue.push(1,2,3)
    //  CommonMethods.showconsole(this.Tag,"Selected Image :- "+this.addproduct.selectedImagesValue.length)
    this.checkLoginStatus()
    this.addAdditionInfo()
  }

   checkLoginStatus()
   {
    
     var loginstatus=MyCookies.checkLoginStatus(this.cookiesservice)
    if (loginstatus) {
      this.httpclient.get(MyConstants.BASEURL + 'categoryList.php').subscribe(responseData => {
        let status = responseData['status']
        switch (status) {
          case '1':
            this.categoryList = responseData['categoriesList']
            break;
          default:
            alert("Error Occured, Please try again");
            break
        }
      },
        response => {
          CommonMethods.showconsole(this.Tag, "Response Error:- " + response)
        },
        () => {
          CommonMethods.showconsole(this.Tag, 'Finish');
        }
      )
    }
    else {
      MyRoutingMethods.gotoLogin(this.router)
    }
  
  }

  //show  Error Dailog Method  
  showErrorDialog(message: string) {
    this.snackBar.open(message, "", {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: ['blue-snackbar']
    });
  }

  // validation function 

  validation() {
    if (this.addproduct.selectedImagesValue.length == 0) {
      this.showErrorDialog("Select Product Image")
      return false;
    } else  if (this.addproduct.productName.trim().length == 0) {
      this.showErrorDialog("Enter Product Name")
      return false
    } else if (this.addproduct.barcode.trim().length == 0) {
      this.showErrorDialog("Enter Barcode")
      return false
    } else if (this.addproduct.description.trim().length == 0) {
      this.showErrorDialog("Enter Description")
      return false
    } else if (this.addproduct.actualPrice.trim().length == 0) {
      this.showErrorDialog("Enter  Price")
      return false;
    } else if (this.addproduct.salePrice.trim().length == 0) {
      this.showErrorDialog("Enter Sale Price")
      return false
    } else if (parseFloat(this.addproduct.salePrice) > parseFloat(this.addproduct.actualPrice)) {
      this.showErrorDialog("Sale Price Can't Be more Than Acutal Price ")
      return false
    }
    // else if (this.addproduct.stock.length == 0 || this.addproduct.stock.trim().length == 0) {
    //   this.addproduct.errorMessage = "Enter Stock"
    //   return false
    // }
    else if (this.categoryIds.length == 0) {
      this.showErrorDialog("Select Category")
      return false
    } else if (!this.checkAdditionFeature()) {
      CommonMethods.showconsole(this.Tag, "Additional Feature not valid")
      return false
    } else if(!this.checkAdditionInfo())
    {
      CommonMethods.showconsole(this.Tag, "Additional info not valid")
      return false
    } else if (this.addproduct.instock == false && this.addproduct.deliver_now == false
      && this.addproduct.shipping == false) {
      this.showErrorDialog("Please Check Atleast one Option from Product Availability")

      return false
    }
    else if (this.addproduct.deliver_now == true && this.addproduct.deliver_charges.length == 0) {
      this.showErrorDialog("Enter Deliver Charges")

      return false


    }
    else if (this.addproduct.shipping == true && this.addproduct.shippingcharges.length == 0) {
      this.showErrorDialog("Enter Shipping Charges")

      return false
    }

    else {
      CommonMethods.showconsole(this.Tag, "else is  working empty error ")

      this.addproduct.errorMessage = ""
      return true
    }

  }


  checkAdditionFeature(): Boolean {
    var isValid = true
    if (this.addproduct.additionalOptionsList.length > 0) {
      for (var i = 0; i < this.addproduct.additionalOptionsList.length; i++) {
        let innerData = this.addproduct.additionalOptionsList[i]
        if (innerData.inputfield.trim().length == 0) {
          CommonMethods.showconsole(this.Tag, "If is working " + i)
          this.showErrorDialog("Enter " + innerData.button_Name)
          isValid = false
          break
        } else if (innerData.additionPrice.trim().length == 0) {
          this.showErrorDialog("Enter Additional price of  " + innerData.button_Name)
          isValid = false
          break
        }
      }
    }
    return isValid
  }
  checkAdditionInfo(): Boolean {
    var isValid = true
    if (this.addproduct.additionInfolist.length > 0) {
      for (var i = 0; i < this.addproduct.additionInfolist.length; i++) {
        let innerData = this.addproduct.additionInfolist[i]
        if (innerData.type.trim().length == 0) {
          this.showErrorDialog("Enter Title")
          isValid = false
          break
        } else if (innerData.value.trim().length == 0) {
          this.showErrorDialog("Enter Info")
          isValid = false
          break
        }
      }
    }
    return isValid
  }


  // add images

  onSelectFile(event) {

    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        CommonMethods.showconsole(this.Tag, "IMage filr name :- " + JSON.stringify(event.target.files[i]))
        this.addproduct.selectedImagesValue.push({
          "filepath": event.target.files[i],
          "uploadImage": false
        })
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[i]);
        reader.onload = (innerEvent) => {
          this.addproduct.imageUrl.push((<FileReader>innerEvent.target).result);
        }
      }
      event.srcElement.value = null
    }

    CommonMethods.showconsole(this.Tag, "Selected  Images :- " + JSON.stringify(this.addproduct.selectedImagesValue))


  }

  // Remove Images
  imageremove(imageurl: any) {



    const index1 = this.addproduct.selectedImagesValue.indexOf(imageurl)
    this.addproduct.selectedImagesValue.splice(index1, 1)
    const index = this.addproduct.imageUrl.indexOf(imageurl)
    this.addproduct.imageUrl.splice(index, 1)
    this.addproduct.firebaseimageurl.splice(index, 1)
    this.indexupload--

  }

  // Addition Feature Into  Product function 

  addInputfields(position: number) {
  
    CommonMethods.showconsole(this.Tag, "addInputfields position " + position)
    let currentData = this.additionInformationbutton[position]
    var index = 0;
    var count = 0;
    var isExists = false
    this.addproduct.additionalOptionsList.forEach(element => {
      CommonMethods.showconsole(this.Tag, "")
      if (element.type == currentData.type) {
        index = count
        isExists = true
      }
      count++
    })
    if (isExists) {
      CommonMethods.showconsole(this.Tag, "ID IS EXIT ")
      CommonMethods.showconsole(this.Tag, "index:-  " + index)
      // currentData.inputfield=""

      this.addproduct.additionalOptionsList.splice(index + 1, 0, {
        "button_Name": currentData.button_Name,
        "type": currentData.type,
        "inputfield": "",
        "additionPrice": "0.0"
      })
    } else {
      CommonMethods.showconsole(this.Tag, "ID IS NOT EXIT ")
      this.addproduct.additionalOptionsList.push({
        "button_Name": currentData.button_Name,
        "type": currentData.type,
        "inputfield": "",
        "additionPrice": "0.0"
      }

      )
    }

    CommonMethods.showconsole(this.Tag, "Selected  Images :- " + JSON.stringify(this.addproduct.additionalOptionsList))

  }

  // Remove Addition Feature  into List  function

  removeColorInputfield(index: any) {
    this.addproduct.additionalOptionsList.splice(index, 1)
  }

  // Add  Product Info List 
  addAdditionInfo() {
   
    this.addproduct.additionInfolist.push({
      "type": "",
      "value": ""
    })
  }


  // Remove  Product Info list item  function

  removeProductInfo(index: any) {
    this.addproduct.additionInfolist.splice(index, 1)
    if (this.addproduct.additionalOptionsList.length == 0) {
    }

  }

  //  on click of check box deliver show and  shipping div enable and desable   function 
  productAvailability(checkvalvalue: any) {
    this.isdeliver_nowdiv = checkvalvalue
    this.addproduct.deliver_charges = ""
    CommonMethods.showconsole(this.Tag, " click is working:- " + checkvalvalue)


    if (checkvalvalue == false) {
      for (var i = 0; i < this.addproduct.productAvailabilityList.length; i++) {
        if (this.addproduct.productAvailabilityList[i].type == "deliver_now") {
          this.addproduct.productAvailabilityList[i].available = false
          this.addproduct.productAvailabilityList[i].price = 0
        }
      }
    }
    CommonMethods.showconsole(this.Tag, "Product Available  uunchecked:- " + JSON.stringify(this.addproduct.productAvailabilityList))
  }
  productAvailabilityshipping(checkvalvalue: any) {
    this.isShipping = checkvalvalue
    this.addproduct.shippingcharges = ""
    CommonMethods.showconsole(this.Tag, " click is working:- " + checkvalvalue)
    if (checkvalvalue == false) {
      for (var i = 0; i < this.addproduct.productAvailabilityList.length; i++) {
        if (this.addproduct.productAvailabilityList[i].type == "shipping") {
          this.addproduct.productAvailabilityList[i].available = false
          this.addproduct.productAvailabilityList[i].price = 0
        }
      }
    }

    CommonMethods.showconsole(this.Tag, "Product Available  uunchecked:- " + JSON.stringify(this.addproduct.productAvailabilityList))
  }
  productAvailabilityInstok(checkvalvalue: any) {
    // this.isShipping=checkvalvalue
    CommonMethods.showconsole(this.Tag, " click is working:- " + checkvalvalue)
    if (checkvalvalue == false) {
      for (var i = 0; i < this.addproduct.productAvailabilityList.length; i++) {
        if (this.addproduct.productAvailabilityList[i].type == "in_store") {
          this.addproduct.productAvailabilityList[i].available = false
        }
      }
    }

    CommonMethods.showconsole(this.Tag, "Product Available  uunchecked:- " + JSON.stringify(this.addproduct.productAvailabilityList))
  }


  // onkeypress Function

  keyPress(event: any) {
    const patt = /^[0-9]{1,4}(\.[0-9][0-9])?$/
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !patt.test(inputChar)) {
      event.preventDefault();
    }
  }
  isNumberKey(txt, evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode == 46) {
      //Check if the text already contains the . character
      if (txt.indexOf('.') === -1) {
        return true;
      } else {
        return false;
      }
    } else {
      if (charCode > 31 &&
        (charCode < 48 || charCode > 57))
        return false;
    }
    return true;
  }


  // image upload function

  uploadImage() {
    if (this.addproduct.selectedImagesValue[this.indexupload].uploadImage == false) {

      CommonMethods.uploadPhoto(MyConstants.FOLDER_PATH_FIREBASE_PRODUCT, this.addproduct.selectedImagesValue[this.indexupload].filepath, this.storage, this)
      CommonMethods.showconsole(this.Tag, "If is working uloaded:-0 " + this.addproduct.selectedImagesValue[this.indexupload].uploadImage)
    }
  }

  productAvailabityArray() {
    if (this.addproduct.instock == true && this.addproduct.deliver_now == true && this.addproduct.shipping == true) {

      CommonMethods.showconsole(this.Tag, "Instock:- " + this.addproduct.instock + " Now Deliver :- " + this.addproduct.deliver_now + "   Shipping:- " + this.addproduct.shipping)
      this.addproduct.productAvailabilityList = []
      this.addproduct.productAvailabilityList.push({
        "type": "in_store",
        "available": true,
        "price": 0
      },
        {
          "type": "deliver_now",
          "available": true,
          "price": this.addproduct.deliver_charges
        },
        {
          "type": "shipping",
          "available": true,
          "price": this.addproduct.shippingcharges
        }
      )
    } else if (this.addproduct.instock == true && this.addproduct.deliver_now == false && this.addproduct.shipping == false) {
      CommonMethods.showconsole(this.Tag, "Instock:- " + this.addproduct.instock + " Now Deliver :- " + this.addproduct.deliver_now + "   Shipping:- " + this.addproduct.shipping)

      this.addproduct.productAvailabilityList = []
      this.addproduct.productAvailabilityList.push({
        "type": "in_store",
        "available": true,
        "price": 0
      },
        {
          "type": "deliver_now",
          "available": false,
          "price": 0
        },
        {
          "type": "shipping",
          "available": false,
          "price": 0
        }
      )
    }
    else if (this.addproduct.instock == false && this.addproduct.deliver_now == true && this.addproduct.shipping == false) {
      CommonMethods.showconsole(this.Tag, "Instock:- " + this.addproduct.instock + " Now Deliver :- " + this.addproduct.deliver_now + "   Shipping:- " + this.addproduct.shipping)

      this.addproduct.productAvailabilityList = []
      this.addproduct.productAvailabilityList.push({
        "type": "in_store",
        "available": false,
        "price": 0
      },
        {
          "type": "deliver_now",
          "available": true,
          "price": this.addproduct.deliver_charges
        },
        {
          "type": "shipping",
          "available": false,
          "price": 0
        }
      )
    }
    else if (this.addproduct.instock == false && this.addproduct.deliver_now == false && this.addproduct.shipping == true) {
      CommonMethods.showconsole(this.Tag, "Instock:- " + this.addproduct.instock + " Now Deliver :- " + this.addproduct.deliver_now + "   Shipping:- " + this.addproduct.shipping)

      this.addproduct.productAvailabilityList = []
      this.addproduct.productAvailabilityList.push({
        "type": "in_store",
        "available": false,
        "price": 0
      },
        {
          "type": "deliver_now",
          "available": false,
          "price": 0
        },
        {
          "type": "shipping",
          "available": true,
          "price": this.addproduct.shippingcharges
        }
      )
    }
    else if (this.addproduct.instock == true && this.addproduct.deliver_now == true && this.addproduct.shipping == false) {
      CommonMethods.showconsole(this.Tag, "Instock:- " + this.addproduct.instock + " Now Deliver :- " + this.addproduct.deliver_now + "   Shipping:- " + this.addproduct.shipping)

      this.addproduct.productAvailabilityList = []
      this.addproduct.productAvailabilityList.push({
        "type": "in_store",
        "available": true,
        "price": 0
      },
        {
          "type": "deliver_now",
          "available": true,
          "price": this.addproduct.deliver_charges
        },
        {
          "type": "shipping",
          "available": false,
          "price": 0
        }
      )
    }
    else if (this.addproduct.instock == true && this.addproduct.deliver_now == false && this.addproduct.shipping == true) {
      CommonMethods.showconsole(this.Tag, "Instock:- " + this.addproduct.instock + " Now Deliver :- " + this.addproduct.deliver_now + "   Shipping:- " + this.addproduct.shipping)

      this.addproduct.productAvailabilityList = []
      this.addproduct.productAvailabilityList.push({
        "type": "in_store",
        "available": true,
        "price": 0
      },
        {
          "type": "deliver_now",
          "available": false,
          "price": 0
        },
        {
          "type": "shipping",
          "available": true,
          "price": this.addproduct.shippingcharges
        }
      )
    }
    else if (this.addproduct.instock == false && this.addproduct.deliver_now == true && this.addproduct.shipping == true) {
      CommonMethods.showconsole(this.Tag, "Instock:- " + this.addproduct.instock + " Now Deliver :- " + this.addproduct.deliver_now + "   Shipping:- " + this.addproduct.shipping)

      this.addproduct.productAvailabilityList = []
      this.addproduct.productAvailabilityList.push({
        "type": "in_store",
        "available": false,
        "price": 0
      },
        {
          "type": "deliver_now",
          "available": true,
          "price": this.addproduct.deliver_charges
        },
        {
          "type": "shipping",
          "available": true,
          "price": this.addproduct.shippingcharges
        }
      )
    }
  }


  // api call function

  addProduct() {
    CommonMethods.showconsole(this.Tag, "VALIDATION : " + this.validation())
    if (this.validation()) {
      this.spinner.show()
      var previousFeaturetype = ""
      for (var i = 0; i < this.categoryIds.length; i++) {

        this.addproduct.categoryId.push(this.categoryIds[i])

      }


      for (var i = 0; i < this.additionInformationbutton.length; i++) {

        for (var j = 0; j < this.addproduct.additionalOptionsList.length; j++) {
          // CommonMethods.showconsole(this.Tag,"Show: "+this.additionInformationbutton[i].type)       
          if (this.additionInformationbutton[i].type == this.addproduct.additionalOptionsList[j].type) {
            CommonMethods.showconsole(this.Tag, "Matching Value :- " + this.addproduct.additionalOptionsList[j].type)
            if (previousFeaturetype == this.addproduct.additionalOptionsList[j].type) {
              CommonMethods.showconsole(this.Tag, "previous type Match")
              this.addproduct.finalAdditionOptionArray[i].info.push({
                "value": this.addproduct.additionalOptionsList[j].inputfield,
                "price": this.addproduct.additionalOptionsList[j].additionPrice
              })
            }
            else {
              CommonMethods.showconsole(this.Tag, "previous type is not Match")
              this.addproduct.finalAdditionOptionArray.push({
                "type": this.additionInformationbutton[i].type,
                "info": [{
                  "value": this.addproduct.additionalOptionsList[j].inputfield,
                  "price": this.addproduct.additionalOptionsList[j].additionPrice
                }]
              })
              previousFeaturetype = this.addproduct.additionalOptionsList[j].type

            }
          }
        }
      }

      this.productAvailabityArray()

      if (this.addproduct.firebaseimageurl.length < this.addproduct.selectedImagesValue.length) {

        this.uploadservice.signIn().then(res => {
          this.spinner.show()
          this.uploadImage();

        }).catch(res => {
          CommonMethods.showconsole(this.Tag, "Working  on error:- " + res)
        })

      }
      else {
        CommonMethods.showconsole(this.Tag, "Else Working ")

        CommonWebApiService.addProduct(this.spinner, this.httpclient, this.cookiesservice, this.addproduct, this,this.snackBar)
      }


    }
  }
  // on image upload function

  onUploadImageResponse(url: string) {

    CommonMethods.showconsole(this.Tag, 'FirebAse Url :- ' + url);
    this.addproduct.firebaseimageurl.push(url)
    this.addproduct.selectedImagesValue[this.indexupload].uploadImage = true
    this.indexupload++

    if (this.addproduct.selectedImagesValue.length == this.indexupload) {
      CommonMethods.showconsole(this.Tag, "If Works")
      CommonMethods.showconsole(this.Tag, "Product Image:- " + JSON.stringify(this.addproduct.firebaseimageurl))
      CommonMethods.showconsole(this.Tag, " Product Name:- " + this.addproduct.productName)
      CommonMethods.showconsole(this.Tag, "product barcode:- " + this.addproduct.barcode)
      CommonMethods.showconsole(this.Tag, "Product Desicription:- " + this.addproduct.description)
      CommonMethods.showconsole(this.Tag, "Product Price:- " + this.addproduct.actualPrice)
      CommonMethods.showconsole(this.Tag, "Product Sale Price:- " + this.addproduct.salePrice)
      // CommonMethods.showconsole(this.Tag, "Product Stock " + this.addproduct.stock)
      CommonMethods.showconsole(this.Tag, "product category:- " + JSON.stringify(this.addproduct.categoryId))
      CommonMethods.showconsole(this.Tag, "product color array:- " + JSON.stringify(this.addproduct.finalAdditionOptionArray))
      CommonMethods.showconsole(this.Tag, "product size array:- " + JSON.stringify(this.addproduct.additionInfolist))
      CommonMethods.showconsole(this.Tag, "add product quantity array " + JSON.stringify(this.addproduct.productAvailabilityList))

      CommonWebApiService.addProduct(this.spinner, this.httpclient, this.cookiesservice, this.addproduct, this,this.snackBar)


    }
    else {
      CommonMethods.showconsole(this.Tag, "Else Works")
      this.uploadImage();

    }

  }

  // on api call response function

  onResponseAddproduct(status: string, message: string) {

    switch (status) {
      case "1":

        this.snackBar.open(message, "", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['sucess-snackbar']
        });
       
        break;
      case "10":
      CommonMethods.showErrorDialog(this.snackBar,"Session Time Out")
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

  // session dialog function
  openDialog(): void {
    const dialogRef = this.matdialog.open(DailogboxComponent, {
      data: { message: "Session Time Out" }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // this.animal = result;
    });
  }


  ngOnInit() {

  }

}
