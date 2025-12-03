import { Router } from "express";
import controllers from '../../controllers'
import airplaneRoutes from '../v1/airplane-routes'

const router = Router()

router.get('/info', controllers.infoController)
router.use('/airplanes', airplaneRoutes)

export default router