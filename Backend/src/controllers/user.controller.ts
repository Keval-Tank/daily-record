import { type Request, type Response } from "express";
import { createUserService, addFundService, getBalanceService, makeTransactionService} from "services/user.service";


export const createUserController = async (req: Request, res: Response) => {
    try {
        const { name }: { name: string } = req.body
        const user = await createUserService(name)

        return res.status(201).json({
            id: user.id,
            name: user.name
        })
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            "msg": error.message
        })
    }
}

export const addFundController = async (req: Request, res: Response) => {
    try {
        const { id, amount }: { id: string, amount: number } = req.body
        const addedFund = await addFundService(id, amount)
        return res.status(200).json({
            id: addedFund.id,
            balance: addedFund.balance
        })
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            "msg": error.message
        })
    }
}

export const checkBalanceController = async (req: Request, res: Response) => {
    try {
        if(!req.params){
            throw new Error("id is missing!")
        }
        const {id} : {id : string} = req.params
        const userBalance = await getBalanceService(id);
        return res.status(200).json({
            id : userBalance.id,
            balance : userBalance.balance
        })
    } catch (error : any) {
        console.error(error);
        return res.status(500).json({
            "msg": error.message
        })
    }
}

export const makeTransactionController = async(req : Request, res : Response) => {
    const {senderId, recieverId, amount} : {senderId : string, recieverId : string, amount : number} = req.body
    const dataEntry  = await makeTransactionService(senderId, recieverId, amount)
    return res.status(200).json({
        sender : dataEntry.sender,
        reciever : dataEntry.reciever,
        amount : dataEntry.amount
    })
}