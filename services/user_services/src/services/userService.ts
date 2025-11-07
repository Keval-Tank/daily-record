import { AuthClient } from "@auth/authClient";
import { UpdateProfileRequest, UserProfile} from "@shared/types/index";
import prisma from '@db/database'
import { createServiceError, sanitizeData } from "@shared/utility/index";

export class UserService{
    private readonly authClient;

    constructor(){
        this.authClient = new AuthClient();
    }

    // create profile
    async createProfile(userId : string, profileData: Partial<UpdateProfileRequest>) : Promise<UserProfile> {
        const existingProfile = await prisma.userProfile.findUnique({
            where : {userId}
        })

        if(existingProfile){
            throw createServiceError("Profile already exists")
        }

        const sanitized_profile_data = this.sanitizedData(profileData);

        const profile = await prisma.userProfile.create({
            data : {
                userId,
                ...sanitized_profile_data
            }
        })

        return profile
    }

    // update profile
    async updateProfile(userId : string, updateData : Partial<UpdateProfileRequest>) : Promise<UserProfile>{
        const user_exist = await prisma.userProfile.findUnique({
            where : {userId}
        })

        if(!user_exist){
            throw createServiceError("User Not Found", 404)
        }

        const sanitized_input = this.sanitizedData(updateData);

        const updated = await prisma.userProfile.update({
            where : {userId},
            data : sanitized_input
        })

        return updated;
    }

    // delete profile
    async deleteProfile(userId : string) : Promise<void> {
        const user_exist = await prisma.userProfile.findUnique({
            where : {userId}
        })
        if(!user_exist){
            throw createServiceError("User Not Found", 404)
        }
        await prisma.userProfile.delete({
            where : {userId}
        })
    }

    // getProfile
    async getProfile(userId : string) : Promise<UserProfile>{
        const user_profile = await prisma.userProfile.findUnique({
            where : {userId}
        })
        if(!user_profile){
            throw createServiceError("Profile Not Found!", 404)
        }
        return user_profile
    }

    private sanitizedData(data : Partial<UpdateProfileRequest>) : Partial<UpdateProfileRequest>{
        const sanitized_data : any = {};
        if(data.firstName !== undefined){
            sanitized_data.firstName = data.firstName ? sanitizeData(data.firstName) : null;
        }
        if(data.lastName !== undefined){
            sanitized_data.lastName = data.lastName ? sanitizeData(data.lastName) : null;
        }
        if(data.bio !== undefined){
            sanitized_data.bio = data.bio ? sanitizeData(data.bio) : null;
        }
        if(data.avatarUrl !== undefined){
            sanitized_data.avatarUrl = data.avatarUrl ? sanitizeData(data.avatarUrl) : null;
        }
        if(data.prefrences !== undefined){
            sanitized_data.prefrences = data.prefrences ? data.prefrences : null
        }
        return sanitized_data;
    }
}
