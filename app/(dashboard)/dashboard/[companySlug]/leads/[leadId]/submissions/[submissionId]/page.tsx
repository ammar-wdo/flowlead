import { CustomError } from '@/custom-error'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { notFound } from 'next/navigation'
import React from 'react'

type Props = {params:{companySlug:string,leadId:string,submissionId:string}}

const page = async({params:{companySlug,leadId,submissionId}}: Props) => {

  const {userId} = auth()
  if(!userId) throw new CustomError("Unauthorized")
const submission = await prisma.submission.findUnique({
  where:{
    id:submissionId,
    company:{slug:companySlug},
    contactId:leadId
  }
})

if(!submission) return notFound()

  return (
    <div ><p className='max-w-[400px] text-lg text-muted-foreground'>{JSON.stringify(submission.content,null,2)}</p></div>
  )
}

export default page