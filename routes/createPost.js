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
            createdOn : `${now.getDate().toString().padStart(2,'0')}-${now.getMonth().toString().padStart(2, '0')}-${now.getFullYear().toString().padStart(2,'0')} -- ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`
        });
        res.status(201).send({
            id : data.insertedId,
            name : user.name,
            balance : 0,
            createdOn : `${now.getDate().toString().padStart(2,'0')}-${now.getMonth().toString().padStart(2, '0')}-${now.getFullYear().toString().padStart(2,'0')} -- ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2, '0')}`
        });
    }

// export default createPost;