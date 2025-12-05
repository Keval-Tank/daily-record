// import { AirplaneRepository } from "../repositories/airplane-repository";
import { AppError } from "../utils/errors/AppError";
import { StatusCodes } from "http-status-codes";

import {prisma} from '../prismaClient'

// const airplaneRepo = new AirplaneRepository()

// create airplane
async function createFlight(flight_data:any){
    try{
        const flight = await prisma.flight.create({
            data : {
                flightNumber : flight_data.flightNumber,
                airplaneId : flight_data.airplaneId,
                departureAirportId : flight_data.departureAirportId,
                arrivalAirportId : flight_data.arrivalAirportId,
                arrivalTime : flight_data.arrivalTime,
                departureTime : flight_data.departureTime,
                price : flight_data.price,
                totalSeats : flight_data.totalSeats
            }
        })
        return flight;
    }catch(err : any){
        console.log(err)
        throw err
    }
}

export default {
    createFlight
}