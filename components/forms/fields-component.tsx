import { controllerElements, formSchema } from '@/schemas'
import { Form } from '@prisma/client'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import FormItemWrapper from './form-item-wrapper'
import { Button } from "@/components/ui/button"
import {
  Form as FormComponent,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import QuillEditor from '../quill-editor'
import LoadingButton from '../loading-button'
import { Label } from '../ui/label'
import FormViewItem from './form-view-item'

type Props = {
  fetchedForm: Form | null | undefined,
  form: UseFormReturn<z.infer<typeof formSchema>>,
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<string | number | undefined>
}

const FieldsComponent = ({ fetchedForm, form, onSubmit }: Props) => {
const isLoading = form.formState.isSubmitting

  return (
    <section className='flex 2xl:gap-40 gap-20'>

      {/* left part _canvas_ */}
      <div className='flex-1 '>
        <div className='max-w-[1100px]'>

          <FormComponent {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Form name */}
              <div className='bg-white p-8 space-y-8'>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Form Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Form Name" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Description <span className='text-muted-foreground'>(optional)</span></FormLabel>
                      <FormControl>
                        <QuillEditor value={field.value || ''} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
{/* Form Elements */}
              <div className='bg-white p-8 space-y-8'>
              <FormField
                  control={form.control}
                  name="elements"
                  render={({ field }) => (
                    <FormItem>
                    
                      <FormControl>
                    <div className='space-y-8'>
                      {!field.value.length  ? <div className='text-muted-foreground border-dashed p-8 flex items-center justify-center border-2 '>Start by drag and drop a field...</div> 
                      : field.value.map((element,i)=><div key={i}>
                        <FormViewItem  element={element} form={form} i={i}/>
                      </div>)
                    
                    }

                    </div>
                      </FormControl>

                      {form.formState.errors.elements && form.formState.errors.elements.message && <FormMessage />}
                     
                    </FormItem>
                  )}
                />
              
              </div>

              <LoadingButton isLoading={isLoading} title='Submit'/>
            </form>
          </FormComponent>
        </div>
      </div>

      {/* right part _controller_ */}
      <div className=' space-y-6 shrink-0'>
        {controllerElements.map(element => <div >
          <h3 className='text-sm text-muted-foreground'>{element.section}</h3>
          <div className='grid grid-cols-2 gap-4 mt-2'>
            {element.elements.map(elementComponent => <FormItemWrapper key={elementComponent.type} elementComponent={elementComponent} form={form} />)}
          </div>

        </div>)}
      </div>

    </section>
  )
}

export default FieldsComponent






