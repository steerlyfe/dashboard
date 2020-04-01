import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, NgZone } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { CommonMethods } from 'src/app/utilpackages/common-methods';
import { TagInputModule } from 'ngx-chips';
import { MatSnackBar } from '@angular/material';
import { CommonWebApiService } from 'src/app/CommonMethods/CommonApis';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddTag, GetTagList, DeleteTagName, GetTagsListProduct, TagProductStatusUpdate } from 'src/app/CommonMethods/CommonInterface';
import { MyCookies } from 'src/app/utilpackages/my-cookies';
import { MyRoutingMethods } from 'src/app/utilpackages/my-routing-methods';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';

@Component({
  selector: 'app-tags-list',
  templateUrl: './tags-list.component.html',
  styleUrls: ['./tags-list.component.css']
})

export class TagsListComponent implements OnInit, AddTag, GetTagList, DeleteTagName,GetTagsListProduct,TagProductStatusUpdate {
  Tag = "TagsListComponent"
  modalReference: NgbModalRef
  displayedColumns: string[] = ['Tag_name', 'action'];
  dataSource: Array<any>
  active_product = false
  inactive_product = false
  getTagListArray: Array<any>
  tags: Array<any>
  deleteTagId: any
  selectedByTag: Array<any>
  tagProductList:Array<any>
  actionStatus:any
  accountType:any
  urlaccountType:any
  currentStatusIcon:any
  productId:any
  productStatucAction:any
  dailogMessage:string
  constructor(public tagservice: TagInputModule, public snackBar: MatSnackBar, public router: Router,
    public httpClient: HttpClient, public cookiesService: CookieService, public spinner: NgxSpinnerService, public modalService: NgbModal,
    public location:Location,public activatedRouter:ActivatedRoute,public ngZone:NgZone) {
    this.getTagListArray = []
    this.dataSource = []
    this.selectedByTag = []
    this.tagProductList=[]
    this.accountType=""
    this.deleteTagId = ""
    this.urlaccountType=""
    this.currentStatusIcon=""
    this.productId=""
    this.productStatucAction=""
    this.actionStatus="active"
    this.dailogMessage=""
    TagInputModule.withDefaults({
      tagInput: {
        placeholder: 'Add a new tag',
        // add here other default values for tag-input
      }
    });
    this.tags = []
    this.active_product = true
    this.checkLoginStatus()
  }

/**
 * 
 *
 * Check Login status
 *  
 */



checkLoginStatus() {

  if (MyCookies.checkLoginStatus(this.cookiesService)) {
    this.accountType = MyCookies.getAccountType(this.cookiesService)

    this.activatedRouter.params.subscribe( params =>{
      CommonMethods.showconsole(this.Tag,"Show account Type :- "+params['accountype'])
      this.urlaccountType=params['accountype']
     })
 if(this.accountType == this.urlaccountType )
 {
    CommonWebApiService.getTagsData(this.spinner, this.httpClient, this.cookiesService, this.snackBar, this)

 }else{
    CommonMethods.showconsole(this.Tag,"Else is working")
    this.location.back()
 }
    
    // CommonMethods.showconsole(this.Tag, "store id :- " + this.storeAccountId)
  }
  else {
    MyRoutingMethods.gotoLogin(this.router)
  }
}







  onResponseGetTagListInterface(status: any, getTagList: any) {
    switch (status) {
      case "1":
        // CommonMethods.showconsole(this.Tag, "array:- " + JSON.stringify(getTagList))
        // CommonMethods.showSuccessDialog(this.snackBar,message)
        // this.getTagListArray = getTagList
        this.dataSource=[]
         for(var i=0;i<getTagList.length;i++)
         {
          this.dataSource.push(
            {
              "tagId": getTagList[i]['tagId'],
              "tagName": getTagList[i]['tagName'],
              "state":false
            }
          )  
         }
       
         CommonMethods.showconsole(this.Tag, "array:- " + JSON.stringify(this.dataSource))
        //  CommonMethods.showconsole(this.Tag,"")
        break;
      case "10":
        CommonMethods.showErrorDialog(this.snackBar, "Session Time Out")
        MyCookies.deletecookies(this.cookiesService)
        MyRoutingMethods.gotoLogin(this.router)
        break;
      case "11":
        // CommonMethods.showErrorDialog(this.snackBar,message)

        break;
      case "0":
        // CommonMethods.showErrorDialog(this.snackBar,message)

        break;
      default:
        alert("Error Occured, Please try again");
        break;
    }

  }

  ngOnInit() {

  }


  showProduct(buttonName: string) {
    CommonMethods.showconsole(this.Tag, "Show Button Name:- " + buttonName)
    if (buttonName == "active_product") {
      this.active_product = true
      this.inactive_product = false
      this.actionStatus="active"
      this.searchByProduct()

    }
    else {
      this.active_product = false
      this.inactive_product = true
      this.actionStatus="inactive";
      this.searchByProduct()
    }
  }

  onItemAdded(evn) {
    CommonMethods.showconsole(this.Tag, "Value of evnet:- " + JSON.stringify(evn))
    this.tags.push(evn.value)
  }


  onRemoved(evnt) {

    const index = this.tags.indexOf(evnt.value);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
    CommonMethods.showconsole(this.Tag, "Array:- " + JSON.stringify(this.tags))
  }


  validation() {

    if (this.tags.length == 0) {
      CommonMethods.showErrorDialog(this.snackBar, "Enter The Tag")
      return false
    }
    else {
      return true
    }
  }



  addTags() {
    if (this.validation()) {
      CommonMethods.showconsole(this.Tag, "Add Tag Array:- " + JSON.stringify(this.tags))
      CommonWebApiService.AddTagsData(this.spinner, this.httpClient, this.cookiesService, this.snackBar, this, this.tags)

    }
  }
  onResponseAddTagInterface(status: any, message: any) {
    switch (status) {
      case "1":
        this.tags = []
        this.dataSource=[]
        CommonWebApiService.getTagsData(this.spinner, this.httpClient, this.cookiesService, this.snackBar, this)
        CommonMethods.showSuccessDialog(this.snackBar, message)
      
        break;
      case "10":
        CommonMethods.showErrorDialog(this.snackBar, "Session Time Out")
        MyCookies.deletecookies(this.cookiesService)
        MyRoutingMethods.gotoLogin(this.router)
        break;
      case "11":
        CommonMethods.showErrorDialog(this.snackBar, message)

        break;
      case "0":
        CommonMethods.showErrorDialog(this.snackBar, message)

        break;
      default:
        alert("Error Occured, Please try again");
        break;
    }
  }




  /**
      * 
      * Open Delete Modal Function 
      */
  openDeleteModal(deleteKeycontent) {
    this.modalReference = this.modalService.open(deleteKeycontent, { centered: true });
    //  this. modalReference.componentInstance.actionMessage = this.actionmessage;
  }

  /**
   * 
   * close Modal Function 
   */

  JoinAndClose() {
    this.modalReference.close();
  }

  /**
   * 
   *  Delete Key Function Call
   * 
   */
  deleteTagsKey(KeyId: any, deleteTagcontent) {
    CommonMethods.showconsole(this.Tag, "ID :- " + KeyId)
    this.deleteTagId = KeyId
    this.openDeleteModal(deleteTagcontent)
  }
  /**
   * 
   * call delete Api 
   */
  deleteApiCall(KeyId: any,) {
    // this.modalReference.close();
    this.deleteTagId = KeyId
    CommonWebApiService.deleteTagName(this.spinner, this.httpClient, this.cookiesService, this.snackBar, this,KeyId)
  
  }

  /**
  * 
  * handle Response delete Api call 
  */
  onResponseDeleteTagNameInterface(status: string, message: string) {
    switch (status) {
      case "1":
        this.spinner.hide();
        CommonMethods.showSuccessDialog(this.snackBar, message)
        CommonMethods.showconsole(this.Tag, "Show Array:- " + JSON.stringify(this.dataSource))
        for (var i = 0; i < this.dataSource.length; i++) {
          if (this.dataSource[i].tagId == this.deleteTagId) {
            this.dataSource.splice(i, 1);

          }
        }
        if(this.dataSource.length == 0){
          this.tagProductList=[]
          this.selectedByTag=[]
        }

        break;
      case "10":
        CommonMethods.showErrorDialog(this.snackBar, "Session Time Out")
        MyCookies.deletecookies(this.cookiesService)
        MyRoutingMethods.gotoLogin(this.router)
        break;

      default:
        alert('Error Occured, Please try again');
        break;
    }
  }

  clickOnRows(selectedValue: any,index:any) {
    var matchingvalue=false
     CommonMethods.showconsole(this.Tag,"INdex:- "+index)
    var divId="tagdiv_"+index;
    CommonMethods.showconsole(this.Tag,"div id :- "+divId)
     document.getElementById(divId).classList.add('activetag')
    CommonMethods.showconsole(this.Tag, "Working boolean:- " + matchingvalue)
    CommonMethods.showconsole(this.Tag, "Working:- " + selectedValue)
    // for(var i=0;i<this.dataSource.length;i++)
    // {
    //  if(this.dataSource[i]['tagName'] == selectedValue )
    //  {
    //   this.dataSource[i]['state']=true
    //  }
    // }
    

     if(this.selectedByTag.length == 0)
     {
      matchingvalue=true
        CommonMethods.showconsole(this.Tag,"If is working")
      this.selectedByTag.push(selectedValue)
     }else{
        CommonMethods.showconsole(this.Tag,"else is working")
      for(var i=0;i<this.selectedByTag.length;i++)
      {
       if(this.selectedByTag[i] == selectedValue )
       {

         CommonMethods.showconsole(this.Tag,"Not Match index :- "+i)
         matchingvalue=true
       }
      }
     }

     CommonMethods.showconsole(this.Tag,"Value of boolean:- "+matchingvalue)
     if(matchingvalue == false && this.selectedByTag.length != 0)
     {
    
      this.selectedByTag.push(selectedValue)
     }
     CommonMethods.showconsole(this.Tag,"Value of Array:- "+JSON.stringify(this.selectedByTag))
  }


  // slectedByid() {

  // }

  removeSelectedTag(removeSelectedValue:any) {
    
     CommonMethods.showconsole(this.Tag,"Selected Remove value:-"+removeSelectedValue)
    const index = this.selectedByTag.indexOf(removeSelectedValue);

    if (index >= 0) {
      this.selectedByTag.splice(index, 1);
    }

     if(this.selectedByTag.length == 0){
         CommonMethods.showconsole(this.Tag," Function is working or not ");
         this.tagProductList=[]
     }
  }


  searchByProduct(){

       CommonWebApiService.getTagProductList(this.spinner,this.httpClient,this.cookiesService,this.snackBar,this,this.selectedByTag,"0",this.actionStatus)
  }


  onResponseGetTagsListProductInterface(status:any,productList:Array<any>,pagePerNumber:any){
       
    switch (status) {
      case "1":
 
        
       
         CommonMethods.showconsole(this.Tag, "array:- " + JSON.stringify(productList))
         this.tagProductList=productList

        break;
      case "10":
        CommonMethods.showErrorDialog(this.snackBar, "Session Time Out")
        MyCookies.deletecookies(this.cookiesService)
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
 

  accountStatus(Userstatus: string, productId: string, content) {
    this.ngZone.run(() => {
      this.productId=productId
      this.productStatucAction=""
      CommonMethods.showconsole(this.Tag, "before api Status:- " + Userstatus)
      if (Userstatus == 'inactive') {
        this.productStatucAction = 'active'
        this.dailogMessage = "Do you want to activated this  product ?"
      } else {
        this.productStatucAction = 'inactive'
        this.dailogMessage = "Do you want to deactivated this product ?"
      }
      this.openModal(content)
    })
  }

  changeStarusApiCall() {
    CommonWebApiService.tagsProductListStatusUpdate(this.spinner,this.httpClient,this.cookiesService,this.snackBar,this,this.productId,this.productStatucAction)
  }
  onResponseGetTagProductStatusUpdateInterface(status: string, message: string) {
    switch (status) {
      case "1":

        this.modalReference.close();

        CommonMethods.showconsole(this.Tag, "Account id:- " +this.productId)
        for (var i = 0; i < this.tagProductList.length; i++) {
          CommonMethods.showconsole(this.Tag, "Accountid:- "+this.tagProductList[i].productId)
          if (this.tagProductList[i].productId == this.productId) {
            CommonMethods.showconsole(this.Tag, "Updated Status:- " + this.tagProductList[i]['currentStatus'])
            this.tagProductList[i]['currentStatus'] = this.productStatucAction
            break;
          }

        }
        this.searchByProduct()
        break;
      case "10":
        CommonMethods.showErrorDialog(this.snackBar, "Session Time Out")
        MyCookies.deletecookies(this.cookiesService)
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

}
