import { companySchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldName, useForm } from "react-hook-form"
import { z } from "zod"
import { useLogo } from "./logo-hook"
import { addCompany, editCompany } from "@/actions/company-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useModal } from "./modal-hook"
import { Company } from "@prisma/client"
import { useState } from "react"


export const useComapany = ({company}:{company:Company | null}) => {


  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    mode:'onChange',
    
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

  const [step, setStep] = useState(0)

  const validatingArray: FieldName<z.infer<typeof companySchema>>[][] = [
    ['name','logo','address','city','zipcode','country','phone','companyEmail','websiteUrl'],
    ['cocNumber','industry','vatNumber','contactPerson','IBAN','termsUrl']
  ]


  const handleNext = async()=>{
      if(step===1) return

      const valid = await form.trigger(validatingArray[step])
      if(valid){
        setStep(prev=>prev+1)
      }
     
  }

  const handleBack = ()=>{
    if(step===0)return
    setStep(prev=>prev-1)
  }


  return { form, onSubmit, file, setFile, uploadImage, ImagePlaceholder,step,setStep,validatingArray ,handleNext,handleBack}

}