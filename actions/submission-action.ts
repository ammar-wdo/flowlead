'use server'
import { CustomError } from "@/custom-error";
import prisma from "@/lib/prisma";
import { generateZodSchema } from "@/lib/utils";

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
if(!validData.success) throw new CustomError("Invalid Inputs")

   

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
