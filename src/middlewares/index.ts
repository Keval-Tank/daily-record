import { validateRequest } from "./airplane-middlewares";
import { validateCityRequest } from "./city-middlewares";

export default {
    AirplaneMiddlewares : {validateRequest},
    CityMiddlewares : {validateCityRequest}
}