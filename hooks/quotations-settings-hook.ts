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


export const useQuotationsSettings = ({quotationsSettingsData}:{quotationsSettingsData:z.infer<typeof quotationsSettings> | null}) => {


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


  const { ImagePlaceholder, file, setFile, uploadImage } = useLogo({ form })

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


  return { form, onSubmit, file, setFile, uploadImage, ImagePlaceholder }

}