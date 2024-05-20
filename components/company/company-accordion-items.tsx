'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

type Props = {
    logo:string | undefined | null
    name:string,
    trigger?:boolean,
    slug:string
}

const CompanyAccordionItem = ({logo,name,trigger,slug}: Props) => {

  const [mount, setMount] = useState(false)
  useEffect(()=>{setMount(true)},[])

  if(!mount) return <span className='w-full'></span>



const router = useRouter()
  const handleClick = ()=>{
    if(trigger) return 

    router.push(`/dashboard/${slug}`)

  }
  return (
    <Button onClick={handleClick}  className={cn('flex items-center gap-2 w-full  text-white  justify-start  pl-[40px] bg-primeOpacity hover:bg-primeOpacity font-light capitalize text-sm  rounded-none border-b border-[#2F394A]',trigger ? "h-full border-none" : "h-[64px]")} >
    {logo ? <div className='w-8 h-8 rounded-full relative'>
        <Image src={logo} fill alt='company logo' />
    </div> : <span className={cn('capitalize w-8 h-8 flex items-center justify-center bg-white rounded-full text-primeOpacity font-bold shrink-0')}>{name.charAt(0)}</span>}
    <p className={cn("max-w-[130px] text-wrap text-xs text-start",trigger && 'font-semibold ')}>{name}</p>
</Button>
  )
}

export default CompanyAccordionItem