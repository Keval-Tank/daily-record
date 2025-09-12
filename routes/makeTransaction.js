import { ObjectId } from 'mongodb';
import { userCollection, ledgerEntry, date, idempotency} from '../middleware/db.js';

const makeTransaction = async(req, res) => {
        let req_data = await idempotency.findOne({transactionId: req.requestId, serviced : true});
        if(req_data){
            return res.status(200).json(req_data);
        }
        let from = new ObjectId(req.body.from);
        let to  = new ObjectId(req.body.to);
        let amount = parseInt(req.body.amount);
        let from_data = await userCollection.findOne({_id : from});
        let to_data = await userCollection.findOne({_id : to});
        if(from.toString() === to.toString()){
            return res.status(400).json({
                "msg" : "Bad request"
            });
        }
        if((!from_data || !to_data )){
            return res.status(404).json({
                "msg" : "User Not Found!"
            });
        }
        if(amount <= 0){
            return res.status(400).json({
                "msg" : "Please add valid amount"
            });
        }
        if(from_data.balance != 0 && from_data.balance < amount){
            return res.status(409).json({
                "msg" : "Insufficient Balance"
            });
        }
        let credit = parseInt(from_data.balance) - amount;
        let debit = parseInt(to_data.balance) + amount;

        await userCollection.findOneAndUpdate({_id : from},
            {$set : {balance : credit}});

        await userCollection.findOneAndUpdate({_id : to},
        {$set : {balance : debit}});

        let after_sender = await userCollection.findOne({_id : from});
        let after_reciever = await userCollection.findOne({_id : to});
        if((from_data.balance + amount !== after_sender.balance) && (to_data.balance + amount !== after_reciever.balance)){
            return res.status(500).json({
                "msg" : "Transaction Interuppted"
            });
        }
        
        await idempotency.findOneAndUpdate({transactionId : req.requestId, serviced : false}, {$set : {serviced : true}});
        
        await ledgerEntry.insertOne({
            from : from,
            To: to,
            amount : amount,
            date : `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
        })
        
        res.status(200).json({
            from : from,
            To: to,
            amount : amount,
            date : `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
        });
    }

export default makeTransaction;