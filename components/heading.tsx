import Link from 'next/link'
import React from 'react'

type Props = {
    title:string
}

const Heading = ({title}: Props) => {
  return (
    <div>

        <h3 className='capitalize font-[500] text-2xl text-prime'>{title}</h3>
     
    
       
        </div>
  )
}

export default Heading