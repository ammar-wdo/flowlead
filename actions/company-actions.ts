'use server'

import { CustomError } from "@/custom-error"
import prisma from "@/lib/prisma"
import { generateRandomSlug } from "@/lib/utils"
import { companySchema } from "@/schemas"
import { auth } from "@clerk/nextjs/server"
import { z } from "zod"

export const addCompany = async (values: z.infer<typeof companySchema>) => {


    try {

        // auth
        const { userId } = auth()
        if (!userId) throw new CustomError("Unauthorized")



// inputs validation
        const validData = companySchema.safeParse(values)
        if (!validData.success) throw new CustomError("Invalid Inputs")



//check if email exists
            const emailExists = await prisma.company.findUnique({
                where:{
                    companyEmail:validData.data.companyEmail
                }
            })

            if(emailExists) throw new CustomError("This email  already exists")




            // account fetch
        const account = await prisma.account.findUnique({
            where: {
                userId
            }
        })

        if (!account) throw new CustomError("Account needed")


// determine attempts number for slug creation loop
        let attempts = 0;
        const maxAttempts = 10




//slug creation and validation
        let randomSlug = generateRandomSlug() 
        let slugExist = await prisma.company.findUnique({
            where: {
                slug: randomSlug
            }
        }) 


//slug check loop
        while (slugExist && attempts < maxAttempts) {
            randomSlug = generateRandomSlug()
            slugExist = await prisma.company.findUnique({
                where: {
                    slug: randomSlug
                }
            })

            attempts++
        }





// to prevent infinite loop for slug creation
        if (attempts === maxAttempts) throw new CustomError("Failed to generate slug")

//create company
     const company =    await prisma.company.create({
            data: {
                userId,
                ...validData.data,
                accountId: account.id,
                slug: randomSlug,
                invoiceSettings: {

                },
             


            }
        })


        return { success: true, message: "Company Created Successfully",slug:company.slug }



    } catch (error) {
        console.log(error)
        let message = 'Internal server error'
        if (error instanceof CustomError)
            message = error.message

        return { success: false, error: message }
    }




}

export const editCompany  =async (values: z.infer<typeof companySchema>,companySlug:string)=>{

    try {

        // auth
        const { userId } = auth()
        if (!userId) throw new CustomError("Unauthorized")

if(!companySlug)throw new CustomError("Company slug is required")

// inputs validation
        const validData = companySchema.safeParse(values)
        
        if (!validData.success) throw new CustomError("Invalid Inputs")
            console.log(validData.error)




//check if email exists
            const emailExists = await prisma.company.findUnique({
                where:{
                    NOT:{
                        slug:companySlug
                    },
                    companyEmail:validData.data.companyEmail
                }
            })

            if(emailExists) throw new CustomError("This email  already exists")




            // account fetch
        const account = await prisma.account.findUnique({
            where: {
                userId
            }
        })

        if (!account) throw new CustomError("Account needed")


// // determine attempts number for slug creation loop
//         let attempts = 0;
//         const maxAttempts = 10




// //slug creation and validation
//         let randomSlug = generateRandomSlug() 
//         let slugExist = await prisma.company.findUnique({
//             where: {
//                 slug: randomSlug
//             }
//         }) 


// //slug check loop
//         while (slugExist && attempts < maxAttempts) {
//             randomSlug = generateRandomSlug()
//             slugExist = await prisma.company.findUnique({
//                 where: {
//                     slug: randomSlug
//                 }
//             })

//             attempts++
//         }





// // to prevent infinite loop for slug creation
//         if (attempts === maxAttempts) throw new CustomError("Failed to generate slug")

//create company
     const company =    await prisma.company.update({
        where:{
            slug:companySlug,
            userId
        },
            data: {
             ...validData.data
            }
        })


        return { success: true, message: "Company Updated Successfully"}



    } catch (error) {
        console.log(error)
        let message = 'Internal server error'
        if (error instanceof CustomError)
            message = error.message

        return { success: false, error: message }
    }



}




