import Heading from "@/components/heading";
import { DataTable } from "@/components/invoices/invoice-table";
import { columns } from "@/components/invoices/invoices-col";


import { CustomError } from "@/custom-error";
import prisma from "@/lib/prisma";
import { checkCompanySubscription } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = { params: { companySlug: string } };

const page = async ({ params: { companySlug } }: Props) => {
  const { userId } = auth();
  if (!userId) throw new CustomError("Unauthorized");

  await checkCompanySubscription({userId,companySlug})
  const invoices = await prisma.invoice.findMany({
    where: {
      company: {
        slug: companySlug,
        userId,
      },
    
    },
    orderBy: {
      createdAt: "desc",
    },select:{
      id:true,
      totalAmount:true,
      status:true,
      createdAt:true,
      invoiceNumber:true,
      contact:{
        select:{
          contactName:true,
          emailAddress:true
        }
      }
      
    }
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading title="Invoices" />
        <Link
          href={`${process.env.NEXT_PUBLIC_BASE_URL}/${companySlug}/invoices/new`}
          className="py-2 px-4 bg-second hover:bg-second/80 text-white rounded-lg text-sm flex items-center gap-1"
        >
         <Plus size={16}/> Add Invoice
        </Link>
      </div>


      <div className="mt-8 bg-white border overflow-hidden rounded-lg">
    <DataTable columns={columns} data={invoices} />
    </div>
    </div>
  );
};

export default page;
