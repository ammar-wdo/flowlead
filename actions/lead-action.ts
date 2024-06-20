"use server";

import { CustomError } from "@/custom-error";
import prisma from "@/lib/prisma";
import { contactSchema } from "@/schemas";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

export const createLead = async ({
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

    const {contactPersons,...rest} = validData.data

    const contactLead = await prisma.contact.create({
      data: {
        companyId: company.id,
        ...rest,
      },
    });

    return { success: true, message: "Lead successfully created" };
  } catch (error) {
    console.error(error);
    let message = "Internal server error";
    if (error instanceof CustomError) message = error.message;

    return { success: false, error: message };
  }
};


export const updateLead = async ({
    values,
    companySlug,
    leadId
  }: {
    values: z.infer<typeof contactSchema>;
    companySlug: string;
    leadId:string
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

      const {contactPersons,...rest} = validData.data
  
      const updatedLead = await prisma.contact.update({
        where:{
            id:leadId,
            companyId: company.id,
        },
        data: {
         
          ...rest,
        },
      });
  
      return { success: true, message: "Lead successfully updated" };
    } catch (error) {
      console.error(error);
      let message = "Internal server error";
      if (error instanceof CustomError) message = error.message;
  
      return { success: false, error: message };
    }
  };



  export const deleteLead = async ({
   
    companySlug,
    leadId
  }: {
 
    companySlug: string;
    leadId:string
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
            id:leadId,
            companyId:company.id
        }
      })
  
      return { success: true, message: "Lead successfully deleted" };
    } catch (error) {
      console.error(error);
      let message = "Internal server error";
      if (error instanceof CustomError) message = error.message;
  
      return { success: false, error: message };
    }
  };