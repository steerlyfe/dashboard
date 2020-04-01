export class OrderPlacedModal {
    constructor(
        public total_amount: any,
        public payment_info: Array<any>,
        public order_info: Array<ProductOrderInfoDetails>,
        public substoreId:any,    
        public couponUsed:any ,   
        public couponCount:any  ,  
        public couponId:any  ,  
        public couponDiscount:any   

    ) {

    }
}


export class ProductOrderInfoDetails {
    constructor(
        public product_id: string,
        public product_name: string,
        public product_image: any,
        public actual_price: any,
        public sale_price: any,
        public store_id: any,
        public store_name: any,
        public additional_feature: any,
        public additional_feature_price: any,
        public quantity: any
    ) {

    }
}