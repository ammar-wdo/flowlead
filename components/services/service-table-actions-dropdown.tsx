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
import { Delete, Edit, MoreHorizontal, MoreVertical } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useModal } from "@/hooks/modal-hook"
import { deleteService } from "@/actions/service-actions"

type Props = {
    serviceId:string
}



const ServiceTableActionsDropdown = ({serviceId}: Props) => {
    const params = useParams()

   const url = `${process.env.NEXT_PUBLIC_BASE_URL}/${params.companySlug}/services/${serviceId}`

   const {setOpen} = useModal()

const handleDeleteModalOpen = ()=>{
setOpen({type:'delete',deleteFunction:()=>deleteService(params.companySlug as string,serviceId)})
  
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
  <DropdownMenuItem asChild  className="p-2   cursor-pointer"><Link className="flex items-center justify-start gap-3" href={url}><Edit /> Edit</Link></DropdownMenuItem>
  <DropdownMenuItem onClick={handleDeleteModalOpen} className="p-2 flex items-center justify-start gap-3  cursor-pointer text-rose-500 hover:!text-rose-500"><Delete /> Delete</DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>
  )
}

export default ServiceTableActionsDropdown









