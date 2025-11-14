import React from 'react'
import { useState } from 'react'
import {FaMapMarker} from 'react-icons/fa'
import {Link} from 'react-router-dom'

type Jobprop = {
    props: {
        type: string,
        post: string,
        desc: string,
        salary: string,
        location: string,
        link : string
    }
}

const Job = (props: Jobprop) => {
    const [showFullDesc, setShowFullDesc] = useState(false)

    let description:string = props.props.desc;

    if(!showFullDesc){
        description = description.substring(0,90) + "...";
    }
    return (
        <>
            <div className="bg-white rounded-xl shadow-md relative">
                <div className="p-4">
                    <div className="mb-6">
                        <div className="text-gray-600 my-2">{props.props.type}</div>
                        <h3 className="text-xl font-bold">{props.props.post}</h3>
                    </div>

                    <div className="mb-5">
                        {description}
                    </div>

                    <button onClick={() => setShowFullDesc((prevState) => (!prevState))} className='text-indigo-500 mb-2 cursor-pointer'>{showFullDesc ? 'Less' : 'More'}</button>

                    <h3 className="text-indigo-500 mb-2">{props.props.salary} / Year</h3>

                    <div className="border border-gray-100 mb-5"></div>

                    <div className="flex flex-col lg:flex-row justify-between mb-4">
                        <div className="text-orange-700 mb-3">
                            <FaMapMarker className='inline text-lg mb-1 mr-'/>
                            {props.props.location}
                        </div>
                        <Link
                            to={props.props.link}
                            className="h-9 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-center text-sm"
                        >
                            Read More
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Job
