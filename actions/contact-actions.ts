"use server";

import { CustomError } from "@/custom-error";
import prisma from "@/lib/prisma";
import { contactSchema } from "@/schemas";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

export const createContact = async ({
  values,
  companySlug,
}: {
  values: z.infer<typeof contactSchema>;
  companySlug: string;
}) => {
  try {
    const { userId } = auth();
    if (!userId) throw new CustomError("Unauthorized");

    const company = await prisma.company.findUnique({
      where: {
        userId,
        slug: companySlug,
      },
      select: {
        id: true,
      },
    });

    if (!company) throw new CustomError("company not found");

    const validData = contactSchema.safeParse(values);
    if (!validData.success) throw new CustomError("Invalid Inputs");

    const contact = await prisma.contact.create({
      data: {
        companyId: company.id,
        ...validData.data,
        contactCategory:'CONTACT'
      },
    });

    return { success: true, message: "Contact successfully created" };
  } catch (error) {
    console.error(error);
    let message = "Internal server error";
    if (error instanceof CustomError) message = error.message;

    return { success: false, error: message };
  }
};


export const updateContact = async ({
    values,
    companySlug,
    contactId
  }: {
    values: z.infer<typeof contactSchema>;
    companySlug: string;
    contactId:string
  }) => {
    try {
      const { userId } = auth();
      if (!userId) throw new CustomError("Unauthorized");
  
      const company = await prisma.company.findUnique({
        where: {
          userId,
          slug: companySlug,
        },
        select: {
          id: true,
        },
      });
  
      if (!company) throw new CustomError("company not found");
  
      const validData = contactSchema.safeParse(values);
      if (!validData.success) throw new CustomError("Invalid Inputs");
  
      const updatedContact = await prisma.contact.update({
        where:{
            id:contactId,
            companyId: company.id,
        },
        data: {
         
          ...validData.data,
        },
      });
  
      return { success: true, message: "Contact successfully updated" };
    } catch (error) {
      console.error(error);
      let message = "Internal server error";
      if (error instanceof CustomError) message = error.message;
  
      return { success: false, error: message };
    }
  };



  export const deleteContact = async ({
   
    companySlug,
    contactId
  }: {
 
    companySlug: string;
    contactId:string
  }) => {
    try {
      const { userId } = auth();
      if (!userId) throw new CustomError("Unauthorized");
  
      const company = await prisma.company.findUnique({
        where: {
          userId,
          slug: companySlug,
        },
        select: {
          id: true,
        },
      });
  
      if (!company) throw new CustomError("company not found");
  
      await prisma.contact.delete({
        where:{
            id:contactId,
            companyId:company.id
        }
      })
  
      return { success: true, message: "Contact successfully deleted" };
    } catch (error) {
      console.error(error);
      let message = "Internal server error";
      if (error instanceof CustomError) message = error.message;
  
      return { success: false, error: message };
    }
  };