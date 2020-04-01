export class UpdateBrandOrdersStatus{
    constructor(
         public web_order_public_id:string,
         public product_id:any,
         public additional_feature:any,
         public status_to_update:any,
    ){

    }
}