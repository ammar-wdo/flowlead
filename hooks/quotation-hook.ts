import { Quotation } from "@prisma/client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { quotationSchema } from "@/schemas";
import { useState } from "react";
import { v4 as uuid4 } from "uuid";

export const useQuotation = ({
  quotation,
  quotationSettings,
}: {
  quotation: Quotation | null | undefined;
  quotationSettings: { id: string; nextNumber: number; prefix: string };
}) => {
  const [openQuotDate, setOpenQuotDate] = useState(false);
  const [openExpiryQuotDate, setOpenExpiryQuotDate] = useState(false);

  const form = useForm<z.infer<typeof quotationSchema>>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      contactId: quotation?.companyId || "",
      acceptedBy: quotation?.acceptedBy || "",
      dateAccepted: quotation?.dateAccepted || undefined,
      discount: quotation?.discount
        ? {
            ...quotation.discount,
            percentageValue: quotation.discount.percentageValue ?? undefined,
            fixedValue: quotation.discount.fixedValue ?? undefined,
          }
        : null,
      discountAmount: quotation?.discountAmount || undefined,
      expiryDate: quotation?.expiryDate || undefined,
      footNote: quotation?.footNote || "",
      isSeen: quotation?.isSeen,
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
      totalAmount: quotation?.totalAmount || undefined,
      totalTax: quotation?.totalTax || undefined,
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

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof quotationSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
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
  };
};
