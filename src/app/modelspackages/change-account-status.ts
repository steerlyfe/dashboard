export class ChangeAccountStatus{
    constructor(
        public accountPublicId:string,
        public type:string,
        public changeStatus:string,
    ){

    }    
}