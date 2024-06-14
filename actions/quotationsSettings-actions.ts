'use server'

import { CustomError } from "@/custom-error"
import prisma from "@/lib/prisma"
import { quotationsSettings } from "@/schemas"
import { auth } from "@clerk/nextjs/server"
import { z } from "zod"


export const saveQuotationsSettings = async (values: z.infer<typeof quotationsSettings>, companySlug: string) => {


    try {

        // auth
        const { userId } = auth()
        if (!userId) throw new CustomError("Unauthorized")
        // inputs validation
        const validData = quotationsSettings.safeParse(values)
        if (!validData.success) throw new CustomError("Invalid Inputs")
        // account fetch
        const account = await prisma.account.findUnique({
            where: {
                userId
            }
        })
        if (!account) throw new CustomError("Account needed")
        //fetch company id to add in the form record
        const company = await prisma.company.findUnique({
            where: {
                userId,
                slug: companySlug
            },
            select: {
                id: true,   quotesSettings:true
            }
        })
        if (!company || !company.quotesSettings ) throw new CustomError("company or quotation settings does not exist")


    
            await prisma.qoutesSettings.update({
                where:{
                    id:company.quotesSettings?.id
                },
                data:{
                    ...validData.data,
                    prefix: validData.data.prefix ?? undefined,
                    attatchments: validData.data.attatchments?.map(att => ({
                        name: att?.name ?? null,
                        type: att?.type ?? null,
                        size: att?.size ?? null,
                        url: att?.url ?? null,
                      }))
                }
            })
        

      
  
      


        return { success: true, message: "Quotations Settings Saved Successfully" }
    } catch (error) {
        console.log(error)
        let message = 'Internal server error'
        if (error instanceof CustomError)
            message = error.message

        return { success: false, error: message }
    }




}