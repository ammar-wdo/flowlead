import React from 'react'
import Logo from './logo'
import CompanyAccordion from './company/company-accordion'

type Props = {companySlug:string}

const Aside = ({companySlug}: Props) => {
  return (
    <aside className='w-[240px] flex flex-col bg-prime'>
  <Logo/>
  <div className=' flex-1 '>
<CompanyAccordion companySlug={companySlug} />
  </div>
  </aside>
  )
}

export default Aside