import Joi from 'joi';

export const updateProfileSchema = Joi.object({
    firstname : Joi.string().min(1).max(50).optional(),
    lastname : Joi.string().min(1).max(50).optional(),
    bio : Joi.string().max(500).optional().allow(""),
    avatarUrl : Joi.string().uri().optional().allow(""),
    prefrences : Joi.object().optional()

})

