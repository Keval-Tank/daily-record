import {Router} from 'express';
import * as authController from '../controller/authController'
import { loginSchema, registrationSchema } from '../utils/validations/validation';
import {validateRequest} from '../../../../shared/middleware/index'

const router = Router()

// public routes -> requires only request schema validation (uses Schema validation middleware)
router.post('/register', validateRequest(registrationSchema), authController.register)
router.post('/login', validateRequest(loginSchema), authController.login)

export default router