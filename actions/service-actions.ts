'use server'

import { CustomError } from "@/custom-error"
import prisma from "@/lib/prisma"
import { generateRandomSlug } from "@/lib/utils"
import { serviceSchema } from "@/schemas"
import { auth } from "@clerk/nextjs/server"
import { z } from "zod"

export const addService = async (values: z.infer<typeof serviceSchema>, companySlug: string) => {


    try {

        // auth
        const { userId } = auth()
        if (!userId) throw new CustomError("Unauthorized")
        // inputs validation
        const validData = serviceSchema.safeParse(values)
        if (!validData.success) throw new CustomError("Invalid Inputs")
        // account fetch
        const account = await prisma.account.findUnique({
            where: {
                userId
            }
        })
        if (!account) throw new CustomError("Account needed")
        //fetch company id to add in the service record
        const companyId = await prisma.company.findUnique({
            where: {
                userId,
                slug: companySlug
            },
            select: {
                id: true
            }
        })
        if (!companyId) throw new CustomError("Company Id not found,check provided slug")
        //create service
        const service = await prisma.service.create({
            data: {
                userId,
                companyId: companyId.id,
                ...validData.data,
                accountId: account.id


            }
        })


        return { success: true, message: "Service Created Successfully" }
    } catch (error) {
        console.log(error)
        let message = 'Internal server error'
        if (error instanceof CustomError)
            message = error.message

        return { success: false, error: message }
    }




}