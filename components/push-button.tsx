'use client'

import React, { HTMLAttributes } from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

type Props = {
    href:string
} & HTMLAttributes<HTMLButtonElement>

const PushButton = ({href,className,children }: Props) => {

    const router = useRouter()
    const handlePush = ()=>{
      router.push(href)
    }
  return (
   <Button onClick={handlePush} className={cn(className)}  variant={'ghost'}>{children}</Button>
  )
}

export default PushButton