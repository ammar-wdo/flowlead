import Heading from '@/components/heading'
import QuotationsSettingsForm from '@/components/quotations-settings/quotations-settings-form'
import { CustomError } from '@/custom-error'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import React from 'react'

type Props = {
  params:{companySlug:string}
}

const page = async({params:{companySlug}}: Props) => {

  const {userId} = auth()
  if(!userId) throw new CustomError("Unauthorized")

const company = await prisma.company.findUnique({
  where:{
      slug:companySlug,
      userId
  },include:{
      quotesSettings:true
  }
})

if(!company) throw new CustomError("Company was not found")
  return (
    <div>
        <Heading title='Quotations Settings'/>
        <QuotationsSettingsForm  companyEmail={company?.companyEmail} companyName={company?.name} quotationsSettings={company?.quotesSettings}/>
    </div>
  )
}

export default page