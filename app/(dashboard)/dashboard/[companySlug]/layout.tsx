import Aside from '@/components/aside'
import { CustomError } from '@/custom-error'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React, { ReactNode } from 'react'

type Props = { children: ReactNode,params:{companySlug:string} }

const layout = async({ children,params:{companySlug} }: Props) => {


  const {userId} = auth()
  if(!userId) throw new CustomError("Unauthorized")

  const company = await prisma.company.findUnique({
    where:{
      slug:companySlug,
      userId
    }
  })

  if(!company) redirect(process.env.NEXT_PUBLIC_BASE_URL + '/dashboard')
  return (
    <main className='max-h-screen h-full flex'>


      <Aside companySlug={companySlug}/>
      <div className='flex-1 flex flex-col'>
        <header className='h-[64px] bg-white border-b'>header</header>
        <div className=' flex-1 '>
          {children}
        </div>
      </div>


    </main>
  )
}

export default layout