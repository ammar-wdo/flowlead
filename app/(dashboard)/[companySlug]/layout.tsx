import Aside from '@/components/aside'
import Header from '@/components/header'
import TraialBar from '@/components/traial-bar'
 
import prisma from '@/lib/prisma'
import { checkFreeTrial } from '@/lib/utils'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React, { ReactNode } from 'react'



type Props = { children: ReactNode,params:{companySlug:string} }

const layout = async({ children,params:{companySlug} }: Props) => {


  const {userId} = auth()
  if(!userId) redirect('/sign-in')

  const company = await prisma.company.findUnique({
    where:{
      slug:companySlug,
      userId
    }
  })
 
  if(!company) redirect(process.env.NEXT_PUBLIC_BASE_URL + '/')


  return (
    <div className=' h-full    '>


      <Aside companySlug={companySlug}/>
      <div className=' flex flex-col pl-[240px]'>
      <Header />
      {company?.plan==='FREE' && <TraialBar  date={company?.createdAt!}  />}
        <main className=' flex-1 p-12 min-h-[calc(100vh-64px)]  bg-[#384EB7]/5 min-w-[1100px]'>

          {children}

 
        </main>
      </div>


    </div>
  )
}

export default layout