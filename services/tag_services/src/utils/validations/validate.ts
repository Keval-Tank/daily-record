import Joi from 'joi'

export const createTagSchema = Joi.object({
    name : Joi.string().min(1).max(500).pattern(/^[a-zA-Z0-9\s\-_]+$/).required(),
    color : Joi.string().pattern(/^#([A-Fa-f0-9]{6} | [A-Fa-f0-9]{3})$/).optional().allow(null , " ")
})

export const updateTagSchema = Joi.object({
    name : Joi.string().min(1).max(500).pattern(/^[a-zA-Z0-9\s\-_]+$/).optional(),
    color : Joi.string().pattern(/^#([A-Fa-f0-9]{6} | [A-Fa-f0-9]{3})$/).optional().allow(null , " ")
})

export const getTagsByUserSchema = Joi.object({
    page : Joi.number().integer().min(1).optional().default(1),
    limit : Joi.number().integer().min(1).max(500).optional().default(50),
    search : Joi.string().min(1).max(100).optional()
})