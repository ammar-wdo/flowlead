"use client"

import { Service } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/button"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


type PartialForm = {
    name:string
createdAt:Date
    slug:string

}

export const formColums: ColumnDef<PartialForm>[] = [
   
  {
    accessorKey: "name",
    header: "Name",
    cell:({row})=><p className=" capitalize font-semibold">{row.getValue('name')}</p>
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell:({row})=><p className="text-muted-foreground capitalize">{row.getValue('slug')}</p>
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
    cell:({row})=><p className="text-muted-foreground">{row.original.createdAt.toLocaleDateString()}</p>
   
  },
  {
    accessorKey: "actions",
    header: "",
    cell:({row})=><div></div>
   
  },
]
