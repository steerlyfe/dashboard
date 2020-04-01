import { Routes } from '@angular/router'
import{AddProductComponent} from'./add-product/add-product.component'
import{ViewProductComponent} from'./view-product/view-product.component'
import{ProductDetailsComponent} from './product-details/product-details.component'
import{EditProductComponent} from './edit-product/edit-product.component'
import { AddAccountsComponent } from '../componentpackage/add-accounts/add-accounts.component';
export const ComponentRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'add/product',
                component: AddProductComponent
            
            },
            {
                path: 'view/all/products',
                component: ViewProductComponent
             
            }
            ,
            {
                path: 'product/details/:id',
                component: ProductDetailsComponent
               
            }
            ,
            {
                path: 'update/product/:id',
                component: EditProductComponent
               
            },
            
           
        ]

    }

];