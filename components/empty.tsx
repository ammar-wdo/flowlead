'use client'

import { cn } from '@/lib/utils'
import { Inbox, Plus } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { useParams } from 'next/navigation'

type Props = {
    url?:string
    title:string
    description:string
    className?:string
    buttonTitle?:string
} 

const EmptyComponent = ({description,title,className,url,buttonTitle}: Props) => {
    const {companySlug} = useParams<{companySlug:string}>()
  return (
    <div className={cn('flex flex-col   items-center justify-center h-64',className)}>
<Inbox className='text-gray-300 shrink-0' size={30}/>

<p className='mt-2 text-sm font-semibold'>{title}</p>
<p className='text-gray-400 text-xs  '>{description}</p>

{url && <Button className='!text-xs xl:text-xs lg:text-xs md:text-xs sm:text-xs text-gray-400 border rounded-lg mt-4 bg-gray-50 hover:bg-gray-50' asChild>
    <Link href={`/${companySlug}/${url}/new`}>
    <Plus size={13}/> {buttonTitle}
    </Link>
    </Button>}

    </div>
  )
}

export default EmptyComponent