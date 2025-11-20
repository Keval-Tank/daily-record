import prisma from '../database/database'

// create User service
export async function createUserService(name : string) {
    if(!name || typeof name !== 'string'){
        throw new Error("Invalid Input")
    }
    const user  = await prisma.users.create({
        data : {
            name
        }
    })
    return user;
}

// add fund service
export async function addFundService(id : string , amount : number) {
    if(!id || typeof id !== 'string' || !amount || amount <= 0){
        throw new Error("Invalid Input")
    }
    const findUser = await prisma.users.findFirst({
        where : {
            id
        }
    })
    if(!findUser){
        throw new Error("User Not Found")
    }
    const updatedUserData = await prisma.users.update({
        where : {
            id
        },
        data : {
            balance : findUser.balance + amount
        }
    })
    return updatedUserData;
}

// get balance service
export async function getBalanceService(id : string){
    if(!id || typeof id !== 'string'){
        throw new Error("Invalid Input")
    }
    const userDetails = await prisma.users.findFirst({
        where : {
            id
        }
    })
    if(!userDetails){
        throw new Error("User Not Found")
    }
    return userDetails;
}

// transaction 
export async function makeTransactionService(senderId:string, recieverId : string, amount : number){
    if(!senderId || !recieverId || amount <= 0 || senderId === recieverId){
        throw new Error("Invalid Input")
    }
    const senderDetails = await prisma.users.findFirst({
        where: {
            id: senderId
        }
    })
    const recieverDetails = await prisma.users.findFirst({
        where: {
            id: recieverId
        }
    })
    if (!senderDetails || !recieverDetails) {
       throw new Error("User Not Found")
    }
    if (senderDetails.balance < amount) {
        throw new Error("Insufficient Balance")
    }
    const ledgerEntry = await prisma.ledger.create({
        data : {
            sender : senderId,
            reciever : recieverId,
            amount
        }
    })
    await prisma.$transaction([
        prisma.users.update({
            where: {
                id: senderId
            },
            data: {
                balance: senderDetails.balance - amount
            }
        }),
        prisma.users.update({
            where: {
                id: recieverId
            },
            data: {
                balance: recieverDetails.balance + amount
            }
        }),
        prisma.ledger.update({
            where : {
                transactionId : ledgerEntry.transactionId,
            },
            data : {
                status : 'Done'
            }
        })
    ])
    if(ledgerEntry.status === 'Pending'){
        await prisma.ledger.update({
            where : {
                transactionId : ledgerEntry.transactionId,
            },
            data : {
                status : 'Cancelled'
            }
        })
    }
    return ledgerEntry
}