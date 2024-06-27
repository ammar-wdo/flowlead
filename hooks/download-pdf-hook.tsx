import { fetchQuotationPDF } from "@/actions/fetch-quotationPDF-action";
import QuotationPdfGenerator from "@/components/quotaions/quotation-pdf-generator";
import { $Enums, Quotation } from "@prisma/client";
import ReactPDF, { pdf } from "@react-pdf/renderer";
import { useParams } from "next/navigation";
import { MutableRefObject, useEffect, useRef, useState } from "react";
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
  const companyInfo: {
    logo: string | null | undefined;
    address: string | null | undefined;
    cocNumber: string | null | undefined;
    vatNumber: string | null | undefined;
    IBAN: string |null | undefined;
    country: string |null | undefined;
    name: string |null | undefined;
    zipcode: string |null | undefined;
    city: string |null | undefined;
    companyEmail:string |null | undefined
  } = {
  logo:quotation?.company?.logo,
  address:quotation?.company?.address,
  city:quotation?.company?.city,
  cocNumber:quotation?.company?.cocNumber,
  companyEmail:quotation?.company?.companyEmail,
  country:quotation?.company?.country,
  IBAN:quotation?.company?.IBAN,
  name:quotation?.company?.name,
  vatNumber:quotation?.company?.vatNumber,
  zipcode:quotation?.company?.zipcode
  
  
  
  }

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
      const doc = <QuotationPdfGenerator quotation={res.quotation} companyInfo={companyInfo}/>;
      const asBlob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(asBlob);

      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${quotation?.subject || 'quotation'}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error("something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { quotation, loading, fetchData ,companyInfo};
};
