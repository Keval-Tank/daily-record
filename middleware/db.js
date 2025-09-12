import { MongoClient } from 'mongodb';

let date = new Date();
const client = new MongoClient('mongodb://127.0.0.1:27017');
await client.connect();
const db = client.db('WalletAPI');
const userCollection = db.collection('users');
const ledgerEntry = db.collection('ledger');
const idempotency = db.collection('idempotency');


export {userCollection, ledgerEntry, date, idempotency};