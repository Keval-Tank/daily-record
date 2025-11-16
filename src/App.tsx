import React from 'react'
import HomePage from './pages/HomePage';
import Mainlayout from './layouts/Mainlayout';
import NotFoundPage from './pages/NotFoundPage';
import JobPage, { jobLoader } from './pages/JobPage';
import EditJobPage from './pages/EditJobPage'

import {
  Route,
  createRoutesFromElements,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom'
import JobsPage from './pages/JobsPage';
import AddJobPage from './pages/AddJobPage';

type Job = {
  title : string,
  type  :string,
  location  : string,
  description : string,
  salary  : string,
  company: {
    name: string,
    description: string,
    contactEmail  :string,
    contactPhone  : string
  }
}


const App = () => {
  // add a job
  const addJob = async (newJob: Job) => {
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(newJob)
    });
    return;
  }

  const updateJob = async(job : any) => {
    const res = await fetch(`/api/jobs/${job.id}`, {
      method : 'PUT',
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify(job)
    });
    return;
  }

  
  // delete a job
  const deleteJob = async(id : string) => {
    const res = await fetch(`/api/jobs/${id}`, {
      method : 'DELETE'
    })
    return;
  }
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Mainlayout />}>
        <Route index element={<HomePage />} />
        <Route path='/jobs' element={<JobsPage />} />
        <Route path='/jobs/:id' element={<JobPage deleteJob={deleteJob} />} loader={jobLoader} />
        <Route path='/edit-job/:id' element={<EditJobPage updatedJobSubmit={updateJob}/>} loader={jobLoader} />
        <Route path='/add-job' element={<AddJobPage addJobSubmit={addJob} />} />
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    )
  )

  return <RouterProvider router={router} />
};

export default App
