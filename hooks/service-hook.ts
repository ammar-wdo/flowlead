import { Service } from "@prisma/client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { serviceSchema } from "@/schemas";
import { useLogo } from "./logo-hook";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { addService, updateService } from "@/actions/service-actions";

export const useService  =(service:Service | null | undefined)=>{

    const form = useForm<z.infer<typeof serviceSchema>>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
          name:service?.name ||  "",
          description:service?.description || "",
          options:service?.options || [{name:'',description:'',enableQuantity:false,image:'',price:undefined,id:String(Date.now())}],
          isRequired:service?.isRequired || false,
          pricingType:service?.pricingType || 'SINGLE_PRICE',
          addToQoutation:service?.addToQoutation   || false ,
          taxPercentage:service?.taxPercentage || undefined ,
          isLineItem:service?.isLineItem || false
        },
      })


      const params:{companySlug:string} = useParams()

      const { ImagePlaceholder, file, setFile, uploadImage } = useLogo({ form })
const router = useRouter()
      async function onSubmit(values: z.infer<typeof serviceSchema>) {
        try {
let res
          if(!service)
          { res = await addService(values,params.companySlug)}
          else{
            res = await updateService(values,params.companySlug,service.id)
          }
    
          if (!res.success) return toast.error(res.error)

          toast.success(res.message)
        router.push(`/dashboard/${params.companySlug}/services`)
        router.refresh()
    
       
    
        } catch (error) {
          toast.error("Something went wrong")
        }
    
      }

      return {form ,onSubmit}

}