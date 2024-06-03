import { Form } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";
import { generateZodSchema } from "@/lib/utils";
import { formSchema } from "@/schemas";

export const useFormPreview = (form:Form)=>{


const dynamicFormSchema = generateZodSchema(form.elements, form.rules, {})
    const formPreview = useForm<z.infer<typeof dynamicFormSchema>>({
        resolver: zodResolver(dynamicFormSchema),
        defaultValues:{}
        
        
      
      })


      function onSubmit(values: z.infer<typeof dynamicFormSchema>) {
      
        console.log(values)
      }

      return {formPreview, onSubmit}

}