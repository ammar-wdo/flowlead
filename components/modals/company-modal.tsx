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

export default CompanyModal