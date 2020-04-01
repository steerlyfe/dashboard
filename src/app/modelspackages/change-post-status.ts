export class ChangePostStatus{
    constructor(
        public postAccountPublicId:string,
        public type:string,
        public changeStatus:string,
    ){

    }    
}