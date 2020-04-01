export class CookiesModal {
    constructor(
        public userId:string,
        public accountId: string,
        public fullName:string,
        public email: string,
        public authToken:string,
        public sessionToken:string,
        public accountType: string,
        ) {

    }
}
  export class StoreDetailsModal
  {
       constructor(
           public LoginstoreId:string,
           public LoginstoreAccountId:string,
           public LoginstoreName:string,
           public LoginimageUrl:string,
           public LoginstoreType:string
       ){

       }
  }
  export class SubStoreDetailsModal
  {
       constructor(
           public loginSubStoreId:string,
           public loginSubStoreAccountId:string,
       ){

       }
  }