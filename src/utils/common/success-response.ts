interface SuccessResponse{
    success : boolean,
    message : string,
    data  : any,
    error : any 
}
export const successResponse : SuccessResponse = {
    success : true,
    message : "Something went wrong",
    data : {},
    error : {}
}