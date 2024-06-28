"use server";

import { CustomError } from "@/custom-error";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const fetchInvoicePDF = async ({
  invoiceId,
  companySlug,
}: {
  invoiceId: string;
  companySlug: string;
}) => {
  try {
    const { userId } = auth();
    if (!userId) throw new CustomError(" Unauthorized");

    if (!invoiceId || !companySlug)
      throw new CustomError("invoiceId or company slug is missing");

    const account = await prisma.account.findUnique({
      where: {
        userId,
      },
    });

    if (!account) throw new CustomError("account not found");

    const invoice = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
        userId,
        company: {
          slug: companySlug,
        },
      },
      include: {
        contact: {
          select: {
            contactType: true,
            contactName: true,
            companyName: true,
            address: true,
            zipcode: true,
            city: true,
            country: true,
            emailAddress: true,
          },
        },
        contactPerson: {
          select: {
            emailAddress: true,
            contactName: true,
          },
        },
        company:{
            select:{
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
            }
        }
      },
    });

    return { success: true, invoice };
  } catch (error) {
    console.error(error);
    let message = "Internal server error";

    if (error instanceof CustomError) {
      message = error.message;
    }

    return { success: false, error: message };
  }
};
