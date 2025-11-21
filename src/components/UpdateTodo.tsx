import {useState} from 'react'
import { useAppDispatch } from '../hooks/typedHooks'
import { updateTodo } from '../features/todo/todoSlice'
import { useNavigate } from 'react-router-dom'

const UpdateTodo = ({id}) => {
  const [input, setInput] = useState(' ')
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(updateTodo({id, text : input}));
    navigate('/');
  }

  return (
    <>
      <h1>Update Todo</h1>
      <form onSubmit={onSubmitHandler}>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)}/>
        <button type="submit">Update todo</button>
      </form>
    </>
  )
}

export default UpdateTodo