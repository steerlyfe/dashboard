export  interface Login
{
    onLoginResponse(status: string,responseMessage:string)
}
export interface UploadImageUrl
{
    onUploadImageResponse(url:string)
}
export interface AddStore{
    onResponseAddStore(status:String ,message:string)
}
export interface AllStoreList{
    onResponseAllStoreList(status:String,storelist:Array<any>)
}
export interface AddAccount{
    onResponseAddAccount(status:String,message:string)
}
export interface ViewAccount{
    onResponseViewAccount(status:string,accountList:Array<any>)
}
export interface AddSubStore{
    onResponseAddSubStore(status:string,message:string)
}
export interface ViewSubStore{
    onResponseViewSubStore(status:string,subStoreList:Array<any>)
}
export interface  AddProduct{
    onResponseAddproduct(status:string,message:string)
}
export interface ViewProduct{
    onResponseViewProduct(status:string,productsList:Array<any>,pagenumberLimit:any)
}
export interface GetProductDetails{
    onResponseGetProductDetails(status:string,responsedata:any)
}
export interface UpdateProduct{
    onResponseUpdateProduct(status:string,responsedata:any)
}
export interface ChangeStatus{
    onResponseChangeAccountStatus(status:string,message:string)
}
export interface StoreStatus{
    onResponseStoreStatus(status:string,message:string)
}
export interface ProductStatus{
    onResponseProductStatus(status:string,message:string)
}
export interface AddPost{
    onResponseAddPost(status:string,message:string)
}
export interface GetPostData{
    onResponseGetPostData(status:string,postDataList:Array<any>,pagenumberLimit:any)
}
export interface PostStatus{
    onResponseGetPostStatus(status:string,message:string)
}
export interface AddStockInterface{
    onResponseGetAddStockInterface(status:string,message:string)
}
export interface GetOrderList{
    onResponseGetOrderListInterface(status:string,orderDataList:Array<any>,pagenumberLimit:any)
}
export interface GetOrderDetails{
    onResponseGetOrderDetailsterface(status:string,responsedata :any)
}
export interface GetOrderCount{
    onResponseGetOrderCountInterface(status:string,countTotal :any,countComplete:any,countCancalled:any,countPending:any)
}
export interface GetBrandProduct{
    onResponseGetBrandProductInterface(status:string,productList:Array<any>,pagenumberLimit:any)
}
export interface GetCartProductById{
    onResponseGetCartProductByIdInterface(status:string,productList:Array<any>)
}
export interface webOrderPlaced{
    onResponsewebOrderPlacedInterface(status:string,message:string)
}
export interface GetStoreOrders{
    onResponseGetStoreOrdersInterface(status:string,OrderList:Array<any>,pagenumberLimit:any)
}
export interface GetBrandOrders{
    onResponseGetBrandOrdersInterface(status:string,OrderList:Array<any>,pagenumberLimit:any)
}
export interface GetStoreOrderDetails{
    onResponseGetStoreOrderDetailsInterface(status:string,OrderList:any)
}

export interface GetStoreOrderCount{
    onResponseGetStoreOrderCountInterface(status:string,countTotal :any,countComplete:any,countCancalled:any,countPending:any)
}
export interface ChangeAppOrderStatus{
    onResponseChangeAppOrderStatusInterface(status:string,message:any)
}
export interface GetEditPostData{
    onResponsegetEditPostDataInterface(status:string,postDetail:any)
}
export interface UpdatePost{
    onResponseUpdatePostInterface(status:string,message:any)
}
export interface GetWooCommerceKey{
    onResponseGetWooCommerceKeyInterface(status:string,wooCommerce:any,bigCommerce:any)
}
export interface GetWooCommerceKeyDetailById{
    onResponseGetWooCommerceKeyDetailByIdInterface(status:string,keyDetails:any)
}
export interface AddWooCommerceKey{
    onResponseUpdatePostInterface(status:string,message:any)
}
export interface DeleteWooCommerceKey{
    onResponseDeleteWooCommerceKeyInterface(status:string,message:any)
}
export interface UpdateStatusWooCommerceKey{
    onResponseUpdatePostInterface(status:string,dataList:any)
}
export interface AddProductFromWeb{
    onResponseAddProductFromWebInterface(status:string,message:any)
}
export interface CheckBeforeAddProductFromWeb{
    onResponseCheckBeforeAddProductFromWebInterface(status:string,alreadyProductsIds:any)
}
export interface GetTagList{
    onResponseGetTagListInterface(status:string,TagsArrayList:any)
}
export interface AddTag{
    onResponseAddTagInterface(status:string,message:any)
}
export interface DeleteTagName{
    onResponseDeleteTagNameInterface(status:string,message:any)
}
export interface GetTagsListProduct{
    onResponseGetTagsListProductInterface(status:string,productList:Array<any>,pageperCount:any)
}
export interface TagProductStatusUpdate{
    onResponseGetTagProductStatusUpdateInterface(status:string,meesgae:string)
}
export interface GetCouponList{
    onResponseGetCouponListInterface(status:string,couponList:Array<any>,pagePercount:any)
}
export interface GetCouponProductList{
    onResponseGetCouponProductListInterface(status:string,productList:Array<any>)
}
export interface AddCoupon{
    onResponseAddCouponInterface(status:string,meesage:string)
}
export interface GetCouponDetails{
    onResponseGetCouponDetailsInterface(status:string,responeData:any)
}
export interface ChangeCouponStatus{
    onResponseChangeCouponStatusInterface(status:string,message:any)
}
export interface  CouponForApplyList{
    onResponseCouponForApplyListInterface(status:string,couponList:Array<any>)
}
export interface  CountCheckWithOrderId{
    onResponsecountCheckWithOrderIdInterface(status:string,payableAmountAfterDiscount:any,message:any,discountAmount:any,couponCountCheck:any)
}