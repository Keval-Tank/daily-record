import { useState } from 'react'
import { type TransactionResult } from '../../types'

const TransactionPage = ({ makeTransaction }) => {
    const [senderId, setSenderId] = useState('')
    const [recieverId, setRecieverId] = useState('')
    const [amount, setAmount] = useState(0)
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({})

    const submitHandler = async (e) => {
        e.preventDefault();
        const transactionResult: TransactionResult = await makeTransaction(senderId, recieverId, amount)
        if (transactionResult) {
            setShow(true)
            setData(transactionResult)
            setLoading(false)
        }
        return;
    }
    return (
        <div>
            <h1>Transaction</h1>
            <form onSubmit={submitHandler}>
                <input type="text" value={senderId} placeholder='Enter Sender id' onChange={(e) => setSenderId(e.target.value)} />
                <input type="text" value={recieverId} placeholder='Enter reciever id' onChange={(e) => setRecieverId(e.target.value)} />
                <input type="number" value={amount} placeholder='Enter amount' onChange={(e) => setAmount(parseInt(e.target.value))} />
                <button type='submit'>Transfer</button>
            </form>
            <div>{
                show && (loading ? (<h2>Loading...</h2>) : (
                   <> <p>sender = {data.sender}</p>
                    <p>reciever = {data.reciever}</p>
                    <p>amount = {data.amount}</p></>
                ))
            }</div>
        </div>
    )
}

export default TransactionPage
