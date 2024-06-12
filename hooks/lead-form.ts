import { Contact } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { contactSchema } from "@/schemas";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { createLead, updateLead } from "@/actions/lead-action";


export const useLead = ({lead}:{lead:Contact | null | undefined})=>{


    const form = useForm<z.infer<typeof contactSchema>>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
        address:lead?.address || "",
        city:lead?.city || "",
        cocNumber:lead?.cocNumber ||"",
        companyName:lead?.companyName || "",
        contactName:lead?.contactName || "",
        contactType:lead?.contactType || 'INDIVIDUAL',
        country:lead?.country || "",
        emailAddress:lead?.emailAddress || "",
        IBAN: lead?.IBAN || "",
        mobileNumber:lead?.mobileNumber || "",
        phoneNumber:lead?.phoneNumber || "",
        vatNumber:lead?.vatNumber || "",
        zipcode:lead?.zipcode || ''
        },
      })
     
   
      const router = useRouter()
   const params = useParams<{leadId:string,companySlug:string}>()
      async function onSubmit(values: z.infer<typeof contactSchema>) {
   
     try {

        let res
        if(!lead){
res = await createLead({values,companySlug:params.companySlug})
        }else{
res = await updateLead({values,companySlug:params.companySlug,leadId:params.leadId})
        }
        if(!res.success) return toast.error(res.error)
toast.success(res.message)
        router.refresh()

     } catch (error) {
        console.error(error)
        toast.error("Something went wrong")
     }
      }


      return {form,onSubmit}

}