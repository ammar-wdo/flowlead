import { companySchema, quotationsSettings } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useLogo } from "./logo-hook"
import { addCompany, editCompany } from "@/actions/company-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useModal } from "./modal-hook"
import { Company } from "@prisma/client"
import { useRef, useState } from "react"
import Quill from "quill"



export const useQuotationsSettings = ({quotationsSettingsData}:{quotationsSettingsData:z.infer<typeof quotationsSettings> | undefined | null}) => {


  const form = useForm<z.infer<typeof quotationsSettings>>({
    resolver: zodResolver(quotationsSettings),
    defaultValues: {
      attachments:quotationsSettingsData?.attachments || "",
      bcc:quotationsSettingsData?.bcc ||"",
      body:quotationsSettingsData?.body || "",
      dueDays:quotationsSettingsData?.dueDays || 14,
      footNote:quotationsSettingsData?.footNote || "",
      nextNumber:quotationsSettingsData?.nextNumber || 1,
      prefix:quotationsSettingsData?.prefix || "",
      senderEmail:quotationsSettingsData?.senderEmail ||"",
      senderName:quotationsSettingsData?.senderName ||"",
      subject:quotationsSettingsData?.subject ||"",
    },
  })

  const [caretSubjectPosition, setCaretSubjectPosition] = useState(0);
  const handleSubjectInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    setCaretSubjectPosition(e.target.selectionStart || 0);
    field.onChange(e.target.value);
  };

  const handleSubjectInsertText = (text: string) => {
    const currentValue = form.getValues('subject') || "";
    const newValue = insertTextAtPosition(currentValue, text, caretSubjectPosition);
    form.setValue('subject', newValue);
  };

  const insertTextAtPosition = (input: string, text: string, position: number) => {
    return input.slice(0, position) + text + input.slice(position);
  };
  const [caretBodyPosition, setCaretBodyPosition] = useState<{ index: number; length: number } | null>(null);
  const handleBodyInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    setCaretBodyPosition({ index: e.target.selectionStart || 0, length: e.target.selectionEnd || 0 });
    field.onChange(e.target.value);
  };

  const quillRef = useRef<Quill | null>(null);

  const handleBodyInsertText = (field: any, text: string) => {
  
    const quill = quillRef.current;
    if (quill) {
      quill.focus();
      const range = quill.getSelection();
      
      if (range) {
        quill.insertText(range.index, text);
        quill.setSelection(range.index + text.length);
        field.onChange(quill.root.innerHTML); // Update the form value
      }
    }
  }





  const router = useRouter()
  const { setClose } = useModal()
  async function onSubmit(values: z.infer<typeof quotationsSettings>) {
    try {
    //   let res

    //   if(quotationsSettingsData){
    //     res = await editCompany(values,company.slug)
    //   }
    //   else{
    //     res = await addCompany(values)
    //   }
     

    //   if (!res.success) return toast.error(res.error)
    //   toast.success(res.message)
    // router.refresh()
    // setClose()
   

    } catch (error) {
      toast.error("Something went wrong")
    }

  }


  return { form, onSubmit,handleSubjectInputChange,handleSubjectInsertText ,setCaretSubjectPosition,setCaretBodyPosition,handleBodyInputChange,handleBodyInsertText ,quillRef}

}