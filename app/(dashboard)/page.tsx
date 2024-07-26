import { DashboardPrepare } from "@/components/dashboard-prepare";
import PrepareUser from "@/components/preparing-user";
import { CustomError } from "@/custom-error";

import { prepareUser } from "@/lib/utils";

import { currentUser } from "@clerk/nextjs/server";
import { Loader, Loader2 } from "lucide-react";
import React, { Suspense } from "react";

type Props = {};

const page = async (props: Props) => {


  return (
    <Suspense
      fallback={
        <section className="h-screen bg-second flex items-center justify-center">
          <p className="flex items-center text-white">
            <Loader2 className="animate-spin ml-3" />
          </p>
        </section>
      }
    >
     <PrepareUser/>
    </Suspense>
  );
};

export default page;
