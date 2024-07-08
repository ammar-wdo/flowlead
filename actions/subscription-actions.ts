"use server";

import { CustomError } from "@/custom-error";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";

export const subscribe = async ({
  companySlug,
  priceId,
}: {
  companySlug: string;
  priceId: string;
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
    let customerId = company.customerStripeId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: company.companyEmail,
      });

      customerId = customer.id;
      await prisma.company.update({
        where: {
          slug: companySlug,
          userId,
        },
        data: {
          customerStripeId: customerId,
        },
      });
    }
    // create session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
 
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL!}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL!}/cancel`,
    });

    return { success: true, url: session.url };
  } catch (error) {
    console.error(error)
    let message = "Internal server error";
    if (error instanceof CustomError) message = error.message;

    return { success: false, error: message };
  }
};
