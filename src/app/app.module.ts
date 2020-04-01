import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material/material'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './componentpackage/login/login.component';
import { DashboardComponent } from './componentpackage/dashboard/dashboard.component';
import { FullComponent } from './layout/full/full.component';
import { BlankComponent } from './layout/blank/blank.component';
import { SidebarComponent } from './header/sidebar/sidebar.component';
import { NavbarComponent } from './header/navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AddStoresComponent } from './componentpackage/add-stores/add-stores.component';
import { AllstoresComponent } from './componentpackage/allstores/allstores.component';
import { AddProductComponent } from './componentpackage/add-product/add-product.component';
import { ViewProductComponent } from './componentpackage/view-product/view-product.component';
import { EditProductComponent } from './componentpackage/edit-product/edit-product.component';
import { ProductDetailsComponent } from './componentpackage/product-details/product-details.component';
import { OnlineOrderComponent } from './componentpackage/online-order/online-order.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from "ngx-spinner";
import { CookieService } from 'ngx-cookie-service';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage'
import { AngularFirestoreModule } from '@angular/fire/firestore'
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { DailogboxComponent } from './componentpackage/dailogbox/dailogbox.component';
import { SubStoresComponent } from './componentpackage/sub-stores/sub-stores.component';
import { AddSubStoresComponent } from './componentpackage/add-sub-stores/add-sub-stores.component';
import { AddAccountsComponent } from './componentpackage/add-accounts/add-accounts.component';
import { ViewAccountsComponent } from './componentpackage/view-accounts/view-accounts.component';
import { AgmCoreModule } from '@agm/core';
import { DatePipe } from '@angular/common';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { EditAccountComponent } from './componentpackage/edit-account/edit-account.component';
// import { NgxTagsInputModule } from 'ngx-tags-input';
// import { CookieModule } from 'ngx-cookie';
// import { NgxGalleryModule } from 'ngx-gallery';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import 'hammerjs';
import 'mousetrap';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import { NgxBarcodeModule } from 'ngx-barcode';
import { CreatePostComponent } from './componentpackage/create-post/create-post.component';
import { PostListComponent } from './componentpackage/post-list/post-list.component';
import { PostEditComponent } from './componentpackage/post-edit/post-edit.component';
import { TimeAgoPipe } from 'time-ago-pipe';
import { ScrollTracker } from './ScrollTracker.directive';
import { OrdersComponent } from './componentpackage/orders/orders.component';
import { OrderDetailsComponent } from './componentpackage/order-details/order-details.component';
import { ProductStatusComponent } from './componentpackage/product-status/product-status.component';
import { BrandListComponent } from './componentpackage/brand-list/brand-list.component';
import { BrandProductListComponent } from './componentpackage/brand-product-list/brand-product-list.component';
import { CartComponent } from './componentpackage/cart/cart.component';
import { StoresOrdersComponent } from './componentpackage/stores-orders/stores-orders.component';
import { StoresOrdersDetailsComponent } from './componentpackage/stores-orders-details/stores-orders-details.component';
import { AddPromocodeComponent } from './componentpackage/add-promocode/add-promocode.component';
import { PromocodeListComponent } from './componentpackage/promocode-list/promocode-list.component';
import { EditPostComponent } from './componentpackage/edit-post/edit-post.component';
import { ECommerceKeyComponent } from './componentpackage/e-commerce-key/e-commerce-key.component';
import { AddCommerceKeyComponent } from './componentpackage/add-commerce-key/add-commerce-key.component';
import { AddBigCommerceKeyComponent } from './componentpackage/add-big-commerce-key/add-big-commerce-key.component';
import { AddShopifyKeyComponent } from './componentpackage/add-shopify-key/add-shopify-key.component';
import { ShrinkProductsWebComponent } from './componentpackage/shrink-products-web/shrink-products-web.component';
import { PostDetailsComponent } from './componentpackage/post-details/post-details.component';
import { WoocommercetutorialComponent } from './componentpackage/woocommercetutorial/woocommercetutorial.component';
import { SyncBigcommerceProductsComponent } from './componentpackage/sync-bigcommerce-products/sync-bigcommerce-products.component';
import { ChangeProfileComponent } from './componentpackage/change-profile/change-profile.component';
import { EditAccountUserComponent } from './componentpackage/edit-account-user/edit-account-user.component';
import { EditSubStoreComponent } from './componentpackage/edit-sub-store/edit-sub-store.component';
import { TagsListComponent } from './componentpackage/tags-list/tags-list.component';
import { AddTagComponent } from './componentpackage/add-tag/add-tag.component';
// import { ConvertIntoTextPipe } from './convert-into-text.pipe';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { TagInputModule } from 'ngx-chips';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    FullComponent,
    BlankComponent,
    SidebarComponent,
    NavbarComponent,
    AddStoresComponent,
    AllstoresComponent,
    OnlineOrderComponent,
    DailogboxComponent,
    SubStoresComponent,
    AddSubStoresComponent,
    AddAccountsComponent,
    ViewAccountsComponent,
    EditAccountComponent,
    AddProductComponent,
    ViewProductComponent,
    ProductDetailsComponent,
    EditProductComponent,
    CreatePostComponent,
    PostListComponent,
    PostEditComponent,
    TimeAgoPipe,
    ScrollTracker,
    OrdersComponent,
    OrderDetailsComponent,
    ProductStatusComponent,
    BrandListComponent,
    BrandProductListComponent,
    CartComponent,
    StoresOrdersComponent,
    StoresOrdersDetailsComponent,
    AddPromocodeComponent,
    PromocodeListComponent,
    EditPostComponent,
    ECommerceKeyComponent,
    AddCommerceKeyComponent,
    AddBigCommerceKeyComponent,
    AddShopifyKeyComponent,
    ShrinkProductsWebComponent,
    PostDetailsComponent,
    WoocommercetutorialComponent,
    SyncBigcommerceProductsComponent,
    ChangeProfileComponent,
    EditAccountUserComponent,
    EditSubStoreComponent,
    TagsListComponent,
    AddTagComponent,
    // ConvertIntoTextPipe


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, ''),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    HttpClientModule,
    NgxSpinnerModule,
    AngularFireAuthModule,
    TagInputModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDgGMTzz9uhLFD7r1oefNrstuVAsXd3C9w',
      libraries: ["places"]
    }),
    NgxMaterialTimepickerModule,
    GalleryModule.forRoot(),
    NgxQRCodeModule,
    NgbModule,
    NgxBarcodeModule
    // NgxGalleryModule
    // NgxTagsInputModule
    // CookieModule.forRoot()

  ],
  entryComponents: [DailogboxComponent],
  providers: [{
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,

  },
  { provide: LocationStrategy, useClass: HashLocationStrategy },
    CookieService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
