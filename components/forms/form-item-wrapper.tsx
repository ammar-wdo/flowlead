import { ElementComponentType, formSchema } from '@/schemas'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid';

type Props = {
    elementComponent:ElementComponentType,
   form:UseFormReturn<z.infer<typeof formSchema>>
}

const FormItemWrapper = ({elementComponent,form}: Props) => {

    const {component,...element} = elementComponent

    const addFormItem = ()=>{
        element.id = uuidv4()
        const elements = form.getValues('elements');
     if(element.type==='FIELD' && element.field) {
      element.field.id = uuidv4()
     }
        form.setValue('elements',[...elements,element])
    }
  return (
    <div onClick={addFormItem} className='py-4 px-6 bg-white flex items-center cursor-pointer border   hover:border-second hover:text-second transition'>{component}</div>
  )
}

export default FormItemWrapper