"use client";

import { $Enums, Contact, Quotation } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import QuotationTableActionDropdown from "./quotations-action-dropdown";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

type FullQuotation = {
  id: string;
  quotationNumber: number;
  createdAt: Date;
  contact: { contactName: string; emailAddress: string };
  status: $Enums.QuotationStatus;
  totalAmount: number;
};

export const columns: ColumnDef<FullQuotation>[] = [
  {
    accessorKey: "quotationNumber",
    header: "Quotation Number",
    cell: ({ row }) => (
      <p className="text-muted-foreground">{row.original.quotationNumber}</p>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
    cell: ({ row }) => (
      <p className="text-muted-foreground">
        {format(row.original.createdAt, "dd-MM-yyyy")}
      </p>
    ),
  },
  {
    accessorKey: "contact.contactName",
    header: "Name",
    cell: ({ row }) => (
      <p className="font-semibold capitalize">
        {row.original.contact.contactName}
      </p>
    ),
  },
  {
    accessorKey: "contact.emailAddress",
    header: "Email address",
    cell: ({ row }) => <p className="">{row.original.contact.emailAddress}</p>,
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
    cell: ({ row }) => <p className="">€ {row.original.totalAmount}</p>,
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => <QuotationTableActionDropdown id={row.original.id} />,
  },
];
