import { type Request, type Response, type NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import responses from '../utils/common'

export const validateAirPortRequest = (req : Request, res : Response, next : NextFunction) => {
    if(!req.body.name){
       responses.ErrorResponse.message = "Something went wrong while creating Airport"
       responses.ErrorResponse.error = {explanation : "Name was not found"}
       return res.status(StatusCodes.BAD_REQUEST).json(responses.ErrorResponse)
    }
    if(!req.body.cityId){
       responses.ErrorResponse.message = "Something went wrong while creating Airport"
       responses.ErrorResponse.error = {explanation : "cityId was not found"}
       return res.status(StatusCodes.BAD_REQUEST).json(responses.ErrorResponse)
    }
    if(!req.body.code){
       responses.ErrorResponse.message = "Something went wrong while creating Airport"
       responses.ErrorResponse.error = {explanation : "code was not found"}
       return res.status(StatusCodes.BAD_REQUEST).json(responses.ErrorResponse)
    }
    next();
}