import {PrismaClient} from '@generated/prisma/client'

// object passed in method ensures that in development environment you can see everything("query", "info", "warn", "error") but in production you'll see only errors
const prisma = new PrismaClient({
    log : process.env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : ["error"],
})

// below all is used to provide a graceful shutdown
process.on('beforeExit', async() => {
    await prisma.$disconnect()
})

process.on('SIGINT', async() => {
    await prisma.$disconnect()
    process.exit(0)
})

process.on("SIGTERM", async() => {
    await prisma.$disconnect()
    process.exit(0)
})

export default prisma