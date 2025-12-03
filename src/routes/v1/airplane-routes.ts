import {Router} from 'express'
import { createAirplane } from '../../controllers/airplane-controller'

const router = Router()

router.post('/', createAirplane);

export default router