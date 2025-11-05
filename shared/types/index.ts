export interface User{
    id : string
    email : string
    createdAt : Date
    updatedAt : Date
}

export interface ApiResponse<T = any>{
    success : boolean
    data? : T
    message? : string
    error? : string
}

export interface AuthToken{
    accessToken : string
    refreshToken : string
}

export interface JWTPayload{
    userId : string
    email : string
    iat : number
    exp : number
}

export class ServiceError extends Error {
    statusCode : number
    code? : string
    details? : string

    constructor(message : string, statusCode : number = 500, code?: string, details? : any){
        super(message);
        this.statusCode = statusCode;
        if(code){
            this.code = code
        }
        if(details){
            this.details = details
        }
    }
}