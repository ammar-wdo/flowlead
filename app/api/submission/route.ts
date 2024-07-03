import { CustomError } from "@/custom-error";
import prisma from "@/lib/prisma";
import { generateZodSchema, parseDates } from "@/lib/utils";
import { Element, Rule } from "@prisma/client";
import { NextResponse } from "next/server";



const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  
  export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
  }
  

export const POST = async (req: Request) => {


console.log('Submission')
  try {


    const body = await req.json() as {   values: any;
        companyId: string;
        elements: Element[];
        rules: Rule[];
        formValues: { [key: string]: any };}

 

 const {companyId,elements,formValues,rules,values} = body

//  let paresedValues = parseDates(values)

 console.log(JSON.stringify(values,undefined,2))

    const schema = generateZodSchema(elements, rules, formValues);
  
    const validData = schema.safeParse(values);
     
    if (!validData.success) {
      console.error(
        JSON.stringify(validData.error.flatten().fieldErrors, undefined, 2)
      );

      throw new CustomError("Invalid Inputs");
    }

    const name = validData.data["Naam-field"];
    const email = validData.data["Email Adres-field"];

    if (!name || !email) throw new CustomError("name and email not found");

    //create contact of type lead
    const contact = await prisma.contact.create({
      data: {
        companyId: companyId,
        contactName: name,
        emailAddress: email,
      },
    });

    //create submition

    const submition = await prisma.submission.create({
      data: {
        contactId: contact.id,
        companyId: companyId,
        content: validData.data,
      },
    });

    
// Create Quotation

    // const quotation = await prisma.quotation.create({
    //     data:{

    //     }
    // })

    //create quotation

    return NextResponse.json({ success: true, message: "Form Submitted Successfully" },{status:200,headers:corsHeaders});
  } catch (error) {
    console.error(error);
    let message = "Internal server error";
    if (error instanceof CustomError) message = error.message;

    return NextResponse.json({ success: false, error: message },{status:200,headers:corsHeaders});
  }
};
