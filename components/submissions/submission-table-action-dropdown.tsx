'use client'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button"
import { Delete, Edit, Eye, MoreHorizontal, MoreVertical } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useModal } from "@/hooks/modal-hook"
import { deleteService } from "@/actions/service-actions"
import { deleteSubmission } from "@/actions/submission-action"

type Props = {
    submissionId:string
}



const SubmissionTableActionsDropdown = ({submissionId}: Props) => {
    const params = useParams<{companySlug:string,leadId:string}>()

   const url = `${process.env.NEXT_PUBLIC_BASE_URL}/${params.companySlug}/leads/${params.leadId}/submissions/${submissionId}`

   const {setOpen} = useModal()

const handleDeleteModalOpen = ()=>{
setOpen({type:'delete',deleteFunction:()=>deleteSubmission({companySlug:params.companySlug,id:submissionId})})
  
}
    
  return (
    <DropdownMenu>
<DropdownMenuTrigger asChild>
  <Button variant="ghost" className="h-8 w-8 p-0">
    <span className="sr-only">Open menu</span>
    <MoreVertical className="h-4 w-4 text-muted-foreground" />
  </Button>
</DropdownMenuTrigger>
<DropdownMenuContent align="end">
  <DropdownMenuLabel>Actions</DropdownMenuLabel>

  <DropdownMenuSeparator />
  <DropdownMenuItem asChild  className="p-2   cursor-pointer"><Link className="flex items-center justify-start gap-3" href={url}><Eye /> View</Link></DropdownMenuItem>
  <DropdownMenuItem onClick={handleDeleteModalOpen} className="p-2 flex items-center justify-start gap-3  cursor-pointer text-rose-500 hover:!text-rose-500"><Delete /> Delete</DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>
  )
}

export default SubmissionTableActionsDropdown









