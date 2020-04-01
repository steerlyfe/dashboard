import { CookieService } from "ngx-cookie-service";
import { CookiesModal, StoreDetailsModal, SubStoreDetailsModal } from '../modelspackages/cookies-modal';
import { CommonMethods } from './common-methods';

export class MyCookies {
 
    static saveLoginDataInCookies(cookieService: CookieService, cookiesModal:CookiesModal) {
        cookieService.set("ta","test")
        cookieService.set('user_Id',cookiesModal.userId, 365,'/');
        cookieService.set('user_accounr_id',cookiesModal.accountId, 365,'/');
        cookieService.set('user_name',cookiesModal.fullName, 365,'/');
        cookieService.set('user_email',cookiesModal.email, 365,'/');
        cookieService.set('accountType',cookiesModal.accountType, 365,'/');
        cookieService.set('session', cookiesModal.sessionToken, 365,'/');
        cookieService.set('Auth', cookiesModal.authToken, 365,'/');
    }
    static saveLoginStoreDataInCookies(cookieService: CookieService, cookiesStoreDataModal:StoreDetailsModal)
    {
      
        cookieService.set('Login_store_Id',cookiesStoreDataModal.LoginstoreId, 365,'/');
        cookieService.set('Login_storeAccountId',cookiesStoreDataModal.LoginstoreAccountId, 365,'/');
        cookieService.set('Login_storeName',cookiesStoreDataModal.LoginstoreName, 365,'/');
        cookieService.set('Login_imageUrl',cookiesStoreDataModal.LoginimageUrl, 365,'/');
        cookieService.set('Login_storeType',cookiesStoreDataModal.LoginstoreType, 365,'/');
    }
    static saveLoginSub_StoreDataInCookies(cookieService: CookieService, cookiesSubStoreDataModal:SubStoreDetailsModal)
    {
        cookieService.set('Login_sub_store_id', cookiesSubStoreDataModal.loginSubStoreId, 365,'/');
        cookieService.set('Login_sub_store_account_id', cookiesSubStoreDataModal.loginSubStoreAccountId, 365,'/');
    }

    static checkLoginStatus(cookieService: CookieService): boolean {
        var cookieExists: boolean = cookieService.check('user_accounr_id')
        CommonMethods.showconsole("Cookies Method ","Cookies Existing :- "+cookieExists)
        cookieExists = cookieService.get('user_accounr_id') != ""
        if (cookieExists) {
            cookieExists = cookieService.check('Auth');
            CommonMethods.showconsole("Cookies Method ","Cookies Existing Auth :- "+cookieExists)
            cookieExists = cookieService.get('Auth') != ""
            if (cookieExists) {
                cookieExists = cookieService.check('session');
                CommonMethods.showconsole("Cookies Method ","Cookies Existing Session :- "+cookieExists)
                cookieExists = cookieService.get('session') != ""
                if (cookieExists) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    static getUserId(cookieService: CookieService): string {
        return cookieService.get('user_Id');
    }
    static getAccountId(cookieService: CookieService): string {
        return cookieService.get('user_accounr_id');
    }
    static getUserName(cookieService: CookieService): string {
        return cookieService.get('user_name');
    }
    static getUserEmail(cookieService: CookieService): string {
        return cookieService.get('user_email');
    }
    static getAccountType(cookieService: CookieService): string {
        return cookieService.get('accountType');
    }
    static getAuthorization(cookieService: CookieService): string {
        return cookieService.get('Auth');
    }
    static getSessionTime(cookieService: CookieService): string {
        return cookieService.get('session');
    }
    static getStoreId(cookieService: CookieService): string {
        return cookieService.get('Login_store_Id');
    }
    static getStoreAccountId(cookieService: CookieService): string {
        return cookieService.get('Login_storeAccountId');
    }
    static getStoreName(cookieService: CookieService): string {
        return cookieService.get('Login_storeName');
    }
    static getStoreImage(cookieService: CookieService): string {
        return cookieService.get('Login_imageUrl');
    }
    static getStoreType(cookieService: CookieService): string {
        return cookieService.get('Login_storeType');
    }
    static getSubStoreId(cookieService: CookieService): string {
        return cookieService.get('Login_sub_store_id');
    }
    static getSubStoreAccountId(cookieService: CookieService): string {
        return cookieService.get('Login_sub_store_account_id');
    }
   
   
  
    // static getStoreName(cookieService: CookieService): string {
    //     return cookieService.get('storeName');
    // }
    // static getStoreSuperAdminId(cookieService: CookieService): string {
    //     return cookieService.get('storeSuperAdminId');
    // }
    // static getStoreAdminId(cookieService: CookieService): string {
    //     return cookieService.get('storeAdminId');
    // }
    // static getStoreId(cookieService: CookieService): string {
    //     return cookieService.get('storeId');
    // }
    // static getImageUrl(cookieService: CookieService): string {
    //     return cookieService.get('imageUrl');
    // }

    // static saveRejectedData(cookieService: CookieService, data: any) {
    //     cookieService.set('rejectData', data, this.getExpiryTime());
    // }

    // static getRejectedItemsData(cookieService: CookieService): any {
    //     return cookieService.get('rejectData');
    // }

    // static getEmployeeDesignation(cookieService: CookieService): string {
    //     return cookieService.get('employeePosition');
    // }
    // static getCustomerStripeId(cookieService: CookieService): string {
    //     return cookieService.get('stripeCustomerId');
    // }
    static getExpiryTime() {
        let date = new Date()
        date.setDate(date.getDate() +1)
        return date
    }

    static deletecookies(cookieService: CookieService) {
         CommonMethods.showconsole("MyCookies"," Function is working  into cookies method ")
        cookieService.deleteAll();

    }
}