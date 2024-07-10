import Heading from '@/components/heading'
import WidgetSettingsForm from '@/components/widget-settings/widget-settings-form'
import prisma from '@/lib/prisma'
import { checkCompanySubscription } from '@/lib/utils'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  params:{companySlug:string}
}

const page =async ({params:{companySlug}}: Props) => {

  const {userId} = auth()
  if(!userId) redirect('/sign-up')
  
    await checkCompanySubscription({userId,companySlug})

    const company = await prisma.company.findUnique({
      where:{
          slug:companySlug,
          userId
      },include:{
          widgetSettings:true
      }
    })
  return (
    <div>
      <Heading title='Widget Settings'/>
      <div className='mt-8'>
<WidgetSettingsForm widgetSettings={company?.widgetSettings}/>
      </div>
    </div>
  )
}

export default page