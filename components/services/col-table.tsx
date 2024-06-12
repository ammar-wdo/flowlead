"use client"

import { Service } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/button"
import ServiceTableActionsDropdown from "./service-table-actions-dropdown"
import PushButton from "../push-button"
import {format} from "date-fns"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


type PartialService = {
    id:string
    name:string,
    createdAt:Date,
    company:{slug:string},
   

}

export const columns: ColumnDef<PartialService>[] = [
   
  {
    accessorKey: "name",
    header: "Name",
    cell:({row})=><PushButton className="hover:bg-transparent hover:underline" href={`/dashboard/${row.original.company.slug}/services/${row.original.id}`}><p className=" capitalize font-semibold">{row.getValue('name')}</p></PushButton>
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell:({row})=>  <p className="text-muted-foreground">{format(row.original.createdAt,"dd-MM-yyyy")}</p>
  },

  {
    accessorKey: "actions",
    header: "",
    cell:({row})=><ServiceTableActionsDropdown serviceId={row.original.id}/>
   
  },
]
