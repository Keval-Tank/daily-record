import { StatusCodes } from "http-status-codes";
import {response, type Request, type Response} from 'express'
import services from "../services";
import responses from "../utils/common"

const createFlight = async(req : Request, res : Response) => {
    try{
        const data = {
            flightNumber : req.body.flightNumber,
            airplaneId : parseInt(req.body.airplaneId),
            departureAirportId : req.body.departureAirportId,
            arrivalAirportId : req.body.arrivalAirportId,
            arrivalTime : new Date(req.body.arrivalTime),
            departureTime : new Date(req.body.departureTime),
            price : parseInt(req.body.price),
            totalSeats : parseInt(req.body.totalSeats)

        }
        const result = await services.AirplaneService.createAirplane(data);
        responses.SuccessResponse.data = result;
        responses.SuccessResponse.message = "Flight created Successfully"
        return res.status(StatusCodes.CREATED).json(responses.SuccessResponse)
    }catch(err : any){
        responses.ErrorResponse.error=err
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responses.ErrorResponse)
    }
}

export default {
    createFlight
}

