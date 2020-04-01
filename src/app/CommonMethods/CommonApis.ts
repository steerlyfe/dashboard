import { HttpClient, HttpParams } from '@angular/common/http';
import { LoginDetail } from '../modelspackages/login-details';
import { MyConstants } from '../utilpackages/constant';
import { CommonMethods } from '../utilpackages/common-methods';
import { NgxSpinnerService } from 'ngx-spinner';
import { MyRoutingMethods } from '../utilpackages/my-routing-methods';
import { Router } from '@angular/router';
import { MyCookies } from '../utilpackages/my-cookies';
import { CookieService } from 'ngx-cookie-service';
import { CookiesModal, StoreDetailsModal, SubStoreDetailsModal } from '../modelspackages/cookies-modal';
import { AddStoreMadal } from '../modelspackages/add-strore';
import {
   AddStore, AllStoreList, AddAccount, ViewAccount, ViewSubStore,
   AddSubStore, AddProduct, ViewProduct, UpdateProduct, GetProductDetails, ChangeStatus,
   Login, StoreStatus, ProductStatus, AddPost, GetPostData, PostStatus, AddStockInterface,
   GetOrderList, GetOrderDetails, GetOrderCount, GetBrandProduct, GetCartProductById, webOrderPlaced, GetBrandOrders, GetStoreOrderDetails, GetStoreOrderCount, GetStoreOrders, ChangeAppOrderStatus, GetEditPostData, UpdatePost, GetWooCommerceKey, DeleteWooCommerceKey, AddWooCommerceKey, AddProductFromWeb,
   CheckBeforeAddProductFromWeb, GetWooCommerceKeyDetailById, GetTagList, AddTag, DeleteTagName, GetTagsListProduct, TagProductStatusUpdate, GetCouponList, GetCouponProductList, AddCoupon, GetCouponDetails, ChangeCouponStatus, CouponForApplyList, CountCheckWithOrderId
} from './CommonInterface';
import { AddAccountModal } from '../modelspackages/add-accounts';
import { AddSubStoreModel } from '../modelspackages/add-sub-store';
import { AddProductModel } from '../modelspackages/add-product';
import { EditProductModel } from '../modelspackages/edit-product';
import { ProductDetails } from '../modelspackages/product-details';
import { ChangeAccountStatus } from '../modelspackages/change-account-status';
import { ChangeStoreStatus } from '../modelspackages/change-store-status';
import { ChangeProductStatus } from '../modelspackages/change-product-status';
import { CreatePost } from '../modelspackages/create-post';
import { GetPostList } from '../modelspackages/get-post-list';
import { ChangePostStatus } from '../modelspackages/change-post-status';
import { MatSnackBar } from '@angular/material';
import { OrderPlacedModal } from '../modelspackages/order-placed';
import { MobileAppOrderStatusUpdate } from '../modelspackages/mobile-order-status-update';
import { UpdateBrandOrdersStatus } from '../modelspackages/update_brand_order_status';
import { UpadtePost } from '../modelspackages/update-post';
import { AddECommerceKey } from '../modelspackages/add-ecommerce-key';
import { AddCouponModal } from '../modelspackages/add-coupon';


export class CommonWebApiService {

   static login(httpClient: HttpClient, loginmodal: LoginDetail, spinner: NgxSpinnerService, router: Router, cookiesservice: CookieService,
      logininterface: Login, snackBar: MatSnackBar) {

      var Tag = "CommonWebApiService Login"
      spinner.show();
      const params = new HttpParams()
         .set("email", loginmodal.email.trim())
         .set("password", loginmodal.password.trim())
         .set("api_token", "web#123OP*7L")
         .set("called_from", "web")
         .set("fcm_token", "")
      httpClient.post(MyConstants.BASEURL + "login.php", params)
         .subscribe((responseData) => {
            var status = responseData['status']
            CommonMethods.showconsole(Tag, "Status: " + status)
            switch (status) {
               case '1':
                  logininterface.onLoginResponse(responseData['status'], "")
                  var userdata = responseData['userDetail']
                  CommonMethods.showconsole(Tag, "Accout Type:= " + userdata['accountType'])
                  MyCookies.saveLoginDataInCookies(cookiesservice,
                     new CookiesModal(userdata['userId'], userdata['accountId'], userdata['fullName'], userdata['email'],
                        userdata['authToken'], userdata['sessionToken'], userdata['accountType']));

                  if (userdata['accountType'] == "admin" || userdata['accountType'] == "manager" ||
                     userdata['accountType'] == "employee") {
                     CommonMethods.showconsole(Tag, "If Works : " + userdata['accountType'])

                     MyCookies.saveLoginStoreDataInCookies(cookiesservice,
                        new StoreDetailsModal(responseData['storeDetail']['storeId'],
                           responseData['storeDetail']['storeAccountId'],
                           responseData['storeDetail']['storeName'],
                           responseData['storeDetail']['imageUrl'],
                           responseData['storeDetail']['storeType']))
                     MyRoutingMethods.gotoDashboard(router, userdata['accountType'])
                  } else if (userdata['accountType'] == "sub_admin" ||
                     userdata['accountType'] == "sub_manager"
                     || userdata['accountType'] == "sub_employee") {
                     CommonMethods.showconsole(Tag, "Else If 2 : " + userdata['accountType'])


                     MyCookies.saveLoginStoreDataInCookies(cookiesservice,
                        new StoreDetailsModal(responseData['storeDetail']['storeId'],
                           responseData['storeDetail']['storeAccountId'],
                           responseData['storeDetail']['storeName'],
                           responseData['storeDetail']['imageUrl'],
                           responseData['storeDetail']['storeType']))
                     MyCookies.saveLoginSub_StoreDataInCookies(cookiesservice,
                        new SubStoreDetailsModal(responseData['storeDetail']['subStoreDetail']['subStoreId'],
                           responseData['storeDetail']['subStoreDetail']['subStoreAccountId']))
                     MyRoutingMethods.gotoDashboard(router, userdata['accountType'])

                  }
                  else {
                     CommonMethods.showconsole(Tag, "Super Admin")
                     MyRoutingMethods.gotoDashboard(router, userdata['accountType'])
                  }



                  break;
               case '0':
                  spinner.hide();
                  logininterface.onLoginResponse(responseData['status'], responseData['message'])
                  break;
               case '2':
                  CommonMethods.showconsole(Tag, "Status 2:- " + responseData['errorData'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, 'Response Error :- ' + response)

            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })
   }


   static addStore(spinner: NgxSpinnerService, cookiesService: CookieService, imageurl: string, storemodal: AddStoreMadal
      , httpClient: HttpClient, addStoreInterface: AddStore, snackBar: MatSnackBar) {
      var Tag = "addstore Api"
      spinner.show();
      CommonMethods.showconsole(Tag, "StoreName Type:- " + storemodal.type)
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("storeName", storemodal.storeName.trim())
         .set("imageUrl", imageurl)
         .set("type", storemodal.type.trim())
      httpClient.post(MyConstants.BASEURL + "addStore.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status before switch :- " + status)
            switch (status) {
               case "1":
                  addStoreInterface.onResponseAddStore("1", responseData['message'])
                  break;
               case "0":
                  addStoreInterface.onResponseAddStore("0", responseData['message'])
                  break;
               case "10":
                  addStoreInterface.onResponseAddStore("10", "")
                  break;
               case "11":
                  addStoreInterface.onResponseAddStore("11", responseData['message'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 Error :- " + responseData['errorData'])
                  break;
               default:

                  alert("Error Occured, Please try again");
                  break;

            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, " " + response)

            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            });

   }
   static getAllStoreList(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      allstoreInterface: AllStoreList, snackBar: MatSnackBar) {
      spinner.show()
      var Tag = "getAllStoreList"
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
      httpClient.post(MyConstants.BASEURL + "storeList.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, 'Status:- ' + status)
            switch (status) {
               case "1":

                  allstoreInterface.onResponseAllStoreList("1", responseData['storeList'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 Error :- " + responseData['errorData'])
                  break;
               case "10":
                  allstoreInterface.onResponseAllStoreList("10", [])
                  break;
               case "0":
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  // allstoreInterface.onResponseAllStoreList("10", [])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            }
         )

   }


   static addAccounts(spinner: NgxSpinnerService, httpClient: HttpClient,
      cookiesService: CookieService, addaccountsmodal: AddAccountModal, addAccountinterface: AddAccount, snackBar: MatSnackBar) {
      var Tag = "addAccounts"
      spinner.show();
      CommonMethods.showconsole(Tag, "addaccountsmodal.sub_store_account_id :- " + addaccountsmodal.sub_store_account_id)
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("storeAccountId", addaccountsmodal.storeAccountId.trim())
         .set("name", addaccountsmodal.accountName.trim())
         .set("email", addaccountsmodal.email.trim())
         .set("password", addaccountsmodal.password.trim())
         .set("called_from", "web")
         .set("type", addaccountsmodal.accountType.trim())
         .set("subStoreAccountId", addaccountsmodal.sub_store_account_id.trim())
      httpClient.post(MyConstants.BASEURL + "addAccount.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status Before switch:- " + status)
            switch (status) {
               case "1":
                  addAccountinterface.onResponseAddAccount("1", responseData['message'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 Error :- " + responseData['errorData'])
                  break;
               case "10":
                  addAccountinterface.onResponseAddAccount("10", "")
                  break;
               case "0":
                  addAccountinterface.onResponseAddAccount("0", responseData['message'])
                  break;
               case "11":
                  addAccountinterface.onResponseAddAccount("11", responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }

   static viewaccounts(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      storeId: string, listType: string, viewaccountinterface: ViewAccount, snackBar: MatSnackBar) {
      var Tag = "viewaccounts"
      spinner.show();
      CommonMethods.showconsole(Tag, "storeId:- " + storeId)
      CommonMethods.showconsole(Tag, "listType:- " + listType)
      const params = new HttpParams()

         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("accountId", storeId)
         .set("type", listType)
      httpClient.post(MyConstants.BASEURL + "accountsList.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "status:- " + status)
            switch (status) {
               case "1":
                  viewaccountinterface.onResponseViewAccount("1", responseData['accountsList'])
                  break;
               case "0":
                  CommonMethods.showconsole(Tag, "Status 0 Error :- " + responseData['message'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 Error :- " + responseData['errorData'])
                  break;
               case "10":
                  viewaccountinterface.onResponseViewAccount("10", [])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }

   static addSubStore(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      addsubstoreintercae: AddSubStore, addsubStoreModel: AddSubStoreModel, firbaseimageurl: string, snackBar: MatSnackBar) {
      var Tag = "addSubStore"
      spinner.show();
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("storeAccountId", addsubStoreModel.storeId)
         .set("description", addsubStoreModel.description.trim())
         .set("address", addsubStoreModel.address.trim())
         .set("lat", addsubStoreModel.lat)
         .set("lng", addsubStoreModel.lng)
         .set("phoneNumber", addsubStoreModel.phoneNumber.trim())
         .set("email", addsubStoreModel.email.trim())
         .set("openingTime", CommonMethods.get24hTime(addsubStoreModel.openingTime))
         .set("closingTime", CommonMethods.get24hTime(addsubStoreModel.closingTime))
         .set("bannerUrl", firbaseimageurl)
      httpClient.post(MyConstants.BASEURL + "addSubStore.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            switch (status) {
               case "1":
                  addsubstoreintercae.onResponseAddSubStore("1", responseData['message'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 Error :- " + responseData['errorData'])
                  break;
               case "10":
                  addsubstoreintercae.onResponseAddSubStore("10", "")
                  break;
               case "0":
                  // CommonMethods.showErrorDialog(snackBar,responseData['message'])
                  addsubstoreintercae.onResponseAddSubStore("0", responseData['message'])
                  break;
               case "11":
                  addsubstoreintercae.onResponseAddSubStore("11", responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static viewSubStore(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      viewSubStoreinterface: ViewSubStore, storeId: string, snackBar: MatSnackBar) {
      spinner.show();
      var Tag = "viewSubStore"
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("storeAccountId", storeId)
      httpClient.post(MyConstants.BASEURL + "subStoreList.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "status; " + status)
            switch (status) {
               case "1":
                  viewSubStoreinterface.onResponseViewSubStore("1", responseData['storeList'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 Error :- " + responseData['errorData'])

                  break;
               case "10":
                  viewSubStoreinterface.onResponseViewSubStore("10", [])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static addProduct(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      addproductmodel: AddProductModel, addproductinterface: AddProduct, snackBar: MatSnackBar) {
      var Tag = "addProduct"
      spinner.show();
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("storeAccountId", MyCookies.getStoreAccountId(cookiesService))
         .set("subStoreAccountId", addproductmodel.substoreAccounId)
         .set("imageUrls", JSON.stringify(addproductmodel.firebaseimageurl))
         .set("productName", addproductmodel.productName.trim())
         .set("barcode", addproductmodel.barcode)
         .set("productDesc", addproductmodel.description)
         .set("actualPrice", addproductmodel.actualPrice)
         .set("salePrice", addproductmodel.salePrice)
         .set("categories", JSON.stringify(addproductmodel.categoryId))
         .set("additionalFeatures", JSON.stringify(addproductmodel.additionalOptionsList))
         .set("productInfo", JSON.stringify(addproductmodel.additionInfolist))
         .set("productAvailability", JSON.stringify(addproductmodel.productAvailabilityList))

      httpClient.post(MyConstants.BASEURL + "addProduct.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  addproductinterface.onResponseAddproduct("1", responseData['message'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 Error :- " + responseData['errorData'])
                  break;
               case "10":
                  addproductinterface.onResponseAddproduct("10", "")
                  break;
               case "0":
                  // CommonMethods.showErrorDialog(snackBar,responseData['message'])
                  addproductinterface.onResponseAddproduct("0", responseData['message'])
                  break;
               case "11":
                  addproductinterface.onResponseAddproduct("11", responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static viewProducts(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      viewproductsinterface: ViewProduct, count: any, storeAccountId: string, snackBar: MatSnackBar) {
      spinner.show();
      var Tag = "viewProducts";
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("storeAccountId", storeAccountId)
         .set("count", count)
      httpClient.post(MyConstants.BASEURL + "productList.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            switch (status) {
               case "1":
                  viewproductsinterface.onResponseViewProduct("1", responseData['productList'], responseData['perPageItems'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 Error :- " + responseData['errorData'])
                  break;
               case "10":
                  viewproductsinterface.onResponseViewProduct("10", [], "")
                  break;
               case "0":
                  spinner.hide();
                  CommonMethods.showSuccessDialog(snackBar, responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }

   static updateProduct(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      EditProductModel: EditProductModel, updateproductinterface: UpdateProduct, snackBar: MatSnackBar) {
      var Tag = "updateProduct"
      spinner.show();
      CommonMethods.showconsole(Tag, "PRODUCT IDD :- " + EditProductModel.productPublicId)
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("productPublicId", EditProductModel.productPublicId)
         .set("imageUrls", JSON.stringify(EditProductModel.firebaseimageurl))
         .set("productName", EditProductModel.productName.trim())
         .set("barcode", EditProductModel.barcode.trim())
         .set("productDesc", EditProductModel.description)
         .set("actualPrice", EditProductModel.actualPrice)
         .set("salePrice", EditProductModel.salePrice)
         .set("categories", JSON.stringify(EditProductModel.categoryId))
         .set("additionalFeatures", JSON.stringify(EditProductModel.additionalOptionsList))
         .set("productInfo", JSON.stringify(EditProductModel.additionInfolist))
         .set("productAvailability", JSON.stringify(EditProductModel.productAvailabilityList))
      httpClient.post(MyConstants.BASEURL + "updateProductDetail.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  updateproductinterface.onResponseUpdateProduct("1", responseData['message'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 Error :- " + responseData['errorData'])
                  break;
               case "10":
                  updateproductinterface.onResponseUpdateProduct("10", "")
                  break;
               case "0":
                  // CommonMethods.showErrorDialog(snackBar,responseData['message'])
                  updateproductinterface.onResponseUpdateProduct("0", responseData['message'])
                  break;
               case "11":
                  updateproductinterface.onResponseUpdateProduct("11", responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }


   static getProductDetails(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      getproductDetails: GetProductDetails, productDetailsmodal: ProductDetails, snackBar: MatSnackBar) {
      spinner.show();
      var Tag = "getProductDetails";
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("productPublicId", productDetailsmodal.productId)
      httpClient.post(MyConstants.BASEURL + "productDetail.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            switch (status) {
               case "1":

                  CommonMethods.showconsole(Tag, "IMAGES : " + responseData['productDetail']['productImages'])
                  getproductDetails.onResponseGetProductDetails("1", responseData['productDetail'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 Error :- " + responseData['errorData'])
                  break;
               case "10":
                  getproductDetails.onResponseGetProductDetails("10", [])
                  break;
               case "0":
                  spinner.hide();
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static changeAccountStatus(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      statusModal: ChangeAccountStatus, statusInterfcae: ChangeStatus, snackBar: MatSnackBar) {
      spinner.show()
      var Tag = "changeAccountStatus"
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("accountPublicId", statusModal.accountPublicId)
         .set("type", statusModal.type)
         .set("status", statusModal.changeStatus)
      httpClient.post(MyConstants.BASEURL + "changeAccountStatus.php", params)
         .subscribe((responseData) => {

            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Api Status:- " + status)
            switch (status) {
               case "1":
                  statusInterfcae.onResponseChangeAccountStatus("1", responseData['message'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 Error :- " + responseData['errorData'])
                  break;
               case "10":
                  statusInterfcae.onResponseChangeAccountStatus("10", "")
                  break;
               case "0":
                  spinner.hide()
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static changeStoreStatus(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      statusModal: ChangeStoreStatus, statusInterfcae: StoreStatus, snackBar: MatSnackBar) {
      var Tag = "changeStoreStatus"
      spinner.show();
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("accountPublicId", statusModal.accountPublicId)
         .set("type", statusModal.type)
         .set("status", statusModal.changeStatus)
      httpClient.post(MyConstants.BASEURL + "changeStoreStatus.php", params)
         .subscribe((responseData) => {

            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Api Status:- " + status)
            switch (status) {
               case "1":
                  statusInterfcae.onResponseStoreStatus("1", responseData['message'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 Error :- " + responseData['errorData'])
                  break;
               case "10":
                  statusInterfcae.onResponseStoreStatus("10", "")
                  break;
               case "0":
                  spinner.hide()
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  CommonMethods.showconsole(Tag, "Status 0 Error :- " + responseData['errorData'])
                  break
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static changeProductStatus(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      statusModal: ChangeProductStatus, statusInterfcae: ProductStatus) {
      var Tag = "changeStoreStatus"
      spinner.show();
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("productPublicId", statusModal.productPublicId)
         .set("status", statusModal.changeStatus.trim())
      httpClient.post(MyConstants.BASEURL + "changeProductStatus.php", params)
         .subscribe((responseData) => {

            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Api Status:- " + status)
            switch (status) {
               case "1":
                  statusInterfcae.onResponseProductStatus("1", responseData['message'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 Error :- " + responseData['errorData'])
                  break;
               case "10":
                  statusInterfcae.onResponseProductStatus("10", "")
                  break;
               case "0":
                  // CommonMethods.showErrorDialog(snack)
                  // CommonMethods.showErrorDialog(,responseData['message'])
                  CommonMethods.showconsole(Tag, "Status 0 Error :- " + responseData['errorData'])
                  break
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static createPost(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      addPostModal: CreatePost, addpostInterface: AddPost, snackBar: MatSnackBar) {
      var Tag = "createPost"
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("storeAccountId", MyCookies.getStoreAccountId(cookiesService))
         .set("subStoreAccountId", addPostModal.subStoreAccountId)
         .set("title", addPostModal.content)
         .set("image_urls", JSON.stringify(addPostModal.firebaseUploadImage))
         .set("categories", JSON.stringify(addPostModal.categoryId))
      httpClient.post(MyConstants.BASEURL + "addPost.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  addpostInterface.onResponseAddPost("1", responseData['message'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 Error :- " + responseData['errorData'])
                  break;
               case "10":
                  addpostInterface.onResponseAddPost("10", "")
                  break;
               case "0":
                  spinner.hide()
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  // addpostInterface.onResponseAddPost("0", responseData['message'])
                  break;
               case "11":
                  addpostInterface.onResponseAddPost("11", responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);

            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static getPost(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      getpostMOdal: GetPostList, getPostINterface: GetPostData, snackBar: MatSnackBar) {
      var Tag = "getAllStoreList"
      CommonMethods.showconsole(Tag, "Category Id :- " + getpostMOdal.categoryId)
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("storeAccountId", getpostMOdal.StoreAccountId)
         .set("subStoreAccountId", getpostMOdal.subStoreAccountId)
         .set("categoryId", getpostMOdal.categoryId)
         .set("type", getpostMOdal.type)
         .set("count", "" + getpostMOdal.count)
      httpClient.post(MyConstants.BASEURL + "getPosts.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            switch (status) {
               case "1":
                  getPostINterface.onResponseGetPostData("1", responseData['postList'], responseData['perPageItems'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 Error :- " + responseData['errorData'])
                  break;
               case "10":
                  getPostINterface.onResponseGetPostData("10", [], "")
                  break;
               case "0":
                  spinner.hide()
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }

   static updateStatusPost(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      postStatusModal: ChangePostStatus, PostStatusInterface: PostStatus, snackBar: MatSnackBar) {
      var Tag = "updateStatusPost"
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("postPublicId", postStatusModal.postAccountPublicId)
         .set("status", postStatusModal.changeStatus)
      httpClient.post(MyConstants.BASEURL + "changePostStatus.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            switch (status) {
               case "1":
                  PostStatusInterface.onResponseGetPostStatus("1", responseData['message'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2:- " + responseData['errorData'])
                  break;
               case "10":
                  PostStatusInterface.onResponseGetPostStatus("2", "")
                  break;
               case "0":
                  spinner.hide()
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static addStockApi(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      productAccountId: string, stockJson: Array<any>, addStockInterface: AddStockInterface, snackBar: MatSnackBar) {
      var Tag = "addStockApi"
      spinner.show();
      CommonMethods.showconsole(Tag, "Product Public id :- " + productAccountId)
      CommonMethods.showconsole(Tag, "array :- " + JSON.stringify(stockJson))
      CommonMethods.showconsole(Tag, "Auth:- " + MyCookies.getAuthorization(cookiesService))
      CommonMethods.showconsole(Tag, "userId:- " + MyCookies.getUserId(cookiesService))
      CommonMethods.showconsole(Tag, "sessionToken:- " + MyCookies.getSessionTime(cookiesService))
      CommonMethods.showconsole(Tag, "accountType:- " + MyCookies.getAccountType(cookiesService))
      CommonMethods.showconsole(Tag, "subStoreAccountId:- " + MyCookies.getSubStoreAccountId(cookiesService))
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("subStoreAccountId", MyCookies.getSubStoreAccountId(cookiesService))
         .set("productPublicId", productAccountId)
         .set("stockData", "" + JSON.stringify(stockJson))
      httpClient.post(MyConstants.BASEURL + "addProductStock.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            switch (status) {
               case "1":
                  addStockInterface.onResponseGetAddStockInterface("1", responseData['message'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 error:- " + responseData['errorMessage'])
                  break;
               case "10":
                  addStockInterface.onResponseGetAddStockInterface("10", "")
                  break;
               case "0":
                  spinner.hide()
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static getOrdersList(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService, snackBar: MatSnackBar,
      getOrderInterface: GetOrderList, count: number, subStoreAccountId: string, orderstatus: string) {
      var Tag = "getOrdersList"
      spinner.show();
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("subStoreAccountId", subStoreAccountId)
         .set("orderStatus", orderstatus)
         .set("count", JSON.stringify(count))
      httpClient.post(MyConstants.BASEURL + "storeOrders.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            switch (status) {
               case "1":

                  getOrderInterface.onResponseGetOrderListInterface("1", responseData['productList'], responseData['perPageItems'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Error status 2:- " + responseData['errorData'])
                  break;
               case "10":
                  getOrderInterface.onResponseGetOrderListInterface("10", [], "")
                  break;
               case "0":
                  spinner.hide()
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static getOrderDetails(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService, snackBar: MatSnackBar,
      orderAccountId: string, orderDetailsInterface: GetOrderDetails) {
      var Tag = "getOrderDetails"
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("storeOrderPublicId", orderAccountId)
      httpClient.post(MyConstants.BASEURL + "storeOrderDetail.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            switch (status) {
               case "1":
                  orderDetailsInterface.onResponseGetOrderDetailsterface("1", responseData['orderDetail'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status Error 2:- " + responseData["errorMeeage"])
                  break;
               case "10":
                  orderDetailsInterface.onResponseGetOrderDetailsterface("10", "")
                  break;
               case "0":
                  spinner.hide()
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  CommonMethods.showconsole(Tag, "0 status Message :- " + responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static getOrderTotalCount(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService, snackBar: MatSnackBar, subStoreAccountId: string,
      getOrderCoutINterface: GetOrderCount) {
      var Tag = "getOrderTotalCount"
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("subStoreAccountId", subStoreAccountId)
      httpClient.post(MyConstants.BASEURL + "storeOrderCount.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            switch (status) {
               case "1":
                  getOrderCoutINterface.onResponseGetOrderCountInterface("1", responseData['allOrdersCount'], responseData['completedOrdersCount'],
                     responseData['cancelledOrdersCount'], responseData['pendingOrdersCount'])
                  break;
               case "2":

                  CommonMethods.showconsole(Tag, "Status 2 Error:- " + responseData['errorMessage'])
                  break;
               case "10":
                  getOrderCoutINterface.onResponseGetOrderCountInterface("10", "", "", "", "")
                  break;
               case "0":
                  spinner.hide()
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static changeOrderStatus(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService, snackBar: MatSnackBar) {
      var Tag = "getAllStoreList"
      const params = new HttpParams()
         .set("Auth", cookiesService.get('Auth'))
         .set("userId", cookiesService.get('storeSuperAdminId'))
         .set("sessionToken", cookiesService.get('session'))
         .set("accountType", cookiesService.get('accountType'))
         .set("accountPublicId", cookiesService.get('accountType'))
         .set("type", cookiesService.get('accountType'))
      httpClient.post(MyConstants.BASEURL + "storeList.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            switch (status) {
               case "1":
                  break;
               case "2":
                  break;
               case "10":
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static getBrandProduct(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService, snackBar: MatSnackBar, categoryId: any, count: any,
      brandProductList: GetBrandProduct) {
      var Tag = "getBrandProduct"
      // spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("categoryId", categoryId)
         .set("count", count)
      httpClient.post(MyConstants.BASEURL + "brandProductList.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            switch (status) {
               case "1":
                  brandProductList.onResponseGetBrandProductInterface("1", responseData['productList'], responseData['actualSizeOfPagination'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 Error :- " + responseData['errorMessage'])
                  break;
               case "10":
                  brandProductList.onResponseGetBrandProductInterface("10", [], "")
                  break;
               case "0":
                  spinner.hide()
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static getCartList(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService, snackBar: MatSnackBar, productList: any,
      cartProductInterFace: GetCartProductById) {
      var Tag = "getCartList"
      spinner.show();
       CommonMethods.showconsole(Tag,"Product List :- "+JSON.stringify(productList))
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("product_list", productList)
      httpClient.post(MyConstants.BASEURL + "productsById.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status: " + status)
            switch (status) {
               case "1":
                  cartProductInterFace.onResponseGetCartProductByIdInterface("1", responseData['productList'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Error 2 status:- " + responseData["errorData"])
                  break;
               case "10":
                  cartProductInterFace.onResponseGetCartProductByIdInterface("10", [])
                  break;
               case "0":
                  spinner.hide()
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static orderPlacedApi(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService, snackBar: MatSnackBar,
      orderPLacedModal: OrderPlacedModal, webOrderPlacedApi: webOrderPlaced) {
      var Tag = "orderPlacedApi"
      spinner.show();
       CommonMethods.showconsole(Tag,"Grand Total:- "+orderPLacedModal.total_amount)
       CommonMethods.showconsole(Tag,"couponUsedl:- "+orderPLacedModal.couponUsed)
       CommonMethods.showconsole(Tag,"couponId:- "+orderPLacedModal.couponId)
       CommonMethods.showconsole(Tag,"couponDiscountl:- "+orderPLacedModal.couponDiscount)
       CommonMethods.showconsole(Tag,"couponCount:- "+orderPLacedModal.couponCount)
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("store_id", MyCookies.getStoreId(cookiesService))
         .set("total_amount", orderPLacedModal.total_amount)
         .set("payment_info", JSON.stringify(orderPLacedModal.payment_info))
         .set("order_info", JSON.stringify(orderPLacedModal.order_info))
         .set("sub_store_id", orderPLacedModal.substoreId)
         .set("couponUsed", orderPLacedModal.substoreId)
         .set("couponCount", orderPLacedModal.substoreId)
         .set("couponId", orderPLacedModal.substoreId)
         .set("couponDiscount", orderPLacedModal.substoreId)
      httpClient.post(MyConstants.BASEURL + "webPlaceOrder.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            switch (status) {
               case "1":
                  webOrderPlacedApi.onResponsewebOrderPlacedInterface("1", responseData['message'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 error Data:- " + responseData['errorData'])
                  break;
               case "10":
                  webOrderPlacedApi.onResponsewebOrderPlacedInterface("10", responseData['message'])
                  break;
               case "0":
                  spinner.hide()
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }


   static getStoreBrandOrder(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService, snackBar: MatSnackBar, count: any,
      getOrderInterface: GetStoreOrders, orderStatus: any) {
      var Tag = "getStoreBrandOrder"
      // spinner.show()
      const params = new HttpParams()

         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("store_id", MyCookies.getStoreId(cookiesService))
         .set("order_status", orderStatus)
         .set("count", count)
      // all/pending/completed/cancelled
      httpClient.post(MyConstants.BASEURL + "getStoreOrderToBrandList.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  CommonMethods.showconsole(Tag, "order List:- " + responseData['orderList'])
                  getOrderInterface.onResponseGetStoreOrdersInterface("1", responseData['orderList'], responseData['perPageItems'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 error Meaage :- " + responseData['errorData'])
                  break;
               case "10":
                  getOrderInterface.onResponseGetStoreOrdersInterface("10", [], "")
                  break;
               case "0":
                  spinner.hide()
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }

   static getBrandOrder(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService, snackBar: MatSnackBar, count: any,
      getOrderInterface: GetBrandOrders, orderStatus: any) {
      var Tag = "getBrandOrder"
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("brand_id", MyCookies.getStoreId(cookiesService))
         .set("order_status", orderStatus)
         .set("count", count)
      // all/pending/completed/cancelled
      httpClient.post(MyConstants.BASEURL + "getBrandOrderList.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  CommonMethods.showconsole(Tag, "order List:- " + responseData['orderList'])
                  getOrderInterface.onResponseGetBrandOrdersInterface("1", responseData['orderList'], responseData['perPageItems'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 error Meaage :- " + responseData['errorData'])
                  break;
               case "10":
                  getOrderInterface.onResponseGetBrandOrdersInterface("10", [], "")
                  break;
               case "0":
                  spinner.hide()
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static getStoreOrderDetails(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService, snackBar: MatSnackBar,
      getOrderDetailsInterface: GetStoreOrderDetails, orderAccountId: any) {
      var Tag = "getBrandOrder"
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("web_order_public_id", orderAccountId)
         .set("type", MyCookies.getStoreType(cookiesService))

      httpClient.post(MyConstants.BASEURL + "storeWebOrderDetail.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status: " + status)
            switch (status) {
               case "1":
                  getOrderDetailsInterface.onResponseGetStoreOrderDetailsInterface("1", responseData['orderDetail'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 error Meaage :- " + responseData['errorMessage'])
                  break;
               case "10":
                  getOrderDetailsInterface.onResponseGetStoreOrderDetailsInterface("10", "")
                  break;
               case "0":
                  spinner.hide()
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try  ");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }


   // GetStoreOrderCount
   static getBrandOrderCounts(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService, snackBar: MatSnackBar, getStoreOrderCoutInterface: GetStoreOrderCount) {
      var Tag = "getBrandOrderCounts"
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("store_id", MyCookies.getStoreId(cookiesService))
         // .set("store_type", MyCookies.getStoreType(cookiesService))
         .set("store_type", MyCookies.getStoreType(cookiesService))
      httpClient.post(MyConstants.BASEURL + "storeOrderToBrandCount.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  getStoreOrderCoutInterface.onResponseGetStoreOrderCountInterface("1", responseData['allOrdersCount'], responseData['completedOrdersCount'],
                     responseData['cancelledOrdersCount'], responseData['pendingOrdersCount'])
                  break;
               case "2":

                  CommonMethods.showconsole(Tag, "Status 2 Error:- " + responseData['errorData'])
                  break;
               case "10":
                  getStoreOrderCoutInterface.onResponseGetStoreOrderCountInterface("10", "", "", "", "")
                  break;
               case "0":
                  spinner.hide()
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  // getStoreOrderCoutInterface.onResponseGetStoreOrderCountInterface("0", "", "", "", "")
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static statusUpdateOrdersAppMobile(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      snackBar: MatSnackBar, updateOrderStatusInterface: ChangeAppOrderStatus, updateStatusMOdal: MobileAppOrderStatusUpdate) {
      var Tag = "getBrandOrderCounts"
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("order_public_id", updateStatusMOdal.order_public_id)
         // .set("store_type", MyCookies.getStoreType(cookiesService))
         .set("product_id", updateStatusMOdal.product_id)
         .set("product_availability", updateStatusMOdal.product_availability)
         .set("additional_feature", updateStatusMOdal.additional_feature)
         .set("status_to_update", updateStatusMOdal.status_to_update)
      httpClient.post(MyConstants.BASEURL + "updateOrderStatus.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  updateOrderStatusInterface.onResponseChangeAppOrderStatusInterface("1", responseData['message'])
                  break;
               case "2":

                  CommonMethods.showconsole(Tag, "Status 2 Error:- " + responseData['errorData'])
                  break;
               case "10":
                  updateOrderStatusInterface.onResponseChangeAppOrderStatusInterface("10", responseData['message'])
                  break;
               case "0":
                  spinner.hide()
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  // updateOrderStatusInterface.onResponseChangeAppOrderStatusInterface("0", responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static statusUpdateOrdersBrand(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      snackBar: MatSnackBar, updateOrderStatusInterface: ChangeAppOrderStatus, updateStatusMOdal: UpdateBrandOrdersStatus) {
      var Tag = "getBrandOrderCounts"
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("web_order_public_id", updateStatusMOdal.web_order_public_id)
         .set("product_id", updateStatusMOdal.product_id)
         .set("additional_feature", updateStatusMOdal.additional_feature)
         .set("status_to_update", updateStatusMOdal.status_to_update)
      httpClient.post(MyConstants.BASEURL + "updateBrandOrderStatus.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  updateOrderStatusInterface.onResponseChangeAppOrderStatusInterface("1", responseData['message'])
                  break;
               case "2":

                  CommonMethods.showconsole(Tag, "Status 2 Error:- " + responseData['errorData'])
                  break;
               case "10":
                  updateOrderStatusInterface.onResponseChangeAppOrderStatusInterface("10", responseData['message'])
                  break;
               case "0":
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  // updateOrderStatusInterface.onResponseChangeAppOrderStatusInterface("0", responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }



   static getPostParticularPPostData(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      snackBar: MatSnackBar, getEditPOstData: GetEditPostData, postPublicId: any) {
      var Tag = "getBrandOrderCounts"
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("post_public_id", postPublicId)
      httpClient.post(MyConstants.BASEURL + "getPostDetail.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  getEditPOstData.onResponsegetEditPostDataInterface("1", responseData['postDetail'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 Error:- " + responseData['errorData'])
                  break;
               case "10":
                  getEditPOstData.onResponsegetEditPostDataInterface("10", "")
                  break;
               case "0":
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  // getEditPOstData.onResponsegetEditPostDataInterface("0", 0)
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static updatePostApi(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      snackBar: MatSnackBar, updatPostInterface: UpdatePost, updatePostMOdal: UpadtePost) {
      var Tag = "updatePostApi"
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("post_id", updatePostMOdal.post_id)
         .set("image_urls", JSON.stringify(updatePostMOdal.firebaseImage))
         .set("title", updatePostMOdal.content)
         .set("categories", JSON.stringify((updatePostMOdal.categories)))
      httpClient.post(MyConstants.BASEURL + "updatePost.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  updatPostInterface.onResponseUpdatePostInterface("1", responseData['message'])
                  break;
               case "2":

                  CommonMethods.showconsole(Tag, "Status 2 Error:- " + responseData['errorData'])
                  break;
               case "10":
                  updatPostInterface.onResponseUpdatePostInterface("10", "")
                  break;
               case "0":
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  // updatPostInterface.onResponseUpdatePostInterface("0", 0)
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static getWooCommerceKey(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      snackBar: MatSnackBar, getWoocommerceKeyInterface: GetWooCommerceKey) {
      var Tag = "getWooCommerceKey"
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("store_id", MyCookies.getStoreId(cookiesService))

      httpClient.post(MyConstants.BASEURL + "getEcommerceKeys.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  getWoocommerceKeyInterface.onResponseGetWooCommerceKeyInterface("1", responseData['wooCommerce'], responseData['bigCommerce'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 Error:- " + responseData['errorData'])
                  break;
               case "10":
                  getWoocommerceKeyInterface.onResponseGetWooCommerceKeyInterface("10", "", "")
                  break;
               case "0":
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  CommonMethods.showconsole(Tag, "Status 0 Error:- " + responseData['message'])
                  // getWoocommerceKeyInterface.onResponseGetWooCommerceKeyInterface("0", "")

                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again or refresh the page ")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static getWooCommerceByPublicKey(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      snackBar: MatSnackBar, getWoocommerceKeyInterface: GetWooCommerceKeyDetailById, keyPublicId: string) {
      var Tag = "getWooCommerceByPublicKey"
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("public_id", keyPublicId)

      httpClient.post(MyConstants.BASEURL + "getEcommerceKeyByPublic.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  getWoocommerceKeyInterface.onResponseGetWooCommerceKeyDetailByIdInterface("1", responseData['keysDetail'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 Error:- " + responseData['errorData'])
                  break;
               case "10":
                  getWoocommerceKeyInterface.onResponseGetWooCommerceKeyDetailByIdInterface("10", "")
                  break;
               case "0":
                  spinner.hide()
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  // CommonMethods.showconsole(Tag, "Status 0 Error:- " + responseData['message'])
                  // getWoocommerceKeyInterface.onResponseGetWooCommerceKeyInterface("0", "")

                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again or refresh the page ")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               // spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static deleteWooCommerceKey(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      snackBar: MatSnackBar, delteWoocommerceKeyInterface: DeleteWooCommerceKey, keyID: any) {
      var Tag = "deleteWooCommerceKey"
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("id", keyID)

      httpClient.post(MyConstants.BASEURL + "deleteEcommerceKeys.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  delteWoocommerceKeyInterface.onResponseDeleteWooCommerceKeyInterface("1", responseData['message'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 Error:- " + responseData['errorData'])
                  break;
               case "10":
                  delteWoocommerceKeyInterface.onResponseDeleteWooCommerceKeyInterface("10", "")
                  break;
               case "0":
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  // CommonMethods.showconsole(Tag, "Status 0 Error:- " + responseData['message'])
                  // delteWoocommerceKeyInterface.onResponseDeleteWooCommerceKeyInterface("0", responseData['message'])

                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again or refresh the page ")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static addWoCommerceKey(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      snackBar: MatSnackBar, addWooCommerceKeyInterface: AddWooCommerceKey, addECommerceKeyMOdal: AddECommerceKey) {
      var Tag = "addWoCommerceKey"
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("consumer_key", addECommerceKeyMOdal.consumer_key)
         .set("consumer_secret", addECommerceKeyMOdal.consumer_secret)
         .set("domain", addECommerceKeyMOdal.domain)
         .set("store_id", MyCookies.getStoreId(cookiesService))
         .set("type", addECommerceKeyMOdal.type)
         .set("access_token", addECommerceKeyMOdal.access_token)
      httpClient.post(MyConstants.BASEURL + "addEcommmerceKeys.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  addWooCommerceKeyInterface.onResponseUpdatePostInterface("1", responseData['message'])
                  break;
               case "2":

                  CommonMethods.showconsole(Tag, "Status 2 Error:- " + responseData['errorData'])
                  break;
               case "10":
                  addWooCommerceKeyInterface.onResponseUpdatePostInterface("10", responseData['message'])
                  break;
               case "0":
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  // addWooCommerceKeyInterface.onResponseUpdatePostInterface("0", responseData['message'])
                  break;
               case "3":

                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  // addWooCommerceKeyInterface.onResponseUpdatePostInterface("0", responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static updateWoCommerceKey(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      snackBar: MatSnackBar, addWooCommerceKeyInterface: AddWooCommerceKey, addECommerceKeyMOdal: AddECommerceKey, keyPublicid: string) {
      var Tag = "updateWoCommerceKey"
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("consumer_key", addECommerceKeyMOdal.consumer_key)
         .set("consumer_secret", addECommerceKeyMOdal.consumer_secret)
         .set("domain", addECommerceKeyMOdal.domain)
         .set("public_id", keyPublicid)
         .set("type", addECommerceKeyMOdal.type)
         .set("access_token", addECommerceKeyMOdal.access_token)
      httpClient.post(MyConstants.BASEURL + "updateEcommmerceKeys.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  addWooCommerceKeyInterface.onResponseUpdatePostInterface("1", responseData['message'])
                  break;
               case "2":

                  CommonMethods.showconsole(Tag, "Status 2 Error:- " + responseData['errorData'])
                  break;
               case "10":
                  addWooCommerceKeyInterface.onResponseUpdatePostInterface("10", responseData['message'])
                  break;
               case "0":
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  // addWooCommerceKeyInterface.onResponseUpdatePostInterface("0", responseData['message'])
                  break;
               case "3":
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  // addWooCommerceKeyInterface.onResponseUpdatePostInterface("0", responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static checkAddBeforeWooCommerceProduct(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      snackBar: MatSnackBar, CheckaddWooCommerceProductInterface: CheckBeforeAddProductFromWeb, productListIds: Array<any>) {
      var Tag = "checkAddBeforeWooCommerceProduct"
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("store_id", MyCookies.getStoreId(cookiesService))
         .set("product_list", JSON.stringify(productListIds))

      httpClient.post(MyConstants.BASEURL + "checkWoocommerceProducts.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  CheckaddWooCommerceProductInterface.onResponseCheckBeforeAddProductFromWebInterface("1", responseData['productList'])
                  break;
               case "2":

                  CommonMethods.showconsole(Tag, "Status 2 Error:- " + responseData['errorData'])
                  break;
               case "10":
                  CheckaddWooCommerceProductInterface.onResponseCheckBeforeAddProductFromWebInterface("10", "")
                  break;
               case "0":
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  // addWooCommerceKeyInterface.onResponseUpdatePostInterface("0", responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static addWooCommerceProduct(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      snackBar: MatSnackBar, addWooCommerceProductInterface: AddProductFromWeb, productList: Array<any>) {
      var Tag = "addWooCommerceProduct"
      CommonMethods.showconsole(Tag, "Before Array:- " + JSON.stringify(productList))
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("store_id", MyCookies.getStoreId(cookiesService))
         .set("product_list", JSON.stringify(productList))

      httpClient.post(MyConstants.BASEURL + "addProductsFromWooCommerece.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  addWooCommerceProductInterface.onResponseAddProductFromWebInterface("1", responseData['message'])
                  break;
               case "2":

                  CommonMethods.showconsole(Tag, "Status 2 Error:- " + responseData['errorData'])
                  break;
               case "10":
                  addWooCommerceProductInterface.onResponseAddProductFromWebInterface("10", responseData['message'])
                  break;
               case "0":
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  // addWooCommerceKeyInterface.onResponseUpdatePostInterface("0", responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static addProductsFromBigCommerce(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      snackBar: MatSnackBar, addWooCommerceProductInterface: AddProductFromWeb, productList: Array<any>, client_key: any, client_auth: any, web_domain: any) {
      var Tag = "addProductsFromBigCommerce"
      CommonMethods.showconsole(Tag, "Before Array:- " + JSON.stringify(productList))
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("store_id", MyCookies.getStoreId(cookiesService))
         .set("x_auth_client", client_key)
         .set("x_auth_token", client_auth)
         .set("domain", web_domain)
         .set("product_list", JSON.stringify(productList))

      httpClient.post(MyConstants.BASEURL + "addProductsFromBigCommerce.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  addWooCommerceProductInterface.onResponseAddProductFromWebInterface("1", responseData['message'])
                  break;
               case "2":

                  CommonMethods.showconsole(Tag, "Status 2 Error:- " + responseData['errorData'])
                  break;
               case "10":
                  addWooCommerceProductInterface.onResponseAddProductFromWebInterface("10", responseData['message'])
                  break;
               case "0":
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  // addWooCommerceKeyInterface.onResponseUpdatePostInterface("0", responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static getParticularSubStoreDetails(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      snackBar: MatSnackBar, addWooCommerceProductInterface: AddProductFromWeb, productList: Array<any>, client_key: any, client_auth: any, web_domain: any) {
      var Tag = "addProductsFromBigCommerce"
      CommonMethods.showconsole(Tag, "Before Array:- " + JSON.stringify(productList))
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("store_id", MyCookies.getStoreId(cookiesService))
         .set("x_auth_client", client_key)
         .set("x_auth_token", client_auth)
         .set("domain", web_domain)
         .set("product_list", JSON.stringify(productList))

      httpClient.post(MyConstants.BASEURL + "addProductsFromBigCommerce.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  addWooCommerceProductInterface.onResponseAddProductFromWebInterface("1", responseData['message'])
                  break;
               case "2":

                  CommonMethods.showconsole(Tag, "Status 2 Error:- " + responseData['errorData'])
                  break;
               case "10":
                  addWooCommerceProductInterface.onResponseAddProductFromWebInterface("10", responseData['message'])
                  break;
               case "0":
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  // addWooCommerceKeyInterface.onResponseUpdatePostInterface("0", responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static updateSubStoreDetails(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      snackBar: MatSnackBar, addWooCommerceProductInterface: AddProductFromWeb, productList: Array<any>, client_key: any, client_auth: any, web_domain: any) {
      var Tag = "addProductsFromBigCommerce"
      CommonMethods.showconsole(Tag, "Before Array:- " + JSON.stringify(productList))
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("store_id", MyCookies.getStoreId(cookiesService))
         .set("x_auth_client", client_key)
         .set("x_auth_token", client_auth)
         .set("domain", web_domain)
         .set("product_list", JSON.stringify(productList))

      httpClient.post(MyConstants.BASEURL + "addProductsFromBigCommerce.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  addWooCommerceProductInterface.onResponseAddProductFromWebInterface("1", responseData['message'])
                  break;
               case "2":

                  CommonMethods.showconsole(Tag, "Status 2 Error:- " + responseData['errorData'])
                  break;
               case "10":
                  addWooCommerceProductInterface.onResponseAddProductFromWebInterface("10", responseData['message'])
                  break;
               case "0":
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  // addWooCommerceKeyInterface.onResponseUpdatePostInterface("0", responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static getParticularAccountDetails(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      snackBar: MatSnackBar, addWooCommerceProductInterface: AddProductFromWeb, productList: Array<any>, client_key: any, client_auth: any, web_domain: any) {
      var Tag = "addProductsFromBigCommerce"
      CommonMethods.showconsole(Tag, "Before Array:- " + JSON.stringify(productList))
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("store_id", MyCookies.getStoreId(cookiesService))
         .set("x_auth_client", client_key)
         .set("x_auth_token", client_auth)
         .set("domain", web_domain)
         .set("product_list", JSON.stringify(productList))

      httpClient.post(MyConstants.BASEURL + "addProductsFromBigCommerce.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  addWooCommerceProductInterface.onResponseAddProductFromWebInterface("1", responseData['message'])
                  break;
               case "2":

                  CommonMethods.showconsole(Tag, "Status 2 Error:- " + responseData['errorData'])
                  break;
               case "10":
                  addWooCommerceProductInterface.onResponseAddProductFromWebInterface("10", responseData['message'])
                  break;
               case "0":
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  // addWooCommerceKeyInterface.onResponseUpdatePostInterface("0", responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static updateAccountDetails(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      snackBar: MatSnackBar, addWooCommerceProductInterface: AddProductFromWeb, productList: Array<any>, client_key: any, client_auth: any, web_domain: any) {
      var Tag = "addProductsFromBigCommerce"
      CommonMethods.showconsole(Tag, "Before Array:- " + JSON.stringify(productList))
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("store_id", MyCookies.getStoreId(cookiesService))
         .set("x_auth_client", client_key)
         .set("x_auth_token", client_auth)
         .set("domain", web_domain)
         .set("product_list", JSON.stringify(productList))

      httpClient.post(MyConstants.BASEURL + "addProductsFromBigCommerce.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  addWooCommerceProductInterface.onResponseAddProductFromWebInterface("1", responseData['message'])
                  break;
               case "2":

                  CommonMethods.showconsole(Tag, "Status 2 Error:- " + responseData['errorData'])
                  break;
               case "10":
                  addWooCommerceProductInterface.onResponseAddProductFromWebInterface("10", responseData['message'])
                  break;
               case "0":
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  // addWooCommerceKeyInterface.onResponseUpdatePostInterface("0", responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static UpdateProfileAccount(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      snackBar: MatSnackBar, addWooCommerceProductInterface: AddProductFromWeb, productList: Array<any>, client_key: any, client_auth: any, web_domain: any) {
      var Tag = "addProductsFromBigCommerce"
      CommonMethods.showconsole(Tag, "Before Array:- " + JSON.stringify(productList))
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("store_id", MyCookies.getStoreId(cookiesService))
         .set("x_auth_client", client_key)
         .set("x_auth_token", client_auth)
         .set("domain", web_domain)
         .set("product_list", JSON.stringify(productList))

      httpClient.post(MyConstants.BASEURL + "addProductsFromBigCommerce.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  addWooCommerceProductInterface.onResponseAddProductFromWebInterface("1", responseData['message'])
                  break;
               case "2":

                  CommonMethods.showconsole(Tag, "Status 2 Error:- " + responseData['errorData'])
                  break;
               case "10":
                  addWooCommerceProductInterface.onResponseAddProductFromWebInterface("10", responseData['message'])
                  break;
               case "0":
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  // addWooCommerceKeyInterface.onResponseUpdatePostInterface("0", responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static getTagsData(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      snackBar: MatSnackBar, getTagsListInterface: GetTagList) {
      var Tag = "getTagsData"
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
      httpClient.post(MyConstants.BASEURL + "getTags.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  getTagsListInterface.onResponseGetTagListInterface("1", responseData['tagList'])
                  break;
               case "2":

                  CommonMethods.showconsole(Tag, "Status 2 Error:- " + responseData['errorData'])
                  break;
               case "10":
                  getTagsListInterface.onResponseGetTagListInterface("10", responseData['message'])
                  break;
               case "0":
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  // addWooCommerceKeyInterface.onResponseUpdatePostInterface("0", responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static AddTagsData(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      snackBar: MatSnackBar, addTagInterface: AddTag, TagArray: Array<any>) {
      var Tag = "AddTagsData"
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("tagName", JSON.stringify(TagArray))
      httpClient.post(MyConstants.BASEURL + "addTags.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  addTagInterface.onResponseAddTagInterface("1", responseData['message'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 Error:- " + responseData['errorData'])
                  break;
               case "10":
                  addTagInterface.onResponseAddTagInterface("10", responseData['message'])
                  break;
               case "0":
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  // addWooCommerceKeyInterface.onResponseUpdatePostInterface("0", responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static deleteTagName(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      snackBar: MatSnackBar, addTagInterface: DeleteTagName, tagId: any) {
      var Tag = "deleteTagName"
      CommonMethods.showconsole(Tag, "Delete Tag NAme Id:- " + tagId)
      // spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("tagId", tagId)
      httpClient.post(MyConstants.BASEURL + "deleteTag.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  addTagInterface.onResponseDeleteTagNameInterface("1", responseData['message'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 Error:- " + responseData['errorData'])
                  break;
               case "10":
                  addTagInterface.onResponseDeleteTagNameInterface("10", responseData['message'])
                  break;
               case "0":
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  // addWooCommerceKeyInterface.onResponseUpdatePostInterface("0", responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static getTagProductList(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      snackBar: MatSnackBar, getTagArrayList: GetTagsListProduct, tagListArray: Array<any>, count: any, productStatus: any) {
      var Tag = "getTagProductList"
      CommonMethods.showconsole(Tag, "Delete Tag NAme Id:- " + JSON.stringify(tagListArray))
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("tagsList", JSON.stringify(tagListArray))
         .set("count", count)
         .set("productStatus", productStatus)
      httpClient.post(MyConstants.BASEURL + "getProductsByTags.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  getTagArrayList.onResponseGetTagsListProductInterface("1", responseData['productList'], "")
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 Error:- " + responseData['errorData'])
                  break;
               case "10":
                  getTagArrayList.onResponseGetTagsListProductInterface("10", [], "")
                  break;
               case "0":
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  // addWooCommerceKeyInterface.onResponseUpdatePostInterface("0", responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static tagsProductListStatusUpdate(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      snackBar: MatSnackBar, tagProductStatusUpdate: TagProductStatusUpdate, productId: any, actionStatus: any) {
      var Tag = "tagsProductListStatusUpdate"
      CommonMethods.showconsole(Tag, "Delete Tag NAme Id:- " + productId)
      CommonMethods.showconsole(Tag, "Delete Tag NAme Id:- " + actionStatus)
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("productStatus", actionStatus)
         .set("productId", productId)
      httpClient.post(MyConstants.BASEURL + "updateProductStatus.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  tagProductStatusUpdate.onResponseGetTagProductStatusUpdateInterface("1", responseData['message'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 Error:- " + responseData['message'])
                  break;
               case "10":
                  tagProductStatusUpdate.onResponseGetTagProductStatusUpdateInterface("10", responseData['message'])
                  break;
               case "0":
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  // addWooCommerceKeyInterface.onResponseUpdatePostInterface("0", responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static getCouponList(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      snackBar: MatSnackBar, couponListInterface: GetCouponList, count: any) {
      var Tag = "getCouponList"
      CommonMethods.showconsole(Tag, "Delete Tag NAme Id:- " + count)
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("count", count)

      httpClient.post(MyConstants.BASEURL + "getCouponList.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  couponListInterface.onResponseGetCouponListInterface("1", responseData['couponList'], "")
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 Error:- " + responseData['message'])
                  break;
               case "10":
                  couponListInterface.onResponseGetCouponListInterface("10", responseData['couponList'], "")
                  break;
               case "0":
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  // addWooCommerceKeyInterface.onResponseUpdatePostInterface("0", responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static getAllProductList(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      snackBar: MatSnackBar, getCouponProductList: GetCouponProductList) {
      var Tag = "getAllProductList"
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("storeAccountId", MyCookies.getStoreAccountId(cookiesService))

      httpClient.post(MyConstants.BASEURL + "getAllProductList.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  getCouponProductList.onResponseGetCouponProductListInterface("1", responseData['productList'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 Error:- " + responseData['message'])
                  break;
               case "10":
                  getCouponProductList.onResponseGetCouponProductListInterface("10", [])
                  break;
               case "0":
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  // addWooCommerceKeyInterface.onResponseUpdatePostInterface("0", responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static addCoupon(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      snackBar: MatSnackBar, addCouponModal: AddCoupon, addPromoCodeModal: AddCouponModal) {
      var Tag = "addCoupon"
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("coupon_code", addPromoCodeModal.coupon_code)
         .set("coupon_start_time", addPromoCodeModal.coupon_start_time)
         .set("coupon_end_time", addPromoCodeModal.coupon_end_time)
         .set("coupon_type", addPromoCodeModal.coupon_type)
         .set("usedby_count_or_end_date", addPromoCodeModal.usedby_count_or_end_date)
         .set("more_then_amount", addPromoCodeModal.more_then_amount)
         .set("discount_type", addPromoCodeModal.discount_type)
         .set("discount_amount", addPromoCodeModal.discount_amount)
         .set("discount_percentage", addPromoCodeModal.discount_percentage)
         .set("number_of_coupon", addPromoCodeModal.number_of_coupon)
         .set("discount_percentage_amount_upto", addPromoCodeModal.discount_percentage_amount_upto)
         .set("products_list", JSON.stringify(addPromoCodeModal.products_list))

      httpClient.post(MyConstants.BASEURL + "addCoupon.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  addCouponModal.onResponseAddCouponInterface("1", responseData['message'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 Error:- " + responseData['errorData'])
                  break;
               case "10":
                  addCouponModal.onResponseAddCouponInterface("10", responseData['message'])
                  break;
               case "0":
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }

   static getCouponDetails(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      snackBar: MatSnackBar, getCouponDetailsInterface: GetCouponDetails, couponPublicId:string) {
      var Tag = "getCouponDetails"
       CommonMethods.showconsole(Tag,"couponPublicId:- "+couponPublicId)
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("coupon_public_id", couponPublicId)

      httpClient.post(MyConstants.BASEURL + "getCouponWithId.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  getCouponDetailsInterface.onResponseGetCouponDetailsInterface("1", responseData['couponData'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 Error:- " + responseData['errorData'])
                  break;
               case "10":
                  getCouponDetailsInterface.onResponseGetCouponDetailsInterface("10", "")
                  break;
               case "0":
                  CommonMethods.showErrorDialog(snackBar, responseData['errorData'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }

   static updateCoupon(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      snackBar: MatSnackBar, addCouponModal: AddCoupon, addPromoCodeModal: AddCouponModal,couponId:any) {
      var Tag = "updateCoupon"
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("coupon_code", addPromoCodeModal.coupon_code)
         .set("coupon_start_time", addPromoCodeModal.coupon_start_time)
         .set("coupon_end_time", addPromoCodeModal.coupon_end_time)
         .set("coupon_type", addPromoCodeModal.coupon_type)
         .set("usedby_count_or_end_date", addPromoCodeModal.usedby_count_or_end_date)
         .set("more_then_amount", addPromoCodeModal.more_then_amount)
         .set("discount_type", addPromoCodeModal.discount_type)
         .set("discount_amount", addPromoCodeModal.discount_amount)
         .set("discount_percentage", addPromoCodeModal.discount_percentage)
         .set("number_of_coupon", addPromoCodeModal.number_of_coupon)
         .set("discount_percentage_amount_upto", addPromoCodeModal.discount_percentage_amount_upto)
         .set("products_list", JSON.stringify(addPromoCodeModal.products_list))
         .set("coupon_id", couponId)

      httpClient.post(MyConstants.BASEURL + "updateCoupon.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  addCouponModal.onResponseAddCouponInterface("1", responseData['message'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 Error:- " + responseData['errorData'])
                  break;
               case "10":
                  addCouponModal.onResponseAddCouponInterface("10", responseData['message'])
                  break;
               case "0":
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }

   static updateCouponStatus(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      snackBar: MatSnackBar, changeCouponStatusInterface: ChangeCouponStatus, couponId:string,couponStatusAction:any) {
      var Tag = "updateCouponStatus"
       CommonMethods.showconsole(Tag,"couponPublicId:- "+couponId)
       CommonMethods.showconsole(Tag,"status:- "+couponStatusAction)
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("coupon_id", couponId)
         .set("status", couponStatusAction)

      httpClient.post(MyConstants.BASEURL + "updateCouponStatus.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  changeCouponStatusInterface.onResponseChangeCouponStatusInterface("1",responseData['message'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 Error:- " + responseData['errorData'])
                  break;
               case "10":
                  changeCouponStatusInterface.onResponseChangeCouponStatusInterface("10", responseData['message'])
                  break;
               case "0":
                  CommonMethods.showErrorDialog(snackBar, responseData['errorData'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static getCouponApplyForList(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      snackBar: MatSnackBar, couponForApplyForListInterface: CouponForApplyList,brandId:any) {
      var Tag = "updateCouponStatus"
      //  CommonMethods.showconsole(Tag,"Store Id:- "+storeId)
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("store_id",brandId)
       

      httpClient.post(MyConstants.BASEURL + "getCouponListForApply.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  couponForApplyForListInterface.onResponseCouponForApplyListInterface("1",responseData['couponList'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 Error:- " + responseData['errorData'])
                  break;
               case "10":
                  couponForApplyForListInterface.onResponseCouponForApplyListInterface("10", responseData['message'])
                  break;
               case "0":
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
   static checkCouponWithOrder(spinner: NgxSpinnerService, httpClient: HttpClient, cookiesService: CookieService,
      snackBar: MatSnackBar, countCheckWithOrderIdInterface: CountCheckWithOrderId, couponId:any,orderInfo:Array<any>,totalAmount:any) {
      var Tag = "checkCouponId"
       CommonMethods.showconsole(Tag,"couponId Id:- "+couponId)
       CommonMethods.showconsole(Tag,"orderInfo:- "+JSON.stringify(orderInfo))
       CommonMethods.showconsole(Tag,"totalAmount:- "+totalAmount)
      spinner.show()
      const params = new HttpParams()
         .set("Auth", MyCookies.getAuthorization(cookiesService))
         .set("userId", MyCookies.getUserId(cookiesService))
         .set("sessionToken", MyCookies.getSessionTime(cookiesService))
         .set("accountType", MyCookies.getAccountType(cookiesService))
         .set("coupon_id", couponId)
         .set("order_info", JSON.stringify(orderInfo))
         .set("total_amount", totalAmount)
       

      httpClient.post(MyConstants.BASEURL + "checkCouponWithOrder.php", params)
         .subscribe((responseData) => {
            let status = responseData['status'];
            CommonMethods.showconsole(Tag, "Status:- " + status)
            switch (status) {
               case "1":
                  countCheckWithOrderIdInterface.onResponsecountCheckWithOrderIdInterface("1",responseData['payableAmountAfterDiscount'],responseData['message'],
                  responseData['discountAmount'],responseData['couponCountCheck'])
                  break;
               case "2":
                  CommonMethods.showconsole(Tag, "Status 2 Error:- " + responseData['errorData'])
                  break;
               case "10":
                  countCheckWithOrderIdInterface.onResponsecountCheckWithOrderIdInterface("10", "",responseData['couponList'],"","")
                  break;
               case "0":
                  CommonMethods.showErrorDialog(snackBar, responseData['message'])
                  break;
               default:
                  alert("Error Occured, Please try again");
                  break;
            }
         },
            response => {
               spinner.hide();
               CommonMethods.showErrorDialog(snackBar, "Some Error Occured ,Please try again")
               CommonMethods.showconsole(Tag, response);
            },
            () => {
               spinner.hide();
               CommonMethods.showconsole(Tag, 'Finish')
            })

   }
 


}