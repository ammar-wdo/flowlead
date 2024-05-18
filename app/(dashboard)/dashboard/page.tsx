
import DashboardPrepare from '@/components/dashboard-prepare'
import { CustomError } from '@/custom-error'
import prisma from '@/lib/prisma'
import { prepareUser } from '@/lib/utils'
import { UserButton } from '@clerk/nextjs'
import { auth, currentUser } from '@clerk/nextjs/server'
import React from 'react'

type Props = {}

const page = async(props: Props) => {

await prepareUser()

// const {userId} = auth()

// if(!userId) throw new CustomError('Unauthorized')

// const company  = await prisma.company.findFirst({
//   where:{
//     userId
//   }
// })





 

   
  return (
   <div className='min-h-screen flex items-center justify-center'>


<DashboardPrepare/>
 </div> 
  )
}

export default page