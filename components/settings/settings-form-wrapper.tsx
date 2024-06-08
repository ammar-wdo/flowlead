import { cn } from '@/lib/utils'
import React, { ReactNode } from 'react'

type Props = {
    children:ReactNode,
    className?:string
}

const SettingsFormWrapper = ({children,className}: Props) => {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-3 gap-1',className)}>{children}</div>
  )
}

export default SettingsFormWrapper