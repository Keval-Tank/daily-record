import { StatusCodes } from "http-status-codes";
import {type Request, type Response} from 'express'
import services from "../services";
import responses from "../utils/common"

export const createAirport = async(req : Request, res : Response) => {
    try{
        const data = {
            name : req.body.name,
            code : req.body.code,
            cityId : parseInt(req.body.cityId)
        }
        const result = await services.AirportServices.createAirport(data);
        responses.SuccessResponse.data = result;
        responses.SuccessResponse.message = "Airport created Successfully"
        return res.status(StatusCodes.CREATED).json(responses.SuccessResponse)
    }catch(err : any){
        responses.ErrorResponse.error=err
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responses.ErrorResponse)
    }
}

const getPorts = async(req : Request, res : Response) => {
    try{
        const result = await services.AirportServices.getPorts();
        responses.SuccessResponse.data = result;
        responses.SuccessResponse.message = "All available ports"
        return res.status(StatusCodes.OK).json(responses.SuccessResponse)
    }catch(err:any){
        responses.ErrorResponse.error=err
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responses.ErrorResponse)
    }
}

export const getAirport = async(req : Request, res : Response) => {
    try {
        if(!req.params.code){
            responses.ErrorResponse.error = {explanation : "Airport code not found"}
            responses.ErrorResponse.message = "Invalid input"
            return res.status(StatusCodes.BAD_REQUEST).json(responses.ErrorResponse)
        }
        const result = await services.AirportServices.getAirport(req.params.code)
        responses.SuccessResponse.data = result;
        responses.SuccessResponse.message = "Requested Airport"
        return res.status(StatusCodes.OK).json(responses.SuccessResponse)
    } catch (err:any) {
        responses.ErrorResponse.error=err
        return res.status( err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(responses.ErrorResponse)
    }
}

const deleteAirport = async(req : Request, res : Response) => {
    try {
        if(!req.params.code){
           responses.ErrorResponse.error = {explanation : "Airport code not found"}
           responses.ErrorResponse.message = "Invalid input"
           return res.status(StatusCodes.BAD_REQUEST).json(responses.ErrorResponse)
        }
        const result = await services.AirportServices.deleteAirport(req.params.code);
        responses.SuccessResponse.data = result;
        responses.SuccessResponse.message = "Deleted Successfully!"
        return res.status(StatusCodes.OK).json(responses.SuccessResponse)
    } catch (err : any) {
        responses.ErrorResponse.error = err;
        return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(responses.ErrorResponse)
    }
}

const upadteAirport = async(req : Request, res : Response) => {
    try {
       const result = await services.AirportServices.updateAirport(req.body); 
       responses.SuccessResponse.data = result;
       responses.SuccessResponse.message = "Updated Successfully"
       return res.status(StatusCodes.OK).json(responses.SuccessResponse)
    } catch (err : any) {
        responses.ErrorResponse.error = err;
        return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(responses.ErrorResponse)
    }
}

export default {
    createAirport,
    getPorts,
    getAirport,
    deleteAirport,
    upadteAirport
}