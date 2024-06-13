import { Form } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { generateZodSchema, isFieldVisible } from "@/lib/utils";
import { toast } from "sonner";
import { createSubmission } from "@/actions/submission-action";

export const useFormPreview = (form: Form) => {
  const [schema, setSchema] = useState(generateZodSchema(form.elements, form.rules, {}));

  const formPreview: UseFormReturn<z.infer<typeof schema>> = useForm({
    resolver: zodResolver(schema),
    defaultValues: {},
   
   
  });

  const formValues = formPreview.watch();
  const hiddenFieldsRef = useRef<string[]>([]);

  // Function to evaluate visibility and update schema
  const evaluateAndUpdateSchema = () => {
    const newHiddenFields: string[] = [];
    form.elements.forEach((element) => {
      const isVisible = isFieldVisible(element.id, form.rules, form.elements, formValues);
      if (!isVisible) {
        const fieldKey = element.field
          ? `${element.field.label}-field`
          : element.service
          ? `${element.service.name}-service`
          : "";
        newHiddenFields.push(fieldKey);
      }
    });

    const hiddenFieldsChanged = JSON.stringify(hiddenFieldsRef.current) !== JSON.stringify(newHiddenFields);

    if (hiddenFieldsChanged) {
      hiddenFieldsRef.current = newHiddenFields;
      newHiddenFields.forEach((fieldKey) => {
        formPreview.setValue(fieldKey, undefined, { shouldDirty: true });
      });
      const updatedSchema = generateZodSchema(form.elements, form.rules, formValues);
      setSchema(updatedSchema);
    }
  };

  // Effect to update schema when formValues change
  useEffect(() => {
    evaluateAndUpdateSchema();
  }, [formValues, form.elements, form.rules]);

  // Handle form submission
  async function onSubmit(values: z.infer<typeof schema>) {
  // return alert(JSON.stringify(values,undefined,2))
    try {
      
  const formValues = formPreview.watch();
      const res = await createSubmission({values,companyId:form.companyId,elements:form.elements,formValues:formValues,rules:form.rules})
if(!res.success) return toast.error(res.error)

  toast.success(res.message)
    


    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    }
  }

  return { formPreview, onSubmit, handleBlur: evaluateAndUpdateSchema };
};
