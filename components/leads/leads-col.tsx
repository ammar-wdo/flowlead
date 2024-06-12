"use client"

import { Contact } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import LeadTableActionDropdown from "./lead-action-dropdown"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: "createdAt",
    header: "Date Created",
    cell:({row})=><p className="text-muted-foreground">{format(row.original.createdAt,"dd-MM-yyyy")}</p>
  },
  {
    accessorKey: "name",
    header: "Name",
    cell:({row})=><p className="font-semibold capitalize">{row.original.contactName}</p>
  },
  {
    accessorKey: "email",
    header: "Email",
    cell:({row})=><p className="">{row.original.emailAddress}</p>
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell:({row})=><p className="">{row.original.phoneNumber || '-'}</p>
  },
  {
    accessorKey: "actions",
    header: "",
    cell:({row})=><LeadTableActionDropdown id={row.original.id} />
   
  },
]
