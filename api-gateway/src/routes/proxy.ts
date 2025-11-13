import {Router, Request, Response} from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import {servicesConfig} from '@config/services'

const router = Router()

function createServiceProxy(targetUrl : string, pathRewrite?: Record<string, string>) : any {
    const options  = {
        target : targetUrl,
        changeOrigin : true,
        pathRewrite : pathRewrite || {},
        timeout : 30000,
        proxyTimeout : 30000,
        onError : (error : any, req : Request, res : Response) => {
            console.log(`proxy error ${error.message}`);
            if(!res.headersSent){
                res.status(503).json({
                    success : false,
                    error : "Service unavailable",
                    message : "Service unavailable"
                })
            }
        },
        onProxyReq : (proxyReq : any, req : any) => {
            console.log(`Proxing request from ${req.method} ${req.originalUrl} to ${targetUrl}`)

            if(req.user){
                proxyReq.setHeader('x-user-id', req.user.userId)
                proxyReq.setHeader('x-user-email', req.user.email)
            }

            if(req.body && (req.method === 'POST' || req.method === "PUT" || req.method === "PATCH")){
                const reqBody = JSON.stringify(req.body)
                proxyReq.setHeader('Content-Type', 'application/json')
                proxyReq.setHeader('Content-Length', Buffer.byteLength(reqBody))
                proxyReq.write(reqBody)
            }
        },
        onProxyRes : (proxyRes : any , req : any) => {
            console.log(`Received Proxy response from ${targetUrl} : ${proxyRes.statusCode} for ${req.method}${req.originalUrl}`)
        }
    }

    return createProxyMiddleware(options)
}

router.use('/api/auth', createServiceProxy(servicesConfig.auth.url, {"^/api/auth" : "/auth"}))

router.use('/api/users', createServiceProxy(servicesConfig.users.url, {"^/api/users" : "/users"}))

router.use('/api/notes', createServiceProxy(servicesConfig.notes.url, {"^/api/notes" : "/notes"}))

router.use('/api/tags', createServiceProxy(servicesConfig.tags.url, {"^/api/tags" : "/tags"}))

export default router
