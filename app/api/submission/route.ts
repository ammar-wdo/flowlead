import { CustomError } from "@/custom-error";
import prisma from "@/lib/prisma";
import { generateZodSchema, parseDates } from "@/lib/utils";
import { Element, LineItem, Rule } from "@prisma/client";
import axios from "axios";
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

 const company = await prisma.company.findUnique({
    where:{
        id:companyId
    },include:{
        quotesSettings:{
        select:{
            id:true,
            nextNumber:true
        }
        }
    }
 })

 if(!companyId || !company  ) throw new CustomError("Company Id is required")
    if(!company.quotesSettings) throw new CustomError("Quotation Settings is missing")



 

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

    const submissionRecievedRes = axios.post('https://hook.eu1.make.com/0h169jxparey9em9ow9w3ep1275abxdt',{
      customerName:name,
      customerEmail:email,
      company:{...company}
    })

    const confirmationRes =  axios.post('https://hook.eu1.make.com/jyyhbif7gv2vdhf2a9dvvy06jv8ezatr',{
      customerName:name,
      customerEmail:email,
      company:{...company}
    })


    const [sumDone,confDOne] = await Promise.all([submissionRecievedRes,confirmationRes])




    // Check for chosen services
    const availableServices = Object.entries(validData.data)
      .filter(([key, value], index) => key.endsWith('-service'))
      .map(([key, value]) => ({ [key]: value }));

 console.log("Available Services",JSON.stringify(availableServices))

 //check if chosen services is emty array or null or empty object then dont send quotation
    if (availableServices.every(item => {
        return Object.entries(item).every(([key, value]) => {
          if (Array.isArray(value)) {
            return value.length === 0;
          } else if (value === null) {
            return true;
          } else if (typeof value === 'object' && Object.keys(value).length === 0) {
            return true;
          }
          return false;
        });
      })) {
      return NextResponse.json({ success: true, message: "Form Submitted Successfully" }, { status: 200, headers: corsHeaders });
    }

    // Calculate services total and convert chosen services into line items
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
        prev += (+(value.price as number)) * (+(value.quantity as number)) + (value.price * value.taxPercentage) / 100;
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
            prev += (+(el.price as number)) * (+(el.quantity as number)) + (el.price * el.taxPercentage) / 100;
          }
        });
      }

      return prev;
    }, 0);








  



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

    const quotationRes =  prisma.quotation.create({
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

    //update quotation settings
  const quotationSettingsUpdateRes =    prisma.qoutesSettings.update({
        where: {
          id: company.quotesSettings.id,
        },
        data: {
          nextNumber: company.quotesSettings.nextNumber + 1,
        },
      });

      await prisma.$transaction([quotationRes,quotationSettingsUpdateRes])

    return NextResponse.json({ success: true, message: "Form Submitted Successfully" },{status:200,headers:corsHeaders});
  } catch (error) {
    console.error(error);
    let message = "Internal server error";
    if (error instanceof CustomError) message = error.message;

    return NextResponse.json({ success: false, error: message },{status:200,headers:corsHeaders});
  }
};
