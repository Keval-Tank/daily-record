import { CreateNoteRequest, UpdateNoteRequest } from "@shared/types";
import {Note} from "@shared/types/index"
import { createServiceError, sanitizeData } from "@shared/utility";
import prisma from "@db/database"

export class NoteServices{
    constructor(){}

    async createNote(userId : string, noteData : CreateNoteRequest, authToken? : string) : Promise<Note> {
        const sanitizedTitle = sanitizeData(noteData.title)
        const sanitizedNoteData = sanitizeData(noteData.content)

        const note = await prisma.note.create({
            data : {
                userId,
                title : sanitizedTitle,
                content : sanitizedNoteData
            },
            include : {
                noteTags : true
            }
        })

        return note as Note;
    }

    async getNoteById(userId : string, noteId : string) : Promise<Note> {
        const note = await prisma.note.findFirst({
            where : {
                id : noteId,
                userId
            },
            include : {
                noteTags : true
            }
        })

        if(!note){
            throw createServiceError("Note not found", 404)
        }
        return note as Note
    }

}