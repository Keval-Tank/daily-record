import { ObjectId } from 'mongodb';
import { userCollection, ledgerEntry, now } from '../middleware/db.js';
import { states } from '../middleware/requestId.js';

export async function makeTransaction(req, res){
    let from = new ObjectId(req.body.from);
    let to = new ObjectId(req.body.to);
    let amount = parseInt(req.body.amount);
    let from_data = await userCollection.findOne({ _id: from });
    let to_data = await userCollection.findOne({ _id: to });
    if (from.toString() === to.toString() || req.body.from === "" || req.body.to === ""){
        res.status(400)
        return res.json({
            "msg": "Bad request"
        });
    }
    if (amount <= 0) {
        res.status(400)
        return res.json({
            "msg": "Please add valid amount"
        });
    }
    if ((!from_data || !to_data)) {
        res.status(404)
        return res.json({
            "msg": "User Not Found!"
        });
    }
    if (from_data.balance != 0 && from_data.balance < amount) {
        res.status(409)
        return res.json({
            "msg": "Insufficient Balance"
        });
    }
    let request_data = await ledgerEntry.findOne({ transactionId: req.requestId, state: states[2] });
    if (request_data) {
        await ledgerEntry.deleteOne({transactionId : req.requestId, state : states[0]});
        res.status(200)
        return res.json({
            status: request_data.state,
            sender: from,
            reciever: to,
            amount: request_data.amount,
            creationTime: `${now.getDate().toString().padStart(2,'0')}-${now.getMonth().toString().padStart(2, '0')}-${now.getFullYear().toString().padStart(2,'0')} -- ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2, '0')}`
        })
    }
    let credit = parseInt(from_data.balance) - amount;
    let debit = parseInt(to_data.balance) + amount;

    await userCollection.findOneAndUpdate({ _id: from },
        { $set: { balance: credit } });

    await userCollection.findOneAndUpdate({ _id: to },
        { $set: { balance: debit } });

    let after_sender = await userCollection.findOne({ _id: from });
    let after_reciever = await userCollection.findOne({ _id: to });
    if ((from_data.balance + amount !== after_sender.balance) && (to_data.balance + amount !== after_reciever.balance)) {
        await ledgerEntry.updateOne({ transactionId: req.requestId }, { $set: { state: states[1] } });
        res.status(500)
        return res.json({
            "status": states[1],
            "msg": "Transaction Interuppted"
        });
    }

    await ledgerEntry.updateOne({ transactionId: req.requestId }, { $set: { state: states[2] } });

    res.status(200)
    return res.json({
        status: states[2],
        sender: from,
        reciever: to,
        amount: amount,
        creationTime: `${now.getDate().toString().padStart(2,'0')}-${now.getMonth().toString().padStart(2, '0')}-${now.getFullYear().toString().padStart(2,'0')} -- ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`
    });
}

// export default makeTransaction;