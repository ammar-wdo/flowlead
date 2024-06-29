import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Building2, ReceiptText, UsersRound } from "lucide-react";
import Link from "next/link";
import React from "react";
import { BsExclamationSquareFill } from "react-icons/bs";

type Props = {params:{companySlug:string}};

const page = ({params}: Props) => {
  const settingsLinks = [
    {
      label: "Company",
      icon: <Building2 />,
      description:"Manage your company settings",
      pathname: `/${params.companySlug}/settings/company`,
    },
    {
      label: "Team Members",
      icon: <UsersRound />,
      description:"Manage your team members",
      pathname: `/${params.companySlug}/settings/team-members`,
    },
    {
      label: "Quotations",
      icon: <BsExclamationSquareFill />,
      description:"Manage your Quotations Settings",
      pathname: `/${params.companySlug}/settings/quotations`,
    },
    {
      label: "Invoices",
      icon: <ReceiptText />,
      description:"Manage your Invoices Settings",
      pathname: `/${params.companySlug}/settings/invoices`,
    },
  ];
  return (
    <div>
      <Heading title="Settings" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 mt-20">
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
