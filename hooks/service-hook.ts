import { Service } from "@prisma/client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { serviceSchema } from "@/schemas";
import { useLogo } from "./logo-hook";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { addService } from "@/actions/service-actions";

export const useService  =(service:Service | null | undefined)=>{

    const form = useForm<z.infer<typeof serviceSchema>>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
          name:service?.name ||  "",
          description:service?.description || "",
          options:service?.options || [{name:'',description:'',enableQuantity:false,image:'',price:undefined}],
          isRequired:service?.isRequired,
          pricingType:service?.pricingType || 'SINGLE_PRICE',
          addToQoutation:service?.addToQoutation     
        },
      })


      const params:{companySlug:string} = useParams()

      const { ImagePlaceholder, file, setFile, uploadImage } = useLogo({ form })
const router = useRouter()
      async function onSubmit(values: z.infer<typeof serviceSchema>) {
        try {
          const res = await addService(values,params.companySlug)
    
          if (!res.success) return toast.error(res.error)
          toast.success(res.message)
        router.push(`/dashboard/${params.companySlug}/services`)
    
       
    
        } catch (error) {
          toast.error("Something went wrong")
        }
    
      }

      return {form ,onSubmit}

}