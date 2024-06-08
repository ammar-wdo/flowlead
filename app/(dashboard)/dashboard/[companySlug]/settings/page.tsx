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
      pathname: `/dashboard/${params.companySlug}/settings/company`,
    },
    {
      label: "Team Members",
      icon: <UsersRound />,
      pathname: `/dashboard/${params.companySlug}/settings/team-members`,
    },
    {
      label: "Quotations",
      icon: <BsExclamationSquareFill />,
      pathname: `/dashboard/${params.companySlug}/settings/quotations`,
    },
    {
      label: "Invoices",
      icon: <ReceiptText />,
      pathname: `/dashboard/${params.companySlug}/settings/invoices`,
    },
  ];
  return (
    <div>
      <Heading title="Settings" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
        {settingsLinks.map((link) => (
          <article
            key={link.label}
            className="rounded-lg bg-white p-6 flex flex-col gap-4"
          >
            <span className="w-12 h-12 flex items-center justify-center bg-second text-white rounded-full">
              {link.icon}
            </span>
            <p className="font-semibold">{link.label}</p>
          
              {" "}
              <Button
              asChild
                className="bg-gray-200 hover:bg-gray-200/80"
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
