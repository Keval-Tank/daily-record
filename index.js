import express from 'express'
import { PrismaClient } from './generated/prisma/client.js';
import createHttpError from 'http-errors';
import { v4 } from 'uuid'
import jwt from 'jsonwebtoken'

const app = express();
const PORT = process.env.PORT;
const prisma = new PrismaClient();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//middleware
const authenticator = (req, res, next) => {
    let authHeader = req.headers['authorization']
    const token = authHeader
    if(token == null || !token){
        return res.status(401).json({
            "msg" : "Unauthorized"
        })
    }
    jwt.verify(token, process.env.SECRET_KEY, async(err, payload) => {
        if(err) {
            return res.status(403).json({
                "msg" : "Expired"
            })
        }
        let data = await prisma.users.findFirst({
            where : {
                id : payload.id,
                password: payload.password
            }
        })
        if(!data || data.password != payload.password){
            return res.status(401).json({
                "msg" : "Unauthorized"
            })
        }
        req.payload = payload
        next();
    })
}

//signup
app.post('/signup', async(req, res) => {
    try {
        const name = req.body.name;
        const password = req.body.password
        let result = await prisma.users.create({
            data: { name , password}
        })
        let payload = {
            id : result.id,
            password
        }
        let access_token = jwt.sign(payload, process.env.SECRET_KEY);
        return res.status(201).json({
            "id" : result.id,
            "name" : name,
            "access-key" : access_token,
            "balance": result.balance,
            "createdOn" : result.createdOn
        });
    } catch (error) {
        return res.status(500).json({
            "msg": error.message
        })
    }
})

// create user
// app.post('/user',authenticator, async (req, res) => {
//     try {
//         const name = req.body.name;
//         let result = await prisma.users.create({
//             data: { name }
//         })
//         return res.status(201).json(result);
//     } catch (error) {
//         return res.status(500).json({
//             "msg": error.message
//         })
//     }
// })

// get balance
app.get('/balance',authenticator, async (req, res) => {
    try {
        const id = parseInt(req.payload.id)
        const data = await prisma.users.findFirst({
            where: { id }
        })
        if (!data) {
            throw createHttpError(404, `User with id ${id} was not found`)
        }
        return res.status(200).json({
            "id" : data.id,
            "balance" : data.balance
        });
    } catch (error) {
        return res.status(error.statusCode).json({
            "msg": error.message
        })
    }
})

// fund
app.post('/fund',authenticator, async (req, res) => {
    try {
        const id = parseInt(req.payload.id)
        const amount = parseInt(req.body.amount)
        let user_data = await prisma.users.findFirst({
            where: { id }
        })
        if (!user_data) {
            throw createHttpError(404, "User was not found!")
        }
        let curr_balance = parseInt(user_data.balance)
        if (amount <= 0) {
            throw createHttpError(400, "Please Enter valid amount")
        }
        let updated_data = await prisma.users.update({
            where: { id },
            data: { balance: curr_balance + amount }
        })
        return res.status(200).json({
            "id" : id,
            "balance" : updated_data.balance
        })
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            "msg": error.message
        })
    }
})

//transfer
app.post('/transfer',authenticator, async (req, res) => {
    try {
        let sender_id = parseInt(req.payload.id)
        let reciever_id = parseInt(req.body.reciever)
        let transaction_id = v4();
        let transfer_amount = parseInt(req.body.amount)
        let sender_details = await prisma.users.findFirst({
            where : {id : sender_id}
        })
        let reciever_details = await prisma.users.findFirst({
            where : {id : reciever_id}
        })
        if(sender_id === reciever_id || transfer_amount <= 0 || sender_id === NaN || reciever_id === NaN){
            throw createHttpError(400, "Bad request")
        }
        if(!sender_details ||  !reciever_details){
            throw createHttpError(404, "User was not found!")
        }
        if(sender_details.balance < transfer_amount){
            throw createHttpError(409, "Insufficient balance, unable to transfer")
        }
        let past_transaction = await prisma.ledger.findFirst({
            where : {
                transactionId: transaction_id,
                status : 'Done'
            }
        })
        if(past_transaction){
            return res.status(200).json(past_transaction)
        }
        // create a ledger entry
        await prisma.ledger.create({
            data : {
                transactionId : transaction_id,
                sender : sender_id,
                reciever : reciever_id,
                amount : transfer_amount
            }
        })
        let sender_balance = sender_details.balance;
        let reciever_balance = reciever_details.balance;
        //transaction
        await prisma.$transaction([
            prisma.users.update({
                where : {id : sender_id},
                data : {balance : sender_balance - transfer_amount}
            }),
            prisma.users.update({
                where : {id : reciever_id},
                data : {balance : reciever_balance + transfer_amount}
            }),
            prisma.ledger.update({
                where : {
                    transactionId : transaction_id,
                    status : 'Pending'
                },
                data : {
                    status : 'Done'
                }
            })
        ])  
        let updated_ledger_entry = await prisma.ledger.findFirst({
            where : { transactionId : transaction_id }
        }) 
        return res.status(200).json(updated_ledger_entry);
    } catch (error) {
        return res.status(error.statusCode).json({
            "msg": error.message
        })
    }
})

// signout
app.get('/signout',authenticator,(req, res) => {
    req.headers['authorization'] = '';        
    res.status(200).json({
        "msg" : "You've logged out"
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
