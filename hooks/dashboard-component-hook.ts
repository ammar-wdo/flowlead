import { useParams } from "next/navigation"
import { useState } from "react"

export const useDashboard = ()=>{
const [hide, setHide] = useState(false)

    const STEPS = ["Edit company details","add a service","add a form","create a contact","create a quotation","create an invoice"] as const

    const [step, setStep] = useState<typeof STEPS[number]>('Edit company details')

    const {companySlug} = useParams<{companySlug:string}>()



    return {STEPS, step , setStep,companySlug,hide,setHide}

}