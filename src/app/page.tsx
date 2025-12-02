
import React from 'react'
import Herosection from '@/components/Herosection'
import FeatureSection from '@/components/FeatureSection'
import WhyChooseUs from '@/components/WhyChooseUs'
import Testimonials from '@/components/Testimonials'
import Webinars from '@/components/Webinars'
import Instructors from '@/components/Instructors'

const page = () => {
  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02]">
      <div>
        <Herosection/>
        <FeatureSection/>
        <WhyChooseUs/>
        <Testimonials/>
        <Webinars/>
        <Instructors/>
      </div>
    </main>
  )
}

export default page
