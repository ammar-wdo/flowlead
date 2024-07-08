"use server";

import { CustomError } from "@/custom-error";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";

export const billingPortal = async ({
  companySlug,
}: {
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
    });

    if (!company) throw new CustomError("Company was not found");

    // check for stripe customer id
    if (!company.customerStripeId)
      throw new CustomError("You are not subscribed");
    // create session
    const session = await stripe.billingPortal.sessions.create({
      customer: company.customerStripeId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${company.slug}/update`
    });

    return { success: true, url: session.url };
  } catch (error) {
    console.error(error);
    let message = "Internal server error";
    if (error instanceof CustomError) message = error.message;

    return { success: false, error: message };
  }
};
