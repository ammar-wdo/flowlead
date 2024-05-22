'use client'

import CompanyModal from '@/components/modals/company-modal'
import DeleteModal from '@/components/modals/delete-modal'
import React, { useEffect, useState } from 'react'

type Props = {}

const ModalsProvider = (props: Props) => {
    const [mounted, setMounted] = useState(false)

    useEffect(()=>{setMounted(true)},[])
    if(!mounted) return null
  return (
   <>
  <CompanyModal/>
  <DeleteModal/>
   </>
  )
}

export default ModalsProvider