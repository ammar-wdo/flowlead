import { CustomError } from '@/custom-error'
import prisma from '@/lib/prisma'
import { checkCompanySubscription } from '@/lib/utils'
import { UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {params:{companySlug:string}}

const page =async ({params:{companySlug}}: Props) => {
const {userId} = auth()
if(!userId) redirect('/sign-up')
  
  await checkCompanySubscription({userId,companySlug})
 
  return (
    <div></div>
  )
}

export default page