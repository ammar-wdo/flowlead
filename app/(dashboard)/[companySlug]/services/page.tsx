import Heading from '@/components/heading'
import { columns } from '@/components/services/col-table'
import { DataTable } from '@/components/services/data-table'
import { CustomError } from '@/custom-error'
import { getServices } from '@/lib/utils'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import React from 'react'

type Props = {
  params:{companySlug:string}
}

const page = async({params:{companySlug}}: Props) => {

  //fetch services
  const {userId} = auth()
  if(!userId) throw new CustomError("Not Authorized")

    const services = await getServices(companySlug,userId)


  return (
    <div>
      <div className='flex items-center justify-between'>
      <Heading title='services'/>
      <Link
      className='bg-second text-white py-2 px-4 rounded-md '
      href={process.env.NEXT_PUBLIC_BASE_URL + '/' + companySlug +  '/services/new'}>Add Service</Link>
      </div>

      <div className="mt-12 bg-white ">
      <DataTable columns={columns} data={services} />
    </div>

    </div>
  )
}

export default page