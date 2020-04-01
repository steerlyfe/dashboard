export class CreatePost{
    constructor(
        public content:string,
        public imageUrl:Array<any>,
        public selectedImageUrl:Array<any>,
        public firebaseUploadImage:Array<any>,
        public categoryId:Array<any>,
        public subStoreAccountId:any
    ){

    }    
}