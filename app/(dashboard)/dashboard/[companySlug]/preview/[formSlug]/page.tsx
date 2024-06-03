import FormPreview from '@/components/forms/form-preview'
import { CustomError } from '@/custom-error'
import prisma from '@/lib/prisma'
import { generateZodSchema } from '@/lib/utils'
import { auth } from '@clerk/nextjs/server'
import { notFound } from 'next/navigation'
import React from 'react'

type Props = {
  params:{formSlug:string
    companySlug:string
  }
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

    if(!form) return notFound()

  return (
    <div>
  <FormPreview form={form}/>
  </div>
  )
}

export default page