'use client'

import { useService } from '@/hooks/service-hook'
import { PricingType, Service } from '@prisma/client'
import React from 'react'

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import QuillEditor from '../quill-editor'
import { optionSchema, pricingTypeArray } from '@/schemas'
import PricingTypeComponent, { SinglePricingType } from '../pricing-type'
import { cn } from '@/lib/utils'
import OptionItem from './option-item'
import { z } from 'zod'

type Props = {
    service: Service | undefined | null
}

const ServiceForm = ({ service }: Props) => {

    const { form, onSubmit } = useService(service)

    const handleDelete = (id: string) => {
        const newOptions = form.watch('options')
        const filteredOptions = newOptions.filter((el, i) => el.id !== id)
        form.setValue('options', filteredOptions)

    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* name */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Service Name*</FormLabel>
                            <FormControl>
                                <Input placeholder="Service name" {...field} />
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


                {/* Pricing Type */}
                <FormField
                    control={form.control}
                    name="pricingType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Pricing Type*</FormLabel>
                            <FormControl>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                                    {pricingTypeArray.map((type, i) => <PricingTypeComponent key={i} isChoosen={field.value === type} pricingType={type as SinglePricingType} onChange={(val) => field.onChange(val)} />)}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* options */}
                <FormField
                    control={form.control}
                    name="options"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Options*</FormLabel>
                            <FormControl>
                                <div>
                                    <div className='space-y-12'>
                                        {form.watch('options').map((option, i) => <OptionItem handleDelete={() => handleDelete(option.id)} name={option.name} form={form} index={i} key={option.id} />)}
                                        {form.formState.errors.options?.length && <span className='text-red-500 mt-4'>Invalid options inputs</span>}
                                    </div>

                                    <Button
                                     className='mt-8 bg-second text-white hover:bg-second/90'
                                      type='button'
                                       onClick={() => field.onChange([...form.watch('options'), { name: '', description: '', image: '', enableQuantity: false ,id:String(Date.now())} as z.infer<typeof optionSchema>])}>Add New Option</Button>
                                </div>
                            </FormControl>

                        </FormItem>
                    )}
                />
                {/* {JSON.stringify(form.watch('options'), null, 2)} */}
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}

export default ServiceForm