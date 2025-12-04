import { StatusCodes } from "http-status-codes";
import {response, type Request, type Response} from 'express'
import services from "../services";
import responses from "../utils/common"

export const createAirplane = async(req : Request, res : Response) => {
    try{
        const data = {
            modelNumber : req.body.modelNumber,
            capacity : req.body.capacity
        }
        const result = await services.AirplaneService.createAirplane(data);
        responses.SuccessResponse.data = result;
        responses.SuccessResponse.message = "Plane created Successfully"
        return res.status(StatusCodes.CREATED).json(responses.SuccessResponse)
    }catch(err : any){
        responses.ErrorResponse.error=err
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responses.ErrorResponse)
    }
}

export const getAllPlanes = async(req : Request, res : Response) => {
    try{
        const result = await services.AirplaneService.getAllPlanes();
        responses.SuccessResponse.data = result;
        responses.SuccessResponse.message = "All available planes"
        return res.status(StatusCodes.OK).json(responses.SuccessResponse)
    }catch(err:any){
        responses.ErrorResponse.error=err
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responses.ErrorResponse)
    }
}

export const getPlane = async(req : Request, res : Response) => {
    try {
        const result = await services.AirplaneService.getPlane(req.params.id)
        responses.SuccessResponse.data = result;
        responses.SuccessResponse.message = "Requested plane"
        return res.status(StatusCodes.OK).json(responses.SuccessResponse)
    } catch (err:any) {
        responses.ErrorResponse.error=err
        return res.status( err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(responses.ErrorResponse)
    }
}

export const deletePlane = async(req : Request, res : Response) => {
    try {
        const result = await services.AirplaneService.deletePlane(req.params.id);
        responses.SuccessResponse.data = result;
        responses.SuccessResponse.message = "Deleted Successfully!"
        return res.status(StatusCodes.OK).json(responses.SuccessResponse)
    } catch (err : any) {
        responses.ErrorResponse.error = err;
        return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(responses.ErrorResponse)
    }
}

export const upadtePlane = async(req : Request, res : Response) => {
    try {
       const result = await services.AirplaneService.updatePlane(req.body); 
       responses.SuccessResponse.data = result;
       responses.SuccessResponse.message = "Updated Successfully"
       return res.status(StatusCodes.OK).json(responses.SuccessResponse)
    } catch (err : any) {
        responses.ErrorResponse.error = err;
        return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(responses.ErrorResponse)
    }
}