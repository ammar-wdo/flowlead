'use client'

import { optionSchema, serviceSchema } from "@/schemas";
import { ChangeEvent, useState } from "react";
import { z } from "zod";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { useLogo } from "@/hooks/logo-hook";
import { SingleImageDropzone } from "../single-image-dropeZone";
import { Button } from "../ui/button";
import { useOptionLogo } from "@/hooks/option-logo-hook";
import { GripVertical, XIcon } from "lucide-react";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from "@/lib/utils";



type Props = {


    id: string
    index: number,
    handleDelete: () => void
    form: UseFormReturn<z.infer<typeof serviceSchema>>
}

const OptionItem = ({ index, form, id, handleDelete }: Props) => {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };


    const { ImagePlaceholder, file, setFile, uploadImage } = useOptionLogo({ form, index })

    return (
        <article ref={setNodeRef} style={style}  className={cn("grid grid-cols-1 md:grid-cols-2 gap-8 relative group  bg-white p-3 rounded-lg",isDragging && 'z-10 opacity-60 relative  ')}>
            <Button {...attributes} {...listeners} type='button' variant={'ghost'} className="-left-4 opacity-0 group-hover:opacity-100 transition top-1/2 -translate-y-1/2 absolute hover:bg-transparent !p-0"><GripVertical/></Button>
            {/* first column */}
            <div className="space-y-3">
                <div className="flex items-start gap-4">
                    <FormField
                        control={form.control}
                        name={`options.${index}.name`}
                        render={({ field }) => (
                            <FormItem className="space-y-0 flex-1">

                                <FormControl>
                                    <Input placeholder="Option name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`options.${index}.price`}
                        render={({ field }) => (
                            <FormItem className="space-y-0 flex-1">

                                <FormControl>
                                    <Input type="number" placeholder="Option Price" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>
                <FormField
                    control={form.control}
                    name={`options.${index}.description`}
                    render={({ field }) => (
                        <FormItem>

                            <FormControl>
                                <Textarea rows={10} className="resize-none" placeholder="Option description" {...field} value={field.value || ''} onChange={(e) => field.onChange(e.target.value || '')} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            {/* second column */}
            <div className="flex flex-col justify-between">
                <FormField
                    control={form.control}
                    name={`options.${index}.enableQuantity`}
                    render={({ field }) => (
                        <FormItem className="space-y-0 flex-1 flex items-start gap-1">

                            <FormControl>

                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />

                            </FormControl>
                            <FormLabel >
                                Enable Quantity
                            </FormLabel>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={`options.${index}.image`}
                    render={({ field }) => (
                        <FormItem className="">
                            <FormLabel>Image <span className="text-xs text-muted-foreground">(optional)</span></FormLabel>
                            <FormControl>
                                <div className="flex items-start gap-3">
                                    <div>
                                        <SingleImageDropzone
                                            width={200}
                                            height={200}
                                            value={file}
                                            onChange={(file) => {
                                                setFile(file);
                                            }}
                                        />

                                        <Button
                                            className={`${(!file || !!form.watch(`options.${index}.image`)) && 'hidden'}`}

                                            type="button"
                                            onClick={uploadImage}
                                        >
                                            Upload
                                        </Button>
                                    </div>

                                    <ImagePlaceholder />
                                </div>

                            </FormControl>



                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            {!!(form.watch('options').length > 1) && <button type="button" onClick={handleDelete} className="flex items-center justify-center w-6 h-6 bg-red-500 rounded-full absolute top-1 right-1"><XIcon size={15} className="text-white" /></button>}
        </article>
    )
}

export default OptionItem