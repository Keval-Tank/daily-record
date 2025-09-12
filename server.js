import express from 'express';
import createPost from './routes/createPost.js';
import checkBalance from './routes/checkBalance.js';
import addFund from './routes/addFund.js';
import makeTransaction from './routes/makeTransaction.js'
import authorizer from './middleware/authorizer.js';
import addRequestId from './middleware/requestId.js';

let app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(addRequestId);

app.post('/users', authorizer, createPost);

app.get('/balance/:uid', authorizer, checkBalance);

app.post('/fund', authorizer, addFund);

app.post('/transfer', authorizer, makeTransaction);

app.listen(PORT, () => console.log(`Server is runnig on port ${PORT}`));

