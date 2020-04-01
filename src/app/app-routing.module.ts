import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlankComponent } from './layout/blank/blank.component'
import { FullComponent } from './layout/full/full.component'
import { LoginComponent } from './componentpackage/login/login.component'
import { DashboardComponent } from './componentpackage/dashboard/dashboard.component'
import { OnlineOrderComponent } from './componentpackage/online-order/online-order.component'
import { AddStoresComponent } from './componentpackage/add-stores/add-stores.component'
import { AllstoresComponent } from './componentpackage/allstores/allstores.component'
import { ViewAccountsComponent } from './componentpackage/view-accounts/view-accounts.component'
import { AddAccountsComponent } from './componentpackage/add-accounts/add-accounts.component'
import { AddSubStoresComponent } from './componentpackage/add-sub-stores/add-sub-stores.component'
import { SubStoresComponent } from './componentpackage/sub-stores/sub-stores.component'
import { EditProductComponent } from './componentpackage/edit-product/edit-product.component'
import { AddProductComponent } from './componentpackage/add-product/add-product.component'
import { ProductDetailsComponent } from './componentpackage/product-details/product-details.component'
import { ViewProductComponent } from './componentpackage/view-product/view-product.component'
import { CreatePostComponent } from './componentpackage/create-post/create-post.component'
import { PostListComponent } from './componentpackage/post-list/post-list.component'
import { PostEditComponent } from './componentpackage/post-edit/post-edit.component'
import { OrdersComponent } from './componentpackage/orders/orders.component'
import { OrderDetailsComponent } from './componentpackage/order-details/order-details.component'
import { ProductStatusComponent } from './componentpackage/product-status/product-status.component'
import { BrandListComponent } from './componentpackage/brand-list/brand-list.component'
import { BrandProductListComponent } from './componentpackage/brand-product-list/brand-product-list.component'
import { CartComponent } from './componentpackage/cart/cart.component'
import { StoresOrdersComponent } from './componentpackage/stores-orders/stores-orders.component'
import { StoresOrdersDetailsComponent } from './componentpackage/stores-orders-details/stores-orders-details.component'
import { ECommerceKeyComponent } from './componentpackage/e-commerce-key/e-commerce-key.component'
import { AddCommerceKeyComponent } from './componentpackage/add-commerce-key/add-commerce-key.component'
import { AddBigCommerceKeyComponent } from './componentpackage/add-big-commerce-key/add-big-commerce-key.component'
import { AddShopifyKeyComponent } from './componentpackage/add-shopify-key/add-shopify-key.component'
import{ShrinkProductsWebComponent} from './componentpackage/shrink-products-web/shrink-products-web.component'
import{PostDetailsComponent} from './componentpackage/post-details/post-details.component'
import{WoocommercetutorialComponent} from'./componentpackage/woocommercetutorial/woocommercetutorial.component'
import{SyncBigcommerceProductsComponent} from './componentpackage/sync-bigcommerce-products/sync-bigcommerce-products.component'
import{ChangeProfileComponent} from'./componentpackage/change-profile/change-profile.component'
import{EditAccountUserComponent} from'./componentpackage/edit-account-user/edit-account-user.component'
import{EditSubStoreComponent} from'./componentpackage/edit-sub-store/edit-sub-store.component'
import{AddTagComponent} from './componentpackage/add-tag/add-tag.component'
import{TagsListComponent} from './componentpackage/tags-list/tags-list.component'
import{PromocodeListComponent} from './componentpackage/promocode-list/promocode-list.component'
import{AddPromocodeComponent} from './componentpackage/add-promocode/add-promocode.component'
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: 'post/detail', component:PostDetailsComponent },
  {
    path: '',
    component: FullComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'online-order', component: OnlineOrderComponent },
      { path: ':accountype/add/store/brand', component: AddStoresComponent },
      { path: ':accountype/stores/list', component: AllstoresComponent },
      { path: ':accountype/add/accounts/:storeid', component: AddAccountsComponent },
      { path: ':accountype/view/sub-stores/:storeAcountId', component: SubStoresComponent },
      { path: ':accountype/view/accounts/:storeid', component: ViewAccountsComponent },
      { path: ':accountype/view/accounts/:storeid', component: ViewAccountsComponent },
      { path: ':accountype/add/sub-store', component: AddSubStoresComponent },
      { path: ':accountype/view/sub-store/posts/list/:SubStoreAccountId', component: PostListComponent },
      { path: ':accountype/view/posts/list/:StoreAccountId', component: PostListComponent },
      { path: ':accountype/view/posts/list', component: PostListComponent },
      { path: ':accountype/view/all/products/:store_Account_id', component: ViewProductComponent },
      { path: ':accountype/product/details/:id', component: ProductDetailsComponent },
      { path: ':accountype/view/all/products', component: ViewProductComponent },
      { path: ':accountype/add/product', component: AddProductComponent },
      { path: ':accountype/update/product/:id', component: EditProductComponent },
      { path: ':accountype/add/accounts', component: AddAccountsComponent },
      { path: ':accountype/add/accounts/:storeid', component: AddAccountsComponent },
      { path: ':accountype/add/sub-store/accounts/:sub_storeId', component: AddAccountsComponent },
      { path: ':accountype/view/accounts', component: ViewAccountsComponent },
      { path: ':accountype/view/sub-store/accounts/:sub_storeId', component: ViewAccountsComponent },
      { path: ':accountype/view/orders', component: OrdersComponent },
      { path: ':accountype/view/orders/:subStoreAccountId', component: OrdersComponent },
      { path: ':accountype/view/order/details/:order_Id', component: OrderDetailsComponent },
      { path: ':accountype/view/product/status/:productPublicId', component: ProductStatusComponent },
      { path: ':accountype/view/sub-stores', component: SubStoresComponent },
      { path: ':accountype/shopping/list', component: BrandListComponent },
      { path: ':accountype/brands/products/:brandId', component: BrandProductListComponent },
      { path: ':accountype/view/cart', component: CartComponent },
      { path: ':accountype/create/post', component: CreatePostComponent },
      { path: ':accountype/create/sub-store/post/:SubStoreAccountId', component: CreatePostComponent },
      { path: ':accountype/store/orders', component: StoresOrdersComponent },
      { path: ':accountype/store/order/detail/:storeOrderId', component: StoresOrdersDetailsComponent },
      { path: ':accountype/edit/post/:postId', component: PostEditComponent },
      { path: ':accountype/ecommerce/keys', component: ECommerceKeyComponent },
      { path: ':accountype/add/Woo-Commerce/key', component: AddCommerceKeyComponent },
      { path: ':accountype/edit/Woo-Commerce/key/:woocommerceKey', component: AddCommerceKeyComponent },
      { path: ':accountype/edit/BigCommerce/key/:woocommerceKey', component: AddBigCommerceKeyComponent },
      { path: ':accountype/add/BigCommerce/key', component: AddBigCommerceKeyComponent },
      { path: ':accountype/add/Shopify/key', component: AddShopifyKeyComponent },
      { path: ':accountype/sync/products/:woocommerceKey', component: ShrinkProductsWebComponent },
      { path: ':accountype/sync/products/bigcommerce/:bigcommerceKey', component: SyncBigcommerceProductsComponent },
      { path: ':accountype/tutorial/add/woocommerce/key', component: WoocommercetutorialComponent },
      { path: ':accountype/change/profile', component: ChangeProfileComponent },
      { path: ':accountype/edit/sub/store/:substoreId', component: EditSubStoreComponent },
      { path: ':accountype/edit/account/:accountId', component: EditAccountUserComponent },
      { path: ':accountype/tag', component: TagsListComponent },
      { path: ':accountype/coupons', component: PromocodeListComponent },
      { path: ':accountype/add/coupon', component: AddPromocodeComponent },
      { path: ':accountype/edit/coupon/:couponId', component: AddPromocodeComponent }
      //  {path:'admin',loadChildren:'./admincomponentpackage/admincomponentpackage.module#AdminComponentPackage'}
      // { path: 'admin', loadChildren: './admincomponentpackage/admincomponentpackage.module#AdminComponentPackage' }
    ]
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      { path: 'login', component: LoginComponent }
    ]

  },
  { path: '**', redirectTo: 'login' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
