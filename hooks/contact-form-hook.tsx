import { Contact, ContactPerson } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { contactSchema } from "@/schemas";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { createLead, updateLead } from "@/actions/lead-action";
import { createContact, updateContact } from "@/actions/contact-actions";
import { v4 as uuidv4 } from "uuid";


export const useContact = ({contact}:{contact:Contact &{contactPersons:ContactPerson[]} | null | undefined})=>{


    const form = useForm<z.infer<typeof contactSchema>>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
        address:contact?.address || "",
        city:contact?.city || "",
        cocNumber:contact?.cocNumber ||"",
        companyName:contact?.companyName || "",
        contactName:contact?.contactName || "",
        contactType:contact?.contactType || 'INDIVIDUAL',
        country:contact?.country || "",
        emailAddress:contact?.emailAddress || "",
        IBAN: contact?.IBAN || "",
        mobileNumber:contact?.mobileNumber || "",
        phoneNumber:contact?.phoneNumber || "",
        vatNumber:contact?.vatNumber || "",
        zipcode:contact?.zipcode || '',
        contactPersons:contact?.contactPersons || []
        },
      })
     
   
      const router = useRouter()
   const params = useParams<{contactId:string,companySlug:string}>()
      async function onSubmit(values: z.infer<typeof contactSchema>) {
   
     try {

        let res
        if(!contact){
res = await createContact({values,companySlug:params.companySlug})
        }else{
res = await updateContact({values,companySlug:params.companySlug,contactId:params.contactId})
        }
        if(!res.success) return toast.error(res.error)
toast.success(res.message)
        router.push(`/${params.companySlug}/contacts`)
        router.refresh()

     } catch (error) {
        console.error(error)
        toast.error("Something went wrong")
     }
      }


      const handleAddContactPerson = ()=>{
const contactPersons = form.watch('contactPersons')
form.setValue('contactPersons',[...(contactPersons || []),{contactName:"",emailAddress:"",phoneNumber:undefined,id:uuidv4()}])
      }


      const handleDeleteContactPerson = (id:string)=>{
        const newContacts=  form.watch('contactPersons')?.filter(person=>person.id !== id)

        form.setValue("contactPersons",newContacts)
      }


      return {form,onSubmit,handleAddContactPerson,handleDeleteContactPerson}

}