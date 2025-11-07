import {Router} from 'express';
import * as authController from '@controller/authController'
import { loginSchema, refreshTokenSchema, registrationSchema } from '@utils/validations/validation';
import {validateRequest, authenticateToken} from '@shared/middleware/index'

const router = Router()

// public routes -> requires only request schema validation (uses Schema validation middleware)
router.post('/register', validateRequest(registrationSchema), authController.register)
router.post('/login', validateRequest(loginSchema), authController.login)
router.post('/refresh', validateRequest(refreshTokenSchema),authController.refreshToken)
router.post('/logout', validateRequest(refreshTokenSchema), authController.logout)

//validate token
router.post('/validate', authController.validateToken)

// protected routes -> only for authorized
router.get('/profile', authenticateToken,authController.getUserData)
router.delete('/profile',authenticateToken,authController.deleteUser)

export default router