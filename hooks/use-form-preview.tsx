import { Form } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { generateZodSchema, isFieldVisible } from "@/lib/utils";

export const useFormPreview = (form: Form) => {
  // Initialize dynamic schema in state to be updated
  const [schema, setSchema] = useState(generateZodSchema(form.elements, form.rules, {}));

  // Set up the form using the initial schema
  const formPreview: UseFormReturn<z.infer<typeof schema>> = useForm({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  // Watch for changes in form values
  const formValues = formPreview.watch();
  
  // Refs to keep track of previous form values and hidden fields
  const hiddenFieldsRef = useRef<string[]>([]);

  useEffect(() => {
    const newHiddenFields: string[] = [];

    // Determine which fields are hidden based on the current form values
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

    // Check if the hidden fields have changed
    const hiddenFieldsChanged = JSON.stringify(hiddenFieldsRef.current) !== JSON.stringify(newHiddenFields);

    if (hiddenFieldsChanged) {
      // Update the ref with the new hidden fields
      hiddenFieldsRef.current = newHiddenFields;

      // Set hidden field values to undefined
      newHiddenFields.forEach((fieldKey) => {
        formPreview.setValue(fieldKey, undefined, { shouldDirty: true });
      });

      // Generate a new schema based on the updated form values
      const updatedSchema = generateZodSchema(form.elements, form.rules, formValues);
      setSchema(updatedSchema); // Update the schema state
    }
  }, [formValues, form.elements, form.rules, formPreview]);

  // Handle form submission
  function onSubmit(values: z.infer<typeof schema>) {
    alert(JSON.stringify(values, undefined, 2));
  }

  return { formPreview, onSubmit };
};
