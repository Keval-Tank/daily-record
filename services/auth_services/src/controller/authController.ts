// this file contains functions that run when request is made to a route
import { AuthService } from "@services/authService";
import {type Request, type Response} from 'express';
import { asyncHandler } from "@shared/middleware/index";
import { createErrorResponse, createSuccessResponse } from "@shared/utility";

const authService = new AuthService();

export const register = asyncHandler(async (req : Request, res : Response) => {
    const {email, password} = req.body;
    const tokens = await authService.register(email, password);
    return res.status(201).json(createSuccessResponse(tokens, "User Registered Successfully"))
})

export const login = asyncHandler(async (req: Request, res : Response) => {
    const { email, password} = req.body;
    const tokens = await authService.login(email, password);
    return res.status(200).json(createSuccessResponse(tokens, "Logged in successfully"))
})

// refresh token
export const refreshToken = asyncHandler(async (req : Request, res : Response) => {
    const {refreshToken} = req.body
    const token = await authService.refreshToken(refreshToken);
    return res.status(200).json(createSuccessResponse(token, "Token Refreshed Successfully"))
})

// logout
export const logout = asyncHandler(async(req : Request, res : Response) => {
    const {refreshToken} = req.body;
    await authService.logout(refreshToken)
    req.user = '';
    req.headers['authorization'] = '';
    return res.status(200).json(createSuccessResponse(null, "Logged Out Successfully"))
})

// validate token
export const validateToken = asyncHandler(async(req: Request, res : Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(" ")[1];
    
    if(!token || !authHeader){
        return res.status(401).json(createErrorResponse("Unauthorized"))    
    }

    const payload = await authService.verifyToken(token)

    return res.status(200).json(createSuccessResponse(payload, "Token validated"))
})

// get User
export const getUserData = asyncHandler(async(req : Request, res : Response) => {
    const userId = req.user?.userId;
    if(!userId){
        throw createErrorResponse("Unauthorized")
    }
    const userData = await authService.getUserById(userId)
    return res.status(200).json(createSuccessResponse(userData, "User profile retrieved"))
})

// delete user
export const deleteUser = asyncHandler(async(req : Request, res : Response) => {
    const userId = req.user?.userId;
    if(!userId){
        throw createErrorResponse("Unauthorized")
    }
    await authService.deleteUser(userId)
    return res.status(200).json(createSuccessResponse(null, "User profile deleted"))
})