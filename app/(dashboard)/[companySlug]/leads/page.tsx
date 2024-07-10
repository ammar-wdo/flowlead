import Heading from "@/components/heading";
import { columns } from "@/components/leads/leads-col";
import { DataTable } from "@/components/leads/leads-table";
import { CustomError } from "@/custom-error";
import prisma from "@/lib/prisma";
import { checkCompanySubscription } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import React from "react";

type Props = {
  params: { companySlug: string };
};

export const revalidate = 0
const page = async ({ params: { companySlug } }: Props) => {
const {userId} = auth()
if(!userId) throw new CustomError("Unauthorized")

  await checkCompanySubscription({userId,companySlug})

  
    const leads = await prisma.contact.findMany({
        where:{
            company:{
                slug:companySlug,
                userId
            },
            contactCategory:"LEAD"
        },
        orderBy:{
          createdAt:"desc"
        }
    })


  return <div>
    <Heading title="Leads"/>

    <div className="mt-8 bg-white rounded-lg border overflow-hidden">
    <DataTable columns={columns} data={leads} />
    </div>
  </div>;
};

export default page;
