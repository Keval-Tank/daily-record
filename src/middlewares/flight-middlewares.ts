import { type Request, type Response, type NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import responses from '../utils/common'

export const validateFlightRequest = (req : Request, res : Response, next : NextFunction) => {
    if(!req.body.flightNumber){
       responses.ErrorResponse.message = "Something went wrong while creating flight"
       responses.ErrorResponse.error = {explanation : "Flight Number was not found"}
       return res.status(StatusCodes.BAD_REQUEST).json(responses.ErrorResponse)
    }
     if(!req.body.airplaneId){
       responses.ErrorResponse.message = "Something went wrong while creating flight"
       responses.ErrorResponse.error = {explanation : "airplane id was not found"}
       return res.status(StatusCodes.BAD_REQUEST).json(responses.ErrorResponse)
    }
     if(!req.body.departureAirportId){
       responses.ErrorResponse.message = "Something went wrong while creating flight"
       responses.ErrorResponse.error = {explanation : "Departure Airport id was not found"}
       return res.status(StatusCodes.BAD_REQUEST).json(responses.ErrorResponse)
    }
     if(!req.body.arrivalAirportId){
       responses.ErrorResponse.message = "Something went wrong while creating flight"
       responses.ErrorResponse.error = {explanation : "arrival airport id was not found"}
       return res.status(StatusCodes.BAD_REQUEST).json(responses.ErrorResponse)
    }
     if(!req.body.arrivalTime){
       responses.ErrorResponse.message = "Something went wrong while creating flight"
       responses.ErrorResponse.error = {explanation : "Arrival Time was not found"}
       return res.status(StatusCodes.BAD_REQUEST).json(responses.ErrorResponse)
    }
     if(!req.body.departureTime){
       responses.ErrorResponse.message = "Something went wrong while creating flight"
       responses.ErrorResponse.error = {explanation : "departure time was not found"}
       return res.status(StatusCodes.BAD_REQUEST).json(responses.ErrorResponse)
    }
     if(!req.body.price){
       responses.ErrorResponse.message = "Something went wrong while creating flight"
       responses.ErrorResponse.error = {explanation : "price was not found"}
       return res.status(StatusCodes.BAD_REQUEST).json(responses.ErrorResponse)
    }
     if(!req.body.totalSeats){
       responses.ErrorResponse.message = "Something went wrong while creating flight"
       responses.ErrorResponse.error = {explanation : "totalSeats was not found"}
       return res.status(StatusCodes.BAD_REQUEST).json(responses.ErrorResponse)
    }

    next();
}