import EmptyComponent from '@/components/empty'
import { Button } from '@/components/ui/button'
import { Check, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Props = {params:{companySlug:string}}

const Success = ({params}: Props) => {
  return (
    <div className='flex items-center justify-center min-h-[calc(100vh-164px)] flex-col gap-3'>
      <CheckCircle size={40} className='text-green-600'/>
     <p className='flex items-center gap-4'>Thank you for your subscription! </p> 

      <Button className='bg-second hover:bg-second/90'><Link href={`/${params.companySlug}`}>Back To Dashboard</Link></Button>
 
    </div>
  )
}

export default Success