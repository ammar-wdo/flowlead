import Image from 'next/image'
import React from 'react'

type Props = {
    logo:string | undefined | null
    name:string
}

const CompanyAccordionItem = ({logo,name}: Props) => {
  return (
    <div className='flex items-center gap-3 h-[64px]'>
    {logo ? <div className='w-8 h-8 rounded-full relative'>
        <Image src={logo} fill alt='company logo' />
    </div> : <span className='capitalize w-8 h-8 flex items-center justify-center bg-white rounded-full text-primeOpacity font-bold'>{name.charAt(0)}</span>}
    {name}
</div>
  )
}

export default CompanyAccordionItem