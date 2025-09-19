import express from 'express'
import pg from 'pg'
import { v4 } from 'uuid'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const { Pool } = pg;


const pool = new Pool({
    user: 'postgres',
    password: 'keV@l012',
    host: 'localhost',
    port: 5432,
    database: 'wallet'
});

let i = 1;

const authenticator = (req, res, next) => {
    let auth = false;
    for (let i in req.headers) {
        if (i === 'x-api-key') {
            auth = true;
            break;
        }
        console.log(i);
    }
    if (!auth) {
        return res.status(401).json({
            "msg": "Unauthorized access"
        })
    }
    next();
}

// create User
app.post('/users', authenticator, async (req, res) => {
    let id = i++;
    let insert_query = {
        text: 'INSERT INTO users(id, name) VALUES($1, $2)',
        values: [id, req.body.name]
    }
    const result = await pool.query(insert_query);
    res.status(201).json({
        id: id,
        name: req.body.name,
        balance: 0,
        createdOn: `${new Date().getFullYear().toString().padStart(2, '0')}-${new Date().getMonth().toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}`
    })
})

// check balance
app.get('/balance/:uid', authenticator, async (req, res) => {
    let user_id = req.params.uid;
    let all_users_data = (await pool.query('SELECT * FROM users')).rows;
    let found = false;
    let user_balance;
    for (let i of all_users_data) {
        if (i.id === parseInt(user_id)) {
            user_balance = i.balance
            found = true;
        }
    }
    if (found === false) {
        return res.status(404).json({
            "msg": `User with id ${user_id} was not found!`
        })
    }
    res.status(200).json({
        "id": parseInt(user_id),
        "balance": user_balance
    })
})

// fund 
app.post('/fund', authenticator, async (req, res) => {
    let user_id = parseInt(req.body.id)
    let amount = parseInt(req.body.amount)
    let all_users_data = (await pool.query('SELECT * FROM users')).rows;
    let user_exist = false;
    let user_balance;
    for (let i of all_users_data) {
        if (i.id === user_id) {
            user_exist = true;
            user_balance = parseInt(i.balance);
            break;
        }
    }
    if (!user_exist) {
        return res.status(404).json({
            "msg": `User with id ${user_id} was not found!`
        })
    }
    let update_query = {
        text: 'UPDATE users SET balance=$1 WHERE id=$2',
        values: [user_balance + amount, user_id]
    }
    await pool.query(update_query)
    res.status(200).json({
        "id": user_id,
        "balance": user_balance + amount
    })
})


// transfer
app.post('/transfer', authenticator, async (req, res) => {
    let transaction_id = v4();
    let sender = parseInt(req.body.from);
    let reciever = parseInt(req.body.to);
    let sender_balance;
    let reciever_balance;
    let transfer_amount = parseInt(req.body.amount);
    try {
        let find_sender = false;
        let find_reciever = false;
        let all_users_data = (await pool.query('SELECT * FROM users')).rows;
        for (let i of all_users_data) {
            if (i.id === sender) {
                find_sender = true;
                sender_balance = i.balance;
            }
            if (i.id === reciever) {
                find_reciever = true;
                reciever_balance = i.balance;
            }
        }
        let transaction_data = (await pool.query('SELECT * FROM ledger')).rows;
        for (let i of transaction_data) {
            if (i.transaction_id === transaction_id && i.status === 'Done') {
                return res.status(200).json({
                    "transaction_id": transaction_id,
                    "sender": sender,
                    "reciever": reciever,
                    "amount": transfer_amount,
                    "createdOn": `${new Date().getFullYear().toString().padStart(2, '0')}-${new Date().getMonth().toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}`,
                    "status": i.status
                })
            }
        }
        if (sender === reciever) {
            return res.status(400).json({
                "msg": "Bad Request"
            })
        }
        if (!(find_sender || find_reciever)) {
            return res.status(404).json({
                "msg": "User Not found!"
            })
        }
        if (sender_balance < transfer_amount) {
            return res.status(409).json({
                "msg": "Insufficient balance in sender account"
            })
        }
        // start
        await pool.query('BEGIN'); 
        let sender_update_query = {
            text: 'UPDATE users SET balance=$1 WHERE id=$2',
            values: [sender_balance - transfer_amount, sender]
        }
        let reciever_update_query = {
            text: 'UPDATE users SET balance=$1 WHERE id=$2',
            values: [reciever_balance + transfer_amount, reciever]
        }
        await pool.query(sender_update_query);
        await pool.query(reciever_update_query);

        let success_transaction = {
            text: 'INSERT INTO ledger(transaction_id, sender, reciever, amount, status) VALUES($1, $2, $3, $4, $5)',
            values: [transaction_id, sender, reciever, transfer_amount, 'Done']
        }
        await pool.query(success_transaction);
        // commit
        await pool.query('COMMIT')
        // for ensuring correct commit
        let sender_check = false;
        let reciever_check = false;
        let after_transaction_data = await pool.query('SELECT * FROM users');
          for (let i of after_transaction_data) {
            if (i.id === sender) {
                find_sender = true;
                sender_balance = sender_balance - transfer_amount;
                sender_check = true;
            }
            if (i.id === reciever) {
                find_reciever = true;
                reciever_balance = reciever_balance + transfer_amount;
                reciever_check = true;
            }
        }
        if(!sender_check || !reciever_check){
            return new Error();
        }
        res.status(200).json({
            "transaction_id": transaction_id,
            "sender": sender,
            "reciever": reciever,
            "amount": transfer_amount,
            "createdOn": `${new Date().getFullYear().toString().padStart(2, '0')}-${new Date().getMonth().toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')} `,
            "status" : 'Done'
        })

    } catch (error) {
        let failed_transaction = {
            text: 'INSERT INTO ledger(transaction_id, sender, reciever, amount, status) VALUES($1, $2, $3, $4, $5)',
            values: [transaction_id, sender, reciever, transfer_amount, 'Cancelled']
        }
        // roll back
        await pool.query('ROLLBACK')
        await pool.query(failed_transaction);

        return res.status(500).json({
            "msg": "Transaction failed"
        })
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})