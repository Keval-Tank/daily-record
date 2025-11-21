
import UpdateTodo from '../components/UpdateTodo'
import {useParams } from 'react-router-dom'

const UpdatePage = () => {
    const {id} = useParams()
  return (
    <UpdateTodo id={id}/>
  )
}

export default UpdatePage