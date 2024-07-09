"use client";

import React, { ReactNode, useTransition } from "react";
import { TableRow } from "../ui/table";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

type Props = {
  children: ReactNode;
  href: string;
};

const ClientRow = ({ children, href }: Props) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      router.push(href);
    });
  };
  return (
    <TableRow
      className={cn("cursor-pointer",pending && 'opacity-50' )}
      onClick={handleClick}
    >
      
      {children}
    </TableRow>
  );
};

export default ClientRow;
