import {Router} from 'express'
import * as noteController from '@controller/noteController'
import { validateRequest, authenticateToken } from '@shared/middleware/index'
import { createNoteSchema } from '@utils/validations/validation'

const router = Router();

router.use(authenticateToken)

router.post('/', validateRequest(createNoteSchema), noteController.createNote);
router.get('/:noteId', noteController.getNoteById)

export default router