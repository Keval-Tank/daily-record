import services from "../services";
import {response, type Request, type Response} from 'express'
import responses from '../utils/common'
import { StatusCodes } from "http-status-codes";
import cityService from "../services/city-service";

const createCity = async(req : Request, res : Response) => {
    try {
        const data = {
            name : req.body.name
        }
        const result = await services.CityService.createCity(data);
        responses.SuccessResponse.data = result
        responses.SuccessResponse.message = "City created Successfully"
        return res.status(StatusCodes.CREATED).json(responses.SuccessResponse)
    }catch(err : any){
        responses.ErrorResponse.error=err
        return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(responses.ErrorResponse)
    }
}

const getAllCities = async(req : Request, res : Response) => {
    try{
        const result = await services.CityService.getAllCities()
        responses.SuccessResponse.data = result
        responses.SuccessResponse.message = "All Cities"
        return res.status(StatusCodes.OK).json(responses.SuccessResponse)
    }catch(err : any){
        responses.ErrorResponse.error = err;
        return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(responses.ErrorResponse)
    }
}

const getCity = async(req : Request, res : Response) => {
    try{
        const result = await cityService.getCity(req.params.id)
        responses.SuccessResponse.data = result;
        responses.SuccessResponse.message = "Requested City"
        return res.status(StatusCodes.OK).json(responses.SuccessResponse)
    }catch(err : any){
        responses.ErrorResponse.error = err;
        return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(responses.ErrorResponse)
    }
}

const deleteCity = async(req : Request, res : Response) => {
    try {   
        const result = await cityService.deleteCity(req.params.id);
        responses.SuccessResponse.data = result
        responses.SuccessResponse.message = "Deleted Successfully"
        return res.status(StatusCodes.OK).json(responses.SuccessResponse)
    }catch(err : any){
        responses.ErrorResponse.error = err;
        return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(responses.ErrorResponse)
    }
}

const updateCity = async(req : Request, res : Response) => {
    try {
        const data = {
            id : req.body.id,
            updates : req.body.updates
        }
        const result = await cityService.updateCity(data);
        responses.SuccessResponse.data = result
        responses.SuccessResponse.message = "Updated Successfully !"
        return res.status(StatusCodes.OK).json(responses.SuccessResponse)
    }catch(err : any){
        responses.ErrorResponse.error = err;
        return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(responses.ErrorResponse)
    }
}

export default {
    createCity,
    getAllCities,
    getCity,
    deleteCity,
    updateCity
}