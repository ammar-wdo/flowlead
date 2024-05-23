import React from 'react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { elementSchema, formSchema } from '@/schemas'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from '../ui/checkbox'



type Element = z.infer<typeof elementSchema>
type Props = {
    form: UseFormReturn<z.infer<typeof formSchema>>,
    i: number,
    element: Element

}



const TextInputViewItem = ({element}: {element:Element}) => {
    return ( <FormControl>
        <div>
        <Label>{element.field?.label}</Label>
            <Input placeholder={element.field?.placeholder || "Text Input"} readOnly className='pointer-events-none' />
        </div>
           
        </FormControl>)

   
}


const NumberInputViewItem = ({element}: {element:Element}) => {
    return ( <FormControl>
             <div>
            <Label>{element.field?.label}</Label>
            <Input placeholder={element.field?.placeholder || "Numeric Input"} readOnly className='pointer-events-none' type='number' />
            </div>
        </FormControl>)
  
}


const SelectInputViewItem = ({element,onChange,defaultValue}:{element: Element, onChange: () => void, defaultValue: string}) => {
    return <div>
        <Label>{element.field?.label}</Label>
        <Select onValueChange={onChange} defaultValue={defaultValue}>
            <FormControl>
                <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                </SelectTrigger>
            </FormControl>
            <SelectContent>
                {element.field?.options.map((option, i) => <SelectItem key={option + i} value={option}>{option}</SelectItem>)}
            </SelectContent>
        </Select>

    </div>
}

const CheckboxInputViewItem = ({element}: {element:Element}) => {
    return  (<FormControl>
        <div className='space-y-4 ' >
            <FormLabel>{element.field?.label}</FormLabel>
         
            {element.field?.options.map((option,i) => <div key={option+i} className='flex items-center gap-3'> <Checkbox

/><Label>{option}</Label></div>)}
            </div>
      

        </FormControl>)

   
}

const ServiceViewItem = ({element}: {element:Element}) => {
    if(!element.service?.id) return <div className='flex items-center justify-center p-4 border'>choose service</div>
    return <div>
        <h3>{element.service?.name}</h3>
        <div className='gird grid-2 gap-3'>
            {element.service?.options.map((option, i) => <div key={option.name + i} className='border rounded-lg'>
                <h4>{option.name}</h4>
                <p>€ {option.price}</p>
            </div>)}
        </div>
    </div>
}


const FormViewItem = ({ form, i, element }: Props) => {

    const fieldName = element.type === 'FIELD' ? `elements.${i}.field` as const : `elements.${i}.service` as const


    return (
        <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
                <FormItem>
                 
{!!(element.type==='SERVICE_ELEMENT') && <ServiceViewItem element={element}/>}
{!!(element.type==='FIELD' && element.field?.type==="text") && <TextInputViewItem  element={element}/>}
{!!(element.type==='FIELD' && element.field?.type==="number") && <NumberInputViewItem element={element}/>}
{!!(element.type==='FIELD' && element.field?.type==="checkbox") && <CheckboxInputViewItem element={element}/>}




                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default FormViewItem