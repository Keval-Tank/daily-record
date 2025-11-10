import {Router} from 'express'
import { authenticateToken, validateRequest } from '@shared/middleware'
import { createTagSchema } from '@utils/validations/validate'
import * as tagController from '@controller/tagController'


const router = Router()

router.use(authenticateToken)

router.post('/', validateRequest(createTagSchema), tagController.createTag)
router.get('/', tagController.getTags)

export default router