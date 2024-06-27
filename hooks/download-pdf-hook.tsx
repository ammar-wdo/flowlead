import { fetchQuotationPDF } from "@/actions/fetch-quotationPDF-action";
import QuotationPdfGenerator from "@/components/quotaions/quotation-pdf-generator";
import { formatWithLeadingZeros, replacePlaceholders } from "@/lib/utils";
import { $Enums, Quotation } from "@prisma/client";
import ReactPDF, { pdf } from "@react-pdf/renderer";
import { useParams } from "next/navigation";
import { MutableRefObject, useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

type Props = {
  type: "quotation" | "invoice";
  id: string;
};

export const useDownloadPDF = ({ type, id }: Props) => {

const [pending, startTransition] = useTransition()
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


   

    try {
      let res;
      startTransition(async ()=>{
   
        res = await fetchQuotationPDF({
          quotationId: id,
          companySlug: params.companySlug,
        });
  
        if (!res.success){  
          toast.error(res.error)
          return
        };
      
  
        setQuotation(res.quotation!);
        const doc = <QuotationPdfGenerator quotation={res.quotation} companyInfo={{
          logo:res.quotation?.company?.logo,
          address:res.quotation?.company?.address,
          city:res.quotation?.company?.city,
          cocNumber:res.quotation?.company?.cocNumber,
          companyEmail:res.quotation?.company?.companyEmail,
          country:res.quotation?.company?.country,
          IBAN:res.quotation?.company?.IBAN,
          name:res.quotation?.company?.name,
          vatNumber:res.quotation?.company?.vatNumber,
          zipcode:res.quotation?.company?.zipcode
        }}/>;
        const asBlob = await pdf(doc).toBlob();
        const url = URL.createObjectURL(asBlob);
  
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `${replacePlaceholders(res.quotation?.quotationString)} ${formatWithLeadingZeros(res.quotation?.quotationNumber!,4)}`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
      })
     
    } catch (error) {
      console.error(error);
      toast.error("something went wrong");
    } finally {
  
    }
  };

  return { quotation, pending, fetchData ,companyInfo};
};
