"use client"

import courses from '../data/music_courses.json'
import Link from 'next/link'
import { BackgroundGradient } from './ui/background-gradient'

interface Course {
    id: number,
    title: string,
    slug: string
    description: string,
    price: number,
    instructor: string,
    isFeatured: boolean,
}

const FeatureSection = () => {
    const featured_courses = courses.courses.filter((course : Course) => course.isFeatured)
    return (
        <div className="py-12 bg-gray-900">
            <div>
                <div>
                    <div className='text-center'>
                        <h2 className="text-base text-teal-600 font-semibold tracking-wide uppercase">FEATURED COURSES</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">Learn With the Best</p>
                    </div>
                </div>
                <div className='mt-9'>
                    <div  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                        {
                            featured_courses.map((course : Course) => (
                                <div key={course.id} className="flex justify-center">
                                    <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
                                        <p className="text-lg sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">{course.title}</p>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 flex-grow mt-4">{course.description}</p>
                                        <div className='mt-6'>
                                            <Link href={`/courses/${course.slug}`}>Learn More</Link>
                                        </div>
                                    </BackgroundGradient>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div>
                    <div className="mt-20 text-center">
                        <Link href={'/all-courses'}   className="px-4 py-2 rounded border border-neutral-600 text-neutral-700 bg-white hover:bg-gray-100 transition duration-200">View all courses</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FeatureSection
