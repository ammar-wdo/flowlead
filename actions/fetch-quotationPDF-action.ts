'use server'

import { CustomError } from "@/custom-error"
import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export const fetchQuotationPDF = async({quotationId,companySlug}:{quotationId:string,companySlug:string})=>{
try {

    const {userId} = auth()
    if(!userId) throw new CustomError(" Unauthorized")

        if(!quotationId || !companySlug) throw new CustomError("quotationId or company slug is missing")

            const account = await prisma.account.findUnique({
                where:{
                    userId
                }
            })

            if(!account) throw new CustomError("account not found")

                const quotation = await prisma.quotation.findUnique({
                    where:{
                        id:quotationId,
                        userId,
                        company:{
                            slug:companySlug
                        }
                    }
                })

                return {success:true,quotation}
    
} catch (error) {
    console.error(error)
    let message = "Internal server error"

    if(error instanceof CustomError){
        message = error.message

    }

    return {success:false,error:message}
}

}