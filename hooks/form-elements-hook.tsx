import { formSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "sonner"
import { useParams, useRouter } from "next/navigation"
import { useModal } from "./modal-hook"
import { Form } from "@prisma/client"
import { addForm, editForm } from "@/actions/form-actions"


export const useFormElements = (fetchedForm:Form | undefined | null) => {


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
     name:fetchedForm?.name || "",
     description:fetchedForm?.description || "",
     isPublished:fetchedForm?.isPublished || false,
     isWidjet:fetchedForm?.isWidjet || false,
     elements:fetchedForm?.elements || []
    },
  })



const params = useParams<{companySlug:string}>()
  const router = useRouter()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let res
    try {
      if(!fetchedForm)
       {res = await addForm(values,params.companySlug)}
      else {
        res = await editForm(values,params.companySlug,fetchedForm.id)
      }

      if (!res.success) return toast.error(res.error)
      toast.success(res.message)
    router.push(`/dashboard/${params.companySlug}/forms`)
    router.refresh()

   

    } catch (error) {
      toast.error("Something went wrong")
    }

  }


  return { form, onSubmit }

}