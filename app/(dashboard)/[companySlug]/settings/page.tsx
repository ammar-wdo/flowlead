import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { checkCompanySubscription } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { Building2, Code, ReceiptText, UsersRound } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { BsExclamationSquareFill } from "react-icons/bs";

type Props = {params:{companySlug:string}};

const page = async({params:{companySlug}}: Props) => {

const {userId} = auth()
if(!userId) redirect('/sign-up')

  await checkCompanySubscription({userId,companySlug})

  const settingsLinks = [
    {
      label: "Company",
      icon: <Building2 />,
      description:"Manage your company settings",
      pathname: `/${companySlug}/settings/company`,
    },
    {
      label: "Widget",
      icon: <Code />,
      description:"Manage your widget settings",
      pathname: `/${companySlug}/settings/widget-settings`,
    },
    {
      label: "Quotations",
      icon: <BsExclamationSquareFill />,
      description:"Manage your Quotations Settings",
      pathname: `/${companySlug}/settings/quotations`,
    },
    {
      label: "Invoices",
      icon: <ReceiptText />,
      description:"Manage your Invoices Settings",
      pathname: `/${companySlug}/settings/invoices`,
    },
  ];
  return (
    <div>
      <Heading title="Settings" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 mt-8">
        {settingsLinks.map((link) => (
          <article
            key={link.label}
            className="rounded-lg bg-white p-6 flex flex-col gap-4"
          >
            <span className="w-12 h-12 flex items-center justify-center bg-second text-white rounded-full">
              {link.icon}
            </span>
            <p className="font-semibold">{link.label}</p>
            <p className=" text-muted-foreground text-sm">{link.description}</p>
          
              {" "}
              <Button
              asChild
                className="bg-gray-200 hover:bg-gray-200/80 mt-auto"
                variant={"secondary"}
              >
              <Link  href={link.pathname}>View</Link>
              </Button>
        
          </article>
        ))}
      </div>
    </div>
  );
};

export default page;
