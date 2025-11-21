import { useAppDispatch, useAppSelector } from '../hooks/typedHooks'
import { removeTodo} from '../features/todo/todoSlice'
import {Link} from 'react-router-dom'


const Todos = () => {
  const todos = useAppSelector(state => state.todos)
  const dispatch = useAppDispatch()
  return (
    <>
    <div>
        <h1>Todo</h1>
        <ul>
          {
            todos.map(todo => {
              const url = `/update/${todo.id}`
              return <li key={todo.id}>{todo.text} <Link to={url}>Update</Link> <button onClick={() => dispatch(removeTodo(todo.id))}>X</button></li>
            })
          }
        </ul>
    </div>
    </>
  )
}

export default Todos