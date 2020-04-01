export class AddProductModel{
    constructor(
        public categoryId :Array<any>,
        public productName :string,
        // public storeAccounId :string,
        public substoreAccounId :string,
        public actualPrice :any,
        public salePrice :any,
        public stock :any,
        public barcode :any,
        public imageUrl :Array<any>,
        public selectedImagesValue :Array<any>,
        public errorMessage:string,
        public description:string,
        public firebaseimageurl:Array<any>,
        public additionalOptionsList:Array<any>,
        public finalAdditionOptionArray:Array<any>,
        public additionInfolist:Array<any>,
        public productAvailabilityList:Array<any>,
        public instock:any,
        public deliver_now:any,
        public shipping:any,
        public deliver_charges:any,
        public shippingcharges:any,

        
    )
    {

    }
}
//  export class inputFields{
//      constructor(
//          public type:string,
//          public inputField:string,
//          public additionprice:string 
//      ){

//      }
//  }