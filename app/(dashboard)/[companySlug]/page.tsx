import { CustomError } from '@/custom-error'
import prisma from '@/lib/prisma'
import { checkCompanySubscription } from '@/lib/utils'
import { UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { format } from 'date-fns'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {params:{companySlug:string}}

const page =async ({params:{companySlug}}: Props) => {
const {userId} = auth()
if(!userId) redirect('/sign-up')

  await checkCompanySubscription({userId,companySlug})
  const company=  await prisma.company.findUnique({
    where:{
      slug:companySlug,
      userId
    },
    select:{
      contactPerson:true
    }
  })
 
  return (
    <div>
<span className='text-muted-foreground'>{format(new Date,"EEE, do MMMM")}</span>
<h3 className='text-5xl font-bold mt-6'>Hello, {company?.contactPerson}.</h3>
    </div>
  )
}

export default page