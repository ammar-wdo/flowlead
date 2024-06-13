import ContactForm from "@/components/contacts/contact-form";
import ContactTabsWrapper from "@/components/contacts/contact-taqbs-wrapper";
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
  params: { contactId: string; companySlug: string };
};

const page = async ({ params: { contactId, companySlug } }: Props) => {
  const { userId } = auth();

  if (!isValidObjectId(contactId) && contactId !== "new") notFound();
  if (!userId) throw new CustomError("Unauthorized");

  let contact =
    contactId !== "new"
      ? await prisma.contact.findUnique({
          where: {
            id: contactId,
            company: {
              slug: companySlug,
              userId,
            },
            contactCategory: "CONTACT",
          },
        })
      : null;

  if (contactId !== "new" && !contact) return notFound();

  return (
    <div>
      <Heading title={contact ? "Edit Contact" : "Create Contact"} />

      <div className="mt-12 bg-white p-8 max-w-[1000px]">
        <ContactForm contact={contact} />
      </div>

      {/* lead tabs */}
      <div className="mt-12">
      <Suspense fallback={"Loading"}>
        <ContactTabsWrapper
          companySlug={companySlug}
          contactId={contactId}
          userId={userId}
        />
      </Suspense>
      </div>
    
    </div>
  );
};

export default page;
