

import { UserService } from "@services/userService";
import { asyncHandler } from "@shared/middleware";
import { createErrorResponse, createSuccessResponse } from "@shared/utility";
import {type Request, type Response} from 'express'


const userService  = new UserService();

// control profile route
export const getProfile = asyncHandler(async(req : Request, res : Response) => {
    const userId = req.user?.userId;

    if(!userId){
        return res.status(401).json(createErrorResponse("User not authenticated"));
    }

    const profile = await userService.getProfile(userId);

    res.status(200).json(createSuccessResponse(profile, "User Profile retrieved"))
})

// update profile route
export const updateProfile = asyncHandler(async(req : Request, res : Response) => {
    const userId  = req.user?.userId;
    const updateData = req.body

    if(!userId || !updateData){
        return res.status(401).json(createErrorResponse("User not found"))
    }

    const updatedProfile = await userService.updateProfile(userId, updateData);

    res.status(200).json(createSuccessResponse(updatedProfile, "Profile updated successfully!"))
})

// delete profile
export const deleteProfile = asyncHandler(async(req : Request, res : Response) => {
    const userId = req.user?.userId;

    if(!userId){
        return res.status(401).json(createErrorResponse("User not authenticated"))
    }

    await userService.deleteProfile(userId);

    res.status(204).json(createSuccessResponse(null, "Profile deleted successfully"));
})




