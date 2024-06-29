import Heading from "@/components/heading";
import QuotationsForm from "@/components/quotaions/quotation-from";
import { CustomError } from "@/custom-error";
import prisma from "@/lib/prisma";
import { isValidObjectId } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { $Enums } from "@prisma/client";
import { notFound } from "next/navigation";
import React from "react";
import { RefactoredContacts } from "../../quotations/[quotationId]/page";
import InvoicesForm from "@/components/invoices/invoice-from";



type Props = {
  params: { companySlug: string; invoiceId: string };
};

const page = async ({ params: { companySlug, invoiceId } }: Props) => {
  const { userId } = auth();

  if (!isValidObjectId(invoiceId) && invoiceId !== "new") notFound();
  if (!userId) throw new CustomError("Unauthorized");

  let invoice =
    invoiceId !== "new"
      ? await prisma.invoice.findUnique({
          where: {
            id: invoiceId,
            company: {
              slug: companySlug,
              userId,
            },
            
          },include:{
            contact:{
              select:{
                contactType:true,
                contactName:true,
                companyName:true,
                address:true,
                zipcode:true,
                city:true,
                country:true,
                emailAddress:true

              }
            },
            contactPerson:{
              select:{
                emailAddress:true,
                contactName:true
              }
            }
          }

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
      city:true,
      companyEmail:true,
      
      invoiceSettings: {
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

  if (!company || !company.invoiceSettings)
    throw new CustomError("company or quotations settings not found");

  const companyInfo = {
    logo:company.logo,
    address:company.address,
    cocNumber:company.cocNumber,
    vatNumber:company.vatNumber,
    IBAN:company.IBAN,
    country:company.country,
    name:company.name,
    zipcode:company.zipcode,
    city:company.city,
    companyEmail:company.companyEmail
    
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
      companyName:contact.companyName,
      contactCategory:contact.contactCategory
      

    };

    // Map contact persons to include company name and person icon
    const contactPersons = contact.contactPersons.map((person) => ({
      contactPersonId: person.id,
      companyId: contact.id,
      contactName: person.contactName,
      emailAddress: person.emailAddress,
      phoneNumber: person.phoneNumber,
      companyName: contact.companyName!,
      contactPerson: true,
      contactCategory:contact.contactCategory
    }));

    // Return a flat array containing the company contact and its contact persons
    return [companyContact, ...contactPersons];
  });

  if (invoiceId !== "new" && !invoice) return notFound();
  return (
    <div>
      <Heading title={invoice ? "Edit quotation" : "Create quotation"} />

      <div className="mt-12">
        <InvoicesForm
          contacts={contacts}
          refactoredContacts={refactoredContacts}
          options={options}
          invoice={invoice}
          invoiceSettings={company?.invoiceSettings}
          companyInfo={companyInfo}
        />
      </div>
    </div>
  );
};

export default page;
