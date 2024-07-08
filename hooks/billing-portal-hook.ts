'use client'

import { billingPortal } from "@/actions/billingportal-actions"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"



export const useBiilingPortal = ()=>{
const [loading, setLoading] = useState(false)


const {companySlug} = useParams<{companySlug:string}>()
const router = useRouter()

const handleBillingPortal = async ()=>{
    try {

        const res = await billingPortal({companySlug})

        if(!res.success) return toast.error(res.error)
        router.push(res.url!)

    } catch (error) {
        console.error(error)
        toast.error('Something went wrong')
    }
}


return { loading, handleBillingPortal}
}