import { DiscountType, Invoice, Quotation } from "@prisma/client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { invoiceEmailSendSchema, invoiceSchema } from "@/schemas";
import { useEffect, useState, useTransition } from "react";
import { v4 as uuid4 } from "uuid";
import { useEdgeStore } from "@/lib/edgestore";
import { FileState } from "@/components/MultiFileDropzone";
import { addQuotation, editQuotation } from "@/actions/quotation-actions";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { replaceDates } from "@/lib/utils";
import { addInvoice, editInvoice } from "@/actions/invoice-actions";

export const useInvoice = ({
  invoice,
  invoiceSettings,
}: {
  invoice: Invoice | null | undefined;
  invoiceSettings: {
    id: string;
    attatchments: {
      name: string | null;
      type: string | null;
      size: string | null;
      url: string | null;
    }[];
    footNote: string | null;
    dueDays: number;
    prefix: string;
    nextNumber: number;
  };
}) => {
  const [openInvoiceDate, setOpenInvoiceDate] = useState(false);
  const [openExpiryInvoiceDate, setOpenExpiryInvoiceDate] = useState(false);
  const [pending, startTransitions] = useTransition();

  const [contactOpen, setContactOpen] = useState(false);

  const [emailData, setEmailData] = useState<z.infer<
    typeof invoiceEmailSendSchema
  >  | null>(null);

  const invoiceExpiryDate =
    invoice?.expiryDate ||
    new Date(
      new Date().setDate(new Date().getDate() + invoiceSettings.dueDays)
    );
  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      contactId: invoice?.contactId || "",
      discount: invoice?.discount
        ? {
            ...invoice.discount,
            percentageValue: invoice.discount.percentageValue ?? undefined,
            fixedValue: invoice.discount.fixedValue ?? undefined,
          }
        : null,

      expiryDate: invoiceExpiryDate,
      footNote: replaceDates(
        invoice?.footNote || invoiceSettings.footNote || "",
        invoice?.invoiceDate || new Date(),
        invoiceExpiryDate
      ),

      lineItems: invoice?.lineItems || [
        {
          id: uuid4(),
          name: "",
          description: "",
          price: 0,
          quantity: 1,
          taxAmount: 0,
          taxPercentage: 0,
          totalPrice: 0,
        },
      ],
      invoiceDate: invoice?.invoiceDate || new Date(),
      invoiceNumber:
        invoice?.invoiceNumber || invoiceSettings.nextNumber,
      invoiceString: invoice?.invoiceString || invoiceSettings.prefix,

      status: invoice?.status || "CONCEPT",
      subject: invoice?.subject || "",

      totalTax: invoice?.totalTax || undefined,
      attatchments: invoice
        ? invoice.attatchments
        : invoiceSettings.attatchments,
      contactPersonId: invoice?.contactPersonId || undefined,
    },
  });

  useEffect(() => {
    const refactoredFootNoteContent = replaceDates(
      form.watch("footNote") || "",
      form.watch("invoiceDate"),
      form.watch("expiryDate")
    );

    form.setValue("footNote", refactoredFootNoteContent);
  }, [form.watch("footNote")]);

  //calculate total when inputs change
  const calculate = (index: number) => {
    const price = form.watch(`lineItems.${index}.price`);
    const quantity = form.watch(`lineItems.${index}.quantity`);
    // const taxPercentage = form.watch(`lineItems.${index}.taxPercentage`);

    // const totalPrice =
    //   price * quantity - (price * quantity * taxPercentage) / 100;
    form.setValue(`lineItems.${index}.totalPrice`, quantity * price);
  };

  const subTotalAmount = form
    .watch("lineItems")
    .reduce((acc, val) => acc + val.price * val.quantity, 0);

  const discountValue =
    form.watch("discount")?.type === "PERCENTAGE"
      ? ((form.watch("discount")?.percentageValue || 0) * subTotalAmount) / 100
      : form.watch("discount")?.fixedValue || 0;

  const subTotalWithDiscount = subTotalAmount - discountValue;

  const totalVat = form
    .watch("lineItems")
    .reduce(
      (acc, val) => acc + (val.taxPercentage * val.price * val.quantity) / 100,
      0
    );

  const total = totalVat + subTotalWithDiscount;

  //add new line item
  const addLineItem = () => {
    const lineItem = {
      id: uuid4(),
      name: "",
      description: "",
      price: 0,
      quantity: 1,
      taxAmount: 0,
      taxPercentage: 0,
      totalPrice: 0,
    };
    const lineItems = form.watch("lineItems");
    form.setValue("lineItems", [...lineItems, lineItem]);
  };

  //delete line item
  const deleteLineItem = (id: string) => {
    const newLineItems = form.watch("lineItems");
    form.setValue(
      "lineItems",
      newLineItems.filter((el) => el.id !== id)
    );
  };

  //footnote variables
  const [caretFootnotePosition, setCaretFootnotePosition] = useState(0);
  const handleFootnoteInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    field: any
  ) => {
    setCaretFootnotePosition(e.target.selectionStart || 0);
    field.onChange(e.target.value);
  };

  const handleFootnoteInsertText = (text: string) => {
    const currentValue = form.getValues("footNote") || "";
    const newValue = insertTextAtPosition(
      currentValue,
      text,
      caretFootnotePosition
    );
    form.setValue("footNote", newValue);
  };

  const insertTextAtPosition = (
    input: string,
    text: string,
    position: number
  ) => {
    return input.slice(0, position) + text + input.slice(position);
  };

  //file upload
  const [file, setFile] = useState<File>();
  const [progressing, setProgressing] = useState(false);
  const [deleting, setDeleting] = useState("");
  const { edgestore } = useEdgeStore();

  const [fileStates, setFileStates] = useState<FileState[]>([]);

  function updateFileProgress(
    key: string,
    progress: FileState["progress"],
    url: string
  ) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key
      );
      if (fileState) {
        fileState.progress = progress;
        fileState.url = url;
      }
      return newFileStates;
    });
  }

  const deleteFile = async (url: string | undefined | null) => {
    if (!url) return;
    try {
      setDeleting(url);
      if (!invoiceSettings.attatchments.some((el) => el.url === url)) {
        await edgestore.publicFiles.delete({
          url,
        });
      }
      setFileStates((prev) => prev.filter((el) => el.url !== url));
    } catch (error) {
      console.log(error);
    } finally {
      setFile(undefined);
      form.setValue(
        "attatchments",
        form.watch("attatchments")?.filter((el) => el?.url !== url)
      );
      setDeleting("");
    }
  };

  const params = useParams<{ companySlug: string }>();
  const router = useRouter();

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof invoiceSchema>) {
    try {
      let res;
      if (invoice) {
        res = await editInvoice(values, params.companySlug, invoice.id);
      } else {
        res = await addInvoice(values, params.companySlug);
      }

      if (!res.success) {
        toast.error(res.error);

        return;
      }

      const returnedInvoice= res.data;
      setEmailData({
        invoiceId: returnedInvoice?.id!,
        content: returnedInvoice?.invoiceSettings!.body!,
        subject: returnedInvoice?.invoiceSettings.subject!,
        receiverEmail:
          returnedInvoice?.contactPerson?.emailAddress ||
          returnedInvoice?.contact.emailAddress!,
        senderEmail: returnedInvoice?.company.companyEmail!,
        senderName:returnedInvoice?.company.name!,
        attatchments:returnedInvoice?.attatchments
      });

 
      toast.success(res.message);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }

  const handleResetEmailData = (val:boolean)=>{
    if(val===true) return 
    setEmailData(null)
    router.refresh()
    router.push(`/dashboard/${params.companySlug}/quotations`)
  }

  const handleSetDiscount = (value: DiscountType) => {
    if (!form.watch("discount")) {
      form.setValue("discount", {
        type: value,
        description: undefined,
        fixedValue: 0,
        percentageValue: 0,
      });
    } else {
      const discount = form.watch("discount") as {
        type: "PERCENTAGE" | "FIXED";
        description?: string | null | undefined;
        percentageValue?: number | undefined;
        fixedValue?: number | undefined;
      };
      form.setValue("discount", { ...discount, type: value });
    }
  };

  const handleDeleteDiscount = () => {
    form.setValue("discount", null);
  };

  return {
    form,
    onSubmit,
    openInvoiceDate,
    setOpenInvoiceDate,
    openExpiryInvoiceDate,
    setOpenExpiryInvoiceDate,
    calculate,
    addLineItem,
    deleteLineItem,
    handleFootnoteInsertText,
    handleFootnoteInputChange,
    setCaretFootnotePosition,
    setFile,
    file,
    setDeleting,
    progressing,
    fileStates,
    setFileStates,
    updateFileProgress,
    edgestore,
    deleting,
    deleteFile,
    contactOpen,
    setContactOpen,
    handleSetDiscount,
    handleDeleteDiscount,
    discountValue,
    subTotalWithDiscount,
    total,
    pending,
    emailData,
    handleResetEmailData
  };
};



export const useSendEmail = ({emailData}:{emailData:z.infer<typeof invoiceEmailSendSchema> | null})=>{



  useEffect(()=>{
   form.reset({...emailData})
  },[emailData])



  const form = useForm<z.infer<typeof invoiceEmailSendSchema>>({
    resolver: zodResolver(invoiceEmailSendSchema),
    defaultValues: {
...emailData
    },
  })
 

  function onSubmit(values: z.infer<typeof invoiceEmailSendSchema>) {
  
   console.log(JSON.stringify(values,undefined,2))
  }

return {form, onSubmit}
}