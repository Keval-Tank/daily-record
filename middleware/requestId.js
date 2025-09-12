import { idempotency } from './db.js'
import {v4} from 'uuid';

async function addRequestId(req, res, next) {
    req.requestId = v4();
    console.log(req.requestId);
    if (req.originalUrl === '/transfer') {
        await idempotency.insertOne({
            transactionId: req.requestId,
            serviced : false
        })
    }

    next();
}

export default addRequestId;
