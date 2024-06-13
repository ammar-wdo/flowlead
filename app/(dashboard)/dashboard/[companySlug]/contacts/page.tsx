import { DataTable } from "@/components/contacts/contact-table";
import { columns } from "@/components/contacts/contacts-col";
import Heading from "@/components/heading";

import { CustomError } from "@/custom-error";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
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
    <div className="flex items-center justify-between">
    <Heading title="Contacts"/>
    <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/${companySlug}/contacts/new`} className="py-2 px-4 bg-second hover:bg-second/80 text-white rounded-lg">Create Contact</Link>
    </div>
  

    <div className="mt-8 bg-white ">
    <DataTable columns={columns} data={contacts} />
    </div>
  </div>;
};

export default page;
