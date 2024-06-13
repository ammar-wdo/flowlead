'use client'
import { useParams, usePathname } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { CgMagnet } from "react-icons/cg";
import { MdDashboard } from "react-icons/md";
import { GoPersonFill } from "react-icons/go";
import { FaBoxArchive } from "react-icons/fa6";
import { FaThList } from "react-icons/fa";
import { FaReceipt } from "react-icons/fa6";
import { BsExclamationSquareFill } from "react-icons/bs";
import { RiSettings3Fill } from "react-icons/ri";
import { FaBolt } from "react-icons/fa";

type Props = {

}

const AsideLinks = (props: Props) => {

    const pathname = usePathname()
    const params: { companySlug: string } = useParams()

    const links = [
        {
            title: 'Menu',
            elements: [
                {
                    title: 'Dashboard',
                    icon: <MdDashboard size={18} />,
                    href: `/dashboard/${params.companySlug}`,
                    active: pathname === `/dashboard/${params.companySlug}`
                },
                {
                    title: 'Leads',
                    icon: <CgMagnet size={18} />,
                    href: `/dashboard/${params.companySlug}/leads`,
                    active: pathname.split('/')[3] === 'leads'
                },
                {
                    title: 'Contacts',
                    icon: <GoPersonFill size={18} />,
                    href: `/dashboard/${params.companySlug}/contacts`,
                    active: pathname.split('/')[3] === 'contacts'
                },
            ]
        },
        {
            title: 'Setup',
            elements: [
                {
                    title: 'Services',
                    icon: <FaBoxArchive size={18} />,
                    href: `/dashboard/${params.companySlug}/services`,
                    active: pathname === `/dashboard/${params.companySlug}/services`
                },
                {
                    title: 'Forms',
                    icon: <FaThList size={18} />,
                    href: `/dashboard/${params.companySlug}/forms`,
                    active: pathname === `/dashboard/${params.companySlug}/forms`
                },
                {
                    title: 'Invoices',
                    icon: <FaReceipt size={18} />,
                    href: `/dashboard/${params.companySlug}/invoices`,
                    active: pathname === `/dashboard/${params.companySlug}/invoices`
                },
                {
                    title: 'Quotations',
                    icon: <BsExclamationSquareFill size={18} />,
                    href: `/dashboard/${params.companySlug}/quotations`,
                    active: pathname === `/dashboard/${params.companySlug}/quotations`
                },
            ]
        },
        {
            title: 'More',
            elements: [
                {
                    title: 'Settings',
                    icon: <RiSettings3Fill size={18} />,
                    href: `/dashboard/${params.companySlug}/settings`,
                    active: pathname.split('/')[3] === 'settings'
                },
                {
                    title: 'Upgrade',
                    icon: <FaBolt size={18} />,
                    href: `/dashboard/${params.companySlug}/upgrade`,
                    active: pathname === `/dashboard/${params.companySlug}/upgrade`
                },
            ]
        },
    ]
    return (
        <section >
            {
                links.map(link => <article key={link.title}>
                    <h3 className='text-white opacity-60 pl-[20px] text-[12px]  mt-8 mb-3 uppercase font-light'>{link.title}</h3>
                    {link.elements.map(el => <Link key={el.title} className={cn('gap-4 px-[20px] py-[12px] flex items-center text-[14px]   tracking-wide rounded-md transition hover:bg-white/10 text-white/60 mb-1', el.active && 'bg-white/10 text-white')} href={el.href}>
                        {el.icon}
                        <p >{el.title}</p>
                        </Link>)}
                </article>)
            }
        </section>
    )
}

export default AsideLinks