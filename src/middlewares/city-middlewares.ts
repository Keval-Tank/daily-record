import { type Request, type Response, type NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import responses from '../utils/common'

export const validateCityRequest = (req : Request, res : Response, next : NextFunction) => {
    if(!req.body.name){
       responses.ErrorResponse.message = "Something went wrong while creating City"
       responses.ErrorResponse.error = {explanation : "City name was not found"}
       return res.status(StatusCodes.BAD_REQUEST).json(responses.ErrorResponse)
    }
    next();
}