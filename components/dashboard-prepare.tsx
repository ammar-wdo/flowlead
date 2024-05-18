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
    
        <DialogContent className="2xl:max-w-[55%] max-w-[95%] w-full max-h-[98%] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>First company registration</DialogTitle>
            <DialogDescription>
              Please complete your first company registration in order to start your journey with us.
            </DialogDescription>
          </DialogHeader>
          <CompanyForm/>
        </DialogContent>
      </Dialog>
      
      )
    }
    






