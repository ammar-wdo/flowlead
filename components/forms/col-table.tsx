"use client"

import { Service } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/button"
import Link from "next/link"
import PushButton from "../push-button"
import FormTableActionDropdown from "./form-table-action-dropdown"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


type PartialForm = {
    name:string
createdAt:Date
    slug:string
    company:{slug:string}

}

export const formColums: ColumnDef<PartialForm>[] = [
   
  {
    accessorKey: "name",
    header: "Name",
    cell:({row})=><PushButton className="hover:bg-transparent hover:underline" href={`/dashboard/${row.original.company.slug}/forms/${row.original.slug}`}><p className=" capitalize font-semibold">{row.getValue('name')}</p></PushButton>
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
    cell:({row})=><FormTableActionDropdown formSlug={row.original.slug} />
   
  },
]
