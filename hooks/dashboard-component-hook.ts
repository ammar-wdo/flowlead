import { useState } from "react"

export const useDashboard = ()=>{


    const STEPS = ["edit company","add service","add form","create contact","create quotation"]

    const [step, setStep] = useState(0)



    return {STEPS, step , setStep}

}