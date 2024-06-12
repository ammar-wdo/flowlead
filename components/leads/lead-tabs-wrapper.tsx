import React from 'react'
import LeadTabs from './lead-tabs'
import prisma from '@/lib/prisma'

type Props = {
    companySlug:string,
    leadId:string,
    userId:string
}

const LeadTabsWrapper = async({companySlug,leadId,userId}: Props) => {

    const submissions = await prisma.submission.findMany({
        where:{
            contactId:leadId,
            company:{
                slug:companySlug,
                userId
            }
        }
    })

    

  return (
   <LeadTabs submissions={submissions}/>
  )
}

export default LeadTabsWrapper