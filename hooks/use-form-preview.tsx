import { Form } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { useEffect, useMemo, useRef, useCallback, useState } from "react";
import { z } from "zod";
import { generateZodSchema, isFieldVisible } from "@/lib/utils";

export const useFormPreview = (form: Form) => {

  //initiat dynamic schema in state to be updated
  const [schema, setSchema] = useState(generateZodSchema(form.elements, form.rules, {}));

  const formPreview: UseFormReturn<z.infer<typeof schema>> = useForm({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const formValues = formPreview.watch();
  //to tracj the hidden fields and set their values to undefiend
  const prevFormValuesRef = useRef(formValues);
  const hiddenFieldsRef = useRef<string[]>([]);

  const updateSchemaAndVisibility = useCallback(() => {
    const updatedSchema = generateZodSchema(form.elements, form.rules, formValues);

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
    }

    prevFormValuesRef.current = formValues;
    setSchema(updatedSchema);
  }, [form.elements, form.rules, formValues, formPreview]);

  useEffect(() => {
    updateSchemaAndVisibility();
  }, [formValues, updateSchemaAndVisibility]);

 

  function onSubmit(values: z.infer<typeof schema>) {
    alert(JSON.stringify(values, undefined, 2));
  }

  return { formPreview, onSubmit };
};
