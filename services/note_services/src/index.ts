import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import {authenticateToken, corsOptions, errorHandler , healthCheck} from '@shared/middleware/index'
import noteRoutes from '@routes/noteRoutes'

const app = express()
const PORT = process.env.PORT || 3003;

app.use(cors(corsOptions()))
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.use('/notes', noteRoutes)
app.use('/health', healthCheck)

app.listen(PORT, () => {
    console.log(`Note Service running on ${PORT}`)
    console.log(`Environment ${process.env.ENVIRONMENT}`)
})

export default app;
