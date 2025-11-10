import { TagServices } from "@services/tagService";
import { asyncHandler } from "@shared/middleware";
import { createErrorResponse, createSuccessResponse } from "@shared/utility";
import {Request, Response} from "express"

const tagServices = new TagServices();

export const createTag = asyncHandler(async(req: Request, res : Response) => {
    const userId = req.user?.userId
    if(!userId){
        throw res.status(401).json(createErrorResponse("Unauthorized"))
    }
    const tag = await tagServices.createTag(userId, req.body);

    res.status(200).json(createSuccessResponse(tag, "Tag created"))
})

export const getTags = asyncHandler(async(req : Request, res : Response) => {
    const userId = req.user?.userId
    if(!userId){
        throw res.status(401).json(createErrorResponse("Unauthorized"))
    }
    const page = parseInt(req.query.page as string) || 1
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100)
    const search = req.query.search as string

    const result = await tagServices.getTagsByUser(page, limit, search, userId)

    return res.status(200).json(createSuccessResponse({
        tags : result.tags,
        pagination : {
            page : result.page,
            limit,
            totalPages : result.total_pages,
            total : result.total
        }
    }, "Tags retrieved"))

})

export const getTagsById = asyncHandler(async(req : Request, res : Response) => {
    const userId = req.user?.userId
    const {tagId} = req.params
    if(!userId){
        return res.status(401).json(createErrorResponse("Unauthorized"))
    }
    const tags = await tagServices.getTagById(tagId, userId)

    return res.status(200).json(createSuccessResponse(tags, "Retirieved tags by user id"))
})

export const validateTags = asyncHandler(async(req : Request, res : Response) => {
    const userId = req.user?.userId;

    if(!userId){
        return res.status(401).json(createErrorResponse("Unauthorized"))
    }

    const {tagIds} = req.body

    const result = await tagServices.validateTags(tagIds, userId)

    return res.status(200).json(createSuccessResponse(result, "Validated Tags"))
})