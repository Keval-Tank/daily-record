import {Router} from 'express'
import { authenticateToken, validateRequest } from '@shared/middleware'
import { createTagSchema, updateTagSchema } from '@utils/validations/validate'
import * as tagController from '@controller/tagController'


const router = Router()

router.use(authenticateToken)

router.post('/', validateRequest(createTagSchema), tagController.createTag)
router.get('/', tagController.getTags)
router.post('/:tagId', tagController.validateTags)

export default router