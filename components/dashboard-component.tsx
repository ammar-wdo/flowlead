"use client";

import { useDashboard } from "@/hooks/dashboard-component-hook";
import React from "react";

type Props = {};

const DashboardComponent = (props: Props) => {
  const { STEPS, setStep, step } = useDashboard();
  return (
    <div className="grid grid-cols-3 gap-4 p-12 bg-white border">
      {/* right */}
      <div className="col-span-1 flex flex-col justify-between border-r pr-2">
        {STEPS.map((el, i) => (
          <span className="flex items-center gap-3 p-2 hover:bg-muted cursor-pointer transition">
            <span className="w-10 h-10 bg-white flex items-center justify-center rounded-full border ">
              {i + 1}
            </span>
            <span className="capitalize text-muted-foreground">{el}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default DashboardComponent;
