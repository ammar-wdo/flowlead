import { DiscountType, Quotation } from "@prisma/client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  companySchema,
  invoiceEmailSendSchema,
  quotationEmailSendSchema,
  quotationSchema,
} from "@/schemas";
import { useEffect, useState, useTransition } from "react";
import { v4 as uuid4 } from "uuid";
import { useEdgeStore } from "@/lib/edgestore";
import { FileState } from "@/components/MultiFileDropzone";
import { addQuotation, editQuotation } from "@/actions/quotation-actions";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { replaceDates } from "@/lib/utils";
import axios from "axios";

export const useQuotation = ({
  quotation,
  quotationSettings,
}: {
  quotation: Quotation | null | undefined;
  quotationSettings: {
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
  const [openQuotDate, setOpenQuotDate] = useState(false);
  const [openExpiryQuotDate, setOpenExpiryQuotDate] = useState(false);
  const [pending, startTransitions] = useTransition();

  const [contactOpen, setContactOpen] = useState(false);

  const [emailData, setEmailData] = useState<z.infer<
    typeof quotationEmailSendSchema
  > | null>(null);

  const quotationExpiryDate =
    quotation?.expiryDate ||
    new Date(
      new Date().setDate(new Date().getDate() + quotationSettings.dueDays)
    );
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

      expiryDate: quotationExpiryDate,
      footNote: replaceDates(
        quotation?.footNote || quotationSettings.footNote || "",
        quotation?.quotationDate || new Date(),
        quotationExpiryDate
      ),

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
      attatchments: quotation
        ? quotation.attatchments
        : quotationSettings.attatchments,
      contactPersonId: quotation?.contactPersonId || undefined,
    },
  });

  useEffect(() => {
    const refactoredFootNoteContent = replaceDates(
      form.watch("footNote") || "",
      form.watch("quotationDate"),
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
      if (!quotationSettings.attatchments.some((el) => el.url === url)) {
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
  async function onSubmit(values: z.infer<typeof quotationSchema>) {
    try {
      let res;
      if (quotation) {
        res = await editQuotation(values, params.companySlug, quotation.id);
      } else {
        res = await addQuotation(values, params.companySlug);
      }

      if (!res.success) {
        toast.error(res.error);

        return;
      }
      const returnedQuotation = res.data;
      const returnedCompany = returnedQuotation?.company
const theCompany:z.infer<typeof companySchema>={
  address:returnedCompany!.address,
  city:returnedCompany!.city,
  companyEmail:returnedCompany!.companyEmail,
  contactPerson:returnedCompany!.contactPerson,
  country:returnedCompany!.country,
  name:returnedCompany!.name,
  phone:returnedCompany!.phone,
  zipcode:returnedCompany!.zipcode,
  cocNumber:returnedCompany!.cocNumber || '',
  IBAN:returnedCompany!.IBAN || '',
  industry:returnedCompany!.industry || '',
  logo:returnedCompany!.logo || '',
  termsUrl:returnedCompany?.termsUrl || '',
  vatNumber:returnedCompany?.vatNumber || '',
  websiteUrl:returnedCompany?.websiteUrl || ''


}
    
      setEmailData({
        quotationId: returnedQuotation?.id!,
        content: returnedQuotation?.quotationSettings!.body!,
        subject: returnedQuotation?.quotationSettings.subject!,
        company:theCompany,
        receiverEmail:
          returnedQuotation?.contactPerson?.emailAddress ||
          returnedQuotation?.contact.emailAddress!,
        expiryDate: returnedQuotation!.expiryDate,
        quotDate: returnedQuotation!.quotationDate,
        quotationNumber: `${returnedQuotation?.quotationString} ${returnedQuotation?.quotationNumber}`,
        name: returnedQuotation!.contact.contactName,
        contactPerson: returnedQuotation!.contactPerson?.contactName,
        address: returnedQuotation?.contact.address || "",
        senderEmail: returnedQuotation?.company.companyEmail!,
        senderName: returnedQuotation!.company.name!,
        attatchments: returnedQuotation?.attatchments,
        companyName: returnedQuotation?.contact.companyName || "",
        mobileNumber: returnedQuotation?.contact.mobileNumber || "",
        phoneNumber:
          returnedQuotation?.contactPerson?.phoneNumber ||
          returnedQuotation?.contact.phoneNumber || ''
      });

      toast.success(res.message);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }

  const handleResetEmailData = (val: boolean) => {
    if (val === true) return;
    setEmailData(null);
    router.refresh();
    router.push(`/${params.companySlug}/quotations`);
  };

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
    handleDeleteDiscount,
    discountValue,
    subTotalWithDiscount,
    total,
    pending,
    emailData,
    handleResetEmailData,
  };
};

export const useSendEmail = ({
  emailData,
}: {
  emailData:
    | z.infer<typeof quotationEmailSendSchema>
    | z.infer<typeof invoiceEmailSendSchema>
    | null;
}) => {
  useEffect(() => {
    form.reset({ ...emailData });
  }, [emailData]);

  const form = useForm<z.infer<typeof quotationEmailSendSchema>>({
    resolver: zodResolver(quotationEmailSendSchema),
    defaultValues: {
      ...emailData,
    },
  });
  const router = useRouter();
  const params = useParams<{ companySlug: string }>();

  async function onSubmit(values: z.infer<typeof quotationEmailSendSchema>) {
    try {
      const res = await axios.post(
        "https://hook.eu1.make.com/47i1lonj4sf35vkeyum1wew3z1rkehxg",
        values
      );
      toast.success("Sent successfully");
      router.refresh();
      router.push(`/${params.companySlug}/quotations`);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }

  return { form, onSubmit };
};
