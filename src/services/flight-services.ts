// import { AirplaneRepository } from "../repositories/airplane-repository";
import { AppError } from "../utils/errors/AppError";
import { StatusCodes } from "http-status-codes";

import {prisma} from '../prismaClient'
import { col } from "sequelize";

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
        throw err
    }
}

interface Filters{
    departureAirportId? : string
    arrivalAirportId? : string
    minPrice? : number
    maxPrice? : number
    travellers? : number
    date? : Date
    sort? : any
}

// get all flights according to query
async function getAllFlights(query : any){
    const query_filters : Filters = {}
    const sort_filter = []
    if(query.trips){
        const [departureAirportId, arrivalAirportId] = query.trips.split('-')
        query_filters.departureAirportId = departureAirportId
        query_filters.arrivalAirportId = arrivalAirportId
    }
    if(query.price){
        const [minPrice, maxPrice] = query.price.split('-');
        query_filters.minPrice = parseInt(minPrice);
        query_filters.maxPrice = parseInt(maxPrice);
    }
    if(query.travellers){
        query_filters.travellers = parseInt(query.travellers)
    }
    if(query.date){
        query_filters.date = new Date(query.date);
    }
    if(query.sort){
        query_filters.sort = query.sort.split(',');
        const sortFilters = query_filters.sort.map((filter) => {
            const [column, order] : [column : string, order : string] = filter.split('_');
            const obj = {
                [column] : order.toLocaleLowerCase()
            }
            sort_filter.push(obj);
        })
        
    }
    try{
       if(Object.keys(query_filters).length === 0){
          const all_flights = await prisma.flight.findMany();
          return all_flights
       }else{
          const flights = await prisma.flight.findMany({
            where : {
                departureAirportId : query_filters.departureAirportId,
                arrivalAirportId : query_filters.arrivalAirportId,
                price : {
                    gte : query_filters.minPrice,
                    lte : query_filters.maxPrice
                },
                totalSeats : {
                    gte : query_filters.travellers
                },
                departureTime : {
                    gte : query_filters.date
                }
            },
            orderBy : sort_filter,
            include : {
                airplane : true,
                departureAirport : true,
                arrivalAirport : true
            }
          })
          return flights;
       }
    }catch(err: any){
        console.log(err)
        throw err
    }
}

export default {
    createFlight,
    getAllFlights
}