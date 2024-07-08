'use client'

import React, { HTMLAttributes } from 'react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { useSubscription } from '@/hooks/subscription-hook'
import { Loader } from 'lucide-react'

type Props = {
    priceId:string
    title:string
} & HTMLAttributes<HTMLButtonElement>

const SubscriptionButton = ({priceId,title,...rest}: Props) => {
    const {handleClick,loading} = useSubscription({priceId})
  return (
    <Button disabled={loading} onClick={handleClick} className={cn('bg-second hover:bg-second/80 text-white',rest.className)}>{title} {loading && <Loader className='ml-3 animate-spin'/>}</Button>
  )
}

export default SubscriptionButton