'use client'

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { ReactNode } from "react"
  

type Props = {
    children:ReactNode,
    title:string
}

const Tip = ({children,title}: Props) => {
  return (
    <TooltipProvider>
    <Tooltip delayDuration={0.4}>
      <TooltipTrigger type="button">{children}</TooltipTrigger>
      <TooltipContent>
        <p>{title}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
  )
}

export default Tip