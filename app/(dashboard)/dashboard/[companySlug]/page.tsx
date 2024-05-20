import { CustomError } from '@/custom-error'
import prisma from '@/lib/prisma'
import { UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {params:{companySlug:string}}

const page =async ({params:{companySlug}}: Props) => {


 
  return (
    <div></div>
  )
}

export default page