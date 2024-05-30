import { formSchema, ruleSchema } from '@/schemas'
import { Form } from '@prisma/client'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { v4 as uuidv4 } from "uuid";
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'

type Props = {
  fetchedForm:Form | undefined | null
  form:UseFormReturn<z.infer<typeof formSchema>>
}

type Rule = z.infer<typeof ruleSchema>

const RulesComponent = ({fetchedForm,form}: Props) => {

  const addRule = ()=>{
    const rules = form.watch('rules') || []
    form.setValue('rules', [
      ...rules,
      {
        conditions: [
          { value: '', field: '', operator: 'CONTAINS', logicalOperator: 'AND' }
        ],
        then: { field: '', action: 'SHOW' }
      }
    ])
  }
  return (
    <div>
      {form.watch('rules')?.map((rule,i)=>
      <div key={uuidv4()}>
{i}

      </div>)}
      <Button onClick={addRule} className='text-indigo-500' variant={'link'}><Plus className='mr-2'/>Add Rule</Button>
    </div>
  )
}

export default RulesComponent