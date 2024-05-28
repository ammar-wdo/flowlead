'use client'

import { Form, Service } from '@prisma/client'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import FieldsComponent from './fields-component'
import RulesComponent from './rules-compoent'
import { useFormElements } from '@/hooks/form-elements-hook'
import { useSelectedElement } from '@/hooks/selected-element-hook'

type Props = {
  fetchedForm: Form | null | undefined
  services:Service[]
}

const FormRuleWrapper = ({ fetchedForm ,services}: Props) => {

  const [activeComponent, setActiveComponent] = useState<'fields' | 'rules'>('fields')
  const { form, onSubmit } = useFormElements(fetchedForm)
  const {setSelectedElementNull} = useSelectedElement()


  return (
    <div>
      <div className='flex items-center'>
        <Button onClick={() => setActiveComponent('fields')} className={cn('hover:bg-transparent rounded-none border-b-2 text-muted-foreground text-sm   border-transparent', activeComponent === "fields" && ' border-black ')} variant={'ghost'}>Fields</Button>
        <Button onClick={() => setActiveComponent('rules')} className={cn('hover:bg-transparent rounded-none border-b-2  text-muted-foreground text-sm  border-transparent', activeComponent === "rules" && ' border-black ')} variant={'ghost'}>Rules</Button>
      </div>
      {/* form rules components */}
      <div className='mt-4'>
        {activeComponent === 'fields' ? <FieldsComponent fetchedForm={fetchedForm} services={services} onSubmit={onSubmit} form={form}  /> : <RulesComponent form={form} fetchedForm={fetchedForm} />}
      </div>



    </div>
  )
}

export default FormRuleWrapper