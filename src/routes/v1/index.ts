import { Router } from "express";
import controllers from '../../controllers'
import airplaneRoutes from '../v1/airplane-routes'
import cityRoutes from '../v1/city-routes'
import airportRoutes from '../v1/airport-routes'
import flightRoutes from "../v1/flight-routes";

const router = Router()

router.get('/info', controllers.InfoController)
router.use('/airplanes' ,airplaneRoutes)
router.use('/cities', cityRoutes)
router.use('/airport', airportRoutes)
router.use('/flight', flightRoutes)


export default router