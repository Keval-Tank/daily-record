import { useState } from "react"
import { type AddFundResult } from "../../types";

const AddFundPage = ({addFund}) => {
    const [id, setId] = useState('');
    const [amount, setAmount] = useState(0);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({})

    const submitHandler = async(e) => {
        e.preventDefault();
        const result : AddFundResult = await addFund(id, amount)
        if(result){
            setShow(true);
            setData(result)
            setLoading(false)
        }
        return;
    }
  return (
    <div>
      <h1>Add Funds</h1>
      <form onSubmit={submitHandler}>
        <input type="text" placeholder="Enter User Id" value={id} onChange={(e) => setId(e.target.value)}/>
        <input type="number" placeholder="Enter Amount to add" value={amount} onChange={(e) => setAmount(parseInt(e.target.value))}/>
        <button type="submit">Add Fund</button>
      </form>
      <div>{
        show && (loading ? (<h2>Loading...</h2>) : (<>
            <p>UserId = {data.id}</p>
            <p>Name = {data.balance}</p>
          </>))
        }</div>
    </div>
  )
}

export default AddFundPage
