import { Component, OnInit, NgZone } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';
import { MyCookies } from 'src/app/utilpackages/my-cookies';
import { CommonMethods } from 'src/app/utilpackages/common-methods';
import { Image } from '@ks89/angular-modal-gallery';
import { MyConstants } from 'src/app/utilpackages/constant';
import { MyRoutingMethods } from 'src/app/utilpackages/my-routing-methods';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangePostStatus } from 'src/app/modelspackages/change-post-status';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GetPostList } from 'src/app/modelspackages/get-post-list';
import { CommonWebApiService } from 'src/app/CommonMethods/CommonApis';
import { GetPostData, PostStatus } from 'src/app/CommonMethods/CommonInterface';
import { MatSnackBar } from '@angular/material';
import { Location } from '@angular/common';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, GetPostData, PostStatus {
  Tag = "PostListComponent"
  postStatusModal: ChangePostStatus
  getPostMOdal: GetPostList
  postsList: Array<any>
  accountType: string
  modalReference: NgbModalRef
  imagearraylist: Array<Image>
  categoryList: Array<any>
  previousPosition: number
  currentStatusIcon: string
  dailogMessage: string
  isLoading = false
  listisloading = false
  substoreButton = false
  name = 'Angular 5';
  curScrollPos = 0;
  endReached = false;
  pageperLimit: number
  onscollLoading = false
  onscollLoadingapical = true
  urlaccountType = ""
  constructor(public spinner: NgxSpinnerService, public cookiesService: CookieService, public httpClient: HttpClient,
    public router: Router, public ngZone: NgZone, public modalService: NgbModal, public snackBar: MatSnackBar,
    public activatedrouter: ActivatedRoute, private location: Location) {
    this.postsList = []
    this.imagearraylist = []
    this.categoryList = []
    this.accountType = ""
    this.previousPosition = 0
    this.currentStatusIcon = "",
      this.dailogMessage = ""
    this.isLoading = false
    this.listisloading = false
    this.substoreButton = false
    this.accountType = MyCookies.getAccountType(this.cookiesService)
    this.pageperLimit = 0
    this.postStatusModal = new ChangePostStatus("", "", "")
    this.getPostMOdal = new GetPostList("", "", 0, "", "")
    this.onscollLoading = false
    this.onscollLoadingapical = true
    this.checkLoginStatus()
  }

  ngOnInit() {

  }




    /*
    
         Check Login Status  Function 
    
    */


  checkLoginStatus() {

    var loginstatus = MyCookies.checkLoginStatus(this.cookiesService)
    this.spinner.show()
    if (loginstatus) {


      this.activatedrouter.params.subscribe(params => {
        CommonMethods.showconsole(this.Tag, "Show account Type :- " + params['accountype'])
        this.urlaccountType = params['accountype']
      })
      if (this.accountType == this.urlaccountType) {


          /*
          
             Get Category Api Call 

          */

        this.httpClient.get(MyConstants.BASEURL + 'categoryList.php').subscribe(responseData => {
          let status = responseData['status']
          switch (status) {

            case '1':
              this.categoryList = responseData['categoriesList']
              setTimeout(() => {
                let buttonid = "catregory_" + this.previousPosition;
                CommonMethods.showconsole(this.Tag, "Button id :- " + buttonid);
                document.getElementById(buttonid).classList.add("active")
              }, 450);
              this.isLoading=true
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
            this.spinner.hide()
            CommonMethods.showconsole(this.Tag, 'Finish');
            setTimeout(() => {
              let buttonid = "catregory_" + this.previousPosition;
              CommonMethods.showconsole(this.Tag, "Button id :- " + buttonid);
              document.getElementById(buttonid).classList.add("active")
            }, 1000);



          }
        )





        this.getPostMOdal.categoryId = "1"
        if (this.accountType == "admin" || this.accountType == "manager") {
          this.activatedrouter.params.subscribe(params => {
            this.getPostMOdal.subStoreAccountId = params['SubStoreAccountId']
          })
          this.getPostMOdal.StoreAccountId = MyCookies.getStoreAccountId(this.cookiesService)
          if (this.getPostMOdal.subStoreAccountId == undefined) {
            this.getPostMOdal.type = "store"
          }
          else {
            this.substoreButton = true
            this.getPostMOdal.type = "sub_store"
          }
          // 
        } else if (this.accountType == "employee") {
          this.getPostMOdal.StoreAccountId = MyCookies.getStoreAccountId(this.cookiesService)
          this.getPostMOdal.subStoreAccountId = ""
          this.getPostMOdal.type = "store"
        }
        else if (this.accountType == "sub_admin" || this.accountType == "sub_manager" || this.accountType == "sub_employee") {
          this.getPostMOdal.StoreAccountId = MyCookies.getStoreAccountId(this.cookiesService)
          this.getPostMOdal.subStoreAccountId = MyCookies.getSubStoreAccountId(this.cookiesService)
          this.getPostMOdal.type = "sub_store"
        }
        else {
          this.activatedrouter.params.subscribe(params => {
            this.getPostMOdal.StoreAccountId = params['StoreAccountId']
            this.getPostMOdal.subStoreAccountId = ""
            CommonMethods.showconsole(this.Tag, "Show:- " + this.getPostMOdal.StoreAccountId)
          })
          if (this.getPostMOdal.StoreAccountId == undefined) {
            this.activatedrouter.params.subscribe(params => {
              this.getPostMOdal.StoreAccountId = this.cookiesService.get('store_account_id')
              this.getPostMOdal.subStoreAccountId = params['SubStoreAccountId']
              CommonMethods.showconsole(this.Tag, "Show:- " + this.getPostMOdal.StoreAccountId)
            })
            this.getPostMOdal.type = "sub_store"
          }
          else {
            this.getPostMOdal.type = "store"
          }
        }

        CommonWebApiService.getPost(this.spinner, this.httpClient, this.cookiesService, this.getPostMOdal, this, this.snackBar)

      } else {
        CommonMethods.showconsole(this.Tag, "Else is working")
        this.location.back()
      }


     


    }
    else {
      MyRoutingMethods.gotoLogin(this.router)
    }
  }

  ngAfterViewInit() {

  }



  /*
  
      Get Post List According Category Id  Function
  
  */

  showCategoryAccodingList(position: number, categoryId: any) {
    CommonMethods.showconsole(this.Tag, "category id :- " + categoryId)
    if (this.previousPosition != position) {
      this.postsList = []
      this.listisloading = false
      this.getPostMOdal.count = 0
      let previousbuttonid = "catregory_" + this.previousPosition
      let currentbuttonid = "catregory_" + position
      document.getElementById(previousbuttonid).classList.remove("active")
      document.getElementById(currentbuttonid).classList.add("active")

      this.getPostMOdal.categoryId = categoryId
      CommonWebApiService.getPost(this.spinner, this.httpClient, this.cookiesService, this.getPostMOdal, this, this.snackBar)
      this.previousPosition = position
    }


  }


  /*
  
       Change Color Function 
  
  */

  getColor(status) {
    //  CommonMethods.showconsole(this.Tag,"status :- "+status)
    switch (status) {
      case 'inactive':
        this.currentStatusIcon = "Inactive"
        return 'red';
      case 'active':
        this.currentStatusIcon = "Active"
        return 'green';
    }
  }


    /*

         Update Status Function  

    */


  changePostStatusFunction(Userstatus: string, userAccountId: string, content) {
    CommonMethods.showconsole(this.Tag, "USer status:- " + Userstatus)
    CommonMethods.showconsole(this.Tag, "USer accounid :- " + userAccountId)
    this.ngZone.run(() => {
      this.postStatusModal.postAccountPublicId = userAccountId
      CommonMethods.showconsole(this.Tag, "before api Status:- " + Userstatus)
      if (Userstatus == 'inactive') {
        this.postStatusModal.changeStatus = 'active'
        // CommonMethods.showconsole(this.Tag, "Active List type :- " + this.activeListtype)
        // if (this.activeListtype == "Brand") {
        this.dailogMessage = "Do you want to activated this post ?"
        // }
        // else {

        // }

      } else {
        this.postStatusModal.changeStatus = 'inactive'
        this.dailogMessage = "Do you want to deactivated this post ?";

      }
      this.openModal(content)
    })
  }



  /*

    Open Model Method 
  
  */

  openModal(content) {
    this.modalReference = this.modalService.open(content, { centered: true })
  }

  /*

     close Model Method 
  
  */


  JoinAndClose() {
    this.modalReference.close()
  }



  /*

  

  */

  onResponseGetPostData(status: string, getPostList: Array<any>, itemperpage: any) {
    switch (status) {
      case "1":
        this.pageperLimit = itemperpage
        CommonMethods.showconsole(this.Tag, "Show page per limit :- " + this.pageperLimit)
        for (var i = 0; i < getPostList.length; i++) {
          var imagearray = getPostList[i]['postImages']
          CommonMethods.showconsole(this.Tag, "Array:-  " + getPostList[i]['postImages'].length)
          this.imagearraylist = []
          for (var j = 0; j < imagearray.length; j++) {
            CommonMethods.showconsole(this.Tag, "Array Length:- " + imagearray[j])

            this.imagearraylist.push(new Image(
              i,
              {
                img: imagearray[j],
              }
            ))


          }
          var timeZone = getPostList[i]["createdTime"] * 1000
          this.postsList.push(
            {
              "postPublicId": getPostList[i]["postPublicId"],
              "image": this.imagearraylist,
              "caption": getPostList[i]["title"],
              'view': getPostList[i]["views"],
              "userImage": getPostList[i]["storeLogo"],
              "posTime": timeZone,
              "username": getPostList[i]["storeName"],
              "status": getPostList[i]["currentStatus"]

            })
        }
        // this.isloading = true

        // setTimeout(() => {
          this.listisloading = true
        // }, 3000);
        CommonMethods.showconsole(this.Tag, "Length Of list Is :- " +JSON.stringify(this.postsList))
        CommonMethods.showconsole(this.Tag, "pageperlimt:- " + this.getPostMOdal.count)
        if (this.postsList.length < this.getPostMOdal.count) {
          CommonMethods.showconsole(this.Tag, "onscollLoadingapical  working")
          this.onscollLoadingapical = false
        }

        // CommonMethods.showconsole(this.Tag, "Finasl Array:- " + JSON.stringify(this.postsList))

        // this.isLoading = true;
        // this.productLists = allProductsList;
        //  CommonMethods.showconsole(this.Tag,"Array:- "+JSON.stringify(this.productLists))


        // this.pageLimit = pagenumberLimit;
        // if (this.count !== 0) {
        //   this.showpreviousButton = true
        // }
        // else {
        //   this.showpreviousButton = false
        // }
        // if (this.productLists.length < this.pageLimit) {
        //   this.shownextButton = false
        // }
        // else {
        //   this.shownextButton = true;
        // }

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

  callChangeStatusApi() {
    CommonWebApiService.updateStatusPost(this.spinner, this.httpClient, this.cookiesService, this.postStatusModal, this, this.snackBar)
  }

  onResponseGetPostStatus(status: string, message: string) {
    switch (status) {
      case "1":
        this.modalReference.close();
        CommonMethods.showconsole(this.Tag, "Account id:- " + this.postStatusModal.postAccountPublicId)
        for (var i = 0; i < this.postsList.length; i++) {
          CommonMethods.showconsole(this.Tag, "Accountid:- " + this.postsList[i].postPublicId)
          if (this.postsList[i].postPublicId == this.postStatusModal.postAccountPublicId) {
            CommonMethods.showconsole(this.Tag, "Updated Status:- " + this.postsList[i]['status'])
            this.postsList[i]['status'] = this.postStatusModal.changeStatus
            break;
          }
        }
        CommonMethods.showSuccessDialog(this.snackBar, message)
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




  updateScrollPos(e) {
    // console.log(e);
    this.curScrollPos = e.pos;
    this.endReached = e.endReached;
    if (this.accountType == "admin" || this.accountType == "manager") {
      this.activatedrouter.params.subscribe(params => {
        this.getPostMOdal.subStoreAccountId = params['SubStoreAccountId']
      })
      this.getPostMOdal.StoreAccountId = MyCookies.getStoreAccountId(this.cookiesService)
      if (this.getPostMOdal.subStoreAccountId == undefined) {
        this.getPostMOdal.type = "store"
      }
      else {
        this.substoreButton = true
        this.getPostMOdal.type = "sub_store"
      }
      // 
    } else if (this.accountType == "employee") {
      this.getPostMOdal.StoreAccountId = MyCookies.getStoreAccountId(this.cookiesService)
      this.getPostMOdal.subStoreAccountId = ""
      this.getPostMOdal.type = "store"
    }
    else if (this.accountType == "sub_admin" || this.accountType == "sub_manager" || this.accountType == "sub_employee") {
      this.getPostMOdal.StoreAccountId = MyCookies.getStoreAccountId(this.cookiesService)
      this.getPostMOdal.subStoreAccountId = MyCookies.getSubStoreAccountId(this.cookiesService)
      this.getPostMOdal.type = "sub_store"
    }
    else {
      this.activatedrouter.params.subscribe(params => {
        this.getPostMOdal.StoreAccountId = params['StoreAccountId']
        this.getPostMOdal.subStoreAccountId = ""
        CommonMethods.showconsole(this.Tag, "Show:- " + this.getPostMOdal.StoreAccountId)
      })
      if (this.getPostMOdal.StoreAccountId == undefined) {
        this.activatedrouter.params.subscribe(params => {
          this.getPostMOdal.StoreAccountId = this.cookiesService.get('store_account_id')
          this.getPostMOdal.subStoreAccountId = params['SubStoreAccountId']
          CommonMethods.showconsole(this.Tag, "Show:- " + this.getPostMOdal.StoreAccountId)
        })
        this.getPostMOdal.type = "sub_store"
      }
      else {
        this.getPostMOdal.type = "store"
      }
    }
    if (e.endReached == true) {

      // setTimeout(() => {
      CommonMethods.showconsole(this.Tag, "Show console onscollLoadingapical value:- " + this.onscollLoadingapical)
      if (this.onscollLoadingapical == true) {
        this.onscollLoading = true
        CommonMethods.showconsole(this.Tag, "Count on end scroll before:- " + this.getPostMOdal.count)
        this.getPostMOdal.count = this.getPostMOdal.count + this.pageperLimit
        CommonMethods.showconsole(this.Tag, "Count on end scroll:after- " + this.getPostMOdal.count)
        CommonWebApiService.getPost(this.spinner, this.httpClient, this.cookiesService, this.getPostMOdal, this, this.snackBar)
        this.onscollLoading = false
      }

      // }, 3000);


    }

  }



}
