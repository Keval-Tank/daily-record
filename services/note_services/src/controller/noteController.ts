import {NoteServices} from '@services/noteServices'
import { asyncHandler } from '@shared/middleware'
import {Request, Response} from 'express'
import { createErrorResponse, createServiceError, createSuccessResponse, parseEnvInt } from '@shared/utility'

const noteServices = new NoteServices()

export const createNote = asyncHandler(async(req : Request, res : Response) => {
    const userId = req.user?.userId;

    if(!userId){
        throw createErrorResponse("Unauthorized")
    }

    const authHeader = req.headers["authorization"]
    const authToken = authHeader.split(" ")[1];
    if(!authToken){
        throw createErrorResponse("Invalid or expired Token")
    }

    const note = await noteServices.createNote(userId, req.body, authToken)

    res.status(201).json(createSuccessResponse(note, "Note found successfully"))
})

export const getNotes = asyncHandler(async(req : Request, res : Response) => {
    const userId = req.user?.userId;

    if(userId) {
        res.status(401).json(createErrorResponse("Unauthorized"))
    }

    const page = parseEnvInt(req.query.page as string, 1);
    const limit = parseEnvInt(req.query.limit as string, 50);
    const search = req.query.search as string

    const result = await noteServices.getNotesByUser(userId,page,limit,search);

    return res.status(200).json(createSuccessResponse(result, "Notes Retrieved Successfully"))
})

export const getNoteById = asyncHandler(async(req: Request, res : Response) => {
    const userId = req.user?.userId
    const {noteId} = req.params
    if(!userId){
        throw createErrorResponse("Unauthorized")
    }
    const authHeader = req.headers["authorization"]
    const token = authHeader.split(" ")[1]
    if(!token){
        throw createErrorResponse("Invalid or expired token")
    }
    const note = await noteServices.getNoteById(userId, noteId);

    return res.status(200).json(createSuccessResponse(note, "Note retrieved"))
})