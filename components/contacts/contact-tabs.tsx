"use client";

import { cn } from "@/lib/utils";
import { Invoice, Quotation, Submission } from "@prisma/client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import EmptyComponent from "../empty";

type Props = {
  quotations: (Quotation & {
    contact: {
      emailAddress: string;
      companyName?: string | null;
      contactName?: string;
    };
  })[];
  invoices: (Invoice & {
    contact: {
      emailAddress: string;
      companyName?: string | null;
      contactName?: string;
    };
  })[];
};

const ContactTabs = ({ invoices, quotations }: Props) => {
  const [tab, setTab] = useState<"quotations" | "invoices">("quotations");
  return (
    <div className="pb-20">
      {/* tabs */}
      <div className="flex items-center">
        <Button
          onClick={() => setTab("quotations")}
          className={cn(
            "hover:bg-transparent rounded-none border border-b-transparent font-normal  rounded-tl-lg border-r-0 text-muted-foreground text-sm  ",
            tab === "quotations" && "    text-black bg-white hover:bg-white"
          )}
          variant={"ghost"}
        >
          Quotations
        </Button>
        <Button
          onClick={() => setTab("invoices")}
          className={cn(
            "hover:bg-transparent rounded-none border rounded-tr-lg font-normal border-b-transparent text-muted-foreground text-sm  ",
            tab === "invoices" && "  text-black bg-white hover:bg-white"
          )}
          variant={"ghost"}
        >
          Invoices
        </Button>
      </div>
      {/* components */}
      <div className="">
        <TabsComponents quotations={quotations} invoices={invoices} tab={tab} />
      </div>
    </div>
  );
};

export default ContactTabs;

export type SubmissionDataType = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  total: number;
};
const TabsComponents = ({
  tab,
  quotations,
  invoices,
}: {
  tab: "quotations" | "invoices";
  quotations: (Quotation & {
    contact: {
      emailAddress: string;
      companyName?: string | null;
      contactName?: string;
    };
  })[];
  invoices: (Invoice & {
    contact: {
      emailAddress: string;
      companyName?: string | null;
      contactName?: string;
    };
  })[];
}) => {
  let data: SubmissionDataType[] = [];

  switch (tab) {
    case "quotations":
      return (
        <div className="border rounded-lg rounded-tl-none bg-white overflow-hidden">
          {quotations.length ? (
            <Table>
              <TableHeader  className="bg-muted">
                <TableRow>
                  <TableHead className=" ">Quotation Number</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className=" ">Email Address</TableHead>
                  <TableHead className=" ">Total Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotations.map((quotation) => (
                  <TableRow key={quotation.id}>
                    <TableCell className=" ">
                      {quotation.quotationNumber}
                    </TableCell>
                    <TableCell>
                      {format(quotation.createdAt, "dd-MM-yyyy HH:mm")}
                    </TableCell>
                    <TableCell>
                      {quotation.contact.companyName ||
                        quotation.contact.contactName}
                    </TableCell>
                    <TableCell>{quotation.contact.emailAddress}</TableCell>
                    <TableCell className=" ">
                      € {quotation.totalAmount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyComponent title='No Quotations' description='No quotations found for this contact'  />
          )}
        </div>
      );

    case "invoices":
      return (
        <div className="border rounded-lg rounded-tl-none bg-white overflow-hidden">
          {invoices.length ? (
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className=" ">Quotation Number</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className=" ">Email Address</TableHead>
                  <TableHead className=" ">Total Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className=" ">{invoice.invoiceNumber}</TableCell>
                    <TableCell>
                      {format(invoice.createdAt, "dd-MM-yyyy HH:mm")}
                    </TableCell>
                    <TableCell>
                      {invoice.contact.companyName ||
                        invoice.contact.contactName}
                    </TableCell>
                    <TableCell>{invoice.contact.emailAddress}</TableCell>
                    <TableCell className=" ">€ {invoice.totalAmount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyComponent title='No Invoices' description='No invoices found for this contact'  />
          )}
        </div>
      );

    default:
      return null;
  }
};
