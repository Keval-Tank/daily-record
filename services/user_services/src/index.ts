import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import {corsOptions} from '@shared/middleware/index'
import userRoutes from '@routes/userRoutes'
import { authenticateToken, errorHandler } from '@shared/middleware/index'

const app = express()
const PORT = process.env.PORT || 3002;

app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.use(cors(corsOptions()))
app.use(helmet())

app.use('/users',authenticateToken,userRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`User services running on ${PORT}`)
    console.log(`Environment : ${process.env.ENVIRONMENT}`)
})



