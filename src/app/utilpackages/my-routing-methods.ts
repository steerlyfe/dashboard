
import { Router } from '@angular/router';


export class MyRoutingMethods {


    static gotoLogin(router: Router) {
        router.navigate(['login']);
    }
    static gotoDashboard(router: Router, usertype: string) {
        if (usertype == "admin") {
            router.navigate([usertype+'/view/all/products'])
        } else if (usertype == "manager") {
            router.navigate([usertype+'/view/accounts'])
        } else if (usertype == "employee") {
            router.navigate([usertype+'/view/all/products'])
        } else if (usertype == "sub_admin") {
            router.navigate([usertype+'/view/all/products'])
        } else if (usertype == "sub_manager") {
            router.navigate([usertype+'/view/all/products'])
        }else if(usertype == "sub_employee") {
            router.navigate([usertype+'/view/all/products'])
        }else {
            router.navigate([usertype+'/stores/list'])
        }
        // router.navigate(['dashboard'])
    }
    static gotoStoreLists(router: Router,accountType:string) {
        router.navigate([accountType+'/stores/list'])
    }

    static gotoAddAccount(router: Router, storeId: String) {
        router.navigate(['add/accounts' + storeId])
    }
    static gotoviewAccount(router: Router, storeId: String,accountType:string) {
        router.navigate([accountType+'/view/accounts/' + storeId])
    }
    static gotoSubStoreViewAccounts(router: Router,subStoreAccountId:String,accountType:string) {
        router.navigate([accountType+'/view/sub-store/accounts/'+subStoreAccountId])
    }
    static gotoAdminviewAccount(router: Router,accountType:string) {
        router.navigate([accountType+'/view/accounts'])
    }
    static gotoManagerviewAccount(router: Router) {
        router.navigate(['manager/view/accounts'])
    }
    static gotoManagerviewAccountSubStore(router: Router,subStoreAccountId:String) {
        router.navigate(['manager/view/accounts/'+subStoreAccountId])
    }
    static gotoSub_StoreAdminViewAccount(router: Router) {
        router.navigate(['sub_admin/view/accounts'])
    }
    static gotoSub_StoreManagerViewAccount(router: Router) {
        router.navigate(['sub_manager/view/accounts'])
    }
    static gotoviewSubStore(router: Router,accountType:string) {
        router.navigate([accountType+'/view/sub-stores'])
    }
    static gotoSuperadminviewSubStore(router: Router,storeAccountId:string,accountType:string) {
        router.navigate([accountType+'/view/sub-stores/'+storeAccountId])
    }
    // static gotAddProduct(router: Router) {
    //     router.navigate(['admin/add/product']);
    // }
    // static gotAllsubStore(router: Router) {
    //     router.navigate(['admin/add/product']);  
    // }
    static gotoviewProduct(router: Router,accountType:string) {
        router.navigate([accountType+'/view/all/products']);
    }
    static gotoPostView(router: Router,accounType:string) {
        router.navigate([accounType+'/view/posts/list']);
    }
    static gotoStoreOrder(router: Router,accounType:string) {
        router.navigate([accounType+'/store/orders']);
    }
    static gotoKeyList(router: Router,accounType:string) {
        router.navigate([accounType+'/ecommerce/keys']);
    }
    static gotoSubStorePostView(router: Router,subStoreAccountId:string,accounType:string) {
        router.navigate([accounType+'/view/sub-store/posts/list/'+subStoreAccountId]);
    }
    static gotoCouponPreviews(router: Router,accounType:string) {
        router.navigate([accounType+'/coupons']);
    }


    // static goToCustomDashboard(router: Router, type: string, id: string) {
    //     router.navigate(['dashboard/' + type + "/" + id]);
    // }

    // static goToLogin(router: Router) {
    //     router.navigate(['login']);
    // }

    // static goToRejectInventory(router: Router) {
    //     router.navigate(['rejectInventory']);
    // }

    // static goToAddStore(router: Router) {
    //     router.navigate(['addStore']);
    // }

    // static goToAddCard(router: Router) {
    //     router.navigate(['addCard']);
    // }

    // static goToSubStores(router: Router, storeId: string) {
    //     router.navigate(['substores/' + storeId]);
    // }
    // static goToStoreItems(router: Router, storeAdminId: string, storeId: string) {
    //     router.navigate(['storeItems/' + storeAdminId + "/" + storeId]);
    // }
    // static goToStoreStockLeft(router: Router, storeId: string) {
    //     router.navigate(['stockLeft/' + storeId]);
    // }
    // static goToLowStock(router: Router, storeId: string) {
    //     router.navigate(['lowStock/' + storeId]);
    // }
    // static goToBilling(router: Router) {
    //     router.navigate(['billing']);
    // }
    // static goToStoreEmployees(router: Router, storeAdminId: string, storeId: string) {
    //     router.navigate(['employees/' + storeAdminId + "/" + storeId]);
    // }
    // static goToStoreTransactions(router: Router, storeId: string) {
    //     router.navigate(['transactions/' + storeId]);
    // }
    // static goToTransactionDetail(router: Router, transactionId: string) {
    //     router.navigate(['transactionDetail/' + transactionId]);
    // }
    // static goToUploadInventory(router: Router) {
    //     router.navigate(['uploadInventory']);
    // }
    // static goToShareInventoryItem(router: Router, storeId: string) {
    //     router.navigate(['shareInventoryItem/' + storeId]);
    // }

    // static goToPendingInventory(router: Router) {
    //     router.navigate(['pendingInventory']);
    // }
    // static goToAllCards(router: Router) {
    //     router.navigate(['allCards']);
    // }
    // static getDashboardRedirectName(): string {
    //     return 'dashboard';
    // }

    // static getOnlineOrdersRedirectName(): string {
    //     return 'online-orders';
    // }
    // static getAllCardsRedirectName(): string {
    //     return 'allCards';
    // }

    // static getAddStoreRedirectName(): string {
    //     return 'addStore';
    // }

    // static getAllStoresRedirectName(): string {
    //     return 'stores';
    // }

    // static getAllSubStoresRedirectName(): string {
    //     return 'substores';
    // }

    // static getStoreItemsRedirectName(): string {
    //     return 'storeItems';
    // }

    // static getEmployeesRedirectName(): string {
    //     return 'employees';
    // }

    // static getTransactionRedirectName(): string {
    //     return 'transactions';
    // }

    // static getAddEmployeeRedirectName(): string {
    //     return 'addEmployee';
    // }

    // static getPriceChangeRequestRedirectName(): string {
    //     return 'priceRequest';
    // }

    // static getCashOnHandsRedirectName(): string {
    //     return 'cashOnHand';
    // }

    // static getAddSubStoreRedirectName(): string {
    //     return 'addSubStore';
    // }

    // static getLogoutRedirectName(): string {
    //     return 'logout';
    // }

    // static getUploadInventoryRedirectName(): string {
    //     return 'uploadInventory';
    // }

    // static getShareInventoryStoreRedirectName(): string {
    //     return 'shareInventoryStore';
    // }

    // static getPendingInventoryRedirectName(): string {
    //     return 'pendingInventory';
    // }

    // static getUploadCsvRedirectName(): string {
    //     return 'uploadCsv';
    // }
    // static getDownloadRecordsName(): string {
    //     return 'download-record';
    // }
    // static getBillingName(): string {
    //     return 'billing';
    // }
    // static getAddCardName(): string {
    //     return 'addCard';
    // }


    // static getEmployeeSalesRecordRedirectName(): string {
    //     return 'employeeSaleRecords';
    // }
    // static logout(cookieService: CookieService, router: Router) {
    //     cookieService.delete('accountId');
    //     cookieService.delete('uniqueId');
    //     cookieService.delete('sessionTime');
    //     router.navigate(['login']);
    // }

    // static sessionOut(cookieService: CookieService, router: Router) {
    //     cookieService.delete('accountId');
    //     cookieService.delete('uniqueId');
    //     cookieService.delete('sessionTime');
    //     router.navigate(['login']);
    // }

    // static goToStockDataUpload(router: Router) {
    //     router.navigate(['stockUpload']);
    // }

    // static goToEmployeeSaleRecords(router: Router, employeeId: string) {
    //     router.navigate(['employeeSaleRecords/' + employeeId]);
    // }




}