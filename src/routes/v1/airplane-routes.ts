import {Router} from 'express'
import controller from '../../controllers/'
import middlewares from '../../middlewares';

const router = Router()

router.post('/', middlewares.AirplaneMiddlewares.validateRequest ,controller.AirplaneController.createAirplane);
router.get('/', controller.AirplaneController.getAllPlanes)
router.get('/:id', controller.AirplaneController.getPlane)
// router.delete('/:id', controller.AirplaneController.deletePlane)
// router.patch('/', controller.AirplaneController.upadtePlane)
export default router