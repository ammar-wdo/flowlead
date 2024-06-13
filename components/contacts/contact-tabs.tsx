"use client";

import { cn } from "@/lib/utils";
import { Submission } from "@prisma/client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { DataTable } from "../submissions/submission-table";
import { columns } from "../submissions/submission-col";

type Props = {

};

const ContactTabs = ({  }: Props) => {
  const [tab, setTab] = useState<"quotations" | "invoices">(
    "quotations"
  );
  return (
    <div className="pb-20">
      {/* tabs */}
      <div className="flex items-center">
    

        <Button
          onClick={() => setTab("quotations")}
          className={cn(
            "hover:bg-transparent rounded-none border-b-2  text-muted-foreground text-sm  border-transparent",
            tab === "quotations" && " border-black text-black"
          )}
          variant={"ghost"}
        >
          Quotations
        </Button>
        <Button
          onClick={() => setTab("invoices")}
          className={cn(
            "hover:bg-transparent rounded-none border-b-2  text-muted-foreground text-sm  border-transparent",
            tab === "invoices" && " border-black text-black"
          )}
          variant={"ghost"}
        >
          Invoices
        </Button>
      </div>
      {/* components */}
      <div className="mt-8">
      <TabsComponents  tab={tab} />
      </div>
     
    </div>
  );
};

export default ContactTabs;


export type SubmissionDataType = {id:string,name:string,email:string,createdAt:Date,total:number}
const TabsComponents = ({
  tab,

}: {
  tab:"quotations" | "invoices";

}) => {

  let data:SubmissionDataType[] = []


 
  switch (tab) {


    
 

    case "quotations":
      return <div>Quotations</div>;

    case "invoices":
      return <div>invoices</div>;

    default:
      return null;
  }
};
