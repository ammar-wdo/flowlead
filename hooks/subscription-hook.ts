"use client";

import { subscribe } from "@/actions/subscription-actions";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  priceId: string;
};

export const useSubscription = ({ priceId }: Props) => {
  const [loading, setLoading] = useState(false);

  const { companySlug } = useParams<{ companySlug: string }>();

  const router = useRouter()

  const handleClick = async () => {
    try {
      setLoading(true);
      const res= await subscribe({companySlug,priceId})
      if(!res.success) return toast.error(res.error)
        router.push(res.url!)

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return {loading, handleClick}
};
