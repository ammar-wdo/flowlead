import FormRuleWrapper from '@/components/forms/form-rules-wrapper'
import Heading from '@/components/heading'
import { CustomError } from '@/custom-error'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { notFound } from 'next/navigation'
import React from 'react'

type Props = {
  params:{formSlug:string,companySlug:string}
}

const page = async({params:{formSlug,companySlug}}: Props) => {

const {userId} = auth()
if(!userId) throw new CustomError("Unauthorized")


  
   const   form = await prisma.form.findUnique({
      where:{
        userId,
        slug:formSlug,
        company:{
          slug:companySlug
        }
      }
    })

    if(!form  &&  formSlug !=='new') return notFound()

    const services = await prisma.service.findMany({
      where:{
        userId
      }
    })








  return (
    <div>
      <Heading title={form ? `Update ${form.name}` : "Create New Form"}/>

      <div className='mt-12'>
        <FormRuleWrapper fetchedForm={form} services={services}/>
      </div>
    </div>
  )
}

export default page