
import DashboardPrepare from '@/components/dashboard-prepare'
import prisma from '@/lib/prisma'
import { prepareUser } from '@/lib/utils'
import { UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

type Props = {}

const page = async(props: Props) => {

await prepareUser()



 

   
  return (
   <div className='min-h-screen flex items-center justify-center'>


<DashboardPrepare/>
 </div> 
  )
}

export default page