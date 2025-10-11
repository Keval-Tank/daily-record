import { ObjectId } from 'mongodb';
import { userCollection } from '../middleware/db.js';

export async function checkBalance(req, res) {
    try {
        if (req.params.uid === '') {
            res.status(400)
            return res.json({
                "msg": "Bad request, Enter valid id"
            })
        }
        let id = new ObjectId(req.params.uid);
        let user_data = await userCollection.findOne({ _id: id });
        if (!user_data) {
            res.status(404)
            return res.json({
                "msg": `user with id ${id} was not found!`
            });
        }
        res.status(200)
        res.json({
            id,
            balance: user_data.balance
        })
    }catch(err){
        res.status(err.statusCode || 500);
        return res.json({
            "error" : err.message
        })
    }
}

// export default checkBalance;