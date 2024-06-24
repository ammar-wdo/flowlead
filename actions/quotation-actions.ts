"use server";

import { CustomError } from "@/custom-error";
import prisma from "@/lib/prisma";
import { generateRandomSlug } from "@/lib/utils";
import { quotationSchema } from "@/schemas";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

export const addQuotation = async (
  values: z.infer<typeof quotationSchema>,
  companySlug: string
) => {
  try {
    // auth
    const { userId } = auth();
    if (!userId) throw new CustomError("Unauthorized");
    // inputs validation
    const validData = quotationSchema.safeParse(values);
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
        quotesSettings: {
          select: {
            id: true,
            nextNumber: true,
          },
        },
      },
    });
    if (!company || !company.quotesSettings?.id)
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

    //create quotation

    const newQuotatuon = await prisma.quotation.create({
      data: {
        userId,
        accountId: account.id,
        companyId: company.id,
        ...validData.data,
        quotationSettingsId: company.quotesSettings?.id,
        attatchments: validData.data.attatchments?.map((att) => ({
          name: att?.name ?? null,
          type: att?.type ?? null,
          size: att?.size ?? null,
          url: att?.url ?? null,
        })),
        totalAmount,
        totalTax,
        discountAmount,
      },
    });

    await prisma.qoutesSettings.update({
      where: {
        id: company.quotesSettings.id,
      },
      data: {
        nextNumber: company.quotesSettings.nextNumber + 1,
      },
    });

    return { success: true, message: "Quotation Created Successfully" };
  } catch (error) {
    console.log(error);
    let message = "Internal server error";
    if (error instanceof CustomError) message = error.message;

    return { success: false, error: message };
  }
};

export const editQuotation = async (
  values: z.infer<typeof quotationSchema>,
  companySlug: string,
  quotationId: string
) => {
  try {
    // auth
    const { userId } = auth();
    if (!userId) throw new CustomError("Unauthorized");
    // inputs validation
    const validData = quotationSchema.safeParse(values);
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

    const updatedQuotation = await prisma.quotation.update({
      where: {
        id: quotationId,
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
        contactPersonId
      },
    });

    return { success: true, message: "Quotation Updated Successfully" };
  } catch (error) {
    console.log(error);
    let message = "Internal server error";
    if (error instanceof CustomError) message = error.message;

    return { success: false, error: message };
  }
};

export const deleteQuotation = async (
  companySlug: string,
  quotationId: string
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

    await prisma.quotation.delete({
      where: {
        id: quotationId,
        userId,
        accountId: account.id,
        companyId: company.id,
      },
    });

    return { success: true, message: "Quotation Deleted Successfully" };
  } catch (error) {
    console.log(error);
    let message = "Internal server error";
    if (error instanceof CustomError) message = error.message;

    return { success: false, error: message };
  }
};
