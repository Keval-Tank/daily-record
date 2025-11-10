import { Request, Response , NextFunction} from "express";
import jwt from 'jsonwebtoken'
import {createErrorResponse} from '@shared/utility/index'

declare global{
    namespace Express{
        interface Request {
            user : any
        }
    }
}

const publicRoutes = [
    "/health",
    "/",
    "/api/auth/register",
    "/api/auth/login",
    "/api/auth/refresh"
]

export function isPublicRoute(path : string) : boolean {
    return publicRoutes.some((route) => {
        if(route.endsWith("*")){
            return path.startsWith(route.slice(0,-1))
        }
        return path === route || path.startsWith(route + "/")
    })
}

export function gatewayAuth(req : Request, res : Response , next : NextFunction){
    if(isPublicRoute(req.path)){
        return next();
    }

    const authHeader = req.headers["authorization"]
    const token = authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json(createErrorResponse("Invalid or expired token"))
    }

    const jwtSecret = process.env.JWT_SECRET;

    if(!jwtSecret){
        return res.status(503).json(createErrorResponse("Server configuration error, Secret not found"))
    }

    jwt.verify(token, jwtSecret, (err : any, decoded : any) => {
        if(err){
            return res.status(403).json(createErrorResponse("Invalid or expired token"))
        }

        req.user = decoded;

        req.headers['x-user-id'] = decoded.userId
        req.headers['x-user-email'] = decoded.email

        next();
    })
}