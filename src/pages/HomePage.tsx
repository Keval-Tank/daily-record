import React from 'react'
import Hero from '../components/Hero'
import Homecard from '../components/Homecard'
import JobListing from '../components/JobListing'
import ViewAll from '../components/ViewAll'

const HomePage = () => {
  return (
    <>
    <Hero title="Become a React Dev" subtitle='subtitle for this title'/>
    <Homecard/>
    <JobListing/>
    <ViewAll/>
    </>
  )
}

export default HomePage
