'use client'

import { useDashboard } from '@/hooks/dashboard-component-hook'
import React from 'react'

type Props = {}

const DashboardComponent = (props: Props) => {

  const {STEPS,setStep,step} = useDashboard()
  return (
    <div>DashboardComponent</div>
  )
}

export default DashboardComponent