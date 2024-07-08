import { useState } from "react"

export const useDashboard = ()=>{


    const STEPS = ["Edit company details","add a service","add a form","create a contact","create a quotation"]

    const [step, setStep] = useState(0)



    return {STEPS, step , setStep}

}