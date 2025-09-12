import { ObjectId } from 'mongodb';
import { userCollection } from '../middleware/db.js';

const checkBalance = async(req, res) => {
        let id = new ObjectId(req.params.uid);
        let user_data = await userCollection.findOne({_id : id});
        if(!user_data){
            return res.status(404).json({
                "message" : `user with id ${id} was not found!`
            });
        }
        res.status(200).json({
            id : user_data._id,
            balance : user_data.balance
        })
    }

export default checkBalance;