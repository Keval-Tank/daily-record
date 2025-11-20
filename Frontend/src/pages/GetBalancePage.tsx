import {useState} from 'react'
import { type GetBalanceResult } from '../../types';

const GetBalancePage = ({getBalance}) => {
 const [id, setId] = useState('');
 const [show, setShow] = useState(false)
 const [loading, setLoading] = useState(true)
 const [data, setData] = useState({})

 const submitHandler = async(e) => {
    e.preventDefault();
    const getBalanceResult : GetBalanceResult = await getBalance(id);
    if(getBalanceResult){
        setShow(true)
        setData(getBalanceResult)
        setLoading(false)
    }
    return;
 }
  return (
    <div>
      <h1>User Balance</h1>
      <form onSubmit={submitHandler}>
        <input type="text" value={id} placeholder='Enter id' onChange={(e) => setId(e.target.value)} />
        <button type='submit'>Get Balance</button>
      </form>
      <div>
        {
          show && (loading ? (<h2>Loading...</h2>) : (<>
            <p>UserId = {data.id}</p>
            <p>Current Balance = {data.balance}</p>
          </>))
        }
      </div>
    </div>
  )
}

export default GetBalancePage
