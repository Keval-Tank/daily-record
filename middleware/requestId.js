import { ledgerEntry, now} from './db.js'
import {v4} from 'uuid';
export let states = Object.freeze(['Pending', 'Cancelled', 'Done']);

export async function addRequestId(req, res, next) {
    if (req.originalUrl === '/transfer') {
        req.requestId = v4();
        await ledgerEntry.insertOne({
            transactionId : req.requestId,
            sender : req.body.from,
            reciever : req.body.to,
            amount : parseInt(req.body.amount),
            createdOn : `${now.getDate()}-${now.getMonth()}-${now.getFullYear()} -- ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
            state : states[0]
        });
    }

    next();
}

// export default addRequestId;
