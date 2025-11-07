import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import {corsOptions} from '@shared/middleware/index'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.use(helmet())
app.use(cors(corsOptions()))



