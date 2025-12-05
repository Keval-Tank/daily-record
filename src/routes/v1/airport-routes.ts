import {Router} from 'express'
import controller from '../../controllers/'
import middlewares from '../../middlewares';

const router = Router()

router.post('/', middlewares.AirportMiddlewares.validateAirPortRequest ,controller.AirportController.createAirport);
router.get('/', controller.AirportController.getPorts)
router.get('/:code', controller.AirportController.getAirport)
router.delete('/:code', controller.AirportController.deleteAirport)
router.patch('/', controller.AirportController.upadteAirport)
export default router