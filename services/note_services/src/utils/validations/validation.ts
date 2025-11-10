import Joi from 'joi'

export const createNoteSchema = Joi.object({
    title : Joi.string().min(1).max(20).required(),
    content : Joi.string().min(1).max(5000).required(),
    tagIds : Joi.array().items(Joi.string().uuid()).optional
})

export const updateNoteSchema = Joi.object({
    title : Joi.string().min(1).max(20).optional(),
    content : Joi.string().min(1).max(5000).optional(),
    tagIds : Joi.array().items(Joi.string().uuid()).optional
})

export const getNotesByUserSchema = Joi.object({
    page : Joi.number().integer().min(1).optional().default(1),
    limit : Joi.number().integer().min(1).max(100).optional().default(10),
    search : Joi.string().max(200).optional()
})
