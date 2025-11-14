import React from 'react'
import { type ReactNode } from 'react'


type Prop = {
    children : ReactNode,
    bg? : string
}

const Card = ({children, bg = 'bg-gray-100'} : Prop) => {
  return (
    <div className={`${bg} p-6 rounded-lg shadow-md`}>
       { children }
    </div>
  )
}

export default Card
