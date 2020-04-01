export class ChangeStoreStatus{
    constructor(
        public accountPublicId:string,
        public type:string,
        public changeStatus:string,
    ){

    }    
}