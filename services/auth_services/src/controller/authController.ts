// this file contains functions that run when request is made to a route
import { AuthService } from "@services/authService";
import {type Request, type Response} from 'express';
import { asyncHandler } from "@shared/middleware/index";
import { createSuccessResponse } from "../../../../shared/utility";

const authService = new AuthService();

export const register = asyncHandler(async (req : Request, res : Response) => {
    const {email, password} = req.body;
    const tokens = await authService.register(email, password);
    res.status(201).json(createSuccessResponse(tokens, "User Registered Successfully"))
})

export const login = asyncHandler(async (req: Request, res : Response) => {
    const { email, password} = req.body;
    const tokens = await authService.login(email, password);
    res.status(200).json(createSuccessResponse(tokens, "Logged in successfully"))
})