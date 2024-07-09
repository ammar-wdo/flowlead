import DashboardComponent from '@/components/dashboard-component'
import LatestInvoices from '@/components/dashboard/latest-invoices'
import LatestLeads from '@/components/dashboard/latest-leads'
import { CustomError } from '@/custom-error'
import prisma from '@/lib/prisma'
import { checkCompanySubscription } from '@/lib/utils'
import { auth } from '@clerk/nextjs/server'
import { format } from 'date-fns'
import { redirect } from 'next/navigation'
import React, { Suspense } from 'react'

type Props = {params:{companySlug:string}}

const page =async ({params:{companySlug}}: Props) => {
const {userId} = auth()
if(!userId) redirect('/sign-up')

  await checkCompanySubscription({userId,companySlug})
  const company=  await prisma.company.findUnique({
    where:{
      slug:companySlug,
      userId
    },
    select:{
      contactPerson:true
    }
  })


 
  return (
    <div>
<span className='text-muted-foreground'>{format(new Date,"EEE, do MMMM")}</span>
<h3 className='text-5xl font-semibold mt-6'>Hello, {company?.contactPerson}.</h3>

<div className='mt-8'>
  <DashboardComponent/>
</div>
{/* latest leads */}
<div className='mt-8 bg-white border p-8'>
<Suspense fallback={<div className='p-12 flex items-center justify-center'>Loading...</div>}>
  <LatestLeads companySlug={companySlug} />
</Suspense>
</div>
{/* latest invoices */}
<div className='mt-8 bg-white border p-8'>
<Suspense fallback={<div className='p-12 flex items-center justify-center'>Loading...</div>}>
  <LatestInvoices companySlug={companySlug} />
</Suspense>
</div>
    </div>
  )
}

export default page