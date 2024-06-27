import { fetchQuotationPDF } from "@/actions/fetch-quotationPDF-action";
import { $Enums, Quotation } from "@prisma/client";
import ReactPDF from "@react-pdf/renderer";
import { useParams } from "next/navigation";
import { MutableRefObject, useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  type: "quotation" | "invoice";
  id: string;
};

export const useDownloadPDF = ({ type, id }: Props) => {
  const [quotation, setQuotation] = useState<
    | (Quotation & {
        contact:
          | {
              address: string | null;
              zipcode: string | null;
              city: string | null;
              country: string | null;
              contactType: $Enums.ContactType;
              contactName: string;
              emailAddress: string;
              companyName: string | null;
            }
          | null
          | undefined;
        contactPerson:
          | {
              emailAddress: string;
              contactName: string;
            }
          | null
          | undefined;
      } &{ company:{
        id: string,
        logo:string | null | undefined,
        address:string,
        cocNumber:string | null | undefined,
        vatNumber:string,
        IBAN:string,
        country:string,
        name:string,
        zipcode:string,
        city:string,
        companyEmail:string,
      } | null | undefined
       
        
      })
    | undefined
    | null
  >(null);
  // const  [invoice, setInvoice] = useState<Invoice>(null)

  const [loading, setLoading] = useState(false);

  const params = useParams<{ companySlug: string }>();

  const fetchData = async () => {
    let res;

    try {
      setLoading(true);
      res = await fetchQuotationPDF({
        quotationId: id,
        companySlug: params.companySlug,
      });

      if (!res.success) return toast.error(res.error);

      setQuotation(res.quotation!);
    } catch (error) {
      console.error(error);
      toast.error("something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { quotation, loading, fetchData };
};
