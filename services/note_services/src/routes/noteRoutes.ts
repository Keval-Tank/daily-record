import {Router} from 'express'
import * as noteController from '@controller/noteController'
import { validateRequest, authenticateToken } from '@shared/middleware/index'
import { createNoteSchema, getNotesByUserSchema } from '@utils/validations/validation'

const router = Router();

router.use(authenticateToken)

router.post('/', validateRequest(createNoteSchema), noteController.createNote);
router.get('/', validateRequest(getNotesByUserSchema), noteController.getNotes)
router.get('/:noteId', noteController.getNoteById)

export default router