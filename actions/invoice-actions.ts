"use server";

import { CustomError } from "@/custom-error";
import prisma from "@/lib/prisma";
import { generateRandomSlug, replacePlaceholders } from "@/lib/utils";
import { invoiceSchema } from "@/schemas";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

export const addInvoice = async (
  values: z.infer<typeof invoiceSchema>,
  companySlug: string
) => {
  try {
    // auth
    const { userId } = auth();
    if (!userId) throw new CustomError("Unauthorized");
    // inputs validation
    const validData = invoiceSchema.safeParse(values);
    if (!validData.success) throw new CustomError("Invalid Inputs");
    // account fetch
    const account = await prisma.account.findUnique({
      where: {
        userId,
      },
    });
    if (!account) throw new CustomError("Account needed");
    //fetch company id to add in the form record
    const company = await prisma.company.findUnique({
      where: {
        userId,
        slug: companySlug,
      },
      select: {
        id: true,
        invoiceSettings: {
          select: {
            id: true,
            nextNumber: true,
          },
        },
      },
    });
    if (!company || !company.invoiceSettings?.id)
      throw new CustomError(
        "Company Id or quotation settings  not found,check provided slug"
      );

    //calculate values
    const subTotalAmount = validData.data.lineItems.reduce(
      (acc, val) => acc + val.price * val.quantity,
      0
    );
    const discountAmount =
      validData.data.discount?.type === "PERCENTAGE"
        ? ((validData.data.discount?.percentageValue || 0) * subTotalAmount) /
          100
        : validData.data.discount?.fixedValue || 0;
    const subTotalWithDiscount = subTotalAmount - discountAmount;
    const totalTax = validData.data.lineItems.reduce(
      (acc, val) => acc + (val.taxPercentage * val.price * val.quantity) / 100,
      0
    );
    const totalAmount = totalTax + subTotalWithDiscount;



    const contactPersonId = validData.data.contactPersonId?.trim() === "" ? null : validData.data.contactPersonId;

    const newInvoice = await prisma.invoice.create({
      data: {
        userId,
        accountId: account.id,
        
        companyId: company.id,
        ...validData.data,
       invoiceSettingsId: company.invoiceSettings?.id,
        attatchments: validData.data.attatchments?.map((att) => ({
          name: att?.name ?? null,
          type: att?.type ?? null,
          size: att?.size ?? null,
          url: att?.url ?? null,
        })),
        totalAmount,
        totalTax,
        discountAmount,
        contactPersonId,
        invoiceString:replacePlaceholders(validData.data.invoiceString)
      },
      include:{
        company:true,
        contact:{
          select:{
            contactName:true,
            emailAddress:true,
            address:true,
            phoneNumber:true,
            mobileNumber:true,
            companyName:true
          }
        },
        contactPerson:{
          select:{
            contactName:true,
            emailAddress:true,
            phoneNumber:true,
             

          }
        },
        invoiceSettings:{
          select:{
            subject:true,
            body:true
          }
        }
     
      }
    });

    await prisma.invoiceSettings.update({
      where: {
        id: company.invoiceSettings.id,
      },
      data: {
        nextNumber: company.invoiceSettings.nextNumber + 1,
      },
    });

    return { success: true, message: "Invoice Created Successfully",data:newInvoice };
  } catch (error) {
    console.log(error);
    let message = "Internal server error";
    if (error instanceof CustomError) message = error.message;

    return { success: false, error: message };
  }
};

export const editInvoice = async (
  values: z.infer<typeof invoiceSchema>,
  companySlug: string,
  invoiceId: string
) => {
  try {
    // auth
    const { userId } = auth();
    if (!userId) throw new CustomError("Unauthorized");
    // inputs validation
    const validData = invoiceSchema.safeParse(values);
    if (!validData.success) throw new CustomError("Invalid Inputs");
    // account fetch
    const account = await prisma.account.findUnique({
      where: {
        userId,
      },
    });
    if (!account) throw new CustomError("Account needed");
    //fetch company id to add in the form record
    const companyId = await prisma.company.findUnique({
      where: {
        userId,
        slug: companySlug,
      },
      select: {
        id: true,
      },
    });
    if (!companyId)
      throw new CustomError("Company Id not found,check provided slug");

    //calculate values
    const subTotalAmount = validData.data.lineItems.reduce(
      (acc, val) => acc + val.price * val.quantity,
      0
    );
    const discountAmount =
      validData.data.discount?.type === "PERCENTAGE"
        ? ((validData.data.discount?.percentageValue || 0) * subTotalAmount) /
          100
        : validData.data.discount?.fixedValue || 0;
    const subTotalWithDiscount = subTotalAmount - discountAmount;
    const totalTax = validData.data.lineItems.reduce(
      (acc, val) => acc + (val.taxPercentage * val.price * val.quantity) / 100,
      0
    );
    const totalAmount = totalTax + subTotalWithDiscount;

    //handle contact person id 
    const contactPersonId = validData.data.contactPersonId?.trim() === "" ? null : validData.data.contactPersonId;
    //update form

    const updatedInvoice = await prisma.invoice.update({
      where: {
        id: invoiceId,
        userId,
        accountId: account.id,
        companyId: companyId.id,
      },
      data: {
        ...validData.data,
        attatchments: validData.data.attatchments?.map((att) => ({
          name: att?.name ?? null,
          type: att?.type ?? null,
          size: att?.size ?? null,
          url: att?.url ?? null,
        })),
        totalAmount,
        totalTax,
        discountAmount,
        contactPersonId,
        invoiceString:replacePlaceholders(validData.data.invoiceString)
      },
      include:{
        company:true,
        contact:{
          select:{
            contactName:true,
            emailAddress:true,
            address:true,
            phoneNumber:true,
            mobileNumber:true,
            companyName:true
          }
        },
        contactPerson:{
          select:{
            contactName:true,
            emailAddress:true,
            phoneNumber:true,
             

          }
        },  invoiceSettings:{
          select:{
            subject:true,
            body:true
          }
        }
     
      }
    });

    return { success: true, message: "Invoice Updated Successfully",data:updatedInvoice };
  } catch (error) {
    console.log(error);
    let message = "Internal server error";
    if (error instanceof CustomError) message = error.message;

    return { success: false, error: message };
  }
};

export const deleteInvoice = async (
  companySlug: string,
  invoiceId: string
) => {
  try {
    // auth
    const { userId } = auth();
    if (!userId) throw new CustomError("Unauthorized");

    // account fetch
    const account = await prisma.account.findUnique({
      where: { userId },
    });
    if (!account) throw new CustomError("Account needed");

    // fetch company id to add in the form record
    const company = await prisma.company.findUnique({
      where: { userId, slug: companySlug },
      select: { id: true },
    });
    if (!company)
      throw new CustomError("Company Id not found, check provided slug");

    // fetch form to be deleted

    // delete

    await prisma.invoice.delete({
      where: {
        id: invoiceId,
        userId,
        accountId: account.id,
        companyId: company.id,
      },
    });

    return { success: true, message: "Invoice Deleted Successfully" };
  } catch (error) {
    console.log(error);
    let message = "Internal server error";
    if (error instanceof CustomError) message = error.message;

    return { success: false, error: message };
  }
};
