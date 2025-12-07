import { validateRequest } from "./airplane-middlewares";
import { validateCityRequest } from "./city-middlewares";
import { validateAirPortRequest } from "./airport-middlewares";
import flightMiddlewares from "./flight-middlewares";

export default {
    AirplaneMiddlewares : {validateRequest},
    CityMiddlewares : {validateCityRequest},
    AirportMiddlewares : {validateAirPortRequest},
    FlightMiddlewares : flightMiddlewares
}