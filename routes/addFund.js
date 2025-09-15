import { ObjectId } from 'mongodb';
import { userCollection, ledgerEntry, now } from '../middleware/db.js';

export const addFund = async(req, res) => {
        let amount = req.body.amount;
        if(amount <= 0){
            return res.status(400).json({
                "message" : "Please enter a valid amount"
            })
        }
        let id = new ObjectId(req.body.id);
        let user = await userCollection.findOne({_id : id})
        if(!user){
            return res.status(404).json({
                "message" : `User with id ${id} was not found!`
            })
        }
        let new_balance = parseInt(user.balance) + parseInt(amount);
        await userCollection.findOneAndUpdate({_id : id},
            {$set: {balance : new_balance}}
        );
        // await ledgerEntry.insertOne({
        //     from : id,
        //     To: id,
        //     amount : parseInt(amount),
        //     date : `${now.getDate()}-${now.getMonth()}-${now.getFullYear()}`
        // });
        res.status(200).json({
            id : id,
            balance : new_balance,
        });
    }

