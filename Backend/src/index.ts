import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import userRoutes from 'routes/user.routes.js'

dotenv.config()

const app = express();
const PORT: string = process.env.PORT!

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST','OPTIONS']
}))


app.use('/api', userRoutes);


app.listen(PORT, () => console.log(`Backend Server running on ${PORT}`))