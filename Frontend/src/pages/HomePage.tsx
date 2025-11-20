import { Link } from "react-router-dom"

const HomePage = () => {
  return (
    <div>
      <Link to='/create-user'>Create User</Link>
      <Link to='/add-funds'>Add Funds</Link>
      <Link to='/get-balance'>Get Balance</Link>  
      <Link to='/make-transaction'>Transfer</Link>
    </div>
  )
}

export default HomePage
