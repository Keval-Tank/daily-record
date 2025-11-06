import Joi from 'joi'

export const registrationSchema = Joi.object({
    email : Joi.string().email().required(),
    password : Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(^a-zA-Z\d).{8,}$/).required()
})

export const loginSchema = Joi.object({
    email : Joi.string().email().required(),
    password : Joi.string().required()
})

export const refreshTokenSchema = Joi.object({
    refreshToken : Joi.string().required()
})