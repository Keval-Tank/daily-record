
import {Route , RouterProvider, createBrowserRouter, createRoutesFromElements}from 'react-router-dom'
import HomePage from './pages/HomePage'
import UpdatePage from './pages/UpdatePage'

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route index element={<HomePage/>}/>
        <Route path='/update/:id' element={<UpdatePage/>}/>
      </Route>
    )
  )

  return (
    <>
     <RouterProvider router={router}/>
    </>
  )
}

export default App
