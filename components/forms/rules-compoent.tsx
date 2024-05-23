import { formSchema } from '@/schemas'
import { Form } from '@prisma/client'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

type Props = {
  fetchedForm:Form | undefined | null
  form:UseFormReturn<z.infer<typeof formSchema>>
}

const RulesComponent = ({fetchedForm}: Props) => {
  return (
    <div>RulesComponent</div>
  )
}

export default RulesComponent