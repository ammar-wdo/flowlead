import React from 'react'
import Logo from './logo'
import CompanyAccordion from './company/company-accordion'
import AsideLinks from './aside-links'
import { SignOutButton } from './signout-button'

type Props = {companySlug:string}

const Aside = ({companySlug}: Props) => {
  return (
    <aside className='w-[240px] flex flex-col bg-prime fixed left-0 h-full overflow-y-auto scroll z-20 pb-8'>
  <Logo companySlug={companySlug}/>

  {/* aside content */}

  <div className=' flex-1 '>
<CompanyAccordion companySlug={companySlug} />
{/* aside links */}
<div className='px-[20px] mt-12'>
<AsideLinks/>
</div>
  </div>
  <div className='mt-auto px-[20px] '>
      <SignOutButton/>
  </div>


  </aside>
  )
}

export default Aside