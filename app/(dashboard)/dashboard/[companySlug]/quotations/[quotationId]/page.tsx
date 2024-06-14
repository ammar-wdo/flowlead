import Heading from "@/components/heading";
import QuotationsForm from "@/components/quotaions/quotation-from";
import { CustomError } from "@/custom-error";
import prisma from "@/lib/prisma";
import { isValidObjectId } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import React from "react";

type Props = {
  params: { companySlug: string; quotationId: string };
};

const page = async ({ params: { companySlug, quotationId } }: Props) => {
  const { userId } = auth();

  if (!isValidObjectId(quotationId) && quotationId !== "new") notFound();
  if (!userId) throw new CustomError("Unauthorized");

  let quotation =
    quotationId !== "new"
      ? await prisma.quotation.findUnique({
          where: {
            id: quotationId,
            company: {
              slug: companySlug,
              userId,
            },
          },
        })
      : null;

      const company  = await prisma.company.findUnique({
        where:{
          slug:companySlug,
          userId
        },select:{
          id:true ,
          quotesSettings:{
            select:{
              id:true,
              nextNumber:true,
              prefix:true

            }
          }
        }
      })

      if(!company || !company.quotesSettings) throw new CustomError("company or quotations settings not found")

  const contactsRes =  prisma.contact.findMany({
    where: {
      company: { slug: companySlug, userId },
    }
  });

  const optionsRes =  prisma.service.findMany({
    where:{
      company: { slug: companySlug, userId },
      
    },
    select:{
      id:true,name:true,options:true
    }
  }).then(data=>data.flatMap(service=> {
    
    
   const newOption =  service.options.map(option=>({...option,serviceName:service.name,serviceId:service.id}))
   return newOption
  }))

 

  const [contacts,options] = await Promise.all([contactsRes,optionsRes])



  if (quotationId !== "new" && !quotation) return notFound();
  return (
    <div>
      <Heading title={quotation ? "Edit quotation" : "Create quotation"} />

      <div className="mt-12">
<QuotationsForm contacts={contacts} options={options} quotation={quotation} quotationSettings={company?.quotesSettings}/>
      </div>


    </div>
  );
};

export default page;
