'use client'

import { checkFreeTrial, cn } from "@/lib/utils"
import { format } from "date-fns"
import { XIcon } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"

type Props = {
 
    date:Date
}

const TraialBar = ({date,
   
}: Props) => {
   
    const [close, setClose] = useState(false)
    const currentDate = new Date();
    const startDate =  date;
  
    // Calculate the end date which is 7 days from the start date
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    // Calculate the difference in milliseconds
const differenceInMillis = endDate.getTime() - currentDate.getTime();

// Convert the difference in milliseconds to days
const differenceInDays = Math.ceil(differenceInMillis / (1000 * 60 * 60 * 24))

const {companySlug} = useParams<{companySlug:string}>()
 
 
  return (
    <div className={cn("h-12 bg-second flex items-center justify-center relative text-white text-sm gap-3",close && "hidden")}>
       Your trial ends in {differenceInDays} day(s).{"  "} <Link className="underline" href={`/${companySlug}/upgrade`}> {"  "} Upgrade Now</Link>
<XIcon onClick={()=>setClose(true)} className="right-4 cursor-pointer absolute"/>
    </div>
  )
}

export default TraialBar