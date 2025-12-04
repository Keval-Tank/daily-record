import { createAirplane, getAllPlanes, getPlane, deletePlane, updatePlane } from "./airplane-services"
import cityServices from "./city-service"
export default {
    AirplaneService : {createAirplane, getAllPlanes, getPlane, deletePlane, updatePlane},
    CityService : cityServices
}