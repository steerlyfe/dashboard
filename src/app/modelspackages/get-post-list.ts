export class GetPostList{
    constructor(
        public categoryId :any,
        public type :string ,
        public count:number,
        public subStoreAccountId:string,
        public StoreAccountId:string
        
    )
    {

    }
}