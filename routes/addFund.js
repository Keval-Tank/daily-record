import { ObjectId } from 'mongodb';
import { userCollection} from '../middleware/db.js';

export async function addFund(req, res){
        let amount = req.body.amount;
        if(amount <= 0 || req.body.id === ''){
            res.status(400)
            return res.json({
                "message" : "Please enter a valid amount or id"
            })
        }
        let id = new ObjectId(req.body.id);
        let user = await userCollection.findOne({_id : id})
        if(!user){
            res.status(404)
            return res.json({
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
        res.status(200)
        return res.json({
            id : id,
            balance : new_balance,
        });
    }

