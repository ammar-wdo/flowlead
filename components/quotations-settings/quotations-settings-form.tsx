"use client";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import React from "react";
import Heading from "../heading";
import { z } from "zod";
import { quotationsSettings } from "@/schemas";

type Props = {
  quotationsSettings: z.infer<typeof quotationsSettings> | undefined | null;
};

const QuotationsSettingsForm = async ({ quotationsSettings }: Props) => {
  return <div>
    
  </div>;
};

export default QuotationsSettingsForm;
