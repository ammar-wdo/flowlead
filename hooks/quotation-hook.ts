import { DiscountType, Quotation } from "@prisma/client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { quotationSchema } from "@/schemas";
import { useState } from "react";
import { v4 as uuid4 } from "uuid";
import { useEdgeStore } from "@/lib/edgestore";
import { FileState } from "@/components/MultiFileDropzone";
import { addQuotation, editQuotation } from "@/actions/quotation-actions";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export const useQuotation = ({
  quotation,
  quotationSettings,
}: {
  quotation: Quotation | null | undefined;
  quotationSettings: { id: string; nextNumber: number; prefix: string };
}) => {
  const [openQuotDate, setOpenQuotDate] = useState(false);
  const [openExpiryQuotDate, setOpenExpiryQuotDate] = useState(false);

  const [contactOpen, setContactOpen] = useState(false)

  const form = useForm<z.infer<typeof quotationSchema>>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      contactId: quotation?.contactId || "",
      acceptedBy: quotation?.acceptedBy || "",
      dateAccepted: quotation?.dateAccepted || undefined,
      discount: quotation?.discount
        ? {
            ...quotation.discount,
            percentageValue: quotation.discount.percentageValue ?? undefined,
            fixedValue: quotation.discount.fixedValue ?? undefined,
          }
        : null,

      expiryDate: quotation?.expiryDate || undefined,
      footNote: quotation?.footNote || "",
  
      lineItems: quotation?.lineItems || [
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
      quotationDate: quotation?.quotationDate || new Date(),
      quotationNumber:
        quotation?.quotationNumber || quotationSettings.nextNumber,
      quotationString: quotation?.quotationString || quotationSettings.prefix,
      signature: quotation?.signature || "",
      status: quotation?.status || "CONCEPT",
      subject: quotation?.subject || "",

      totalTax: quotation?.totalTax || undefined,
      attatchments:quotation?.attatchments || [],
      contactPersonId:quotation?.contactPersonId || undefined,

    },
  });

  //calculate total when inputs change
  const calculate = (index: number) => {
    const price = form.watch(`lineItems.${index}.price`);
    const quantity = form.watch(`lineItems.${index}.quantity`);
    const taxPercentage = form.watch(`lineItems.${index}.taxPercentage`);

    const totalPrice =
      price * quantity - (price * quantity * taxPercentage) / 100;
    form.setValue(`lineItems.${index}.totalPrice`, totalPrice);
  };

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
      await edgestore.publicFiles.delete({
        url,
      });
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
  async function onSubmit(values: z.infer<typeof quotationSchema>) {
    try {
      let res;
      if (quotation) {
        res = await editQuotation(values, params.companySlug, quotation.id);
      } else {
        res = await addQuotation(values, params.companySlug);
      }

      if (!res.success) return toast.error(res.error);
      router.push(`/dashboard/${params.companySlug}/quotations`);
      router.refresh()
      toast.success(res.message);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }


 


  const handleSetDiscount=(value:DiscountType)=>{

    if(!form.watch('discount'))
      {
        form.setValue('discount',{type:value,description:undefined,fixedValue:0,percentageValue:0})
      }else{
        const discount = form.watch('discount') as {
          type: "PERCENTAGE" | "FIXED";
          description?: string | null | undefined;
          percentageValue?: number | undefined;
          fixedValue?: number | undefined;
        }
        form.setValue('discount',{...discount,type:value})
      }

  }

  const handleDeleteDiscount = ()=>{
    form.setValue('discount',null)
  }

  return {
    form,
    onSubmit,
    openQuotDate,
    setOpenQuotDate,
    openExpiryQuotDate,
    setOpenExpiryQuotDate,
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
    handleDeleteDiscount
  };
};
