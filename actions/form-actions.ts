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

             // extract service ids and ensure uniqueness
        const serviceIds = Array.from(new Set(validData.data.elements
            .filter(element => element.service !== undefined && element.service !== null)
            .map(element => element.service!.id)));

        //create form

        const newForm = await prisma.form.create({
            data:{
                userId,
                accountId:account.id,
                companyId:companyId.id,
                slug:randomSlug,
                ...validData.data,
                services: serviceIds 
            }
        })

            // update each related service to include the new form ID
    for (const serviceId of serviceIds) {
        const service = await prisma.service.findUnique({
          where: { id: serviceId },
          select: { forms: true },
        });
  
        if (service) {
          await prisma.service.update({
            where: { id: serviceId },
            data: { forms: Array.from(new Set([...service.forms, newForm.id])) },
          });
        }
      }
      


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

         // extract service ids from the new data and ensure uniqueness
    const newServiceIds = Array.from(new Set(validData.data.elements
        .filter((element) => element.service !== undefined && element.service !== null)
        .map((element) => element.service!.id)));

             // fetch the current form to get the current services
    const currentForm = await prisma.form.findUnique({
        where: { id: formId },
        select: { services: true },
      });
      if (!currentForm) throw new CustomError("Form not found");
  
      // determine services to be removed
      const removedServiceIds = currentForm.services.filter((serviceId) => !newServiceIds.includes(serviceId));
  
      // update services to remove the form's ID
      for (const serviceId of removedServiceIds) {
        const service = await prisma.service.findUnique({
          where: { id: serviceId },
          select: { forms: true },
        });
  
        if (service) {
          await prisma.service.update({
            where: { id: serviceId },
            data: { forms: service.forms.filter((id) => id !== formId) },
          });
        }
      }

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
                services: newServiceIds 
            }
        })

         // update new services to include the form's ID
    for (const serviceId of newServiceIds) {
        const service = await prisma.service.findUnique({
          where: { id: serviceId },
          select: { forms: true },
        });
  
        if (service && !service.forms.includes(formId)) {
          await prisma.service.update({
            where: { id: serviceId },
            data: { forms: [...service.forms, formId] },
          });
        }
      }
      


        return { success: true, message: "Form Updated Successfully" }
    } catch (error) {
        console.log(error)
        let message = 'Internal server error'
        if (error instanceof CustomError)
            message = error.message

        return { success: false, error: message }
    }




}




export const deleteForm = async (companySlug: string, formSlug: string) => {
    try {
        // auth
        const { userId } = auth();
        if (!userId) throw new CustomError("Unauthorized");

        // account fetch
        const account = await prisma.account.findUnique({
            where: { userId },
        });
        if (!account) throw new CustomError("Account needed");

        // fetch company id to add in the form record
        const company = await prisma.company.findUnique({
            where: { userId, slug: companySlug },
            select: { id: true },
        });
        if (!company) throw new CustomError("Company Id not found, check provided slug");

        // fetch form to be deleted
        const form = await prisma.form.findUnique({
            where: {
                slug: formSlug,
                userId,
                accountId: account.id,
                companyId: company.id,
            },
        });

        if (!form) throw new CustomError("Form not found");

        // remove form id from associated services
        if (form.services.length > 0) {
            for (const serviceId of form.services) {
                // Find the service to get the current forms
                const service = await prisma.service.findUnique({
                    where: { id: serviceId },
                    select: { forms: true },
                });

                if (service) {
                    // Filter out the formId from the service's forms array
                    const updatedForms = service.forms.filter(id => id !== form.id);

                    // Update the service with the filtered forms array
                    await prisma.service.update({
                        where: { id: serviceId },
                        data: { forms: updatedForms },
                    });
                }
            }
        }
// delete

        await prisma.form.delete({
            where:{
                slug:formSlug,
                userId,
                accountId:account.id,
                companyId:company.id,
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