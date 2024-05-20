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
import { pricingTypeArray } from '@/schemas'
import PricingTypeComponent, { SinglePricingType } from '../pricing-type'
import { cn } from '@/lib/utils'

type Props = {
    service: Service | undefined | null
}

const ServiceForm = ({ service }: Props) => {

    const { form, onSubmit } = useService(service)
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
                                    {pricingTypeArray.map((type,i) =><PricingTypeComponent key={i} isChoosen={field.value===type}  pricingType={type as SinglePricingType} onChange={(val)=>field.onChange(val)}/>)}
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
                                {field.value.map((option,i)=><div key={i}>{option.name}</div>)}
                                <Button type='button' onClick={()=>field.onChange([...field.value,{name:'Option ' + (field.value.length+1)}])}>Add Option</Button>
                                </div>
                            
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}

export default ServiceForm