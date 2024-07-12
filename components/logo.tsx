import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {companySlug:string}

const Logo = ({companySlug}: Props) => {
  return (
    <div className='w-full h-[64px] flex items-center justify-center bg-second text-white shrink-0 relative z-50'>
        <Link className='' href={`/${companySlug}`}>
        <Image src={'/logo.png'}  alt='logo' className='object-contain  '  width={102} height={13} />
        </Link>
    </div>
  )
}

export default Logo