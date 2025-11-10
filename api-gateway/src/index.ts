import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import proxyRoutes from '@routes/proxy'
// import dotenv from 'dotenv'
// import {corsOptions} from '@shared/middleware/index'
// import userRoutes from '@routes/userRoutes'
// import { authenticateToken, errorHandler } from '@shared/middleware/index'

const app = express()
const PORT = process.env.PORT || 8080;

app.set("trust proxy", 1);

app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : process.env.CORS_CREDENTIALS === "true",
    methods : ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders : ["Content-Type", "Authorization", "x-user-id", "x-user-email"]
}))
app.use(helmet({
    crossOriginEmbedderPolicy : false
}))

app.use(proxyRoutes)


const server = app.listen(PORT, () => {
    console.log(`User services running on ${PORT}`)
    console.log(`Environment : ${process.env.ENVIRONMENT}`)
    console.log(`Auth services on : ${process.env.AUTH_SERVICE_URL}`)
    console.log(`User services on : ${process.env.USER_SERVICE_URL}`)
})

// gracefule shutdown
process.on('SIGINT', () => {
    console.log("Shutting down api")
    server.close(() => {
        console.log("api gateway shut down")
        process.exit(0);
    })
})

process.on("SIGTERM", () => {
    console.log("Shutting down api")
    server.close(() => {
        console.log("api gateway shut down")
        process.exit(0);
    })
})


export default app;