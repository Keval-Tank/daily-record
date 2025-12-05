// // import { CityRepository } from "../repositories/city-repository";
import { AppError } from "../utils/errors/AppError";
import { StatusCodes } from "http-status-codes";
import {prisma} from '../prismaClient'

// const cityRepo = new CityRepository()

async function createCity(city_data : any){
    try{
        const result = await prisma.city.create({
            data : {
                name : city_data.name
            }
        })
        return result
    }catch(err : any){
        if(err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError'){
            const explanation : any = [];
            err.errors.forEach((err : any) => {
                explanation.push(err.message)
            })
            throw new AppError(explanation, StatusCodes.BAD_REQUEST)
        }
        console.log(err)
        throw err
    }
}

async function getAllCities(){
    try{
        const cities = await prisma.city.findMany();
        return cities
    }catch(err : any){
        console.log(err)
        throw new AppError(err, StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function getCity(cityName : any){
    try{
        const city = await prisma.city.findUnique({
            where : {
                name : cityName
            }
        });
        return city
    }catch(err : any){
        throw new AppError(err, err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
    }

}

async function deleteCity(cityName : any){
    try {
        const result = await prisma.city.delete({
            where : {
                name : cityName
            }
        })
        return result
    }catch(err : any){
        throw new AppError(err, err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function updateCity(updatedata : any){
    try{
        const result = await prisma.city.update({
            where : {
                id : updatedata.id
            },
            data : {
                name : updatedata.name
            }
        });
        return result
    }catch(err : any){
        throw new AppError(err, err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

export default {
    createCity,
    getAllCities,
    getCity,
    deleteCity,
    updateCity
}
