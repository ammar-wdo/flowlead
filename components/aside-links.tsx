'use client'
import { useParams, usePathname } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import Image from 'next/image'

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
                    icon: '/dashboard.png',
                    href: `/dashboard/${params.companySlug}`,
                    active: pathname === `/dashboard/${params.companySlug}`
                },
            ]
        },
        {
            title: 'Setup',
            elements: [
                {
                    title: 'Services',
                    icon: '/services.png',
                    href: `/dashboard/${params.companySlug}/services`,
                    active: pathname === `/dashboard/${params.companySlug}/services`
                },
                {
                    title: 'Forms',
                    icon: '/forms.png',
                    href: `/dashboard/${params.companySlug}/forms`,
                    active: pathname === `/dashboard/${params.companySlug}/forms`
                },
                {
                    title: 'Invoices',
                    icon: '/invoices.png',
                    href: `/dashboard/${params.companySlug}/invoices`,
                    active: pathname === `/dashboard/${params.companySlug}/invoices`
                },
                {
                    title: 'Qoutations',
                    icon: '/quotations.png',
                    href: `/dashboard/${params.companySlug}/qoutations`,
                    active: pathname === `/dashboard/${params.companySlug}/qoutations`
                },
            ]
        },
        {
            title: 'More',
            elements: [
                {
                    title: 'Settings',
                    icon: '/settings.png',
                    href: `/dashboard/${params.companySlug}/settings`,
                    active: pathname === `/dashboard/${params.companySlug}/settings`
                },
                {
                    title: 'Upgrade',
                    icon: '/upgrade.png',
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
                    <h3 className='text-white opacity-60 pl-[20px] text-[11px]  mt-8 mb-3 uppercase font-light'>{link.title}</h3>
                    {link.elements.map(el => <Link key={el.title} className={cn('gap-4 px-[20px] py-[12px] flex items-center text-[12px]  tracking-wide rounded-md transition hover:bg-white/10 text-white/60 mb-1', el.active && 'bg-white/10')} href={el.href}>
                        <Image alt='icon' src={el.icon} width={15} height={15} className={cn(!el.active && 'opacity-60')} />
                        <p className={cn(el.active && 'text-white')}>{el.title}</p>
                        </Link>)}
                </article>)
            }
        </section>
    )
}

export default AsideLinks