import { Router } from "express";
import controllers from '../../controllers'
import airplaneRoutes from '../v1/airplane-routes'
// import cityRoutes from '../v1/city-routes'

const router = Router()

router.get('/info', controllers.InfoController)
router.use('/airplanes' ,airplaneRoutes)
// router.use('/cities', cityRoutes)


export default router