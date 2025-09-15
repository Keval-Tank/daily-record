import {userCollection, now} from '../middleware/db.js'
export const createPost =  async(req, res) => {
        let user = req.body;
        if(user.name === ""){
            return res.status(400).json({
                "msg": "Please enter a valid name to create account"
            });
        }
        let data = await userCollection.insertOne({
            name : user.name,
            balance : 0,
            createdOn : `${now.getDate()}-${now.getMonth()}-${now.getFullYear()}`
        });
        res.status(201).send({
            id : data.insertedId,
            name : user.name,
            balance : 0,
            createdOn : `${now.getDate()}-${now.getMonth()}-${now.getFullYear()}`
        });
    }

// export default createPost;