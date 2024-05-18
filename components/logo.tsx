import Image from 'next/image'
import React from 'react'

type Props = {}

const Logo = (props: Props) => {
  return (
    <div className='w-full h-[64px] flex items-center  bg-second text-white'>
        <Image src={'/logo.png'}  alt='logo' className='object-contain ml-[40px]'  width={102} height={13} />
    </div>
  )
}

export default Logo