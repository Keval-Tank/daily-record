import { idempotency } from './db.js'
import {v4} from 'uuid';

async function addRequestId(req, res, next) {
    if (req.originalUrl === '/transfer') {
        req.requestId = v4();
        await idempotency.insertOne({
            transactionId: req.requestId,
            serviced : false
        })
    }

    next();
}

export default addRequestId;
