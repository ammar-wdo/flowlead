import { companySchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useLogo } from "./logo-hook"
import { addCompany } from "@/actions/company-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useModal } from "./modal-hook"


export const useComapany = () => {


  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      address: "",
      zipcode: "",
      city: "",
      country: "",
      websiteUrl: "",
      logo: "",
      phone: "",
      companyEmail: "",
      serviceEmail: "",
      cocNumber: "",
      industry: "",
      vatNumber: "",
      contactPerson: "",
      IBAN: "",
      termsUrl: "",
    },
  })


  const { ImagePlaceholder, file, setFile, uploadImage } = useLogo({ form })

  const router = useRouter()
  const { setClose } = useModal()
  async function onSubmit(values: z.infer<typeof companySchema>) {
    try {
      const res = await addCompany(values)

      if (!res.success) return toast.error(res.error)
      toast.success(res.message)
    router.refresh()
   

    } catch (error) {
      toast.error("Something went wrong")
    }

  }


  return { form, onSubmit, file, setFile, uploadImage, ImagePlaceholder }

}