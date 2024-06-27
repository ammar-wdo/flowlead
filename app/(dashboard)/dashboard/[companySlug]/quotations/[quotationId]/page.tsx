import Heading from "@/components/heading";
import QuotationsForm from "@/components/quotaions/quotation-from";
import { CustomError } from "@/custom-error";
import prisma from "@/lib/prisma";
import { isValidObjectId } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { $Enums } from "@prisma/client";
import { notFound } from "next/navigation";
import React from "react";

export type RefactoredContacts = (
  | {
    companyId: string;
      contactName: string;
      emailAddress: string;
      phoneNumber: string | null;
      contactType: $Enums.ContactType;
    }
  | {
      contactPersonId: string;
      companyId: string;
      contactName: string;
      emailAddress: string;
      phoneNumber: string | null;
      companyName: string;
      contactPerson: boolean;
    }
)[];

type Props = {
  params: { companySlug: string; quotationId: string };
};

const page = async ({ params: { companySlug, quotationId } }: Props) => {
  const { userId } = auth();

  if (!isValidObjectId(quotationId) && quotationId !== "new") notFound();
  if (!userId) throw new CustomError("Unauthorized");

  let quotation =
    quotationId !== "new"
      ? await prisma.quotation.findUnique({
          where: {
            id: quotationId,
            company: {
              slug: companySlug,
              userId,
            },
            
          },

        })
      : null;

  const company = await prisma.company.findUnique({
    where: {
      slug: companySlug,
      userId,
    },
    select: {
      id: true,
      logo:true,
      address:true,
      cocNumber:true,
      vatNumber:true,
      IBAN:true,
      country:true,
      name:true,
      zipcode:true,
      
      quotesSettings: {
        select: {
          id: true,
          nextNumber: true,
          prefix: true,
          dueDays:true,
          attatchments:true,
          footNote:true,
          
        },
      },
    },
  });

  if (!company || !company.quotesSettings)
    throw new CustomError("company or quotations settings not found");

  const companyInfo = {
    logo:company.logo,
    address:company.address,
    cocNumber:company.cocNumber,
    vatNumber:company.vatNumber,
    IBAN:company.IBAN,
    country:company.country,
    name:company.name,
    zipcode:company.zipcode
    
  }

  const contactsRes = prisma.contact.findMany({
    where: {
      company: { slug: companySlug, userId },
    },
    include: {
      contactPersons: true,
    },
  });

  const optionsRes = prisma.service
    .findMany({
      where: {
        company: { slug: companySlug, userId },
      },
      select: {
        id: true,
        name: true,
        taxPercentage:true,
        options: true,
      },
    })
 

  const [contacts, options] = await Promise.all([contactsRes, optionsRes]);

  // Transform the data
  const refactoredContacts:RefactoredContacts = contacts.flatMap((contact) => {
    // Base company contact object
    const companyContact = {
      companyId: contact.id,
      contactName: contact.contactName,
      emailAddress: contact.emailAddress,
      phoneNumber: contact.phoneNumber,
      contactType: contact.contactType,
    };

    // Map contact persons to include company name and person icon
    const contactPersons = contact.contactPersons.map((person) => ({
      contactPersonId: person.id,
      companyId: contact.id,
      contactName: person.contactName,
      emailAddress: person.emailAddress,
      phoneNumber: person.phoneNumber,
      companyName: contact.contactName,
      contactPerson: true,
    }));

    // Return a flat array containing the company contact and its contact persons
    return [companyContact, ...contactPersons];
  });

  if (quotationId !== "new" && !quotation) return notFound();
  return (
    <div>
      <Heading title={quotation ? "Edit quotation" : "Create quotation"} />

      <div className="mt-12">
        <QuotationsForm
          contacts={contacts}
          refactoredContacts={refactoredContacts}
          options={options}
          quotation={quotation}
          quotationSettings={company?.quotesSettings}
          companyInfo={companyInfo}
        />
      </div>
    </div>
  );
};

export default page;
