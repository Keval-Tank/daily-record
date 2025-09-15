import { ObjectId } from 'mongodb';
import { userCollection, ledgerEntry, date } from '../middleware/db.js';
import { states } from '../middleware/requestId.js';

export const makeTransaction = async (req, res) => {
    let from = new ObjectId(req.body.from);
    let to = new ObjectId(req.body.to);
    let amount = parseInt(req.body.amount);
    let from_data = await userCollection.findOne({ _id: from });
    let to_data = await userCollection.findOne({ _id: to });
    if (from.toString() === to.toString()) {
        return res.status(400).json({
            "msg": "Bad request"
        });
    }
    if ((!from_data || !to_data)) {
        return res.status(404).json({
            "msg": "User Not Found!"
        });
    }
    if (amount <= 0) {
        return res.status(400).json({
            "msg": "Please add valid amount"
        });
    }
    if (from_data.balance != 0 && from_data.balance < amount) {
        return res.status(409).json({
            "msg": "Insufficient Balance"
        });
    }
    let request_data = await ledgerEntry.findOne({ transactionId: req.requestId, state: states[2] });
    if (request_data) {
        await ledgerEntry.deleteOne({transactionId : req.requestId, state : states[0]});
        return res.json({
            status: request_data.state,
            from: from,
            To: to,
            amount: request_data.amount,
            creationTime: `${date.getDate()}-${date.getMonth()}-${date.getFullYear()} -- ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
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
        return res.status(500).json({
            "status": states[1],
            "msg": "Transaction Interuppted"
        });
    }

    await ledgerEntry.updateOne({ transactionId: req.requestId }, { $set: { state: states[2] } });

    return res.status(200).json({
        status: states[2],
        from: from,
        To: to,
        amount: amount,
        creationTime: `${date.getDate()}-${date.getMonth()}-${date.getFullYear()} -- ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    });
}

// export default makeTransaction;