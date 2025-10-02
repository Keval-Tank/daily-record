import express from 'express'
import { PrismaClient } from './generated/prisma/client.js';
import createHttpError from 'http-errors';
import { v4 } from 'uuid'
import jwt from 'jsonwebtoken'
import session from 'express-session'
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'
import cookieParser from 'cookie-parser';
import { createClient } from 'redis';


const app = express();
const PORT = process.env.PORT;
const prisma = new PrismaClient();
const redis_client = createClient();
await redis_client.connect()
await mongoose.connect("mongodb://127.0.0.1:27017/sessions");

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
//setup session
app.use(session({
    secret: process.env.SECRET_KEY,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60 * 60 * 1000
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/sessions',
        collectionName: 'session'
    })
}))

//middleware
const authenticator = (req, res, next) => {
    try {
        if (!req.session.user) {
            throw createHttpError(401, "Unauthorized")
        }
        req.session.visited.push(req.originalUrl)
        const token = req.cookies.token;
        if (token == null || !token) {
            throw createHttpError(401, "Unauthorized")
        }
        jwt.verify(token, process.env.SECRET_KEY, async (err, payload) => {
            if (err) {
                throw createHttpError(403, "Invalid or expired token")
            }
            let data = await prisma.users.findFirst({
                where: {
                    id: payload.id,
                    password: payload.password
                }
            })
            if (!data || data.password != payload.password) {

                throw createHttpError(401, "Unauthorized")
            }
            req.payload = payload
            next();
        })
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            msg: error
        })
    }
}

//signup
app.post('/signup', async (req, res) => {
    try {
        const name = req.body.name;
        const password = req.body.password
        let result = await prisma.users.create({
            data: { name, password }
        })
        return res.status(201).json({
            "id": result.id,
            "name": name
        });
    } catch (error) {
        return res.status(500).json({
            "msg": error.message
        })
    }
})

//login
app.post('/login', async (req, res) => {
    try {
        let id = parseInt(req.body.id);
        let password = req.body.password;
        let user_data = await prisma.users.findFirst({
            where: {
                id,
                password
            }
        })
        if (!user_data) {
            throw createHttpError(404, "User not found!");
        }
        let payload = {
            id: user_data.id,
            password
        }
        let access_token = jwt.sign(payload, process.env.SECRET_KEY);
        req.session.user = user_data.id;
        req.session.visited = [req.originalUrl];
        res.cookie("token", access_token);
        res.status(200).json({
            "id": id,
            "name": user_data.name,
            "balance": user_data.balance,
            "createdOn": user_data.createdOn
        })

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message
        })
    }
})

// get balance
app.get('/balance/:id', authenticator, async (req, res) => {
    try {
        const id = parseInt(req.payload.id)
        let is_in_cache = await redis_client.hExists("user_balance", req.originalUrl);
        if (is_in_cache) {
            let cached_result = await redis_client.hGet("user_balance", req.originalUrl);
            let response = JSON.parse(cached_result);
            return res.status(200).json(response);
        } else {
            const data = await prisma.users.findFirst({
                where: { id }
            })
            if (!data) {
                throw createHttpError(404, `User with id ${id} was not found`)
            }
            let response_to_cache = JSON.stringify({
                "id" : data.id,
                "balance" : data.balance
            });
            await redis_client.hSet("user_balance", req.originalUrl, response_to_cache);
            return res.status(200).json({
                "id": data.id,
                "balance": data.balance
            });
        }

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            "msg": error.message
        })
    }
})

// fund
app.post('/fund', authenticator, async (req, res) => {
    try {
        const id = parseInt(req.payload.id)
        const amount = parseInt(req.body.amount);
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
        let response_to_cache = JSON.stringify({
            "id": id,
            "balance": updated_data.balance
        });
        await redis_client.hSet("user_balance", `/balance/${id}`, response_to_cache)
        return res.status(200).json({
            "id": id,
            "balance": updated_data.balance
        })
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            "msg": error.message
        })
    }
})

//transfer
app.post('/transfer', authenticator, async (req, res) => {
    try {
        let sender_id = parseInt(req.payload.id)
        let reciever_id = parseInt(req.body.reciever)
        let transaction_id = v4();
        let transfer_amount = parseInt(req.body.amount)
        let sender_details = await prisma.users.findFirst({
            where: { id: sender_id }
        })
        let reciever_details = await prisma.users.findFirst({
            where: { id: reciever_id }
        })
        if (sender_id === reciever_id || transfer_amount <= 0 || sender_id === NaN || reciever_id === NaN) {
            throw createHttpError(400, "Bad request")
        }
        if (!sender_details || !reciever_details) {
            throw createHttpError(404, "User was not found!")
        }
        if (sender_details.balance < transfer_amount) {
            throw createHttpError(409, "Insufficient balance, unable to transfer")
        }
        let past_transaction = await prisma.ledger.findFirst({
            where: {
                transactionId: transaction_id,
                status: 'Done'
            }
        })
        if (past_transaction) {
            let cache_response = await redis_client.hGet("ledger_cache", transaction_id);
            let response = JSON.parse(cache_response);
            return res.status(200).json(response);
        }
        // create a ledger entry with 'Pending' status
        await prisma.ledger.create({
            data: {
                transactionId: transaction_id,
                sender: sender_id,
                reciever: reciever_id,
                amount: transfer_amount
            }
        })
        let sender_balance = sender_details.balance;
        let reciever_balance = reciever_details.balance;
        //transaction
        await prisma.$transaction([
            prisma.users.update({
                where: { id: sender_id },
                data: { balance: sender_balance - transfer_amount }
            }),
            prisma.users.update({
                where: { id: reciever_id },
                data: { balance: reciever_balance + transfer_amount }
            }),
            prisma.ledger.update({
                where: {
                    transactionId: transaction_id,
                    status: 'Pending'
                },
                data: {
                    status: 'Done'
                }
            })
        ])
        // update the existing ledger entry
        let updated_ledger_entry = await prisma.ledger.findFirst({
            where: { transactionId: transaction_id }
        })
        let response_to_cache = JSON.stringify(updated_ledger_entry);
        await redis_client.hSet("ledger_cache", transaction_id, response_to_cache);
        let sender_balance_cache = JSON.stringify({
            "id" : sender_id,
            "balance" : sender_balance - transfer_amount
        })
        await redis_client.hSet("user_balance", `/balance/${sender_id}`, sender_balance_cache)
        let reciever_balance_cache = JSON.stringify({
            "id" : reciever_id,
            "balance" : reciever_balance + transfer_amount
        })
        await redis_client.hSet("user_balance", `/balance/${reciever_id}`, reciever_balance_cache)
        return res.status(200).json(updated_ledger_entry);
    } catch (error) {
        return res.status(error.statusCode).json({
            "msg": error.message
        })
    }
})

// signout
app.get('/signout', authenticator, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({
                msg: "Internal server error"
            })
        }
        res.clearCookie("connect.sid");
        res.clearCookie("token");
        res.json({
            "msg": "You've logged out"
        })
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
