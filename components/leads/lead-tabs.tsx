"use client";

import { cn } from "@/lib/utils";
import { Invoice, Quotation, Submission } from "@prisma/client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { DataTable } from "../submissions/submission-table";
import { columns } from "../submissions/submission-col";
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
  submissions: Submission[];
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

const LeadTabs = ({ submissions, quotations, invoices }: Props) => {
  const [tab, setTab] = useState<"submissions" | "quotations" | "invoices">(
    "submissions"
  );
  return (
    <div className="pb-20">
      {/* tabs */}
      <div className="flex items-center">
        <Button
          onClick={() => setTab("submissions")}
          className={cn(
            "hover:bg-transparent rounded-none border-b-2 text-muted-foreground text-sm   border-transparent",
            tab === "submissions" && " border-black text-black"
          )}
          variant={"ghost"}
        >
          Submissions
        </Button>

        <Button
          onClick={() => setTab("quotations")}
          className={cn(
            "hover:bg-transparent rounded-none border-b-2  text-muted-foreground text-sm  border-transparent",
            tab === "quotations" && " border-black text-black"
          )}
          variant={"ghost"}
        >
          Quotations
        </Button>
        <Button
          onClick={() => setTab("invoices")}
          className={cn(
            "hover:bg-transparent rounded-none border-b-2  text-muted-foreground text-sm  border-transparent",
            tab === "invoices" && " border-black text-black"
          )}
          variant={"ghost"}
        >
          Invoices
        </Button>
      </div>
      {/* components */}
      <div className="mt-8">
        <TabsComponents
          submissions={submissions}
          quotations={quotations}
          invoices={invoices}
          tab={tab}
        />
      </div>
    </div>
  );
};

export default LeadTabs;

export type SubmissionDataType = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  total: number;
};
const TabsComponents = ({
  tab,
  submissions,
  quotations,
  invoices,
}: {
  tab: "submissions" | "quotations" | "invoices";
  submissions: Submission[];
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

  //loop over submission to prepare data to table

  submissions.forEach((el) => {
    const content = el.content as any;
    const id = el.id;
    const name = content["Naam-field"];
    const email = content["Email Adres-field"];
    const createdAt = el.createdAt;
    const total = Object.entries(content).reduce(
      (prev: number, [key, value]) => {
        if (key.endsWith("-service")) {
          if (
            !Array.isArray(value) &&
            typeof value === "object" &&
            value !== null &&
            "price" in value &&
            "quantity" in value &&
            !isNaN(+(value.price as number))
          ) {
            prev =
              prev + +(value.price as number) * +(value.quantity as number);
          } else if (Array.isArray(value)) {
            value.forEach((el) => {
              if (
                typeof el === "object" &&
                el !== null &&
                "price" in el &&
                "quantity" in el &&
                !isNaN(+(el.price as number))
              ) {
                prev = prev + +(el.price as number) * +(el.quantity as number);
              }
            });
          }
        }
        return prev;
      },
      0
    );

    data.push({ id, name, email, total, createdAt });
  });
  switch (tab) {
    case "submissions":
      return (
        <div className="bg-white">
          <DataTable columns={columns} data={data} />
        </div>
      );

    case "quotations":
      return (
        <div className="border rounded-lg bg-white overflow-hidden">
          {quotations.length ? (
            <Table>
              <TableHeader>
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
            <EmptyComponent title='No Quotations' description='No quotations found for this lead'  />
          )}
        </div>
      );

    case "invoices":
      return (
        <div className="border rounded-lg bg-white overflow-hidden">
          {invoices.length ? (
            <Table>
              <TableHeader>
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
            <EmptyComponent title='No Invoices' description='No invoices found for this lead'  />
          )}
        </div>
      );

    default:
      return null;
  }
};
