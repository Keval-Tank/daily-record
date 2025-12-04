import infoController from "./info-controller";
import { createAirplane, getPlane, getAllPlanes, deletePlane, upadtePlane } from "./airplane-controller";
import cityController from './city-controller'

export default {
    InfoController : infoController,
    AirplaneController : {createAirplane, getPlane, getAllPlanes, deletePlane, upadtePlane},
    CityController : cityController
}