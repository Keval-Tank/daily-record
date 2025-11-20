import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import HomePage from './pages/HomePage'
import CreateUserPage from './pages/CreateUserPage'
import AddFundPage from './pages/AddFundPage'
import GetBalancePage from './pages/GetBalancePage'
import TransactionPage from './pages/TransactionPage'

const App = () => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  // create user
  const createUserHandler = async(name :string) => {
    const res = await fetch(`${backendUrl}/createUser`, {
      method : 'POST',
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        "name" : name
      })
    });
    if(res.ok){
      const data = await res.json();
      toast.success("User Created SuccessFully !")
      return data;
    }else{
      toast.error("User Not Created")
    }
    return;
  }

  // addfund
  const addFundHandler = async(id : string, amount : number) => {
    const res = await fetch(`${backendUrl}/addBalance`, {
      method : 'POST',
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        "id" : id,
        "amount" : amount
      })
    });
    if(res.ok){
      const data = await res.json();
      toast.success("Funds added successfully");
      return data;
    }else{
      toast.error("Failed to add funds")
    }
    return;
  }

  // getBalance
  const getBalanceHandler = async(id : string) => {
    const res = await fetch(`${backendUrl}/getBalance/${id}`)
    if(res.ok){
      const data = await res.json()
      toast.success("Balance Found")
      return data
    }else{
      toast.error("User Not found")
    }
    return;
  }

  // makeTransaction
  const makeTranscationHandler = async(senderId : string, recieverId : string, amount : number) => {
    const res = await fetch(`${backendUrl}/transfer`, {
      method : 'POST',
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        "senderId" : senderId,
        "recieverId" : recieverId,
        "amount" : amount
      })
    })

    if(res.ok){
      const data = await res.json()
      toast.success("Transaction successfull")
      return data;
    }else{
      toast.error("Transaction Failed")
    }

    return
  }


  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route index element={<HomePage/>}/>
        <Route path='/create-user' element={<CreateUserPage sendUserData={createUserHandler}/>}/>
        <Route path='/add-funds' element={<AddFundPage addFund={addFundHandler}/>}></Route>
        <Route path='/get-balance' element={<GetBalancePage getBalance={getBalanceHandler}/>}></Route>
        <Route path='/make-transaction' element={<TransactionPage makeTransaction={makeTranscationHandler}/>}/>
      </Route>
    )
  )

  return <>
   <RouterProvider router={router}/>
   <ToastContainer/>
  </>
}

export default App
