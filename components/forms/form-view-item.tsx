import React, { MouseEvent } from 'react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { elementSchema, formSchema } from '@/schemas'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { v4 as uuidv4 } from 'uuid';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from '../ui/checkbox'
import { Button } from '../ui/button'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash, XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSelectedElement } from '@/hooks/selected-element-hook'

type Form = UseFormReturn<z.infer<typeof formSchema>>
type FieldType = ControllerRenderProps<z.infer<typeof formSchema>, `elements.${number}.field`>
type ServiceElementType = ControllerRenderProps<z.infer<typeof formSchema>, `elements.${number}.service`>
type Element = z.infer<typeof elementSchema>
type Props = {
    form: Form,
    i: number,
    element: Element,
    handleDelete: (id: string, e: MouseEvent<HTMLButtonElement>) => void

}






const FormViewItem = ({ form, i, element, handleDelete }: Props) => {

    const { setSelectedElement,selectedElement} = useSelectedElement()

    const handleSelectedElementClick = () => {
        setSelectedElement({ id: element.id, type: element.type })
        console.log(element)
    }

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: element.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        ...(isDragging ? { height: 'auto', width: 'auto' } : {})
    };



    if (element.type === 'SERVICE_ELEMENT') return <div

        onClick={handleSelectedElementClick}
        ref={setNodeRef}
        className={cn(' p-8 relative  group h-fit cursor-pointer', isDragging && 'z-10 opacity-60 relative',selectedElement?.id===element.id && 'bg-muted/50 rounded-lg')}
        style={style}>
        <Button size={'icon'} onClick={(e) => handleDelete(element.id, e)} type='button' variant={'ghost'}
            className="right-1  opacity-0 group-hover:opacity-100 
            transition top-1  absolute hover:bg-white
            bg-white  hover:shadow-gray-300  shadow-md rounded-lg
             text-gray-300 hover:shadow-lg flex items-center justify-center w-8 h-8  p-0.5"><XIcon  /></Button>
        <Button {...attributes} {...listeners} type='button'
            variant={'ghost'}
            className="-left-4 opacity-0 group-hover:opacity-100 transition top-1/2 -translate-y-1/2 absolute hover:bg-transparent !p-0"><GripVertical /></Button>
     
      <FormField
            control={form.control}
            name={`elements.${i}.service`}
            render={({ field }) => (
                <FormItem>

                    {!!(element.type === 'SERVICE_ELEMENT') && <ServiceViewItem i={i} form={form} field={field} />}
                
                    

                  
                </FormItem>
            )}
        />
    </div>

    else return (<div ref={setNodeRef}
        className={cn(' p-8 relative  group h-fit cursor-pointer ', isDragging && 'z-10 opacity-60 relative ',selectedElement?.id===element.id && 'bg-muted/50 rounded-lg')}
        style={style}
        onClick={handleSelectedElementClick}>
        <Button onClick={(e) => handleDelete(element.id, e)} type='button' variant={'ghost'}
            className="right-1  opacity-0 group-hover:opacity-100 
            transition top-1  absolute hover:bg-white
            bg-white  hover:shadow-gray-300  shadow-md rounded-lg
             text-gray-300 hover:shadow-lg flex items-center justify-center w-8 h-8  p-0.5"><XIcon /></Button>

        <Button {...attributes} {...listeners} type='button' variant={'ghost'}
            className="-left-4 text-gray-300 opacity-0 group-hover:opacity-100 
        transition top-1/2 -translate-y-1/2 absolute hover:bg-transparent !p-0"><GripVertical /></Button>
        <FormField
            control={form.control}
            name={`elements.${i}.field`}
            render={({ field }) => (
                <FormItem >
                    {!!(element.type === 'FIELD' && element.field?.type === "text") && <TextInputViewItem form={form} index={i}  />}
                    {!!(element.type === 'FIELD' && element.field?.type === "number") && <NumberInputViewItem form={form} index={i} placeholder={field.value?.placeholder} />}
                    {!!(element.type === 'FIELD' && element.field?.type === "checkbox") && <CheckboxInputViewItem form={form} index={i} options={field.value?.options} />}
                    {!!(element.type === 'FIELD' && element.field?.type === "radio") && <RadioInputViewItem form={form} index={i} options={field.value?.options} />}

                </FormItem>
            )}
        />
        
    </div>

    )
}

export default FormViewItem



const TextInputViewItem = ({ index, form, }: { index: number, form: Form}) => {
    return (<FormControl>
        <FormField
            control={form.control}
            name={`elements.${index}.field.label`}
            render={({ field }) => (
                <FormItem>
                    <div>
                        <div className='flex flex-col gap-1'>
                        <Label className='flex items-center gap-1'>{form.watch('elements')[index].field?.label}{form.watch('elements')[index].field?.validations?.required ?'*' : <span className='bg-muted px-2 py-1 rounded-md text-xs'>Optional</span>}</Label>
                        <Label className='text-sm text-muted-foreground font-light'>{form.watch('elements')[index].field?.hint}</Label>
                        </div>

                   
                        <Input placeholder={form.watch('elements')[index].field?.placeholder || ""} readOnly className='pointer-events-none' />
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    </FormControl>)


}


const NumberInputViewItem = ({ index, form, placeholder }: { index: number, form: Form, placeholder: string | null | undefined }) => {
    return (<FormControl>
        <FormField
            control={form.control}
            name={`elements.${index}.field.label`}
            render={({ field }) => (
                <FormItem>
                    <div>
                    <div className='flex flex-col gap-1'>
                    <Label className='flex items-center gap-1'>{form.watch('elements')[index].field?.label}{form.watch('elements')[index].field?.validations?.required ?'*' : <span className='bg-muted px-2 py-1 rounded-md text-xs'>Optional</span>}</Label>
                        <Label className='text-sm text-muted-foreground font-light'>{form.watch('elements')[index].field?.hint}</Label>
                        </div>
                        <Input placeholder={form.watch('elements')[index].field?.placeholder || ""} type='number' readOnly className='pointer-events-none' />
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    </FormControl>)

}


const SelectInputViewItem = ({ field, onChange, defaultValue }: { onChange: () => void, defaultValue: string, field: FieldType }) => {
    return <div>
        <Label>{field.value?.label}</Label>
        <Select onValueChange={onChange} defaultValue={defaultValue}>
            <FormControl>
                <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                </SelectTrigger>
            </FormControl>
            <SelectContent>
                {field.value?.options.map((option, i) => <SelectItem key={option + i} value={option}>{option}</SelectItem>)}
            </SelectContent>
        </Select>

    </div>
}

const CheckboxInputViewItem = ({ form, index, options }: { form: Form, index: number, options: string[] | undefined }) => {
    return (
        <FormControl>
            <div className='space-y-4'>

                <FormField
                    control={form.control}
                    name={`elements.${index}.field.label`}
                    render={({ field }) => (
                        <FormItem>
                            <div>
                                <Label>{field?.value}</Label>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name={`elements.${index}.field.options`}
                    render={({ field }) => (
                        <FormItem className='grid grid-cols-2 gap-3 space-y-0'>
                            {(options || []).map((item, i) => (
                                <FormField
                                    key={uuidv4()}
                                    control={form.control}
                                    name={`elements.${index}.field.options`}
                                    render={({ field: optionField }) => {

                                        return (

                                            <FormField
                                                control={form.control}
                                                name={`elements.${index}.field.options.${i}`}
                                                render={({ field }) => (
                                                    <FormItem
                                                        key={uuidv4()}
                                                        className="flex flex-row items-start space-x-3 space-y-0 p-6 border rounded-lg bg-white cursor-pointer"
                                                    >
                                                        <FormControl>

                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            {item}
                                                        </FormLabel>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                        );
                                    }}
                                />
                            ))}
                            {field.value.length === 0 && <FormMessage />}
                        </FormItem>
                    )}
                />
            </div>
        </FormControl>
    );
}


const RadioInputViewItem = ({ form, index, options }: { form: Form, index: number, options: string[] | undefined }) => {
    return (
        <FormControl>
            <div className='space-y-4'>

                <FormField
                    control={form.control}
                    name={`elements.${index}.field.label`}
                    render={({ field }) => (
                        <FormItem>
                            <div>
                                <Label>{field?.value}</Label>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name={`elements.${index}.field.options`}
                    render={({ field }) => (
                        <FormItem className='grid grid-cols-2 gap-3 space-y-0'>
                            {(options || []).map((item, i) => (
                                <FormField
                                    key={uuidv4()}
                                    control={form.control}
                                    name={`elements.${index}.field.options`}
                                    render={({ field: optionField }) => {

                                        return (

                                            <FormField
                                                control={form.control}
                                                name={`elements.${index}.field.options.${i}`}
                                                render={({ field }) => (
                                                    <FormItem
                                                        key={uuidv4()}
                                                        className="flex flex-row items-start space-x-3 space-y-0 p-6 border rounded-lg bg-white cursor-pointer"
                                                    >
                                                        <FormControl>

                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            {item}
                                                        </FormLabel>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                        );
                                    }}
                                />
                            ))}
                            {field.value.length === 0 && <FormMessage />}
                        </FormItem>
                    )}
                />
            </div>
        </FormControl>
    );
}

const ServiceViewItem = ({ field,form ,i}: { field: ServiceElementType ,form:UseFormReturn<z.infer<typeof formSchema>>,i:number}) => {
    if (!form.watch('elements')[i].service?.id) return <div className='flex p-3 text-center rounded-md border-dashed border-2  justify-center'><p className='font-semibold leading-relaxed text-muted-foreground ' >Click to choose a service</p></div>
    else return <div>

        
        <h3 className='capitalize '>service selected: <span className='text-muted-foreground'>{form.watch('elements')[i].service?.name}</span></h3>
        <div className='grid grid-cols-2 gap-3 mt-4'>
            {form.watch('elements')[i].service?.options?.map((option, i) => <div key={option.name + i} className='border rounded-lg p-4 bg-white'>
                <h4 className='capitalize'>{option.name}</h4>
                <p>€ {option.price}</p>
            </div>)}
        </div>
    </div>
}