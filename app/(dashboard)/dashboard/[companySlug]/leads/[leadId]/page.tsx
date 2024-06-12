import Heading from "@/components/heading";
import LeadForm from "@/components/leads/lead-form";
import LeadTabsWrapper from "@/components/leads/lead-tabs-wrapper";

import { CustomError } from "@/custom-error";
import prisma from "@/lib/prisma";
import { isValidObjectId } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

type Props = {
  params: { leadId: string; companySlug: string };
};

const page = async ({ params: { leadId, companySlug } }: Props) => {
  const { userId } = auth();

  if (!isValidObjectId(leadId) && leadId !== "new") notFound();
  if (!userId) throw new CustomError("Unauthorized");

  let lead =
    leadId !== "new"
      ? await prisma.contact.findUnique({
          where: {
            id: leadId,
            company: {
              slug: companySlug,
              userId,
            },
            contactCategory: "LEAD",
          },
        })
      : null;

  if (leadId !== "new" && !lead) return notFound();

  return (
    <div>
      <Heading title="Edit Lead" />

      <div className="mt-12 bg-white p-8 max-w-[1000px]">
        <LeadForm lead={lead} />
      </div>

      {/* lead tabs */}
      <div className="mt-12">
      <Suspense fallback={"Loading"}>
        <LeadTabsWrapper
          companySlug={companySlug}
          leadId={leadId}
          userId={userId}
        />
      </Suspense>
      </div>
    
    </div>
  );
};

export default page;
