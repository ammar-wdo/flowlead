import { CustomError } from '@/custom-error'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import Image from 'next/image'
import CompanyAccordionItem from './company-accordion-items'
import { PlusCircle } from 'lucide-react'
import { Button } from '../ui/button'
import ClientModalButton from '../client-modal-button'

type Props = { companySlug: string }

const CompanyAccordion = async ({ companySlug }: Props) => {


    const { userId } = auth()
    if (!userId) throw new CustomError("Unauthorized")
    const companies = await prisma.company.findMany({
        where: {
            userId,

        },
        select: {
            slug: true,
            id: true,
            name: true,
            logo: true
        }
    })



    const company = companies.find(el => el.slug === companySlug)


    return (
        <Accordion type="single" collapsible className=''>
            <AccordionItem value="companiees" className='border-b-0'>
                <AccordionTrigger  className='h-[64px] hover:no-underline bg-primeOpacity  text-white pr-4 border-b border-[#2F394A] '>
                    <CompanyAccordionItem trigger={true} name={company?.name as string} logo={company?.logo} slug='' />


                </AccordionTrigger>
                <AccordionContent className='bg-primeOpacity pb-0'>

                    {companies.map(el => {
                        if (el.slug === companySlug) return
                        return <CompanyAccordionItem name={el.name} logo={el.logo} slug={el.slug} />
                    })}
                    <ClientModalButton modalInputs={{ type: 'company-modal' }} className='flex items-center gap-2 w-full text-white h-[64px] border-b border-[#2F394A] rounded-none justify-start  pl-[40px] bg-primeOpacity hover:bg-primeOpacity font-light capitalize text-sm '>
                        <PlusCircle size={31}/>
                        <span>Create Company</span>
                    </ClientModalButton>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

export default CompanyAccordion