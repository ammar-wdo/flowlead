import Link from 'next/link'
import React from 'react'

type Props = {
    title:string
}

const Heading = ({title}: Props) => {
  return (
    <div>

        <h3 className='capitalize font-semibold  text-prime'>{title}</h3>
     
    
       
        </div>
  )
}

export default Heading