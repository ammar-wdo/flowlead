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
import CompanyForm from "../company/company-form"
  
type Props = {}

const CompanyModal = (props: Props) => {

    const {open,modalInputs,setClose} = useModal()

    const openModal = !!open && !!(modalInputs?.type==='company-modal')
  return (
    <Dialog open={openModal} onOpenChange={setClose}>

    <DialogContent className="2xl:max-w-[30%]   sm:max-w-[90%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[40%]  max-w-[95%] w-full max-h-[98%] overflow-y-auto border">
      <DialogHeader>
      <DialogTitle className="pb-8 border-b">Create New Company</DialogTitle>
      
        <DialogDescription>
     
        </DialogDescription>
      </DialogHeader>
      <CompanyForm/>
    </DialogContent>
  </Dialog>
  
  )
}

export default CompanyModal