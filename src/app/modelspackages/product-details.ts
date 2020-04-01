import { Image } from '@ks89/angular-modal-gallery';

export class ProductDetails{
    constructor(
        public productId:any,
        public productImages:Array<Image>,
        public productName:string,
        public productCategory:Array<any>,
        public productPrice:string,
        public productSaleprice:string,
        public  productStrock:string,
        public  productBarcode:string,
        public productDescription:string,
        public productadditionOptionList:Array<any>,
        public product_availability_list:Array<any>,
        public productquantitytype:Array<any>,
        public productadditionalinfo:Array<any>
    ){

    }    
}