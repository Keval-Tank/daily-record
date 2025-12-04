import { type Request, type Response, type NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import responses from '../utils/common'

export const validateRequest = (req : Request, res : Response, next : NextFunction) => {
    if(!req.body.modelNumber){
       responses.ErrorResponse.message = "Something went wrong while creating plane"
       responses.ErrorResponse.error = {explanation : "Model Number was not found"}
       return res.status(StatusCodes.BAD_REQUEST).json(responses.ErrorResponse)
    }
    next();
}