'use client'

import CompanyModal from '@/components/modals/company-modal'
import React, { useEffect, useState } from 'react'

type Props = {}

const ModalsProvider = (props: Props) => {
    const [mounted, setMounted] = useState(false)

    useEffect(()=>{setMounted(true)},[])
    if(!mounted) return null
  return (
   <>
  <CompanyModal/>
   </>
  )
}

export default ModalsProvider