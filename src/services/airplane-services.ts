import { AirplaneRepository } from "../repositories/airplane-repository";
import { AppError } from "../utils/errors/AppError";
import { StatusCodes } from "http-status-codes";

const airplaneRepo = new AirplaneRepository()

// create airplane
export async function createAirplane(data:any){
    try{
        const airplane = await airplaneRepo.create(data);
        return airplane;
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
        const planes = await airplaneRepo.getAll();
        return planes
    } catch (err : any) {
        throw new AppError(err, err.statusCode)
    }
}

// get Single plane
export async function getPlane(id : any){
    try {
        const plane = await airplaneRepo.get(id);
        return plane
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
        const result = await airplaneRepo.destory(id);
        return result;
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

