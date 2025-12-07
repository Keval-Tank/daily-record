import { StatusCodes } from "http-status-codes";
import { response, type Request, type Response } from 'express'
import services from "../services";
import responses from "../utils/common"

const createFlight = async (req: Request, res: Response) => {
    try {
        const data = {
            flightNumber: req.body.flightNumber,
            airplaneId: parseInt(req.body.airplaneId),
            departureAirportId: req.body.departureAirportId,
            arrivalAirportId: req.body.arrivalAirportId,
            arrivalTime: new Date(req.body.arrivalTime),
            departureTime: new Date(req.body.departureTime),
            price: parseInt(req.body.price),
            totalSeats: parseInt(req.body.totalSeats)

        }
        const result = await services.FlightServices.createFlight(data);
        responses.SuccessResponse.data = result;
        responses.SuccessResponse.message = "Flight created Successfully"
        return res.status(StatusCodes.CREATED).json(responses.SuccessResponse)
    } catch (err: any) {
        responses.ErrorResponse.error = err
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responses.ErrorResponse)
    }
}

const getFlights = async (req: Request, res: Response) => {
    try {
        const result = await services.FlightServices.getAllFlights(req.query);
        responses.SuccessResponse.data = result;
        responses.SuccessResponse.message = "All Avialable Flights"
        return res.status(StatusCodes.OK).json(responses.SuccessResponse)
    } catch (err: any) {
        responses.ErrorResponse.error = err
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responses.ErrorResponse)
    }
}

const getFlight = async (req: Request, res: Response) => {
    try {
        const result = await services.FlightServices.getFlight(parseInt(req.params.id!))
        responses.SuccessResponse.data = result;
        responses.SuccessResponse.message = "Requested Flight"
        return res.status(StatusCodes.OK).json(responses.SuccessResponse)
    } catch (err: any) {
        responses.ErrorResponse.error = err;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responses.ErrorResponse)
    }
}
interface UpdateSeat {
    id : number,
    dec? : string
}
const updateRemainingSeats = async (req: Request, res: Response) => {
    try {
        const data : UpdateSeat  = {}
        if(req.body.dec){
            data.dec = req.body.dec;
        }
        data.id = parseInt(req.body.id);
        const result = await services.FlightServices.updateRemainingSeats(data);
        responses.SuccessResponse.data = result;
        responses.SuccessResponse.message = "Remaining Seats";
        return res.status(StatusCodes.OK).json(responses.SuccessResponse)
        return 
    } catch (err: any) {
        responses.ErrorResponse.error = err;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responses.ErrorResponse)
    }
}

export default {
    createFlight,
    getFlights,
    getFlight,
    updateRemainingSeats
}

