import {useState} from 'react'
import { addTodo } from '../features/todo/todoSlice'
import { useAppDispatch} from '../hooks/typedHooks'


const AddTodo = () => {
  const dispatch = useAppDispatch()
  const [input, setInput] = useState('')
  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(addTodo(input))
    setInput('')
  }
  return (
    <>
    <h1>Add Todo</h1>
    <form onSubmit={submitHandler}>
        <input type="text" placeholder='Enter todo' value={input} onChange={(e) => setInput(e.target.value)} />
        <button type='submit'>Add Todo</button>
    </form>
    </>
  )
}

export default AddTodo