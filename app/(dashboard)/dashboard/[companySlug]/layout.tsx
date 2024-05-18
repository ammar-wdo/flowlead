import Aside from '@/components/aside'
import React, { ReactNode } from 'react'

type Props = { children: ReactNode,params:{companySlug:string} }

const layout = ({ children,params }: Props) => {
  return (
    <main className='max-h-screen h-full flex'>


      <Aside companySlug={params.companySlug}/>
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