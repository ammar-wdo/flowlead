import { controllerElements, formSchema } from '@/schemas'
import { Form } from '@prisma/client'
import React, { MouseEvent, useRef, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import FormItemWrapper from './form-item-wrapper'
import { Button } from "@/components/ui/button"
import { v4 as uuidv4 } from 'uuid';
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
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import Scroller from '../scroller'
import { useSelectedElement } from '@/hooks/selected-element-hook'

type Props = {
  fetchedForm: Form | null | undefined,
  form: UseFormReturn<z.infer<typeof formSchema>>,
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<string | number | undefined>
}

const FieldsComponent = ({ fetchedForm, form, onSubmit }: Props) => {
  const previousVar = useRef(1)

  const {selectedElement,setSelectedElementNull} = useSelectedElement()

  const handleDelete = (id: string,e:MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    const newOptions = form.watch('elements')
    const filteredOptions = newOptions.filter((el, i) => el.id !== id)
    form.setValue('elements', filteredOptions)
    previousVar.current--
  
    if(selectedElement && id===selectedElement.id){

      setSelectedElementNull()
    }

}
  const isLoading = form.formState.isSubmitting

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {

      const items = form.watch('elements')
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      const newElements = arrayMove(items, oldIndex, newIndex);

      form.setValue('elements', newElements)
 
        ;
    }
  };

  return (
 


    <section className='flex 2xl:gap-40 gap-20 relative min-h-screen'>

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
              <DndContext
                sensors={useSensors(
                  useSensor(PointerSensor),
                  useSensor(KeyboardSensor, {
                    coordinateGetter: sortableKeyboardCoordinates,
                  })
                )}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={form.watch('elements')}>
                  <div className='bg-white p-8 space-y-8'>
                    <FormField
                      control={form.control}
                      name="elements"
                      render={({ field }) => (
                        <FormItem>

                          <FormControl>

                            <div className=''>
                              {!field.value.length ? <div className='text-muted-foreground border-dashed p-8 flex items-center justify-center border-2 '>Start by drag and drop a field...</div>
                                : field.value.map((element, i) => <div key={element.id}>
                                  <FormViewItem  handleDelete={(id:string,e:MouseEvent<HTMLButtonElement>)=>handleDelete(id,e)} element={element} form={form} i={i} />
                                </div>)

                              }

                            </div>

                          </FormControl>

                          {form.formState.errors.elements && form.watch('elements').length===0 && <span className='text-red-500 mt-3'>At least one field or service</span>}
                       

                        </FormItem>
                      )}
                    />

                  </div>
                </SortableContext>
        
              
              </DndContext>
              <LoadingButton isLoading={isLoading} title='Submit' />
            </form>
          </FormComponent>
        </div>
        <Scroller variable={form.watch('elements').length} previousVar={previousVar}/>
      </div>

      {/* right part _controller_ */}
    

     
      {!selectedElement ? <div className=' space-y-6 shrink-0'>
        {controllerElements.map(element => <div >
          <h3 className='text-sm text-muted-foreground'>{element.section}</h3>
          <div className='grid grid-cols-2 gap-4 mt-2'>
            {element.elements.map(elementComponent => <FormItemWrapper key={uuidv4()} elementComponent={elementComponent} form={form} />)}
          </div>

        </div>)}
      </div> : <div>{selectedElement.type}</div>}
  
    </section>
    
  )
}

export default FieldsComponent






