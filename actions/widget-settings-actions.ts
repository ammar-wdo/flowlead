'use server'

import { CustomError } from "@/custom-error"
import prisma from "@/lib/prisma"
import { widgetSchema } from "@/schemas"
import { auth } from "@clerk/nextjs/server"
import { z } from "zod"

export const updateWidgetSettings = async({companySlug,values}:{companySlug:string,values:z.infer<typeof widgetSchema>})=>{
try {
const {userId} = auth()
if(!userId) throw new CustomError("Unauthorized")

const company = await prisma.company.findUnique({where:{
    slug:companySlug,userId,
    
},
select:{
    id:true
}})

if(!company) throw new CustomError("Company was not found")

    const validData = widgetSchema.safeParse(values)

    if(!validData.success)throw new CustomError(`${validData.error.formErrors.fieldErrors}`)

    await prisma.widgetSettings.update({
        where:{
           companyId:company.id
        },
        data:{
...validData.data
        }
    })
    

    return {success:true,
        message:"Updated Successfully"
    }
    
} catch (error) {
    console.error(error)
    let message = "Internal server error";
    if (error instanceof CustomError) message = error.message;

    return { success: false, error: message };
  }

}