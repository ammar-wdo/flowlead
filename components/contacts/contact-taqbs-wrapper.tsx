import React from 'react'

import prisma from '@/lib/prisma'
import ContactTabs from './contact-tabs'

type Props = {
    companySlug:string,
    contactId:string,
    userId:string
}

const ContactTabsWrapper = async({companySlug,contactId,userId}: Props) => {

  
 

const quotationsRes = prisma.quotation.findMany({
    where:{
        contact:{
            id:contactId,
            contactCategory:"CONTACT"
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
            id:contactId,
            contactCategory:"CONTACT"
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


const [quotations,invoices] = await Promise.all([quotationsRes,invoicesRes])
    

  return (
   <ContactTabs quotations={quotations} invoices={invoices} />
  )
}

export default ContactTabsWrapper