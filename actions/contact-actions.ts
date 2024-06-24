"use server";

import { CustomError } from "@/custom-error";
import prisma from "@/lib/prisma";
import { contactSchema } from "@/schemas";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
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

    const {contactPersons,...rest} = validData.data

   

    const contact = await prisma.contact.create({
      data: {
        companyId: company.id,
        ...rest,
        contactCategory:'CONTACT',
        contactPersons:{
        createMany: contactPersons && contactPersons.length > 0 ? {
            data: contactPersons.map(person => ({
              contactName: person.contactName,
              emailAddress: person.emailAddress,
              phoneNumber: person.phoneNumber
            }))
          } : undefined
        }
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

      const {contactPersons,...rest} = validData.data


 // Fetch existing contact persons
 const existingContactPersons = await prisma.contactPerson.findMany({
  where: { contactId }
});
// get ids
const existingContactPersonIds = existingContactPersons.map(cp => cp.id)

 // Identify new, updated, and deleted contact persons
 const newContactPersons = validData.data.contactPersons?.filter(cp =>cp.id && !existingContactPersonIds.includes(cp.id)) ?? [];
 const updatedContactPersons = validData.data.contactPersons?.filter(cp =>cp.id && existingContactPersonIds.includes(cp.id)) ?? [];
 const deletedContactPersons = existingContactPersons.filter(cp => !validData.data.contactPersons?.some(vcp => vcp.id === cp.id));

//transaction array
 const transactionOperations: any[] = [];


 //if new contact perosns then add to transation arry
 if (newContactPersons.length > 0) {
   transactionOperations.push(prisma.contactPerson.createMany({
     data: newContactPersons.map(cp => ({
       contactName: cp.contactName,
       emailAddress: cp.emailAddress,
       phoneNumber: cp.phoneNumber,
       contactId
     }))
   }));
 }

 //if deleted contact person ,then add to transaction array
 if (deletedContactPersons.length > 0) {
   transactionOperations.push(prisma.contactPerson.deleteMany({
     where: { id: { in: deletedContactPersons.map(cp => cp.id) } }
   }));
 }

 //add updated contact persons to array
 transactionOperations.push(
   ...updatedContactPersons.map(cp => prisma.contactPerson.update({
     where: { id: cp.id },
     data: {
       contactName: cp.contactName,
       emailAddress: cp.emailAddress,
       phoneNumber: cp.phoneNumber,
       
     }
   }))
 );

 //trigger transaction
 await prisma.$transaction(transactionOperations);


 //update rest of contact
      const updatedContact = await prisma.contact.update({
        where:{
            id:contactId,
            companyId: company.id,
        },
        data: {
         
          ...rest,
        },
      });
  
      return { success: true, message: "Contact successfully updated" };
    } catch (error) {
      console.error(error);
      let message = "Internal server error";

        // Check for Prisma error code related to foreign key constraints
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        message = 'Cannot delete contact person because it is related to other records.';
      }
    }
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

      const contactPerson = await prisma.contactPerson.findFirst({
        where:{
          contactId
        }
      })

      if(contactPerson) return {success:false,error:"Can not delete this contact, it is related to one or more contact persons"}
  
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