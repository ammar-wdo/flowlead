import prisma from '@/lib/prisma'
import React from 'react'

type Props = {companySlug:string}

const LatestInvoices = async({companySlug}: Props) => {

    const latestInvoices = await prisma.invoice.findMany({
        where:{
            company:{
                slug:companySlug
            },       
        },take:5,
        orderBy:{
            createdAt:'desc'
        },
        select:{
            invoiceNumber:true,
            id:true,
            createdAt:true,
            
        }
    })

  return (
    <div>

    </div>
  )
}

export default LatestInvoices