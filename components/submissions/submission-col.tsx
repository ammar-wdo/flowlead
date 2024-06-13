"use client"

import { ColumnDef } from "@tanstack/react-table"
import { SubmissionDataType } from "../leads/lead-tabs"
import { format } from "date-fns"
import SubmissionTableActionsDropdown from "./submission-table-action-dropdown"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<SubmissionDataType>[] = [
    {
        accessorKey: "createdAt",
        header: "Date Created",
        cell:({row})=><p className="text-muted-foreground">{format(row.original.createdAt,"dd-MM-yyyy")}</p>
      },
  {
    accessorKey: "name",
    header: "Naam",
    cell:({row})=><p className="capitalize font-semibold">{row.original.name}</p>
  },
  {
    accessorKey: "email",
    header: "Email",
    cell:({row})=><p className="text-muted-foreground">{row.original.email}</p>
  },
  {
    accessorKey: "total",
    header: "Total Amount",
    cell:({row})=><p className="text-muted-foreground">€{row.original.total}</p>
  },

  {
    accessorKey: "actions",
    header: "",
    cell:({row})=><SubmissionTableActionsDropdown submissionId={row.original.id}/>
   
  }
]
