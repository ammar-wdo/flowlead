import FormRuleWrapper from '@/components/forms/form-rules-wrapper'
import Heading from '@/components/heading'
import { CustomError } from '@/custom-error'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import React from 'react'

type Props = {
  params:{formSlug:string}
}

const page = async({params:{formSlug}}: Props) => {

const {userId} = auth()
if(!userId) throw new CustomError("Unauthorized")


  
   const   form = await prisma.form.findUnique({
      where:{
        userId,
        slug:formSlug
      }
    })






  return (
    <div>
      <Heading title='Add Form'/>

      <div className='mt-12'>
        <FormRuleWrapper fetchedForm={form}/>
      </div>
    </div>
  )
}

export default page