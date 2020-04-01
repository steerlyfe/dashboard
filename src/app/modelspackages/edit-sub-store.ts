export class EditSubStoreModel{
    constructor(
        public storeId:string,
        public description:string,
        public address:any,
        public lat:any,
        public lng:any,
        public phoneNumber:string,
        public email:string,
        public openingTime:any,
        public closingTime:any,
        public bannerurl:any,
        public selectbannerurl:any,
        public errorMessage:string

    )
    {

    }
}