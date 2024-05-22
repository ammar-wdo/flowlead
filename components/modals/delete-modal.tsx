'use client'


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { useModal } from "@/hooks/modal-hook"
import CompanyForm from "../company/company-form"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { useState } from "react"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
  
type Props = {}

const DeleteModal = (props: Props) => {


    const [isLoading,setIsLoading] = useState(false)
    const {open,modalInputs,setClose} = useModal()
    const router = useRouter()
    const openModal = !!open && !!(modalInputs?.type==='delete')

    if(modalInputs?.type !=='delete') return 

   

const handleDelete = async ()=>{
    try {
        setIsLoading(true)
        const res = await modalInputs.deleteFunction()

        if(!res.success){
            return toast.error(res.error)
        }else {
            toast.success(res.message)
            setClose()
            router.refresh()
            return 
        }
    } catch (error) {
        toast.error("Something went wrong")
    } finally{
        setIsLoading(false)
    }
}

  return (
    <Dialog open={openModal} onOpenChange={setClose}>

    <DialogContent className="">
      <DialogHeader>
        <DialogTitle>Are You Sure?</DialogTitle>
        <DialogDescription>
          Data will be permenantly deleted form our servers!
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <div className="flex items-center gap-4">
            <Button onClick={setClose} variant={'secondary'}>Cancel</Button>
            <Button disabled={isLoading} onClick={handleDelete} variant={'destructive'}>Delete {isLoading && <Loader size={10} className="ml-3 animate-spin" />}</Button>

        </div>
    </DialogFooter>
    </DialogContent>

  </Dialog>
  
  )
}

export default DeleteModal