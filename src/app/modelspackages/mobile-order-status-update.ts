export class MobileAppOrderStatusUpdate{
     constructor(
          public order_public_id:string,
          public product_id:any,
          public product_availability:any,
          public additional_feature:any,
          public status_to_update:any,
     ){

     }
}