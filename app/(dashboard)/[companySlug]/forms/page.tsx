import { formColums } from '@/components/forms/col-table'
import { FormDataTable } from '@/components/forms/data-table'
import FormsForm from '@/components/forms/forms-form'
import Heading from '@/components/heading'
import { CustomError } from '@/custom-error'
import prisma from '@/lib/prisma'
import { checkCompanySubscription, checkFreeTrial, getForms } from '@/lib/utils'
import { auth } from '@clerk/nextjs/server'
 
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'


type Props = {
  params:{companySlug:string}
}

const page = async({params:{companySlug}}: Props) => {

const {userId} = auth()

if(!userId) throw new CustomError("Unauthorized")

 await checkCompanySubscription({userId,companySlug})
 
  const forms = await getForms(companySlug,userId)
  return (
    <div>
      <div className='flex items-center justify-between'> 
      <Heading title='Forms' />
      <Link
      className='bg-second text-white py-2 px-4 rounded-md '
      href={process.env.NEXT_PUBLIC_BASE_URL + '/' + companySlug +  '/forms/new'}>Add Form</Link>
      </div>


      <div className="mt-8 bg-white border overflow-hidden rounded-l ">
      <FormDataTable columns={formColums} data={forms} />
    </div>
  
    </div>
  )
}

export default page