import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {companySlug:string}

const Logo = ({companySlug}: Props) => {
  return (
    <div className='w-full h-[64px] flex items-center  bg-second text-white'>
        <Link className='' href={`/dashboard/${companySlug}`}>
        <Image src={'/logo.png'}  alt='logo' className='object-contain ml-[40px]'  width={102} height={13} />
        </Link>
    </div>
  )
}

export default Logo