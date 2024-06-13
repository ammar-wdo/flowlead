import { DataTable } from "@/components/contacts/contact-table";
import { columns } from "@/components/contacts/contacts-col";
import Heading from "@/components/heading";

import { CustomError } from "@/custom-error";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import React from "react";

type Props = {
  params: { companySlug: string };
};

export const revalidate = 0
const page = async ({ params: { companySlug } }: Props) => {
const {userId} = auth()
if(!userId) throw new CustomError("Unauthorized")

    const contacts = await prisma.contact.findMany({
        where:{
            company:{
                slug:companySlug,
                userId
            },
            contactCategory:'CONTACT'
        }
    })


  return <div>
    <Heading title="Contacts"/>

    <div className="mt-8 bg-white ">
    <DataTable columns={columns} data={contacts} />
    </div>
  </div>;
};

export default page;
