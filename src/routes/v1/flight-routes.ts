import {Router} from 'express'
import controller from '../../controllers/'
import middlewares from '../../middlewares';

const router = Router()

router.post('/', middlewares.FlightMiddlewares.validateFlightRequest ,controller.FlightController.createFlight);
router.get('/', controller.FlightController.getFlights)

export default router