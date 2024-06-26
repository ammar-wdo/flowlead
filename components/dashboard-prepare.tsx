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


type Props = {}
    
   export const DashboardPrepare= (props: Props) => {
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
    
        <DialogContent className="2xl:max-w-[35%] sm:maxw-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%]  max-w-[95%] w-full max-h-[98%] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle className="pb-8 border-b">Create Your Company</DialogTitle>
            <DialogDescription>
           
            </DialogDescription>
          </DialogHeader>
          <CompanyForm/>
        </DialogContent>
      </Dialog>
      
      )
    }
    






