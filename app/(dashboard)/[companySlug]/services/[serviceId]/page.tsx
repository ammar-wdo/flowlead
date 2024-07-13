import Heading from '@/components/heading'
import ServiceForm from '@/components/services/service-form'
import { CustomError } from '@/custom-error'
import prisma from '@/lib/prisma'
import { isValidObjectId } from '@/lib/utils'
import { auth } from '@clerk/nextjs/server'
import { notFound } from 'next/navigation'
import React from 'react'

type Props = {
    params: {
        companySlug: string,
        serviceId: string
    }

}

const page = async ({ params: { companySlug, serviceId } }: Props) => {


    if (!isValidObjectId(serviceId) && serviceId !== 'new') notFound()

    const { userId } = auth()
    if (!userId) throw new CustomError("Unauthorized")
    let service

    serviceId !== 'new' ? service = await prisma.service.findUnique({
        where: {
            userId,
            id: serviceId,
            company: {
                slug: companySlug
            }
        }
    }) : null


if(serviceId !=='new' && !service) return notFound()
    return (
        <div>
            <Heading title='Add Service' />

            {/* service form  */}
            <div className='  max-w-[1000px] w-full  '>
<ServiceForm service={service}/>
            </div>
         
        </div>
    )
}

export default page