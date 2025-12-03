import { StatusCodes } from "http-status-codes";
import {type Request, type Response} from 'express'
import services from "../services";

export const createAirplane = async(req : Request, res : Response) => {
    try{
        const data = {
            modelNumber : req.body.modelNumber,
            capacity : req.body.capacity
        }
        const result = await services.AirplaneService.createAirplane(data);
        return res.status(StatusCodes.CREATED).json({
            success : true,
            message : "Plane created Successfully",
            data : result,
            error : {}
        })
    }catch(err){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success : false,
            message : "Something went wrong while creating plane",
            data : {},
            error : err
        })
    }
}
