'use server'
import { CustomError } from "@/custom-error";
import prisma from "@/lib/prisma";
import { generateZodSchema } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";

import { Rule, Element } from "@prisma/client";


export const createSubmission = async ({
  values,
  companyId,
  elements,
  rules,
  formValues,
}: {
  values: any;
  companyId: string;
  elements: Element[];
  rules: Rule[];
  formValues: { [key: string]: any };
}) => {
  try {

const schema = generateZodSchema(elements,rules,formValues)

const validData = schema.safeParse(values)
console.log(JSON.stringify(values,undefined,2))
if(!validData.success){ 
  console.error(JSON.stringify(validData.error.flatten().fieldErrors,undefined,2))

  throw new CustomError("Invalid Inputs")
 }

   

   const name = validData.data["Naam-field"]
   const email =validData.data['Email Adres-field']

   if(!name || !email) throw new CustomError("name and email not found")

//create contact of type lead
const contact = await prisma.contact.create({
    data:{
        companyId:companyId,
        contactName:name,
        emailAddress:email,
     
    }
})

//create submition

const submition = await prisma.submission.create({
    data:{
        contactId:contact.id,
        companyId:companyId,
        content:validData.data,

    }
})

//create quotation


    return {success:true,message:"Form Submitted Successfully"}



  } catch (error) {
console.error(error)
let message = "Internal server error";
if (error instanceof CustomError) message = error.message;

return { success: false, error: message };


  }
};



export const deleteSubmission = async ({
   
  companySlug,
  id
}: {

  companySlug: string;
  id:string
}) => {
  try {
    const { userId } = auth();
    if (!userId) throw new CustomError("Unauthorized");

    const company = await prisma.company.findUnique({
      where: {
        userId,
        slug: companySlug,
      },
      select: {
        id: true,
      },
    });

    if (!company) throw new CustomError("company not found");

    await prisma.submission.delete({
      where:{
          id,
          companyId:company.id
      }
    })

    return { success: true, message: "Submission successfully deleted" };
  } catch (error) {
    console.error(error);
    let message = "Internal server error";
    if (error instanceof CustomError) message = error.message;

    return { success: false, error: message };
  }
};