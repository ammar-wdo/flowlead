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
  console.log('Webhook received');
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
    console.error("Webhook signature verification failed.", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400, headers: corsHeaders });
  }

  const subscription = event.data.object as Stripe.Subscription;

  try {
    switch (event.type) {
      case "customer.subscription.created":
        await updateCompanyStatus(subscription, "PREMIUM");
        console.log("Subscription Created", subscription.customer);
        break;
      case "customer.subscription.deleted":
        await updateCompanyStatus(subscription, "FREE");
        console.log("Subscription Deleted", subscription.customer);
        break;
      case "customer.subscription.updated":
        if (subscription.status === "canceled") {
          await updateCompanyStatus(subscription, "FREE");
          console.log("Subscription Canceled", subscription.customer);
        } else {
          await updateCompanyStatus(subscription, "PREMIUM");
          console.log("Subscription Updated", subscription.customer);
        }
        break;
      case "invoice.payment_failed":
        await updateCompanyStatus(subscription, "FREE");
        console.log("Payment Failed", subscription.customer);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error("Error updating company status:", error);
    return new NextResponse(`Internal server error`, { status: 500, headers: corsHeaders });
  }

  return new NextResponse(null, { status: 200, headers: corsHeaders });
};

async function updateCompanyStatus(
  subscription: Stripe.Subscription,
  newPlan: 'FREE' | 'PREMIUM'
) {
  const customerId = subscription.customer as string;

  const company = await prisma.company.findUnique({
    where: { customerStripeId: customerId },
  });

  if (!company) {
    console.error("Company not found for customer ID:", customerId);
    throw new Error("Company not found");
  }

  console.log(`Updating company ${company.id} to ${newPlan} plan`);

  await prisma.company.update({
    where: { id: company.id },
    data: {
      plan: newPlan,
    },
  });

  console.log(`Company ${company.id} updated to ${newPlan} plan`);
}
