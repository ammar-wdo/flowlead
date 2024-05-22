"use client"

import { Service } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/button"
import TableActionsDropdown from "./table-actions-dropdown"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


type PartialService = {
    id:string
    name:string,
    description:string | null,
    price:number
}

export const columns: ColumnDef<PartialService>[] = [
   
  {
    accessorKey: "name",
    header: "Name",
    cell:({row})=><p className=" capitalize font-semibold">{row.getValue('name')}</p>
  },
  {
    accessorKey: "description",
    header: "Description",
    cell:({row})=><p className="text-muted-foreground capitalize">{row.getValue('description')}</p>
  },
  {
    accessorKey: "price",
    header: "Price",
    cell:({row})=><p className="text-muted-foreground">€ {row.getValue('price')}</p>
   
  },
  {
   
    header: "Actions",
    cell:({row})=><TableActionsDropdown serviceId={row.original.id}/>
   
  },
]
