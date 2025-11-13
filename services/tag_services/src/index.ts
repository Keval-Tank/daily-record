import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import {corsOptions, errorHandler, healthCheck} from '@shared/middleware/index'
import tagRoutes from '@routes/tagRoutes'

const app = express()
const PORT = process.env.PORT || 3004
app.use(cors(corsOptions()))
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({extended : true}))


app.use('/tags', tagRoutes)
app.use('/health', healthCheck)


app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Tags service is running on ${PORT}`)
    console.log(`Environment : ${process.env.ENVIRONMENT}`)
})

export default app;


