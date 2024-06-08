import Heading from '@/components/heading'
import CompanySettingsForm from '@/components/settings/company-settings-form'
import { CustomError } from '@/custom-error'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { notFound } from 'next/navigation'
import React from 'react'

type Props = {params:{companySlug:string}}

const page = async({params}: Props) => {

    const {userId} = auth()
    if(!userId) throw new CustomError("Unauthorized")

        const company = await prisma.company.findUnique({
            where:{
                slug:params.companySlug,
                userId
            }
        })

        if(!company) return notFound()
  return (
    <div>
        <Heading title='Company Settings'/>
        <CompanySettingsForm  company={company}/>
    </div>
  )
}

export default page