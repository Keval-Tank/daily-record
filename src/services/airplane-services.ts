import { AirplaneRepository } from "../repositories/airplane-repository";
import { AppError } from "../utils/errors/AppError";
import { StatusCodes } from "http-status-codes";
import supabase from "../supabaseClient";

const airplaneRepo = new AirplaneRepository()

// create airplane
export async function createAirplane(planedata:any){
    try{
        const {data, error} = await supabase
        .from('airplanes')
        .insert([
            {
                modelnumber : planedata.modelNumber,
                capacity : planedata.capacity
            },
        ])
        .select();
        if(error){
            throw new AppError(error.message, parseInt(error.code))
        }
        return data
    }catch(err : any){
        if(err.name === 'SequelizeValidationError'){
            const explanation : any = [];
            err.errors.forEach((err : any) => {
                explanation.push(err.message)
            })
            throw new AppError(explanation, StatusCodes.BAD_REQUEST)
        }
        throw err
    }
}

// get all palnes
export async function getAllPlanes(){
    try {
        const {data, error} = await supabase
        .from('airplanes')
        .select();
        if(error){
            throw new AppError(error.message, parseInt(error.code) || StatusCodes.INTERNAL_SERVER_ERROR)
        }
        return data;
    } catch (err : any) {
        throw new AppError(err, err.statusCode)
    }
}

// get Single plane
export async function getPlane(id : any){
    try {
        const {data, error} = await supabase
        .from('airplanes')
        .select()
        .eq('id', id);
        if(error){
            throw new AppError(error.message, parseInt(error.code) || StatusCodes.INTERNAL_SERVER_ERROR)
        }
        if(data.length === 0){
            throw new AppError('Plane not find', StatusCodes.NOT_FOUND)
        }
        return data
    } catch (err:any) {
        if(err.statusCode === StatusCodes.NOT_FOUND){
            throw new AppError("Requested plane is not present", err.statusCode)
        }
        throw new AppError(err, err.statusCode)
    }
}

// delete a plane
export async function deletePlane(id : any){
    try {
        const {data, error} = await supabase
        .from('airplanes')
        .delete()
        .eq('id', id)
        .select();
        if(error){
            throw new AppError(error.message, parseInt(error.code) || StatusCodes.INTERNAL_SERVER_ERROR)
        }
        console.log(data)
        return data
    } catch (error:any) {
        if(error.statusCode === StatusCodes.NOT_FOUND){
            throw new AppError("Requested plane is not present", error.statusCode)
        }
        throw new AppError(error, error.statusCode)
    }
}


// update a plane
export async function updatePlane(data : any){
    try{
        const result = await airplaneRepo.update(data.id, data.updates)
        return result
    }catch(err : any){
        throw new AppError(err, err.statusCode)
    }
}

