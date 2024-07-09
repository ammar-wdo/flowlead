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
      <h3 className="text-gray-400 text-lg">Latest Leads</h3>
      <div className="mt-3">
        {!!latestLeads.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className=" ">Created At</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email Adrress</TableHead>
                <TableHead className=" ">Phone</TableHead>

                <TableHead className=" "> </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {latestLeads.map((data) => (
                <TableRow key={data.id}>
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
                  <TableCell className=" ">
             
                  </TableCell>
                </TableRow>
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
