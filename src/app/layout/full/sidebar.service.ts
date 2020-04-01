import { Injectable, NgZone } from '@angular/core';
import { SideNavigationMain, SideNavigationInner, SideNavigationUrlTitle } from 'src/app/modelspackages/menus-model';
import { CommonMethods } from 'src/app/utilpackages/common-methods';
import { Router, NavigationEnd } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MyCookies } from 'src/app/utilpackages/my-cookies';
import { MyRoutingMethods } from 'src/app/utilpackages/my-routing-methods';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  tag = "SidebarService"
  toggled = false;
  pageName = ""
  accounttype: string
  menus: Array<SideNavigationMain> = []
  storeid: string
  constructor(public ngzone: NgZone, public router: Router, public cookiesservice: CookieService) {
    // this.checkloginstatus()
  }
  //  checkloginstatus()
  //  {
  //     CommonMethods.showconsole(this.tag,"ng serve is Working")
  //     var loginstatus = MyCookies.checkLoginStatus(this.cookiesservice)
  //     if(loginstatus)
  //     {
  //       this.ngzone.run(()=>{
  //         this.accounttype = MyCookies.getAccountType(this.cookiesservice);
  //         CommonMethods.showconsole(this.tag,"Account Type :- "+this.accounttype)

  //         this.router.events.subscribe(value => {
  //           if (value instanceof NavigationEnd) {

  //             // this.checkAndSetValue()

  //             // if (this.mainContainer != undefined) {
  //             //   this.mainContainer.nativeElement.scrollIntoView();
  //             // }

  //           }
  //         })
  //         // this.addSideOption();
  //       });

  //     }
  //     else{
  //       MyRoutingMethods.gotoLogin(this.router)
  //     }
  //  }



  addSideOption() {
    this.menus = []
    this.accounttype = ""

    this.accounttype = MyCookies.getAccountType(this.cookiesservice);
    CommonMethods.showconsole(this.tag, "Account Type :- " + this.accounttype)
    switch (this.accounttype) {
      case 'admin':
        var pageInnerUrls: Array<SideNavigationUrlTitle> = []
        pageInnerUrls.push(new SideNavigationUrlTitle("/add/product", "Add New Product"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/update/product/", "update Product"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/product/details/", "Product Details"))
        //  this.menus.push(new SideNavigationMain("dashboard", "Dashboard",'dashboard', "fa fa-tachometer-alt", "inactive","header", []))
        this.menus.push(new SideNavigationMain("products", "Products", this.accounttype + '/view/all/products', "product_icon", "inactive", "header", [], pageInnerUrls,"product_icon_active"))
        var innerDataAccounts: Array<SideNavigationInner> = []
        innerDataAccounts.push(new SideNavigationInner("Add Account", "Add Account", this.accounttype + '/add/accounts', "add_user_icon", "inactive", [],"add_user_icon_active"))

        var pageInnerUrls: Array<SideNavigationUrlTitle> = []
        pageInnerUrls.push(new SideNavigationUrlTitle("/edit/account/", "Edit Account Details"))
        
        innerDataAccounts.push(new SideNavigationInner("View Acounts", "View Accounts", this.accounttype + '/view/accounts', "user_list_icon", "inactive", pageInnerUrls,"user_list_icon_active"))
        this.menus.push(new SideNavigationMain("accounts", "Accounts", '', "accounts_icon", "inactive", "dropdown", innerDataAccounts, [],"accounts_icon_active"))
        var pageInnerUrls: Array<SideNavigationUrlTitle> = []
        pageInnerUrls.push(new SideNavigationUrlTitle("/add/sub-store/accounts/", "Add New sub store Admin"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/add/sub-store", "Add new Sub Store"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/view/sub-store/accounts/", "View Sub Store Admins"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/view/sub-store/posts/list/", "View Sub Store Posts"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/create/sub-store/post/", "Create new Sub Store Posts"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/view/orders/", "Orders List"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/order/details", "Order Details"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/edit/sub/store/", "Edit SubStore"))
        this.menus.push(new SideNavigationMain("allstore", "All Sub Stores", this.accounttype + '/view/sub-stores', "sub_store_icon", "inactive", "header", [], pageInnerUrls,"sub_store_icon_active" ))

        // var innerData: Array<SideNavigationInner> = []
        // innerData.push(new SideNavigationInner("allstore", "All Sub Stores", this.accounttype + "/view/sub-stores", " ", "inactive", pageInnerUrls))
        // this.menus.push(new SideNavigationMain("store", "Store", '', "fa fa-shopping-cart", "inactive", "dropdown", innerData, []))
        var pageInnerUrls: Array<SideNavigationUrlTitle> = []
        pageInnerUrls.push(new SideNavigationUrlTitle("/create/post", "Create New Post"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/edit/post/", "Update post"))
        this.menus.push(new SideNavigationMain("View posts", "View Posts", this.accounttype + '/view/posts/list', "posts_icon", "inactive", "header", [], pageInnerUrls,"posts_icon_active"))


        // this.menus.push(new SideNavigationMain("store", "Store", '', "fa fa-shopping-cart", "inactive", "dropdown", innerData, []))
        if (MyCookies.getStoreType(this.cookiesservice) == "store") {
          var pageInnerUrls: Array<SideNavigationUrlTitle> = []

          pageInnerUrls.push(new SideNavigationUrlTitle("/shopping/products/", "Products List"))
          this.menus.push(new SideNavigationMain("shopping", "Shopping", this.accounttype + '/shopping/list', "shopping_icon", "inactive", "header", [], pageInnerUrls,"shopping_icon_active"))
          this.menus.push(new SideNavigationMain("cart", "Cart", this.accounttype + '/view/cart', "cart_icon", "inactive", "header", [], [],"cart_icon_active"))
        }

        var pageInnerUrls: Array<SideNavigationUrlTitle> = []
        pageInnerUrls.push(new SideNavigationUrlTitle("/store/order/detail/", "Order details"))

        this.menus.push(new SideNavigationMain("Order", "Orders", this.accounttype + '/store/orders', "orders_icon", "inactive", "header", [], pageInnerUrls,"orders_icon_active"))
        var pageInnerUrls: Array<SideNavigationUrlTitle> = []
        pageInnerUrls.push(new SideNavigationUrlTitle("/add/Woo-Commerce/key", "Add WooCommerce Key"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/add/Shopify/key", "Add Shopify Key"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/add/BigCommerce/key", "Add Big-Commerce Key"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/edit/Woo-Commerce/key/", "Update WooCommerce Key"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/sync/products/", "Sync Products From web"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/tutorial/add/woocommerce/key", "Tutorial Add Woocommerce Key"))

        this.menus.push(new SideNavigationMain("E-commerce", "E-commerce Keys", this.accounttype + '/ecommerce/keys', "ecommerce_icon", "inactive", "header", [], pageInnerUrls,"ecommerce_icon_active"))
        this.menus.push(new SideNavigationMain("My Account", "My Account", this.accounttype + '/change/profile', "user_setting", "inactive", "header", [],[],"user_setting_active"))
        var pageInnerUrls: Array<SideNavigationUrlTitle> = []
        pageInnerUrls.push(new SideNavigationUrlTitle("/add/coupon", "Add Coupon"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/edit/coupon", "Edit Coupon"))
        this.menus.push(new SideNavigationMain("Coupons", "Coupons", this.accounttype + '/coupons', "coupon_icon", "inactive", "header", [], pageInnerUrls,"coupon_icon_active"))
        break;
      case 'manager':
        // this.menus.push(new SideNavigationMain("dashboard", "Dashboard", 'dashboard', "fa fa-tachometer-alt", "inactive", "header", []))

        var innerDataAccounts: Array<SideNavigationInner> = []
        innerDataAccounts.push(new SideNavigationInner("Add Account", "Add Account", this.accounttype + '/add/accounts', "add_user_icon", "inactive", [],"add_user_icon_active"))
        
        var pageInnerUrls: Array<SideNavigationUrlTitle> = []
        pageInnerUrls.push(new SideNavigationUrlTitle("/edit/account/", "Edit Account Details"))
        innerDataAccounts.push(new SideNavigationInner("View Acounts", "View Accounts", this.accounttype + '/view/accounts', "user_list_icon", "inactive",pageInnerUrls,"user_list_icon_active"))
        this.menus.push(new SideNavigationMain("accounts", "Accounts", '', "accounts_icon", "inactive", "dropdown", innerDataAccounts, [],"accounts_icon_active"))
        var pageInnerUrls: Array<SideNavigationUrlTitle> = []
        pageInnerUrls.push(new SideNavigationUrlTitle("/add/product", "Add New Product"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/update/product/", "update Product"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/product/details/", "Product Details"))
        this.menus.push(new SideNavigationMain("products", "Products", this.accounttype + '/view/all/products', "product_icon", "inactive", "header", [], pageInnerUrls,"product_icon_active"))
        var pageInnerUrls: Array<SideNavigationUrlTitle> = []

        pageInnerUrls.push(new SideNavigationUrlTitle("/add/sub-store/accounts/", "Add New sub store Admin"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/add/sub-store", "Add new Sub Store"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/view/sub-store/accounts/", "View Sub Store Admins"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/view/sub-store/posts/list/", "View Sub Store Posts"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/create/sub-store/post/", "Create new Sub Store Posts"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/view/orders/", "Orders List"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/order/details", "Order Details"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/edit/sub/store/", "Edit SubStore"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/edit/account/", "Edit Account Details"))
        // var innerData: Array<SideNavigationInner> = []
        // innerData.push(new SideNavigationInner("allstore", "All Sub Stores", this.accounttype + "/view/sub-stores", " ", "inactive", pageInnerUrls))
        // this.menus.push(new SideNavigationMain("store", "Store", '', "fa fa-shopping-cart", "inactive", "dropdown", innerData, []))
        this.menus.push(new SideNavigationMain("allstore", "All Sub Stores", this.accounttype + '/view/sub-stores', "sub_store_icon", "inactive", "header", [], pageInnerUrls,"sub_store_icon_active"))
        var pageInnerUrls: Array<SideNavigationUrlTitle> = []
        pageInnerUrls.push(new SideNavigationUrlTitle("/create/post", "Create New Post"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/edit/post/", "Update post"))
        this.menus.push(new SideNavigationMain("posts", "Posts", this.accounttype + '/view/posts/list', "posts_icon", "inactive", "header", [], pageInnerUrls,"posts_icon_active"))
        // this.menus.push(new SideNavigationMain("View Orders", "Orders", this.accounttype + '/view/orders', "fa fa-shopping-cart", "inactive", "header", [], []))
        // this.menus.push(new SideNavigationMain("brands", "Brands", this.accounttype + '/brands/list', "fa fa-shopping-cart", "inactive", "header", [], []))
        
        if (MyCookies.getStoreType(this.cookiesservice) == "store") {
          var pageInnerUrls: Array<SideNavigationUrlTitle> = []

          pageInnerUrls.push(new SideNavigationUrlTitle("/shopping/products/", "Products List"))
          this.menus.push(new SideNavigationMain("shopping", "Shopping", this.accounttype + '/shopping/list', "shopping_icon", "inactive", "header", [], pageInnerUrls,"shopping_icon_active"))
          this.menus.push(new SideNavigationMain("cart", "Cart", this.accounttype + '/view/cart', "cart_icon", "inactive", "header", [], [],""))
        }

        var pageInnerUrls: Array<SideNavigationUrlTitle> = []
        pageInnerUrls.push(new SideNavigationUrlTitle("/store/order/detail/", "Order details"))

        this.menus.push(new SideNavigationMain("Order", "Orders", this.accounttype + '/store/orders', "orders_icon", "inactive", "header", [], pageInnerUrls,"orders_icon_active"))
        var pageInnerUrls: Array<SideNavigationUrlTitle> = []
        pageInnerUrls.push(new SideNavigationUrlTitle("/add/Woo-Commerce/key", "Add WooCommerce Key"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/add/Shopify/key", "Add Shopify Key"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/add/BigCommerce/key", "Add Big-Commerce Key"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/edit/Woo-Commerce/key/", "Update WooCommerce Key"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/sync/products/", "Sync Products From web"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/tutorial/add/woocommerce/key", "Tutorial Add Woocommerce Key"))
        this.menus.push(new SideNavigationMain("E-commerce", "E-commerce", this.accounttype + '/ecommerce/keys', "ecommerce_icon", "inactive", "header", [], pageInnerUrls,"ecommerce_icon_active"))
        this.menus.push(new SideNavigationMain("My Account", "My Account", this.accounttype + '/change/profile', "user_setting", "inactive", "header", [],[],"user_setting_active"))
        
        break;
      case 'employee':
        var pageInnerUrls: Array<SideNavigationUrlTitle> = []
        pageInnerUrls.push(new SideNavigationUrlTitle("/product/details/", "Product Details"))
        this.menus.push(new SideNavigationMain("products", "Products", this.accounttype + '/view/all/products', "product_icon", "inactive", "header", [], pageInnerUrls,"product_icon_active"))
        // this.menus.push(new SideNavigationMain("dashboard", "Dashboard", 'dashboard', "fa fa-tachometer-alt", "inactive", "header", []))
        this.menus.push(new SideNavigationMain("posts", "Posts", this.accounttype + '/view/posts/list', "posts_icon", "inactive", "header", [], [],"posts_icon_active"))
        // var innerData: Array<SideNavigationInner> = []
        // innerData.push(new SideNavigationInner("allstore", "All Sub Stores", this.accounttype + "/view/sub-stores", " ", "inactive", pageInnerUrls))
        // this.menus.push(new SideNavigationMain("store", "Store", '', "fa fa-shopping-cart", "inactive", "dropdown", innerData, []))
        // this.menus.push(new SideNavigationMain("View Orders", "Orders", this.accounttype + '/view/orders', "fa fa-shopping-cart", "inactive", "header", [], []))
        this.menus.push(new SideNavigationMain("My Account", "My Account", this.accounttype + '/change/profile', "user_setting", "inactive", "header", [],[],"user_setting_active"))
        
        break;
      case 'sub_admin':

        var pageInnerUrls: Array<SideNavigationUrlTitle> = []
        pageInnerUrls.push(new SideNavigationUrlTitle("/add/product", "Add New Product"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/update/product/", "update Product"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/product/details/", "Product Details"))
        this.menus.push(new SideNavigationMain("products", "Products", this.accounttype + '/view/all/products', "product_icon", "inactive", "header", [], pageInnerUrls,"product_icon_active"))
        var innerDataAccounts: Array<SideNavigationInner> = []
        innerDataAccounts.push(new SideNavigationInner("Add Account", "Add Account", this.accounttype + '/add/accounts', "add_user_icon", "inactive", [],"add_user_icon_active"))
        var pageInnerUrls: Array<SideNavigationUrlTitle> = []
        pageInnerUrls.push(new SideNavigationUrlTitle("/edit/account/", "Edit Account Details"))

        innerDataAccounts.push(new SideNavigationInner("View Acounts", "View Accounts", this.accounttype + '/view/accounts', "user_list_icon", "inactive",pageInnerUrls,"user_list_icon_active"))
        this.menus.push(new SideNavigationMain("accounts", "Accounts", '', "accounts_icon", "inactive", "dropdown", innerDataAccounts, [],"accounts_icon_active"))
        var pageInnerUrls: Array<SideNavigationUrlTitle> = []
        pageInnerUrls.push(new SideNavigationUrlTitle("/create/post", "Create New Post"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/edit/post/", "Update post"))
        this.menus.push(new SideNavigationMain("posts", "Posts", this.accounttype + '/view/posts/list', "posts_icon", "inactive", "header", [], pageInnerUrls,"posts_icon_active"))
        var pageInnerUrls: Array<SideNavigationUrlTitle> = []
        pageInnerUrls.push(new SideNavigationUrlTitle("/order/details", "Order Details"))
        this.menus.push(new SideNavigationMain("View Orders", "Orders", this.accounttype + '/view/orders', "orders_icon", "inactive", "header", [], pageInnerUrls,"posts_icon_active"))
        this.menus.push(new SideNavigationMain("My Account", "My Account", this.accounttype + '/change/profile', "user_setting", "inactive", "header", [],[],"user_setting_active"))
        
        break;
      case 'sub_manager':

        var pageInnerUrls: Array<SideNavigationUrlTitle> = []
        pageInnerUrls.push(new SideNavigationUrlTitle("/add/product", "Add New Product"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/update/product/", "update Product"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/product/details/", "Product Details"))
        this.menus.push(new SideNavigationMain("products", "Products", this.accounttype + '/view/all/products', "product_icon", "inactive", "header", [], pageInnerUrls,"product_icon_active"))
        var innerDataAccounts: Array<SideNavigationInner> = []
        innerDataAccounts.push(new SideNavigationInner("Add Account", "Add Account", this.accounttype + '/add/accounts', "add_user_icon", "inactive", [],"add_user_icon_active"))
        var pageInnerUrls: Array<SideNavigationUrlTitle> = []
        pageInnerUrls.push(new SideNavigationUrlTitle("/edit/account/", "Edit Account Details"))
        innerDataAccounts.push(new SideNavigationInner("View Acounts", "View Accounts", this.accounttype + '/view/accounts', "user_list_icon", "inactive", pageInnerUrls,"user_list_icon_active"))
        this.menus.push(new SideNavigationMain("accounts", "Accounts", '', "accounts_icon", "inactive", "dropdown", innerDataAccounts, [],"accounts_icon_active"))
        var pageInnerUrls: Array<SideNavigationUrlTitle> = []
        pageInnerUrls.push(new SideNavigationUrlTitle("/create/post", "Create New Post"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/edit/post/", "Update post"))
        this.menus.push(new SideNavigationMain("posts", "Posts", this.accounttype + '/view/posts/list', "posts_icon", "inactive", "header", [], pageInnerUrls,"posts_icon_active"))
        var pageInnerUrls: Array<SideNavigationUrlTitle> = []
        pageInnerUrls.push(new SideNavigationUrlTitle("/order/details", "Order Details"))
        this.menus.push(new SideNavigationMain("View Orders", "Orders", this.accounttype + '/view/orders', "orders_icon", "inactive", "header", [], pageInnerUrls,"orders_icon_active"))
        this.menus.push(new SideNavigationMain("My Account", "My Account", this.accounttype + '/change/profile', "user_setting", "inactive", "header", [],[],"user_setting_active"))
       
        break;
      case 'sub_employee':
        var pageInnerUrls: Array<SideNavigationUrlTitle> = []
        pageInnerUrls.push(new SideNavigationUrlTitle("/product/details/", "Product Details"))
        this.menus.push(new SideNavigationMain("products", "Products", this.accounttype + '/view/all/products', "product_icon", "inactive", "header", [], pageInnerUrls,"product_icon_active"))
        this.menus.push(new SideNavigationMain("posts", "Posts", this.accounttype + '/view/posts/list', "posts_icon", "inactive", "header", [], [],"posts_icon_active"))
        var pageInnerUrls: Array<SideNavigationUrlTitle> = []

        pageInnerUrls.push(new SideNavigationUrlTitle("/order/details", "Order Details"))
        this.menus.push(new SideNavigationMain("View Orders", "Orders", this.accounttype + '/view/orders', "orders_icon", "inactive", "header", [], pageInnerUrls,"orders_icon_active"))
        this.menus.push(new SideNavigationMain("My Account", "My Account", this.accounttype + '/change/profile', "user_setting", "inactive", "header", [],[],"user_setting_active"))
        
        break;
      default:
        // this.menus.push(new SideNavigationMain("dashboard", "Dashboard",'dashboard', "fa fa-tachometer-alt", "inactive","header", []))
        //  this.menus.push(new SideNavigationMain("onilneorder", "Online Order",'online-order', "fa fa-shopping-cart", "inactive","header", []))
        // this.menus.push(new SideNavigationMain("View product", "View Products", 'view/all/products', "fa fa-shopping-cart", "inactive", "header", []))
        var pageInnerUrls: Array<SideNavigationUrlTitle> = []
        pageInnerUrls.push(new SideNavigationUrlTitle("add/accounts/", " Add New Account"))
        pageInnerUrls.push(new SideNavigationUrlTitle("view/accounts/", " view Accounts"))
        pageInnerUrls.push(new SideNavigationUrlTitle("view/sub-stores/", " View Sub Stores "))
        pageInnerUrls.push(new SideNavigationUrlTitle("add/accounts/", " Add New Account"))
        pageInnerUrls.push(new SideNavigationUrlTitle("view/all/products/", " View Products "))
        pageInnerUrls.push(new SideNavigationUrlTitle("/product/details/", "Product Details"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/add/sub-store", "Add New Sub Store"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/view/sub-store/posts/list/", " view Sub Store posts"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/view/posts/list/", " view Store posts"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/view/orders/", "Orders List"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/order/details", "Order Details"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/edit/sub/store/", "Edit SubStore"))
        pageInnerUrls.push(new SideNavigationUrlTitle("/edit/account/", "Edit Account Details"))

        var innerData: Array<SideNavigationInner> = []
        innerData.push(new SideNavigationInner("addstore", "New Store/Brand", this.accounttype + "/add/store/brand", "add_store", "inactive", [],"add_store_active"))
        innerData.push(new SideNavigationInner("allstore", "All Store/Brand", this.accounttype + "/stores/list", "store_brand_list", "inactive", pageInnerUrls,"store_brand_list_active"))
        this.menus.push(new SideNavigationMain("store", "Store", '', "sub_store_icon", "inactive", "dropdown", innerData, [],"sub_store_icon_active"))
        // var pageInnerUrls: Array<SideNavigationUrlTitle> = []
        // pageInnerUrls.push(new SideNavigationUrlTitle("view/order/details/", " Order Detail"))
        // pageInnerUrls.push(new SideNavigationUrlTitle("/view/product/status/", " Order Status"))
        // this.menus.push(new SideNavigationMain("View Orders", "Orders", this.accounttype + '/view/orders', "fa fa-shopping-cart", "inactive", "header", [], pageInnerUrls))
        // this.menus.push(new SideNavigationMain("View posts", "View Posts", 'view/posts/list', "fa fa-shopping-cart", "inactive", "header", [], pageInnerUrls))
        // this.menus.push(new SideNavigationMain("My Account", "My Account", this.accounttype + '/change/profile', "user_setting", "inactive", "header", [],[],"user_setting_active"))
        this.menus.push(new SideNavigationMain("Tags", "Tags", this.accounttype + '/tag', "tag_icon", "inactive", "header", [],[],"tag_icon_active"))

        break;
    }
    // this.checkAndSetValue()
  }

  toggle() {
    this.toggled = !this.toggled;
  }

  getSidebarState() {
    return this.toggled;
  }

  setSidebarState(state: boolean) {
    this.toggled = state;
  }

  getMenuList() {
    this.addSideOption()
    CommonMethods.showconsole(this.tag, " Function is working ")
    return this.menus;
  }



  // checkAndSetValue() {

  //   this.ngzone.run(() => {

  //     var currentUrl = this.router.url

  //     var matched = false
  //     this.menus.forEach(element => {

  //       element.status = "inactive"

  //       if (!matched) {
  //         if (currentUrl == "/" + element.url) {
  //           matched = true
  //           element.status = "active"
  //           //  this.pageName = element.title
  //         }
  //       }
  //       element.innerOptions.forEach(innerElement => {
  //         innerElement.status = "inactive"


  //         if (!matched) {
  //            CommonMethods.showconsole(this.tag," Working function qwdwerwerwe")
  //           if (currentUrl == "/" + innerElement.url) {
  //             matched = true
  //             //  this.pageName = innerElement.title
  //             innerElement.status = "active"
  //           }
  //         }
  //       })
  //     })
  //   })

  // }




  // get hasBackgroundImage() {
  //   return this._hasBackgroundImage;
  // }

  // set hasBackgroundImage(hasBackgroundImage) {
  //   this._hasBackgroundImage = hasBackgroundImage;
  // }
}
