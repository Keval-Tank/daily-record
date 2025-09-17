import express from 'express';
import {createPost, checkBalance, addFund, makeTransaction, authorizer, addRequestId} from './Barrel.js'

let app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(addRequestId);

app.get('/api', (req, res) => {
    res.end();
})

app.post('/api/users', authorizer, createPost);

app.get('/api/balance/:uid', authorizer, checkBalance);

app.post('/api/fund', authorizer, addFund);

app.post('/api/transfer', authorizer, makeTransaction);

app.listen(PORT, () => console.log(`Server is runnig on port ${PORT}`));

