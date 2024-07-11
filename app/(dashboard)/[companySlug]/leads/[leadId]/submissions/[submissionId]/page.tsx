import { CustomError } from '@/custom-error'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { format, isValid, parseISO } from 'date-fns'
import { notFound } from 'next/navigation'
 
import React from 'react'

type Props = {params:{companySlug:string,leadId:string,submissionId:string}}

const page = async({params:{companySlug,leadId,submissionId}}: Props) => {

  const evaluateValue = (value: any) => {
    if (typeof value === 'string') {
      // Check if the string is an ISO date string
      const date = parseISO(value);
      if (isValid(date)) {
        return <p className='text-xs'>{format(date, 'PPpp')}</p>;
      }
      return <p className='text-xs truncate max-w-[100px]'>{value}</p>;
    } else if (Array.isArray(value)) {
      return (
        <div className='flex items-center gap-3'>
          {value.map((item, index) =>
            typeof item === 'object' ? (
              <div key={index} className='border rounded-md bg-white p-3'>
                {evaluateValue(item)}
              </div>
            ) : (
              <p className='text-xs' key={index}>{item}</p>
            )
          )}
        </div>
      );
    } else if (typeof value === 'object' && value !== null) {
      return (
        <div className='flex flex-col gap-1'>
          {Object.entries(value).map(([key, val], index) => key !=='id' && key !=='serviceId' &&  (
            <div key={index} className='flex items-center gap-2'>
              <p className='text-xs'>{key}: </p>
              {evaluateValue(val)}
            </div>
          ))}
        </div>
      );
    } else if (typeof value === 'number') {
    
      return <p className='text-xs'>{value}</p>;
    } else {
      return <p className='text-xs'>{JSON.stringify(value)}</p>;
    }
  };

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
    <div ><div className='max-w-[1100px] text-lg text-muted-foreground bg-white p-12 border rounded-md' >{

      Object.entries(submission.content || []).map(([key,value],index)=><div key={index} className='flex items-start justify-between p-3  rounded-xl hover:bg-muted transition'>
      <p>{key}</p>
     
      {evaluateValue(value)}
     
           

      </div>)
    }</div></div>
  )
}

export default page