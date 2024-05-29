'use server'

import { CustomError } from "@/custom-error"
import prisma from "@/lib/prisma"
import { generateRandomSlug } from "@/lib/utils"
import { formSchema } from "@/schemas"
import { auth } from "@clerk/nextjs/server"
import { z } from "zod"

export const addForm = async (values: z.infer<typeof formSchema>, companySlug: string) => {


    try {

        // auth
        const { userId } = auth()
        if (!userId) throw new CustomError("Unauthorized")
        // inputs validation
        const validData = formSchema.safeParse(values)
        if (!validData.success) throw new CustomError("Invalid Inputs")
        // account fetch
        const account = await prisma.account.findUnique({
            where: {
                userId
            }
        })
        if (!account) throw new CustomError("Account needed")
        //fetch company id to add in the form record
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
// determine attempts number for slug creation loop
        let attempts = 0;
        const maxAttempts = 10




//slug creation and validation
        let randomSlug = generateRandomSlug() 
        let slugExist = await prisma.form.findUnique({
            where: {
                slug: randomSlug
            }
        }) 


//slug check loop
        while (slugExist && attempts < maxAttempts) {
            randomSlug = generateRandomSlug()
            slugExist = await prisma.form.findUnique({
                where: {
                    slug: randomSlug
                }
            })

            attempts++
        }





// to prevent infinite loop for slug creation
        if (attempts === maxAttempts) throw new CustomError("Failed to generate slug")

            // extratct services ids

            const serviceIds = validData.data.elements
            .filter(element => element.service !== undefined && element.service !== null)
            .map(element => element.service!.id)

        //create form

        const newForm = await prisma.form.create({
            data:{
                userId,
                accountId:account.id,
                companyId:companyId.id,
                slug:randomSlug,
                ...validData.data,
                services:{
                    connect:serviceIds.map(id=>({id}))
                }
            }
        })
      


        return { success: true, message: "Form Created Successfully" }
    } catch (error) {
        console.log(error)
        let message = 'Internal server error'
        if (error instanceof CustomError)
            message = error.message

        return { success: false, error: message }
    }




}


export const editForm = async (values: z.infer<typeof formSchema>, companySlug: string,formId:string) => {


    try {

        // auth
        const { userId } = auth()
        if (!userId) throw new CustomError("Unauthorized")
        // inputs validation
        const validData = formSchema.safeParse(values)
        if (!validData.success) throw new CustomError("Invalid Inputs")
        // account fetch
        const account = await prisma.account.findUnique({
            where: {
                userId
            }
        })
        if (!account) throw new CustomError("Account needed")
        //fetch company id to add in the form record
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

            //extract services ids
            const serviceIds = validData.data.elements
            .filter(element => element.service !== undefined && element.service !== null)
            .map(element => element.service!.id);

        //update form

        const updatedForm = await prisma.form.update({
            where:{
                id:formId,
                userId,
                accountId:account.id,
                companyId:companyId.id,
            },
            data:{
              
              
                ...validData.data,
                services:{
                    set:[],
                    connect:serviceIds.map(id=>({id}))
                }
            }
        })
      


        return { success: true, message: "Form Updated Successfully" }
    } catch (error) {
        console.log(error)
        let message = 'Internal server error'
        if (error instanceof CustomError)
            message = error.message

        return { success: false, error: message }
    }




}




export const deleteForm = async (values: z.infer<typeof formSchema>, companySlug: string,formId:string) => {


    try {

        // auth
        const { userId } = auth()
        if (!userId) throw new CustomError("Unauthorized")
        // account fetch
        const account = await prisma.account.findUnique({
            where: {
                userId
            }
        })
        if (!account) throw new CustomError("Account needed")
        //fetch company id to add in the form record
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

        

        //set connected services to 0

        const updatedForm = await prisma.form.update({
            where:{
                id:formId,
                userId,
                accountId:account.id,
                companyId:companyId.id,
            },
            data:{
                services:{
                    set:[], 
                }
            }
        })
// delete

        await prisma.form.delete({
            where:{
                id:formId,
                userId,
                accountId:account.id,
                companyId:companyId.id,
            }
        })
      


        return { success: true, message: "Form Deleted Successfully" }
    } catch (error) {
        console.log(error)
        let message = 'Internal server error'
        if (error instanceof CustomError)
            message = error.message

        return { success: false, error: message }
    }




}