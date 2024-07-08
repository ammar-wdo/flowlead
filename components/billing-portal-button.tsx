'use client'

import React, { HTMLAttributes } from 'react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { useSubscription } from '@/hooks/subscription-hook'
import { Loader } from 'lucide-react'
import { useBiilingPortal } from '@/hooks/billing-portal-hook'

type Props = {
  
    title:string
} & HTMLAttributes<HTMLButtonElement>

const BillingPortalButton = ({ title,...rest}: Props) => {
  const {handleBillingPortal,loading} = useBiilingPortal()
  return (
    <Button disabled={loading} onClick={handleBillingPortal} className={cn('bg-second hover:bg-second/80 text-white',rest.className)}>{title} {loading && <Loader className='ml-3 animate-spin'/>}</Button>
  )
}

export default BillingPortalButton