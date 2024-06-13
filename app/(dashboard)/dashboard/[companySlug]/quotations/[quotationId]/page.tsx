import { CustomError } from '@/custom-error';
import prisma from '@/lib/prisma';
import { isValidObjectId } from '@/lib/utils';
import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import React from 'react'

type Props = {
    params:{companySlug:string,quotationId:string}
}

const page = async({params:{companySlug,quotationId}}: Props) => {

    const { userId } = auth();

  if (!isValidObjectId(quotationId) && quotationId !== "new") notFound();
  if (!userId) throw new CustomError("Unauthorized");

  let contact =
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

  if (quotationId !== "new" && !contact) return notFound();
  return (
    <div>page</div>
  )
}

export default page