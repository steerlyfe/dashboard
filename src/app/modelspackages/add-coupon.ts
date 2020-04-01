export class AddCouponModal{
    constructor(
        public coupon_code:string,
        public coupon_start_time:any,
        public coupon_end_time:any,
        public coupon_type:string,
        public usedby_count_or_end_date:string,
        public more_then_amount:string,
        public discount_type :string,
        public discount_amount :any,
        public discount_percentage :any,
        public number_of_coupon :any,
        public discount_percentage_amount_upto :any,
        public products_list :Array<any>,
    ){

    }    
}