import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  RouterModule } from '@angular/router';


import{FormsModule,ReactiveFormsModule} from'@angular/forms';

import { NgxSpinnerModule } from "ngx-spinner";
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment.prod';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { MaterialModule } from '../material/material';
import { ComponentRoutes } from './admincomponentpackage.routing';
import { AddProductComponent } from './add-product/add-product.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import 'hammerjs';
import 'mousetrap';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import {GalleryModule} from '@ks89/angular-modal-gallery';
import { NgxBarcodeModule } from 'ngx-barcode';
@NgModule({
    imports:[
        CommonModule,
        RouterModule.forChild(ComponentRoutes),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        NgxSpinnerModule,
        AngularFireModule.initializeApp(environment.firebaseConfig, ''),
        AngularFireDatabaseModule,
        MaterialModule,
         AngularFireStorageModule,
        AngularFireAuthModule,
        GalleryModule.forRoot(),
        NgxQRCodeModule,
        NgxBarcodeModule

    ],
    declarations:[AddProductComponent, ViewProductComponent, ProductDetailsComponent, EditProductComponent],
    entryComponents:[]

})
export class AdminComponentPackage{}