import {CreateTagRequest, Tag} from '@shared/types/index'
import { sanitizeData } from '@shared/utility'
import { createErrorResponse , createServiceError, isValidUUID} from '@shared/utility';
import prisma from '@db/database'

export class TagServices{
    async createTag(userId : string, tagData : CreateTagRequest) : Promise<Tag> {
        const sanitizedName = sanitizeData(tagData.name);
        const sanitizedColor = tagData.color ? sanitizeData(tagData.color)  :undefined;

        if(sanitizedColor && !this.isValidHex(sanitizedColor)){
            throw createServiceError("Invalid color code")
        }
        try{
            const tag = await prisma.tags.create({
                data : {
                    userId, 
                    name : sanitizedName,
                    color : sanitizedColor
                }
            });
            return tag as Tag
        }catch(error : any){
            if(error.code === 'P2002'){
                throw createServiceError("Tag already exists", 409)
            }
            throw createServiceError("Failed to create a tag", 500)
        }
    }

    async getTagById(tagId : string, userId: string){
        if(!isValidUUID(tagId)){
            throw createServiceError("Invalid UUID")
        }
        const tag = await prisma.tags.findFirst({
            where : {
                id : tagId,
                userId
            }
        })
        if(!tag){
            throw createServiceError("Tag not found")
        }
        return tag as Tag;
    }

    async getTagsByUser(page : number, limit : number, search? : string, userId? : string) : Promise<
      {
        tags : Tag[],
        total : number,
        page : number,
        total_pages : number
      }
    >{
        const skip = (page-1)* limit;

        const whereClause : any = {
            userId
        }

        if(search){
            const sanitizedSearch = sanitizeData(search)
            const [tags, total] = await Promise.all([
                prisma.tags .findMany({
                    where : whereClause,
                    skip,
                    take : limit,
                    orderBy : {name : "asc"}
                }),
                prisma.tags.count({
                    where : whereClause
                }),
            ])
            const totalPages  = Math.ceil(total / limit)

            return {
                tags : tags as Tag[],
                total,
                page,
                total_pages:totalPages
            }
        }
    }

    async validateTags(tagsId : string[], userId : string) : Promise<{
        validTags : Tag[],
        invalidTags : string[]
    }>{
        const validTags : Tag[] = [];
        const invalidTags : string[] = []

        for(let tagId of tagsId){
            if(!isValidUUID(tagId)){
                invalidTags.push(tagId)
                continue;
            }

            try {
               const tag = await this.getTagById(tagId, userId)
               validTags.push(tag)
            } catch (error) {
                invalidTags.push(tagId)
            }
        }

        return {validTags, invalidTags}

    }

    private isValidHex(color : string) : boolean{
        const hexColorCode = /^#([A-Fa-f0-9]{6} | [A-Fa-f0-9]{3})$/;
        return hexColorCode.test(color);
    }
}