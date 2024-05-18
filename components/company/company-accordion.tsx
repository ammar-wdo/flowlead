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

type Props = { companySlug: string }

const CompanyAccordion = async ({ companySlug }: Props) => {


    const { userId } = auth()
    if (!userId) throw new CustomError("Unauthorized")
    const companiesRes = prisma.company.findMany({
        where: {
            userId,
            NOT: {
                slug: companySlug
            }
        }
    })


    const companyRes = prisma.company.findUnique({
        where: {
            userId,
            slug: companySlug
        }
    })

    const [companies, company] = await Promise.all([companiesRes, companyRes])


    return (
        <Accordion type="single" collapsible className=''>
            <AccordionItem value="companiees" className='border-b-0'>
                <AccordionTrigger className='text-white h-[64px] hover:no-underline pl-[40px] bg-primeOpacity font-light capitalize text-sm pr-4'>
                    <CompanyAccordionItem name={company?.name as string} logo={company?.logo} />


                </AccordionTrigger>
                <AccordionContent className='bg-primeOpacity pb-0'>

                    {companies.map(el => <CompanyAccordionItem name={el.name} logo={el.logo} />)}
                    <div className='flex items-center gap-3 h-[64px] pl-[40px] text-white '>
                        <PlusCircle/>
<span>Create Company</span>                       
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

export default CompanyAccordion