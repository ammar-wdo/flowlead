
import { UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

type Props = {}

const page = async(props: Props) => {

    const user = await currentUser()
  return (
   <div className='min-h-screen flex items-center justify-center'>


    <UserButton showName />



   </div> 
  )
}

export default page