import {Router} from 'express'
import controller from '../../controllers/'
import middlewares from '../../middlewares';

const router = Router()

router.post('/', middlewares.FlightMiddlewares.validateFlightRequest ,controller.FlightController.createFlight);
router.get('/', controller.FlightController.getFlights)
router.get('/:id', controller.FlightController.getFlight)
router.patch('/', middlewares.FlightMiddlewares.validateUpdateReq , controller.FlightController.updateRemainingSeats)

export default router