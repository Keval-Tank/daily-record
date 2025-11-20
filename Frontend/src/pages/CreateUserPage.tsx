import {useState} from 'react'
import {type UserDetails} from '../../types/index'

const CreateUserPage = ({sendUserData}) => {

    const [name, setName] = useState('')
    const [userData, setUserData] = useState({})
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);

    const submitHandler = async(e) => {
        e.preventDefault();
        const userDetails : UserDetails = await sendUserData(name)
        if(userDetails){
          setShow(true);
          setUserData(userDetails);
          setLoading(false);
        }
        return;
    }

  return (
    <div>
      <h1>Add user</h1>
      <form onSubmit={submitHandler}>
        <input type="text" value={name} placeholder='Enter Your Name' onChange={(e) => setName(e.target.value)}/>
        <button type="submit">Submit</button>
      </form>
      <div>
        {
          show && (loading ? (<h2>Loading...</h2>) : (<>
            <p>UserId = {userData.id}</p>
            <p>Name = {userData.name}</p>
          </>))
        }
      </div>
    </div>
  )
}

export default CreateUserPage
