import React from 'react'

import prisma from '@/lib/prisma'
import ContactTabs from './contact-tabs'

type Props = {
    companySlug:string,
    contactId:string,
    userId:string
}

const ContactTabsWrapper = async({companySlug,contactId,userId}: Props) => {

  

    

  return (
   <ContactTabs />
  )
}

export default ContactTabsWrapper