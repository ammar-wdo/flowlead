import React from 'react'
import LeadTabs from './lead-tabs'
import prisma from '@/lib/prisma'

type Props = {
    companySlug:string,
    leadId:string,
    userId:string
}

const LeadTabsWrapper = async({companySlug,leadId,userId}: Props) => {

    const submissionsRes =  prisma.submission.findMany({
        where:{
            contactId:leadId,
            company:{
                slug:companySlug,
                userId
            }
        }
    })

    const quotationsRes = prisma.quotation.findMany({
        where:{
            contact:{
                id:leadId,
                contactCategory:"LEAD"
            },
            company:{
                slug:companySlug,
                userId
            }
        },
        include:{
            contact:{
                select:{
                    emailAddress:true,
                    companyName:true,
                    contactName:true
                }
            }
        }
    })

    const invoicesRes =  prisma.invoice.findMany({
        where:{
            contact:{
                id:leadId,
                contactCategory:"LEAD"
            },
            company:{
                slug:companySlug,
                userId
            }
        }, include:{
            contact:{
                select:{
                    emailAddress:true,
                    companyName:true,
                    contactName:true
                }
            }
        }
    })


    const [submissions,quotations,invoices] = await Promise.all([submissionsRes,quotationsRes,invoicesRes])

    

  return (
   <LeadTabs submissions={submissions} quotations={quotations} invoices={invoices}/>
  )
}

export default LeadTabsWrapper