import { formColums } from '@/components/forms/col-table'
import { FormDataTable } from '@/components/forms/data-table'
import FormsForm from '@/components/forms/forms-form'
import Heading from '@/components/heading'
import { CustomError } from '@/custom-error'
import { getForms } from '@/lib/utils'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import React from 'react'

type Props = {
  params:{companySlug:string}
}

const page = async({params:{companySlug}}: Props) => {

const {userId} = auth()

if(!userId) throw new CustomError("Unauthorized")
  const forms = await getForms(companySlug,userId)
  return (
    <div>
      <div className='flex items-center justify-between'> 
      <Heading title='Forms' />
      <Link
      className='bg-second text-white py-2 px-4 rounded-md '
      href={process.env.NEXT_PUBLIC_BASE_URL + '/dashboard/' + companySlug +  '/forms/new'}>Add Form</Link>
      </div>


      <div className="mt-12 bg-white ">
      <FormDataTable columns={formColums} data={forms} />
    </div>
  
    </div>
  )
}

export default page