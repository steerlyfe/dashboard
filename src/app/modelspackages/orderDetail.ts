export class OrderDetailModal {
    constructor(
        public store_order_id: any,
        public order_id: any,
        public store_order_public_id: any,
        public store_id: any,
        public sub_store_id: any,
        public total_amount: any,
        public order_time: any,
        public address_Details: any,
        public pincode: any,
        public full_name: any,
        public phone_number: any,
        public productOrderInfo: Array<ProductInfoDetails>,
        public orderStatus:any
    ) {

    }
}


export class ProductInfoDetails {
    constructor(
        public product_id: string,
        public product_name: string,
        public product_image: string,
        public actual_price: string,
        public sale_price: string,
        public store_id: string,
        public store_name: string,
        public sub_store_id: string,
        public sub_store_address: string,
        public product_availability: string,
        public product_availability_price: string,
        public additional_feature: string,
        public additional_feature_price: string,
        public quantity: string,
        public producttsatus:any,
        public productstatusTime:any
    ) {

    }
}