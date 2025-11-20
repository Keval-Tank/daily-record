import {Router} from 'express'
import { addFundController, createUserController, checkBalanceController, makeTransactionController} from 'controllers/user.controller'

const router = Router()

router.post('/createUser', createUserController)
router.post('/addBalance', addFundController)
router.get('/getBalance/:id', checkBalanceController)
router.post('/transfer', makeTransactionController)

export default router