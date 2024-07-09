import prisma from "@/lib/prisma";
import React from "react";
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
import Link from "next/link";
import ClientRow from "./client-row";
import LeadTableActionDropdown from "../leads/lead-action-dropdown";

type Props = { companySlug: string };

const LatestLeads = async ({ companySlug }: Props) => {
  const latestLeads = await prisma.contact.findMany({
    where: {
      company: {
        slug: companySlug,
       
      },
      contactCategory:"LEAD"
    },
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      createdAt: true,
      id: true,
   
          companyName: true,
          contactName: true,
          emailAddress: true,
          phoneNumber: true,
    
    },
  });

  return (
    <div>
      <h3 className=" px-3 text-prime font-semibold">Latest Leads</h3>
      <div className="mt-3 border rounded-lg overflow-hidden">
        {!!latestLeads.length ? (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className=" ">Created At</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead className=" ">Phone</TableHead>

               
              </TableRow>
            </TableHeader>
            <TableBody>
              {latestLeads.map((data) => (
                 <ClientRow href={`/${companySlug}/leads/${data.id}`} key={data.id}  >
                  <TableCell className=" ">
                    {format(data.createdAt, "dd-MM-yyyy")}
                  </TableCell>

                  <TableCell>
                    {data.companyName || data.contactName}
                  </TableCell>
                  <TableCell className=" ">
                    {data.emailAddress}
                  </TableCell>

                  <TableCell className=" ">
                    {data.phoneNumber || '-'}
                  </TableCell>
            
                </ClientRow> 
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-lg font-semibold text-gray-300 text-center">
            No Leads
          </p>
        )}
      </div>
    </div>
  );
};

export default LatestLeads;
