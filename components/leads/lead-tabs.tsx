"use client";

import { cn } from "@/lib/utils";
import { Submission } from "@prisma/client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { DataTable } from "../submissions/submission-table";
import { columns } from "../submissions/submission-col";

type Props = {
  submissions: Submission[];
};

const LeadTabs = ({ submissions }: Props) => {
  const [tab, setTab] = useState<"submissions" | "quotations" | "invoices">(
    "submissions"
  );
  return (
    <div className="pb-20">
      {/* tabs */}
      <div className="flex items-center">
        <Button
          onClick={() => setTab("submissions")}
          className={cn(
            "hover:bg-transparent rounded-none border-b-2 text-muted-foreground text-sm   border-transparent",
            tab === "submissions" && " border-black text-black"
          )}
          variant={"ghost"}
        >
          Submissions
        </Button>

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
      <TabsComponents submissions={submissions} tab={tab} />
      </div>
     
    </div>
  );
};

export default LeadTabs;


export type SubmissionDataType = {id:string,name:string,email:string,createdAt:Date,total:number}
const TabsComponents = ({
  tab,
  submissions,
}: {
  tab: "submissions" | "quotations" | "invoices";
  submissions: Submission[];
}) => {

  let data:SubmissionDataType[] = []


  //loop over submission to prepare data to table
  
  submissions.forEach((el)=>{
    const content = el.content as any
    const id = el.id
    const name = content["Naam-field"]
    const email = content["Email Adres-field"]
    const createdAt = el.createdAt
    const total = Object.entries(content).reduce((prev: number, [key, value]) => {

      if (key.endsWith("-service") ) {
       if(!Array.isArray(value) && typeof value === 'object' && value !== null && 'price' in value && 'quantity'  in value && !isNaN(+(value.price as number))){
        prev = prev + (+(value.price as number))*(+(value.quantity as number));
       }else if(Array.isArray(value)){
        value.forEach(el=>{
          if(typeof el === 'object' && el !== null && 'price' in el && 'quantity'  in el && !isNaN(+(el.price as number))){
            prev = prev + (+(el.price as number))*(+(el.quantity as number));
          }
        })
       }


      
      }
      return prev;
    }, 0);
  
    data.push({id,name,email,total,createdAt})
  })
  switch (tab) {


    
    case "submissions":
      return  <div className="bg-white"><DataTable columns={columns} data={data} /></div>;

    case "quotations":
      return <div>Quotations</div>;

    case "invoices":
      return <div>invoices</div>;

    default:
      return null;
  }
};
