// import { AirplaneRepository } from "../repositories/airplane-repository";
import { AppError } from "../utils/errors/AppError";
import { StatusCodes } from "http-status-codes";

import {prisma} from '../prismaClient'

// const airplaneRepo = new AirplaneRepository()

// create airplane
async function createAirport(airport_data:any){
    try{
        const airport = await prisma.airport.create({
            data : {
                name : airport_data.name,
                cityId : parseInt(airport_data.cityId),
                code : airport_data.code
            }
        })
        return airport;
    }catch(err : any){
        // if(err.name === 'PrismaClientValidationError'){
        //     const explanation : any = [];
        //     err.errors.forEach((err : any) => {
        //         explanation.push(err)
        //     })
        //     throw new AppError(explanation, StatusCodes.BAD_REQUEST)
        // }
        throw err
    }
}

// get all palnes
async function getPorts(){
    try {
        const airports = await prisma.airport.findMany();
        return airports
    } catch (err : any) {
        throw new AppError(err, err.statusCode)
    }
}

// get Single plane
export async function getAirport(code : any){
    try {
        const airport = await prisma.airport.findUnique({
            where : {
                code : String(code)
            }
        });
        if(!airport){
            throw new AppError("Not Found!", StatusCodes.NOT_FOUND)
        }
        return airport
    } catch (err:any) {
        if(err.statusCode === StatusCodes.NOT_FOUND){
            throw new AppError("Requested plane is not present", err.statusCode)
        }
        console.log(err)
        throw new AppError(err, err.statusCode)
    }
}

// delete a plane
export async function deleteAirport(code : any){
    try {
        const result = await prisma.airport.delete({
            where : {
                code : code
            }
        })
        return result;
    } catch (error:any) {
        if(error.statusCode === StatusCodes.NOT_FOUND){
            throw new AppError("Requested plane is not present", error.statusCode)
        }
        throw new AppError(error, error.statusCode)
    }
}


// update a plane
async function updateAirport(updatedata : any){
    try{
        const result = await prisma.airport.update({
            where : {
                id : parseInt(updatedata.id)
            },
            data : {
                name : updatedata.name,
                cityId : parseInt(updatedata.cityId),
                code : updatedata.code
            }
        })
        return result
    }catch(err : any){
        throw new AppError(err, err.statusCode)
    }
}
export default {
    createAirport,
    getPorts,
    getAirport,
    deleteAirport,
    updateAirport
}

