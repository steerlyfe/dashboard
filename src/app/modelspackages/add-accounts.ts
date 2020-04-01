export class AddAccountModal{
    constructor(
        public storeAccountId:string,
        public accountName:string,
        public email:string,
        public password:string,
        public conPassword:string,
        public accountType:string,
        public sub_store_account_id :string
    ){

    }    
}