import { companySchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useLogo } from "./logo-hook"
import { addCompany, editCompany } from "@/actions/company-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useModal } from "./modal-hook"
import { Company } from "@prisma/client"


export const useComapany = ({company}:{company:Company | null}) => {


  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name:company?.name ||  "",
      address:company?.address ||  "",
      zipcode:company?.zipcode ||  "",
      city:company?.city ||  "",
      country:company?.city ||  "",
      websiteUrl:company?.websiteUrl || "",
      logo:company?.logo ||  "",
      phone:company?.phone || "",
      companyEmail:company?.companyEmail ||  "",
      serviceEmail: company?.serviceEmail ||  "",
      cocNumber:company?.cocNumber ||  "",
      industry:company?.industry ||  "",
      vatNumber:company?.vatNumber ||  "",
      contactPerson:company?.contactPerson ||  "",
      IBAN:company?.IBAN ||  "",
      termsUrl:company?.termsUrl ||  "",
    },
  })


  const { ImagePlaceholder, file, setFile, uploadImage } = useLogo({ form })

  const router = useRouter()
  const { setClose } = useModal()
  async function onSubmit(values: z.infer<typeof companySchema>) {
    try {
      let res

      if(company){
        res = await editCompany(values,company.slug)
      }
      else{
        res = await addCompany(values)
      }
     

      if (!res.success) return toast.error(res.error)
      toast.success(res.message)
    router.refresh()
    setClose()
   

    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    }

  }


  return { form, onSubmit, file, setFile, uploadImage, ImagePlaceholder }

}