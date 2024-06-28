"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "../ui/button";
import { Delete, Download, Edit, Loader, MoreVertical } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useModal } from "@/hooks/modal-hook";

import { deleteQuotation } from "@/actions/quotation-actions";

import { useDownloadPDF } from "@/hooks/download-pdf-hook";
import { deleteInvoice } from "@/actions/invoice-actions";

type Props = {
  id: string;
};

const InvoiceTableActionDropdown = ({ id }: Props) => {
  const params = useParams<{ companySlug: string }>();

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/${params.companySlug}/invoices/${id}`;

  const { setOpen } = useModal();

  const handleDeleteModalOpen = () => {
    setOpen({
      type: "delete",
      deleteFunction: () => deleteInvoice(params.companySlug, id),
    });
  };

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
        <DropdownMenuItem asChild className="p-2   cursor-pointer">
          <Link className="flex items-center justify-start gap-3" href={url}>
            <Edit /> Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="p-2   cursor-pointer">
          <FetchButon id={id} />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDeleteModalOpen}
          className="p-2 flex items-center justify-start gap-3  cursor-pointer text-rose-500 hover:!text-rose-500"
        >
          <Delete /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default InvoiceTableActionDropdown;

const FetchButon = ({ id }: { id: string }) => {
  const {
    quotation,

    fetchData,
   
    pending,
  } = useDownloadPDF({ id, type: "invoice" });

  return (
    <div>
      <Button
        variant={"ghost"}
        className="w-full gap-3 justify-start px-2"
        onClick={fetchData}
        disabled={pending}
      >
        <Download /> PDF{" "}
        {!!pending && <Loader size={12} className="ml-2 animate-spin" />}
      </Button>
    </div>
  );
};
