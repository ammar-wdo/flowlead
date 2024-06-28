import { fetchInvoicePDF } from "@/actions/fetch-invoice-pdf";
import { fetchQuotationPDF } from "@/actions/fetch-quotationPDF-action";
import InvoicePdfGenerator from "@/components/invoices/invoice-pdf-generator";
import QuotationPdfGenerator from "@/components/quotaions/quotation-pdf-generator";
import { formatWithLeadingZeros, replacePlaceholders } from "@/lib/utils";

import { pdf } from "@react-pdf/renderer";
import { useParams } from "next/navigation";
import {

  useState,
  useTransition,
} from "react";
import { toast } from "sonner";

type Props = {
  type: "quotation" | "invoice";
  id: string;
};

export const useDownloadPDF = ({ type, id }: Props) => {
  const [pending, startTransition] = useTransition();
  const [quotation, setQuotation] = useState<Awaited<ReturnType<typeof fetchQuotationPDF>>["quotation"] | null>(null);
  const [invoice, setInvoice] = useState<Awaited<ReturnType<typeof fetchInvoicePDF>>["invoice"] | null>(null);

  const params = useParams<{ companySlug: string }>();


  const fetchData = async () => {
    if (type === "quotation") {
      await fetchQuotationData();
    } else if (type === "invoice") {
      await fetchInvoiceData();
    }
  };
 
  const fetchQuotationData = async () => {
    try {
      startTransition(async () => {
        const res   = await fetchQuotationPDF({
          quotationId: id,
          companySlug: params.companySlug,
        });

        if (!res.success) {
          toast.error(res.error);
          return;
        }

        setQuotation(res.quotation!);
        await generatePDF(
          <QuotationPdfGenerator
            quotation={res.quotation}
            companyInfo={{
              logo: res.quotation?.company?.logo,
              address: res.quotation?.company?.address,
              city: res.quotation?.company?.city,
              cocNumber: res.quotation?.company?.cocNumber,
              companyEmail: res.quotation?.company?.companyEmail,
              country: res.quotation?.company?.country,
              IBAN: res.quotation?.company?.IBAN,
              name: res.quotation?.company?.name,
              vatNumber: res.quotation?.company?.vatNumber,
              zipcode: res.quotation?.company?.zipcode,
            }}
          />,
          `${replacePlaceholders(
            res.quotation?.quotationString
          )} ${formatWithLeadingZeros(res.quotation?.quotationNumber!, 4)}`
        );
      });
    } catch (error) {
      console.error(error);
      toast.error("something went wrong");
    }
  };

  const fetchInvoiceData = async () => {
    try {
      startTransition(async () => {
        const res = await fetchInvoicePDF({
          invoiceId: id,
          companySlug: params.companySlug,
        });

        if (!res.success) {
          toast.error(res.error);
          return;
        }

        setInvoice(res.invoice);
        await generatePDF(
          <InvoicePdfGenerator
            invoice={res.invoice}
            companyInfo={{
              logo: res.invoice?.company?.logo,
              address: res.invoice?.company?.address,
              city: res.invoice?.company?.city,
              cocNumber: res.invoice?.company?.cocNumber,
              companyEmail: res.invoice?.company?.companyEmail,
              country: res.invoice?.company?.country,
              IBAN: res.invoice?.company?.IBAN,
              name: res.invoice?.company?.name,
              vatNumber: res.invoice?.company?.vatNumber,
              zipcode: res.invoice?.company?.zipcode,
            }}
          />,
          `${replacePlaceholders(
            res.invoice?.invoiceString
          )} ${formatWithLeadingZeros(res.invoice?.invoiceNumber!, 4)}`
        );
      });
    } catch (error) {
      console.error(error);
      toast.error("something went wrong");
    }
  };

  const generatePDF = async (doc: JSX.Element, filename: string) => {
    const asBlob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(asBlob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  return { quotation, pending, fetchData,invoice };
};
