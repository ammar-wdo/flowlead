import Heading from "@/components/heading";
import SubscriptionButton from "@/components/subscription-button";
import { Button } from "@/components/ui/button";
import { CustomError } from "@/custom-error";
import prisma from "@/lib/prisma";
import { checkFreeTrial } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/dist/server/api-utils";
import React from "react";

type Props = {
  params: { companySlug: string };
};

const page = async ({ params: { companySlug } }: Props) => {


  const {userId} = auth()
  if(!userId) throw new Error("Unauthorized")

  const company = await prisma.company.findUnique({
    where: {
      slug: companySlug,
      userId
    },
  });

  if (!company) throw new CustomError("Company not found");

  const {message} = checkFreeTrial(company.createdAt)

  if(company.plan!=='PREMIUM')
  return (
    <div className="">
    
      <div className="max-w-[800px]">
        {/* current plan  */}
      <Heading title="Manage Billing" />
        <article className="p-4 bg-white mt-4 flex items-center gap-4 font-semibold">Free Trial <span className="px-3 py-1 bg-muted rounded-lg text-muted-foreground text-sm">{message}</span></article>
        {/* Upgrade to plan */}
        <div className="mt-12">
        <Heading title="Upgrade to Premium plan" />
        <article className="p-4 bg-white mt-4">
          <div className="flex items-center justify-between">
          <h3 className="font-semibold">PRO</h3>
          <span>€99/mo</span>
          </div>
          <p>Upgrade now and get all the Premium features.</p>
        <SubscriptionButton className="mt-3 w-full"  priceId="price_1PaCOEEFg0p7Lz0aFPOR9WQe" title="Continue to payment"/>
        

        </article>
        </div>
    
      </div>
    </div>
  );


  return (

    <div>
          <div className="max-w-[800px]">
        {/* current plan  */}
      <Heading title="Manage Billing" />
        <article className="p-4 bg-white mt-4 flex items-center gap-4 font-semibold">Premium Plan </article>
        {/* Upgrade to plan */}
        <div className="mt-12">
        <Heading title="Subscription settings" />
        <article className="p-4 bg-white mt-4">
          <div className="flex items-center justify-between">
          <h3 className="font-semibold">PRO</h3>
          <span>€99/mo</span>
          </div>
          <p>Upgrade now and get all the Premium features.</p>
        <SubscriptionButton className="mt-3 w-full"  priceId="price_1PaCOEEFg0p7Lz0aFPOR9WQe" title="Continue to payment"/>
        

        </article>
        </div>
    
      </div>
    </div>
  )
};

export default page;
