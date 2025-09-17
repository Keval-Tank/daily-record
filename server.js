import express from 'express';
import {createPost, checkBalance, addFund, makeTransaction, authorizer, addRequestId} from './Barrel.js'

let app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(addRequestId);
app.get('/', (req, res) => {
    res.send('Hello world');
})

app.post('/users', authorizer, createPost);

app.get('/balance/:uid', authorizer, checkBalance);

app.post('/fund', authorizer, addFund);

app.post('/transfer', authorizer, makeTransaction);

app.listen(PORT, () => console.log(`Server is runnig on port ${PORT}`));

