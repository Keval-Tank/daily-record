import { createServiceError } from "@shared/utility";
import axios from "axios";

export interface TagValidationResponse {
    validTags: Array<{
        id: string,
        name: string,
        color?: string,
        userId?: string,
        createdAt: Date
    }>,
    invalidTags: string[]
}

export class TagsServiceClient {
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.TAG_SERVICE_URL || 'http://localhost:3004'
    }

    async valiadateTags(tagsIds: string[], authToken: string): Promise<TagValidationResponse> {
        try {
            const response = await axios.post(`${this.baseUrl}/tags/validate`, {
                tagsIds,
            },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authToken}`,
                    }
                }
            )

            if(!response.data.success){
                throw createServiceError("Tag validation failed", 400)
            }

            return response.data.data
        } catch (error :any) {
            if(!error.request){
                throw createServiceError("Tag service unavailable", 503)
            }
            throw createServiceError(error.message || "Unexpected Error occured", 500)
        }
    }

    async getTagsByIds(tags: string[], authToken : string) : Promise<Array<{
        id : string,
        name  :string,
        color? : string,
        userId? : string,
        createdAt : Date
    }>>{
        const validation = await this.valiadateTags(tags, authToken);

        if(validation.invalidTags.length > 0){
            throw createServiceError("Invalid tagIds", 400)
        }

        return validation.validTags;
    }


}

