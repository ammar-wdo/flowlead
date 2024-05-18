import React, { ReactNode } from 'react'

type Props = {
    title:string
    children:ReactNode
}

const SectionsWrapper = ({title,children}: Props) => {
  return (
    <section className='mt-8'>
        <h3 className='capitalize font-semibold text-lg mb-6'>{title}</h3>
        {children}
        
        </section>
  )
}

export default SectionsWrapper