import prisma from '@/lib/prisma'
import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { format } from 'date-fns'

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
            contact:{
                select:{
                    companyName:true,
                    contactName:true,
                    emailAddress:true
                }
            },
            status:true,
            totalAmount:true
            
        }
    })

  return (
    <div>
<h3 className='text-gray-400 font-semibold'>Latest Invoces</h3>
<div className='mt-3'>
{!!latestInvoices.length ? <Table>
  
  <TableHeader>
    <TableRow>
      <TableHead className=" ">Invoice Number</TableHead>
      <TableHead>Created At</TableHead>
      <TableHead>Name</TableHead>
      <TableHead className=" ">Email Address</TableHead>
      <TableHead className=" ">Status</TableHead>
      <TableHead className=" ">Total Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
 { latestInvoices.map(data=><TableRow key={data.id}>
      <TableCell className=" ">{data.invoiceNumber}</TableCell>
      <TableCell>{format(data.createdAt,"dd-MM-yyyy")}</TableCell>
      <TableCell>{data.contact.companyName || data.contact.contactName}</TableCell>
      <TableCell className=" ">{data.contact.emailAddress}</TableCell>
      <TableCell className=" ">{data.status}</TableCell>
      <TableCell className=" ">{data.totalAmount}</TableCell>
    </TableRow>)  }
  </TableBody>
</Table> : <p className='text-lg font-semibold text-gray-300 text-center'>No Invoices</p>}
</div>
    </div>
  )
}

export default LatestInvoices