import { Component, OnInit, NgZone } from '@angular/core';
import { AddProductModel } from 'src/app/modelspackages/add-product';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatSnackBar, MatDialog } from '@angular/material';
import { PhotouploadfirebaseService } from 'src/app/firebaseconsole/photouploadfirebase.service';
import { MyCookies } from 'src/app/utilpackages/my-cookies';
import { MyConstants } from 'src/app/utilpackages/constant';
import { CommonMethods } from 'src/app/utilpackages/common-methods';
import { MyRoutingMethods } from 'src/app/utilpackages/my-routing-methods';
import { DailogboxComponent } from 'src/app/componentpackage/dailogbox/dailogbox.component';
import { EditProductModel } from 'src/app/modelspackages/edit-product';
import { CommonWebApiService } from 'src/app/CommonMethods/CommonApis';
import { ProductDetails } from 'src/app/modelspackages/product-details';
import { UpdateProduct } from 'src/app/CommonMethods/CommonInterface';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit, UpdateProduct {

  Tag = "EditProductComponent"
  updateproduct: EditProductModel
  modalReference: NgbModalRef
  categoryList: Array<any>
  firebaseiimageurl: any
  fileList: FileList
  categoryIds: any
  apicallBoolean = false
  indexupload = 0
  previousbuttontype = ""
  indextype = 0
  isdeliver_nowdiv = false
  isShipping = false
  in_stockif = false
  deliver_nowif = false
  shippingif = false
  productdetailsModal: ProductDetails
  tempcaregoriesArray: Array<any>
  isimageUloaded = false
  previousButtonType: string
  currentbuttonType: string
  dailogMessage: string
  accountType = ""
  additionInformationbutton: Array<any>
  urlaccountType = ""
  constructor(public spinner: NgxSpinnerService, public httpclient: HttpClient,
    public cookiesservice: CookieService, public router: Router, public uploadservice: PhotouploadfirebaseService,
    private storage: AngularFireStorage, public snackBar: MatSnackBar, public matdialog: MatDialog,
    public activatedRouter: ActivatedRoute, public ngZone: NgZone, public modalService: NgbModal, public location: Location) {
    this.categoryList = []
    this.categoryIds = ""
    this.previousbuttontype = ""
    this.apicallBoolean = false
    this.isdeliver_nowdiv = false
    this.isShipping = false

    this.in_stockif = false
    this.deliver_nowif = false
    this.shippingif = false
    this.isimageUloaded = false
    this.additionInformationbutton = [];
    this.tempcaregoriesArray = []
    this.previousButtonType = ""
    this.currentbuttonType = ""
    this.dailogMessage = ""
    this.additionInformationbutton.push(

      {
        "button_Name": "Ml",
        "type": "ml",

      },
      {
        "button_Name": "Mg",
        "type": "mg",

      }




      // {
      //   "button_Name": "Color",
      //   "type": "color",

      // },
      // {
      //   "button_Name": "Size(ex:L, M, XL)",
      //   "type": "size",

      // },
      // {
      //   "button_Name": "Quantity(ex:5Kg, 500gm)",
      //   "type": "quantity",

      // },
      // {
      //   "button_Name": "Quantity(ex:5l,500ml)",
      //   "type": "Ml",

      // }
    )

    this.firebaseiimageurl = ""
    this.indextype = 0
    this.updateproduct = new EditProductModel([], "", "", "", "", "", "", "", [], [], "", "", [], [], [], [], [], false, false, false, "", "")
    this.productdetailsModal = new ProductDetails("", [], "", [], "", "", "", "", "", [], [], [], [])
    // this.addproduct.selectedImagesValue.push(1,2,3)
    // CommonMethods.showconsole(this.Tag,"Selected Image :- "+this.addproduct.selectedImagesValue.length)
    this.checkLoginStatus()
  }

  //check login
  checkLoginStatus() {
    let loginstatus = MyCookies.checkLoginStatus(this.cookiesservice)
    if (loginstatus) {
      this.accountType = MyCookies.getAccountType(this.cookiesservice)
      this.activatedRouter.params.subscribe(params => {
        CommonMethods.showconsole(this.Tag, "Show account Type :- " + params['accountype'])
        this.urlaccountType = params['accountype']
      })
      if (this.accountType == this.urlaccountType) {
        this.activatedRouter.params.subscribe(params => {

          this.updateproduct.productPublicId = params['id']
          this.productdetailsModal.productId = params['id']
          CommonMethods.showconsole(this.Tag, "Product Public id:- " + this.updateproduct.productPublicId)
        })

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

        CommonWebApiService.getProductDetails(this.spinner, this.httpclient, this.cookiesservice, this, this.productdetailsModal,this.snackBar)
      } else {
        CommonMethods.showconsole(this.Tag, "Else is working")
        this.location.back()
      }



    }
    else {
      MyRoutingMethods.gotoLogin(this.router)
    }

  }


  // on response product details
  onResponseGetProductDetails(status: string, apiResponse: any) {
    switch (status) {
      case "1":
        CommonMethods.showconsole(this.Tag, "show api response:- " + apiResponse['productImages'])
        this.updateproduct.productName = apiResponse['productName']
        this.updateproduct.imageUrl = apiResponse['productImages']
        // this.updateproduct.firebaseimageurl = apiResponse['productImages']
        this.updateproduct.actualPrice = apiResponse['actualPrice'].toString()
        this.updateproduct.salePrice = apiResponse['salePrice'].toString()
        this.updateproduct.barcode = apiResponse['barcode'].toString()
        this.updateproduct.description = apiResponse['description']
        this.updateproduct.additionInfolist = apiResponse['product_info']
        this.updateproduct.productAvailabilityList = apiResponse['product_availability']

        for (var i = 0; i < apiResponse['categories'].length; i++) {
          this.tempcaregoriesArray.push(apiResponse['categories'][i].category_id)
        }
        this.categoryIds = this.tempcaregoriesArray
        CommonMethods.showconsole(this.Tag, "Categories Id:- " + this.categoryIds)
        for (var i = 0; i < this.updateproduct.productAvailabilityList.length; i++) {
          if (this.updateproduct.productAvailabilityList[i].type == "in_store" &&
            this.updateproduct.productAvailabilityList[i].available == true) {
            this.updateproduct.instock = true
          }
          else if (this.updateproduct.productAvailabilityList[i].type == "deliver_now" &&
            this.updateproduct.productAvailabilityList[i].available == true) {
            this.updateproduct.deliver_now = true
            this.isdeliver_nowdiv = true
            this.updateproduct.deliver_charges = this.updateproduct.productAvailabilityList[i].price.toString()
          }
          else if (this.updateproduct.productAvailabilityList[i].type == "shipping" &&
            this.updateproduct.productAvailabilityList[i].available == true) {
            this.updateproduct.shipping = true
            this.isShipping = true
            this.updateproduct.shippingcharges = this.updateproduct.productAvailabilityList[i].price.toString()
          }
        }
        this.updateproduct.additionalOptionsList = apiResponse['additional_features']
        for (var i = 0; i < apiResponse['additional_features'].length; i++) {
               CommonMethods.showconsole(this.Tag,"value :- "+apiResponse['additional_features'][i]['unitType'])
                if(apiResponse['additional_features'][i]['unitType'] == "MG")
                {
                  this.previousButtonType="mg"
                }else{
                  this.previousButtonType="ml"
                }
               
              }
        // for (var i = 0; i < apiResponse['additional_features'].length; i++) {

        //   // var length_of_info =apiResponse['additional_features'][i].info.length
        //   // for (var j = 0; j < apiResponse['additional_features'][i].info.length; j++) {

        //   //   //  CommonMethods.showconsole(this.Tag,"Size of info ")
        //   //   //  CommonMethods.showconsole(this.Tag,"Size of info "+apiResponse['additional_features'][i].info.length)
        //   //   this.updateproduct.additionalOptionsList.push({
        //   //     "button_Name": apiResponse['additional_features'][i].type,
        //   //     "type": apiResponse['additional_features'][i].type,
        //   //     "inputfield": apiResponse['additional_features'][i]['info'][j].value,
        //   //     "additionPrice": apiResponse['additional_features'][i]['info'][j].price.toString()
        //   //   }

        //   //   )
        //   // }

        //   this.updateproduct.additionalOptionsList.push({

        //   })


        // }
        for (var i = 0; i < apiResponse['productImages'].length; i++) {
          this.updateproduct.firebaseimageurl.push(apiResponse['productImages'][i])
        }
        //  this.indexupload=this.updateproduct.firebaseimageurl.length

        CommonMethods.showconsole(this.Tag, "List :- " + JSON.stringify(this.updateproduct.additionalOptionsList))

        // for(var i=0;i<apiResponse['categories'].length;i++)
        // {
        // CommonMethods.showconsole(this.Tag,"category Id :- "+apiResponse['categories'][i].category_id)
        // this.categoryIds.push(apiResponse['categories'][i].category_id)
        // }

        // this.productDetailsModal.productadditionOptionList=apiResponse['additional_features']
        // this.productDetailsModal.productIMages.push(apiResponse['productImages'])
        // for(var i=0;i<this.productDetailsModal.productIMages.length;i++)
        // {
        // CommonMethods.showconsole(this.Tag,"Image url:- "+this.productDetailsModal.productIMages[i])
        // this.gallaryImageArray.push(new Image(i, {
        // img:this.productDetailsModal.productIMages[i]
        // },
        // { img: this.productDetailsModal.productIMages[i] }
        // ))
        // }

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

  //show Error Dailog Method
  showErrorDialog(message: string) {
    this.snackBar.open(message, "", {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: ['blue-snackbar']
    });
  }

  // validation function

  validation() {
    if (this.updateproduct.imageUrl.length == 0) {
      this.showErrorDialog("Select Product Image")
      return false;
    }
    else if (this.updateproduct.productName.trim().length == 0) {
      this.showErrorDialog("Enter Product Name")
      return false
    }
    else if (this.updateproduct.barcode.trim().length == 0) {
      this.showErrorDialog("Enter Barcode")
      return false
    }
    else if (this.updateproduct.description.trim().length == 0) {
      this.showErrorDialog("Enter Description")

      return false
    }
    else if (this.updateproduct.actualPrice.trim().length == 0) {
      this.showErrorDialog("Enter Price")

      return false;
    }
    else if (this.updateproduct.salePrice.trim().length == 0) {
      this.showErrorDialog("Enter Sale Price")

      return false
    }
    else if (parseFloat(this.updateproduct.salePrice) > parseFloat(this.updateproduct.actualPrice)) {

      this.showErrorDialog("Sale Price Can't Be more Than Acutal Price ")

      return false
    }
    // else if (this.updateproduct.stock.length == 0 || this.updateproduct.stock.trim().length == 0) {
    // this.updateproduct.errorMessage = "Enter Stock"
    // return false
    // }


    else if (this.categoryIds.length == 0) {
      this.showErrorDialog("Select Category")
    } else if (this.updateproduct.additionalOptionsList.length == 0) {
      CommonMethods.showErrorDialog(this.snackBar, "Atlaest one Stock Add")
      return false
    } else if (!this.checkAdditionFeature()) {
      CommonMethods.showconsole(this.Tag, "Additional Feature not valid")
      return false
    } else if (!this.checkAdditionInfo()) {
      CommonMethods.showconsole(this.Tag, "Additional info not valid")
      return false
    }

    else if (this.updateproduct.instock == false && this.updateproduct.deliver_now == false
      && this.updateproduct.shipping == false) {
      this.showErrorDialog("Please Check Atleast one Option from Product Availability")

      return false
    }
    else if (this.updateproduct.deliver_now == true && this.updateproduct.deliver_charges.length == 0) {
      this.showErrorDialog("Enter Deliver Charges")

      return false


    }
    else if (this.updateproduct.shipping == true && this.updateproduct.shippingcharges.length == 0) {
      this.showErrorDialog("Enter Shipping Charges")

      return false
    }

    else {
      // CommonMethods.showconsole(this.Tag, "else is working empty error ")

      this.updateproduct.errorMessage = ""
      return true
    }

  }


  checkAdditionFeature(): Boolean {
    var isValid = true
    if (this.updateproduct.additionalOptionsList.length > 0) {
      for (var i = 0; i < this.updateproduct.additionalOptionsList.length; i++) {
        let innerData = this.updateproduct.additionalOptionsList[i]
        if (innerData.value.trim().length == 0) {
          CommonMethods.showconsole(this.Tag, "If is working " + i)
          this.showErrorDialog("Enter " + innerData.unitType)
          isValid = false
          break
        } else if (innerData.price.length == 0) {
          this.showErrorDialog("Enter Additional price of  " + innerData.unitType)
          isValid = false
          break
        }
      }
    }
    return isValid
  }
  checkAdditionInfo(): Boolean {
    var isValid = true
    if (this.updateproduct.additionInfolist.length > 0) {
      for (var i = 0; i < this.updateproduct.additionInfolist.length; i++) {
        let innerData = this.updateproduct.additionInfolist[i]
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
      // this.fileList = event.target.files;
      for (let i = 0; i < filesAmount; i++) {
        CommonMethods.showconsole(this.Tag, "IMage filr name :- " + JSON.stringify(event.target.files[i]))
        this.updateproduct.selectedImagesValue.push({
          "filepath": event.target.files[i],
          "uploadImage": false
        })
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[i]);
        reader.onload = (innerEvent) => {
          this.updateproduct.imageUrl.push((<FileReader>innerEvent.target).result);
        }
      }
      event.srcElement.value = null
    }

    CommonMethods.showconsole(this.Tag, "Selected Images :- " + JSON.stringify(this.updateproduct.selectedImagesValue))
    this.isimageUloaded = true

  }

  // Remove Images
  imageremove(imageurl: any) {



    const index1 = this.updateproduct.selectedImagesValue.indexOf(imageurl)
    this.updateproduct.selectedImagesValue.splice(index1, 1)
    const index = this.updateproduct.imageUrl.indexOf(imageurl)
    this.updateproduct.imageUrl.splice(index, 1)
    this.updateproduct.firebaseimageurl.splice(index, 1)

    if (this.updateproduct.selectedImagesValue.length == 0) {
      this.isimageUloaded = false
    }
    if (this.indexupload != 0) {
      this.indexupload--
    }
    // else{
    //   CommonMethods.showconsole(this.Tag,"Show index before:- "+this.indexupload)
    //   
    //   CommonMethods.showconsole(this.Tag,"Show index after:- "+this.indexupload)

    // }

  }

  // Addition Feature Into Product function

  // addInputfields(position: number) {

  //   CommonMethods.showconsole(this.Tag, "addInputfields position " + position)
  //   let currentData = this.additionInformationbutton[position]
  //   var index = 0;
  //   var count = 0;
  //   var isExists = false
  //   this.updateproduct.additionalOptionsList.forEach(element => {
  //     CommonMethods.showconsole(this.Tag, "")
  //     if (element.type == currentData.type) {
  //       index = count
  //       isExists = true
  //     }
  //     count++
  //   })
  //   if (isExists) {
  //     CommonMethods.showconsole(this.Tag, "ID IS EXIT ")
  //     CommonMethods.showconsole(this.Tag, "index:- " + index)
  //     // currentData.inputfield=""

  //     this.updateproduct.additionalOptionsList.splice(index + 1, 0, {
  //       "button_Name": currentData.button_Name,
  //       "type": currentData.type,
  //       "inputfield": "",
  //       "additionPrice": 0.0
  //     })
  //   } else {
  //     CommonMethods.showconsole(this.Tag, "ID IS NOT EXIT ")
  //     this.updateproduct.additionalOptionsList.push({
  //       "button_Name": currentData.button_Name,
  //       "type": currentData.type,
  //       "inputfield": "",
  //       "additionPrice": 0.0
  //     }

  //     )
  //   }

  //   CommonMethods.showconsole(this.Tag, "Selected Images :- " + JSON.stringify(this.updateproduct.additionalOptionsList))

  // }



  addInputfields(buttontype: string, content) {
    this.ngZone.run(() => {
      this.currentbuttonType = buttontype
      CommonMethods.showconsole(this.Tag, "previous button type " + this.previousButtonType)
      CommonMethods.showconsole(this.Tag, "length of array :- " + this.updateproduct.additionalOptionsList.length)
      if (this.updateproduct.additionalOptionsList.length != 0 && this.previousButtonType != buttontype) {

        CommonMethods.showconsole(this.Tag, "If Is working")
        //  if(buttontype == "ml")
        //  {
        this.dailogMessage = "Multiple quantity types are not allowed. By pressing continue your previously added quantity types will be removed."
        //  }
        //  else{

        //  }
        this.openModal(content)

      }
      else {
        CommonMethods.showconsole(this.Tag, "Else is working")
        if (buttontype == "ml") {
          this.updateproduct.additionalOptionsList.push(
            {
              "value": "",
              "price": 0.0,
              "unitType": "ML"
            })
          this.previousButtonType = buttontype
        } else {
          this.updateproduct.additionalOptionsList.push(
            {
              "value": "",
              "price": 0.0,
              "unitType": "MG"
            });
          this.previousButtonType = buttontype
        }
      }

      // CommonMethods.showconsole(this.Tag, "addInputfields position " + position)
      CommonMethods.showconsole(this.Tag, "addInputfields position " + buttontype)
      // let currentData = this.additionInformationbutton[position]
      // var index = 0;
      // var count = 0;
      // var isExists = false
      // this.addproduct.additionalOptionsList.forEach(element => {
      //   CommonMethods.showconsole(this.Tag, "")
      //   if (element.type == currentData.type) {
      //     index = count
      //     isExists = true
      //   }
      //   count++
      // })
      // if (isExists) {
      //   CommonMethods.showconsole(this.Tag, "ID IS EXIT ")
      //   CommonMethods.showconsole(this.Tag, "index:-  " + index)
      //   // currentData.inputfield=""

      //   this.addproduct.additionalOptionsList.splice(index + 1, 0, {
      //     "button_Name": currentData.button_Name,
      //     "type": currentData.type,
      //     "inputfield": "",
      //     "additionPrice": "0.0"
      //   })
      // } else {
      //   CommonMethods.showconsole(this.Tag, "ID IS NOT EXIT ")
      //   this.addproduct.additionalOptionsList.push({
      //     "button_Name": currentData.button_Name,
      //     "type": currentData.type,
      //     "inputfield": "",
      //     "additionPrice": "0.0"
      //   }

      //   )
      // }
    })


    CommonMethods.showconsole(this.Tag, "Selected  Images :- " + JSON.stringify(this.updateproduct.additionalOptionsList))

  }


  clearArray() {
    CommonMethods.showconsole(this.Tag, "Current Button Type:- " + this.currentbuttonType)
    if (this.currentbuttonType == "ml") {
      this.updateproduct.additionalOptionsList = []

      this.updateproduct.additionalOptionsList.push(
        {
          "value": "",
          "price": 0.0,
          "unitType": "ML"
        })
      this.previousButtonType = this.currentbuttonType
      this.modalReference.close();
    }
    else {
      this.updateproduct.additionalOptionsList = []
      this.updateproduct.additionalOptionsList.push(
        {
          "value": "",
          "price": 0.0,
          "unitType": "MG"
        });
      this.previousButtonType = this.currentbuttonType
      this.modalReference.close();
    }
  }



  openModal(content) {
    this.modalReference = this.modalService.open(content, { centered: true });
    //  this. modalReference.componentInstance.actionMessage = this.actionmessage;
  }
  JoinAndClose() {
    this.modalReference.close();
  }



  // Remove Addition Feature into List function

  removeColorInputfield(index: any) {
    this.updateproduct.additionalOptionsList.splice(index, 1)
  }

  // Add Product Info List
  addAdditionInfo() {

    this.updateproduct.additionInfolist.push({
      "type": "",
      "value": ""
    })
  }


  // Remove Product Info list item function

  removeProductInfo(index: any) {
    this.updateproduct.additionInfolist.splice(index, 1)
  }

  // on click of check box deliver show and shipping div enable and desable function
  productAvailability(checkvalvalue: any) {
    this.isdeliver_nowdiv = checkvalvalue
    this.updateproduct.deliver_charges = ""
    CommonMethods.showconsole(this.Tag, " click is working:- " + checkvalvalue)


    if (checkvalvalue == false) {
      for (var i = 0; i < this.updateproduct.productAvailabilityList.length; i++) {
        if (this.updateproduct.productAvailabilityList[i].type == "deliver_now") {
          this.updateproduct.productAvailabilityList[i].available = false
          this.updateproduct.productAvailabilityList[i].price = 0
        }
      }
    }
    CommonMethods.showconsole(this.Tag, "Product Available uunchecked:- " + JSON.stringify(this.updateproduct.productAvailabilityList))
  }
  productAvailabilityshipping(checkvalvalue: any) {
    this.isShipping = checkvalvalue
    this.updateproduct.shippingcharges = ""
    CommonMethods.showconsole(this.Tag, " click is working:- " + checkvalvalue)
    if (checkvalvalue == false) {
      for (var i = 0; i < this.updateproduct.productAvailabilityList.length; i++) {
        if (this.updateproduct.productAvailabilityList[i].type == "shipping") {
          this.updateproduct.productAvailabilityList[i].available = false
          this.updateproduct.productAvailabilityList[i].price = 0
        }
      }
    }
    CommonMethods.showconsole(this.Tag, "Product Available uunchecked:- " + JSON.stringify(this.updateproduct.productAvailabilityList))
  }
  productAvailabilityInstok(checkvalvalue: any) {
    // this.isShipping=checkvalvalue
    CommonMethods.showconsole(this.Tag, " click is working:- " + checkvalvalue)
    if (checkvalvalue == false) {
      for (var i = 0; i < this.updateproduct.productAvailabilityList.length; i++) {
        if (this.updateproduct.productAvailabilityList[i].type == "in_store") {
          this.updateproduct.productAvailabilityList[i].available = false
        }
      }
    }
    CommonMethods.showconsole(this.Tag, "Product Available uunchecked:- " + JSON.stringify(this.updateproduct.productAvailabilityList))
  }


  // onkeypress Function



  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
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
    // CommonMethods.showconsole(this.Tag,"Index pf uload image ")/ 
    if (this.updateproduct.selectedImagesValue[this.indexupload].uploadImage == false) {
      CommonMethods.uploadPhoto(MyConstants.FOLDER_PATH_FIREBASE_PRODUCT, this.updateproduct.selectedImagesValue[this.indexupload].filepath, this.storage, this)
      CommonMethods.showconsole(this.Tag, "If is working uloaded:-0 " + this.updateproduct.selectedImagesValue[this.indexupload].uploadImage)
    }
  }

  productAvailabityArray() {
    if (this.updateproduct.instock == true && this.updateproduct.deliver_now == true && this.updateproduct.shipping == true) {
      CommonMethods.showconsole(this.Tag, "Instock:- " + this.updateproduct.instock + " Now Deliver :- " + this.updateproduct.deliver_now + " Shipping:- " + this.updateproduct.shipping)
      this.updateproduct.productAvailabilityList = []
      this.updateproduct.productAvailabilityList.push({
        "type": "in_store",
        "available": true,
        "price": 0
      },
        {
          "type": "deliver_now",
          "available": true,
          "price": this.updateproduct.deliver_charges
        },
        {
          "type": "shipping",
          "available": true,
          "price": this.updateproduct.shippingcharges
        }
      )
    } else if (this.updateproduct.instock == true && this.updateproduct.deliver_now == false && this.updateproduct.shipping == false) {
      CommonMethods.showconsole(this.Tag, "Instock:- " + this.updateproduct.instock + " Now Deliver :- " + this.updateproduct.deliver_now + " Shipping:- " + this.updateproduct.shipping)
      this.updateproduct.productAvailabilityList = []
      this.updateproduct.productAvailabilityList.push({
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
    else if (this.updateproduct.instock == false && this.updateproduct.deliver_now == true && this.updateproduct.shipping == false) {
      CommonMethods.showconsole(this.Tag, "Instock:- " + this.updateproduct.instock + " Now Deliver :- " + this.updateproduct.deliver_now + " Shipping:- " + this.updateproduct.shipping)
      this.updateproduct.productAvailabilityList = []
      this.updateproduct.productAvailabilityList.push({
        "type": "in_store",
        "available": false,
        "price": 0
      },
        {
          "type": "deliver_now",
          "available": true,
          "price": this.updateproduct.deliver_charges
        },
        {
          "type": "shipping",
          "available": false,
          "price": 0
        }
      )
    }
    else if (this.updateproduct.instock == false && this.updateproduct.deliver_now == false && this.updateproduct.shipping == true) {
      CommonMethods.showconsole(this.Tag, "Instock:- " + this.updateproduct.instock + " Now Deliver :- " + this.updateproduct.deliver_now + " Shipping:- " + this.updateproduct.shipping)

      this.updateproduct.productAvailabilityList = []
      this.updateproduct.productAvailabilityList.push({
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
          "price": this.updateproduct.shippingcharges
        }
      )
    }
    else if (this.updateproduct.instock == true && this.updateproduct.deliver_now == true && this.updateproduct.shipping == false) {
      CommonMethods.showconsole(this.Tag, "Instock:- " + this.updateproduct.instock + " Now Deliver :- " + this.updateproduct.deliver_now + " Shipping:- " + this.updateproduct.shipping)

      this.updateproduct.productAvailabilityList = []
      this.updateproduct.productAvailabilityList.push({
        "type": "in_store",
        "available": true,
        "price": 0
      },
        {
          "type": "deliver_now",
          "available": true,
          "price": this.updateproduct.deliver_charges
        },
        {
          "type": "shipping",
          "available": false,
          "price": 0
        }
      )
    }
    else if (this.updateproduct.instock == true && this.updateproduct.deliver_now == false && this.updateproduct.shipping == true) {
      CommonMethods.showconsole(this.Tag, "Instock:- " + this.updateproduct.instock + " Now Deliver :- " + this.updateproduct.deliver_now + " Shipping:- " + this.updateproduct.shipping)

      this.updateproduct.productAvailabilityList = []
      this.updateproduct.productAvailabilityList.push({
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
          "price": this.updateproduct.shippingcharges
        }
      )
    }
    else if (this.updateproduct.instock == false && this.updateproduct.deliver_now == true && this.updateproduct.shipping == true) {
      CommonMethods.showconsole(this.Tag, "Instock:- " + this.updateproduct.instock + " Now Deliver :- " + this.updateproduct.deliver_now + " Shipping:- " + this.updateproduct.shipping)

      this.updateproduct.productAvailabilityList = []
      this.updateproduct.productAvailabilityList.push({
        "type": "in_store",
        "available": false,
        "price": 0
      },
        {
          "type": "deliver_now",
          "available": true,
          "price": this.updateproduct.deliver_charges
        },
        {
          "type": "shipping",
          "available": true,
          "price": this.updateproduct.shippingcharges
        }
      )
    }
  }


  // api call function

  updateProductApi() {
    if (this.validation()) {
      var previousFeaturetype = ""
      this.updateproduct.categoryId = []
      this.updateproduct.finalAdditionOptionArray = []
      CommonMethods.showconsole(this.Tag, "Category idsdfsdf:- " + this.categoryIds)
      for (var i = 0; i < this.categoryIds.length; i++) {

        this.updateproduct.categoryId.push(this.categoryIds[i])

      }


      // for (var i = 0; i < this.additionInformationbutton.length; i++) {

      //   for (var j = 0; j < this.updateproduct.additionalOptionsList.length; j++) {
      //     // CommonMethods.showconsole(this.Tag,"Show: "+this.additionInformationbutton[i].type)
      //     if (this.additionInformationbutton[i].type == this.updateproduct.additionalOptionsList[j].type) {
      //       CommonMethods.showconsole(this.Tag, "Matching Value :- " + this.updateproduct.additionalOptionsList[j].type)
      //       if (previousFeaturetype == this.updateproduct.additionalOptionsList[j].type) {
      //         CommonMethods.showconsole(this.Tag, "previous type Match")
      //         this.updateproduct.finalAdditionOptionArray[i].info.push({
      //           "value": this.updateproduct.additionalOptionsList[j].inputfield,
      //           "price": this.updateproduct.additionalOptionsList[j].additionPrice
      //         })
      //       }
      //       else {
      //         CommonMethods.showconsole(this.Tag, "previous type is not Match")
      //         this.updateproduct.finalAdditionOptionArray.push({
      //           "type": this.additionInformationbutton[i].type,
      //           "info": [{
      //             "value": this.updateproduct.additionalOptionsList[j].inputfield,
      //             "price": this.updateproduct.additionalOptionsList[j].additionPrice
      //           }]
      //         })
      //         previousFeaturetype = this.updateproduct.additionalOptionsList[j].type

      //       }
      //     }
      //   }
      // }
      // for (var j = 0; j < this.updateproduct.additionalOptionsList.length; j++) {
      //   this.updateproduct.finalAdditionOptionArray.push({
      //               "value": this.updateproduct.additionalOptionsList[j].value.trim()+this.updateproduct.additionalOptionsList[j].placeholder,
      //               "price": this.updateproduct.additionalOptionsList[j].price
      //             })
      // }


      this.productAvailabityArray()



      // CommonMethods.showconsole(this.Tag, "product available:- " + JSON.stringify(this.updateproduct.productAvailabilityList))

      // $pieces = explode(" ", this.categoryIds)



      if (this.isimageUloaded == true) {

        this.uploadservice.signIn().then(res => {
          this.spinner.show()
          this.uploadImage();

        }).catch(res => {
          CommonMethods.showconsole(this.Tag, "Working on error:- " + res)
        })

      }
      else {
        CommonMethods.showconsole(this.Tag, "Else Working ")


        // CommonMethods.showconsole(this.Tag, "If Works")
        CommonMethods.showconsole(this.Tag, "Product Image:- " + JSON.stringify(this.updateproduct.firebaseimageurl))
        CommonMethods.showconsole(this.Tag, " Product Name:- " + this.updateproduct.productName)
        CommonMethods.showconsole(this.Tag, "product barcode:- " + this.updateproduct.barcode)
        CommonMethods.showconsole(this.Tag, "Product Desicription:- " + this.updateproduct.description)
        CommonMethods.showconsole(this.Tag, "Product Price:- " + this.updateproduct.actualPrice)
        CommonMethods.showconsole(this.Tag, "Product Sale Price:- " + this.updateproduct.salePrice)
        // CommonMethods.showconsole(this.Tag, "Product Stock " + this.updateproduct.stock)
        CommonMethods.showconsole(this.Tag, "product category:- " + JSON.stringify(this.updateproduct.categoryId))
        CommonMethods.showconsole(this.Tag, "product color array:- " + JSON.stringify(this.updateproduct.additionalOptionsList))
        CommonMethods.showconsole(this.Tag, "product size array:- " + JSON.stringify(this.updateproduct.additionInfolist))
        CommonMethods.showconsole(this.Tag, "add product quantity array " + JSON.stringify(this.updateproduct.productAvailabilityList))
        CommonWebApiService.updateProduct(this.spinner, this.httpclient, this.cookiesservice, this.updateproduct, this,this.snackBar)

      }


    }
  }
  // on image upload function

  onUploadImageResponse(firebaseurl: string) {
    //  this.spinner.hide()
    CommonMethods.showconsole(this.Tag, 'FirebAse Url :- ' + firebaseurl);
    CommonMethods.showconsole(this.Tag, "Upload image array :- " + JSON.stringify(this.updateproduct.firebaseimageurl))
    this.updateproduct.firebaseimageurl.push(firebaseurl)
    this.updateproduct.selectedImagesValue[this.indexupload].uploadImage = true
    this.indexupload++

    if (this.updateproduct.selectedImagesValue.length == this.indexupload) {
      CommonMethods.showconsole(this.Tag, "If Works")
      this.isimageUloaded = false
      CommonMethods.showconsole(this.Tag, "Product Image:- " + JSON.stringify(this.updateproduct.firebaseimageurl))
      CommonMethods.showconsole(this.Tag, " Product Name:- " + this.updateproduct.productName)
      CommonMethods.showconsole(this.Tag, "product barcode:- " + this.updateproduct.barcode)
      CommonMethods.showconsole(this.Tag, "Product Desicription:- " + this.updateproduct.description)
      CommonMethods.showconsole(this.Tag, "Product Price:- " + this.updateproduct.actualPrice)
      CommonMethods.showconsole(this.Tag, "Product Sale Price:- " + this.updateproduct.salePrice)
      // CommonMethods.showconsole(this.Tag, "Product Stock " + this.updateproduct.stock)
      CommonMethods.showconsole(this.Tag, "product category:- " + JSON.stringify(this.updateproduct.categoryId))
      CommonMethods.showconsole(this.Tag, "product color array:- " + JSON.stringify(this.updateproduct.finalAdditionOptionArray))
      CommonMethods.showconsole(this.Tag, "product size array:- " + JSON.stringify(this.updateproduct.additionInfolist))
      CommonMethods.showconsole(this.Tag, "add product quantity array " + JSON.stringify(this.updateproduct.productAvailabilityList))
      CommonWebApiService.updateProduct(this.spinner, this.httpclient, this.cookiesservice, this.updateproduct, this,this.snackBar)

    }
    else {
      CommonMethods.showconsole(this.Tag, "Else Works")
      this.uploadImage();

    }

  }

  // on api call response function

  onResponseUpdateProduct(status: string, message: string) {

    switch (status) {
      case "1":

        this.snackBar.open(message, "", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['sucess-snackbar']
        });
        MyRoutingMethods.gotoviewProduct(this.router, this.accountType)
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
