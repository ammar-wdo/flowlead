import Heading from '@/components/heading'
import Link from 'next/link'
import React from 'react'

type Props = {
  params:{companySlug:string}
}

const page = ({params:{companySlug}}: Props) => {
  return (
    <div>
      <div className='flex items-center justify-between'>
      <Heading title='services'/>
      <Link
      className='bg-second text-white py-2 px-4 rounded-md '
      href={process.env.NEXT_PUBLIC_BASE_URL + '/dashboard/' + companySlug +  '/services/new'}>Add Service</Link>
      </div>

    </div>
  )
}

export default page