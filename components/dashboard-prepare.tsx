'use client'





import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { useModal } from "@/hooks/modal-hook"
import CompanyForm from "./company/company-form"
import { useEffect, useState } from "react"


type Props = {email:string}
    
   export const DashboardPrepare= ({email}: Props) => {
    const [openModal, setOpenModal] = useState(true)

    const [mounted, setMounted] = useState(false)

    useEffect(()=>{
        setMounted(true)
    },[])

    useEffect(()=>{
        setOpenModal(true)
    },[openModal])

    if(!mounted) return 
     
      return (
        <Dialog open={openModal} onOpenChange={setOpenModal} >
    
        <DialogContent className="2xl:max-w-[30%]   sm:max-w-[90%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[40%]  max-w-[95%] w-full max-h-[98%] overflow-y-auto border ">
          <DialogHeader>
            <DialogTitle className="pb-8 border-b">Create Your Company</DialogTitle>
            <DialogDescription className="!my-8">
            Your login details have been sent by email to &quot;{email}&quot;. To create an administration for your company, we only need your company details. You can fill this in below.
            </DialogDescription>
          </DialogHeader>
          <CompanyForm/>
        </DialogContent>
      </Dialog>
      
      )
    }
    






