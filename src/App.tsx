import React from 'react'
import HomePage from './pages/HomePage';
import Mainlayout from './layouts/Mainlayout';

import {
  Route,
  createRoutesFromElements,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom'
import JobsPage from './pages/JobsPage';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Mainlayout/>}>
      <Route index element={<HomePage/>}/>
      <Route path='/jobs' element={<JobsPage/>}/>
    </Route>
  )
)

const App = () => {
  return <RouterProvider router={router}/>
};

export default App
