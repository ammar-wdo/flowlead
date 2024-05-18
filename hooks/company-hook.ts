import { companySchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useLogo } from "./logo-hook"


export const useComapany = ()=>{
 

    const form = useForm<z.infer<typeof companySchema>>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            name: "",
            address:"",
            zipcode:"",
            city:"",
            country:"",
            websiteUrl:"",
            logo:"",
            phone:"",
            companyEmail:"",
            serviceEmail:"",
            cocNumber:"",
            industry:"",
            vatNumber:"",
            contactPerson:"",
            IBAN:"",
            termsUrl:"",
        },
      })


      const {ImagePlaceholder,file,setFile,uploadImage} = useLogo({form})


      function onSubmit(values: z.infer<typeof companySchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)

}


return {form,onSubmit,file,setFile,uploadImage,ImagePlaceholder}

}