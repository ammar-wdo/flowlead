import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export const POST = async (req: Request) => {
  const body = await req.text();

  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.log(error);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const subscription = event.data.object as Stripe.Subscription;
  switch (event.type) {
    case "customer.subscription.created":
      // Then define and call a function to handle the event customer.subscription.created
      await updateCompanyStatus(subscription);

      console.log("Subscription Created", subscription.customer);
      break;
    case "customer.subscription.deleted":
      // Then define and call a function to handle the event customer.subscription.deleted
      await updateCompanyStatus(subscription, true);

      console.log("Subscription Deleted", subscription.customer);
      break;
    case "customer.subscription.updated":
      // Then define and call a function to handle the event customer.subscription.updated

      await updateCompanyStatus(subscription);

      console.log("Subscription Updated", subscription.customer);
      break;
    case "invoice.payment_failed":
      // Then define and call a function to handle the event invoice.payment_failed

      await updateCompanyStatus(subscription, true);

      console.log("Payment Failed", subscription.customer);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }


  return new NextResponse(null, { status: 200 });
};

async function updateCompanyStatus(
  subscription: Stripe.Subscription,
  deleted?: boolean
) {
  const customerId = subscription.customer as string;

  // Find the company associated with the Stripe customer ID
  const company = await prisma.company.findUnique({
    where: { customerStripeId: customerId },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  // Update the company status
  await prisma.company.update({
    where: { id: company.id },
    data: {
      plan: deleted ? "FREE" : "PREMIUM",
    },
  });
}
