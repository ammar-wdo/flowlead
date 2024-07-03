import { CustomError } from "@/custom-error";
import prisma from "@/lib/prisma";
import { generateZodSchema, parseDates } from "@/lib/utils";
import { Element, LineItem, Rule } from "@prisma/client";
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
        console.log("OBJECT BFORE PARSING",JSON.stringify(Object.entries(body.values),null,2))
        // console.log("Form Vakues",JSON.stringify(body.formValues,undefined,2))
 

 const {companyId,elements,formValues,rules,values} = body

 const company = await prisma.company.findUnique({
    where:{
        id:companyId
    }
 })

 if(!companyId || !company) throw new CustomError("Company Id is required")



 

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

    // Check for chosen services
    const availableServices = Object.entries(validData.data)
      .filter(([key, value], index) => key.endsWith('-service'))
      .map(([key, value]) => ({ [key]: value }));

      console.log("OBJECT",JSON.stringify(Object.entries(validData.data),null,2))

    // console.log("AVAILABLE SERVICES", JSON.stringify(availableServices, undefined, 2));

    if (!availableServices.length) {
      return NextResponse.json({ success: true, message: "Form Submitted Successfully" }, { status: 200, headers: corsHeaders });
    }

    // Calculate services total
    let lineItems: LineItem[] = [];
    const totalAmount = availableServices.reduce((prev: number, item) => {
      const [key, value] = Object.entries(item)[0];

      if (!Array.isArray(value) && typeof value === 'object' && value !== null && 'price' in value && 'quantity' in value && !isNaN(+(value.price as number))) {
        lineItems.push({
         id:value.id,
         name:value.name,
         price:value.price,
         quantity:value.quantity,
         taxPercentage:value.taxPercentage,

            description:value.description,
          taxAmount: (value.price * value.taxPercentage) / 100,
          totalPrice:value.price * value.quantity

        } as LineItem);
        prev += (+(value.price as number)) * (+(value.quantity as number));
      } else if (Array.isArray(value)) {
        value.forEach(el => {
          if (typeof el === 'object' && el !== null && 'price' in el && 'quantity' in el && !isNaN(+(el.price as number))) {
            lineItems.push({
                id:el.id,
                name:el.name,
                price:el.price,
                quantity:el.quantity,
                taxPercentage:el.taxPercentage,
       
                   description:el.description,
                 taxAmount: (el.price * el.taxPercentage) / 100,
                 totalPrice:el.price * el.quantity
       
               }  as LineItem);
            prev += (+(el.price as number)) * (+(el.quantity as number));
          }
        });
      }

      return prev;
    }, 0);

//   console.log("TOTAL AMOUNT",totalAmount)
//   console.log("LINE ITEMS",lineItems.length)






  



    const quotationSettings = await prisma.qoutesSettings.findUnique({
        where:{
            companyId
        },
        select:{
            attatchments:true,
            subject:true,
            footNote:true,
            dueDays:true,
            prefix:true,
            nextNumber:true,
            id:true
           
            
        }
    })
    if(!quotationSettings) throw new CustomError("Quotation settings is missing")

    const expiryDate =  new Date(
        new Date().setDate(new Date().getDate() + quotationSettings.dueDays)
      )



    
// Create Quotation

    const quotation = await prisma.quotation.create({
        data:{
userId:company.userId,
lineItems:lineItems,
companyId:company.id,
subject:quotationSettings.subject,
footNote:quotationSettings.footNote,
expiryDate:expiryDate,
quotationNumber:quotationSettings.nextNumber,
quotationString:quotationSettings.prefix,
quotationSettingsId:quotationSettings.id,
accountId:company.accountId,
contactId:contact.id,
attatchments:quotationSettings.attatchments,
totalAmount



        }
    })

    //create quotation

    return NextResponse.json({ success: true, message: "Form Submitted Successfully" },{status:200,headers:corsHeaders});
  } catch (error) {
    console.error(error);
    let message = "Internal server error";
    if (error instanceof CustomError) message = error.message;

    return NextResponse.json({ success: false, error: message },{status:200,headers:corsHeaders});
  }
};
