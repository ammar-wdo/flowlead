import { CustomError } from '@/custom-error'
import prisma from '@/lib/prisma'
import { UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {params:{companySlug:string}}

const page =async ({params:{companySlug}}: Props) => {

  const {userId} = auth()
  if(!userId) throw new CustomError("Unauthorized")

  const company = await prisma.company.findUnique({
    where:{
      slug:companySlug,
      userId
    }
  })

  if(!company) redirect(process.env.NEXT_PUBLIC_BASE_URL + '/dashboard')
  return (
    <div><UserButton /></div>
  )
}

export default page