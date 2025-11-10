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

export function logError(error : Error, context? : Record<string, any>) : void {
    console.error("Error Occured", {
        message : error.message,
        stack : error.stack,
        context,
        timeStamp : new Date().toISOString()
    });
}

export interface UserProfile {
    id : string,
    userId : string,
    firstName? : string | null,
    lastName? : string | null,
    bio? : string | null,
    avatarUrl? : string | null,
    prefrences? : any,
    createdAt : Date,
    updatedAt : Date
}

export interface UpdateProfileRequest{
    firstName ? : string | null,
    lastName ? : string | null,
    bio ? : string | null,
    avatarUrl ? : string | null,
    prefrences ? : Record<string, any>
}

export interface ServiceResponse<T = any> {
    success : boolean,
    data? : T,
    message? : string,
    error? : string,
    statusCode? : number
}

export interface CreateNoteRequest{
    title : string,
    content : string,
    tagIds? : string[]
}

export interface UpdateNoteRequest{
    title? : string,
    content? : string,
    tagIds? :string[]
}

export interface Tag{
    id : string,
    name : string,
    color? : string,
    userId : string,
    updatedAt : Date
}

export interface Note{
    id : string,
    userId : string,
    title : string,
    content : string,
    isDeleted : boolean,
    createdAt : Date,
    updatedAt : Date,
    tags? : Tag[]
}

export interface CreateTagRequest {
    name : string,
    color? : string
}