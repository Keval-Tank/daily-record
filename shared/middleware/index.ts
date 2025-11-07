import {type Request, type Response, type NextFunction} from 'express'
import { JWTPayload, type ServiceError } from '../types';
import {logError } from '../types/index'
import { createErrorResponse, createSuccessResponse } from '../utility';
import jwt, { VerifyErrors } from 'jsonwebtoken'

declare global {
    namespace Express {
        interface Request {
            user? : any
        }
    }
}

export function authenticateToken(req : Request, res : Response, next : NextFunction){
    if(!req.headers['authorization']){
        return res.status(401).json(createErrorResponse("Authorization header missing"))
    }
    const authHeader : string | undefined = req.headers['authorization'];
    const token = authHeader.split(" ")[1];

    if(!authHeader || !token){
        return res.status(401).json(createErrorResponse("Access token required"))
    }

    const jwtSecret = process.env.JWT_SECRET;
    if(!jwtSecret){
        logError(new Error("JWT_SECRET is not found"))
        return res.status(500).json(createErrorResponse("Invalid token"))
    }else{
        const decoded = jwt.verify(token, jwtSecret)
        if(!decoded){
            logError(new Error("Invalid token"))
            return;
        }
        req.user = decoded
        next()
    }
}

export function asyncHandler(fn:(req : Request, res : Response, next : NextFunction) => Promise<any>){
    return (req : Request,  res: Response, next : NextFunction) : void => {
        Promise.resolve(fn(req, res, next)).catch(next)
    };
}

export function validateRequest(schema : any){
    return (req : Request, res : Response, next : NextFunction) => {
        const {error} = schema.validate(req.body)
        
        if(error){
            const errors : Record<string, string[]> = {}
            error.details.forEach((detail : any) => {
                const field = detail.path.join('.');
                if(!error[field]){
                    errors[field] = [];
                }
                errors[field].push(detail.message);
            });
            return res.status(400).json({
                success : false,
                message : "Validation error",
                errors
            });
        }

        next();
    }
}

export function errorHandler(error : ServiceError, req : Request, res : Response, next : NextFunction){
    logError(error, {
        method : req.method,
        url : req.originalUrl,
        body : req.body,
        params : req.params,
        query : req.query
    })

    const statusCode : number = error.statusCode || 500
    const message : string = error.message || "Internal server error"

    res.status(statusCode).json(createErrorResponse(message))
    next();
}

export function corsOptions(){
    return {
        origin : process.env.CORS_ORIGIN || "http://localhost:3000",
        methods : ["GET","POST","PUT","DELETE", "OPTIONS"],
        allowHeaders : ["Content-Type", "Authorization"],
        credentials : process.env.CORS_CREDENTIALS === "true"
    }
}