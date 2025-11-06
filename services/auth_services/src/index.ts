import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import authRoutes from '@routes/authRoutes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001
app.use(cors())
app.use(helmet())

app.use(express.json({limit : "10mb"}))
app.use(express.urlencoded({extended : true}))


app.use('/auth', authRoutes)

app.listen(PORT, () => {
    console.log(`Auth service running on ${PORT}`)
    console.log(`Environment : ${process.env.ENVIRONMENT}`)
})

export default app