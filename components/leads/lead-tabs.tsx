"use client";

import { cn } from "@/lib/utils";
import { Submission } from "@prisma/client";
import React, { useState } from "react";
import { Button } from "../ui/button";

type Props = {
  submissions: Submission[];
};

const LeadTabs = ({ submissions }: Props) => {
  const [tab, setTab] = useState<"submissions" | "quotations" | "invoices">(
    "submissions"
  );
  return (
    <div>
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

const TabsComponents = ({
  tab,
  submissions,
}: {
  tab: "submissions" | "quotations" | "invoices";
  submissions: Submission[];
}) => {
  switch (tab) {
    case "submissions":
      return <div>Submission</div>;

    case "quotations":
      return <div>Quotations</div>;

    case "invoices":
      return <div>invoices</div>;

    default:
      return null;
  }
};
