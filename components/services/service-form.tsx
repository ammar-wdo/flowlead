"use client";

import { useService } from "@/hooks/service-hook";
import { PricingType, Service } from "@prisma/client";
import React, { useRef, useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import QuillEditor from "../quill-editor";
import { optionSchema, pricingTypeArray, taxesEnum } from "@/schemas";
import PricingTypeComponent, { SinglePricingType } from "../pricing-type";
import { cn } from "@/lib/utils";
import OptionItem from "./option-item";
import { z } from "zod";
import { Checkbox } from "../ui/checkbox";
import { ChevronDown, FileDiff, Loader, PlusIcon } from "lucide-react";
import LoadingButton from "../loading-button";
import Scroller from "../scroller";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import { taxesValuesMapper, valuesTaxesMapper } from "@/mapping";
import Optional from "../optional";

type Props = {
  service: Service | undefined | null;
};

const ServiceForm = ({ service }: Props) => {
  const { form, onSubmit } = useService(service);
  const [openTax, setOpenTax] = useState(false);
  const previousVar = useRef(1);

  const handleDelete = (id: string) => {
    const newOptions = form.watch("options");
    const filteredOptions = newOptions.filter((el, i) => el.id !== id);
    form.setValue("options", filteredOptions);
    previousVar.current--;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const items = form.watch("options");
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newOptions = arrayMove(items, oldIndex, newIndex);

      form.setValue("options", newOptions);
    }
  };

  const isLoading = form.formState.isSubmitting;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2 pt-4"
      >
        {/* name */}
        <div className="bg-white p-8 flex flex-col gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Name</FormLabel>
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
                <FormLabel>
                  Service Description{" "}
                  <span className="text-muted-foreground"><Optional /></span>
                </FormLabel>
                <FormControl>
                  <QuillEditor
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Is Line Item */}
          <FormField
            control={form.control}
            name="isLineItem"
            render={({ field }) => (
              <FormItem className="flex items-start gap-3 space-y-0">
                <FormLabel>Show as Line Item</FormLabel>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Tax percentage */}
        <div className="bg-white p-8 flex flex-col gap-2">
          <FormField
            control={form.control}
            name="taxPercentage"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel>Tax Percentage</FormLabel>
                <Popover open={openTax} onOpenChange={setOpenTax}>
                  <PopoverTrigger className="w-[240px]">
                    <Button type="button" className="w-full bg-white hover:bg-white border" variant={"secondary"}>
                      {valuesTaxesMapper[field.value]}
                      <ChevronDown size={14} className="ml-auto" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[240px] p-1">
                    {taxesEnum.map((tax) => (
                      <Button
                      type="button"
                        onClick={() => {
                          field.onChange(taxesValuesMapper[tax]);
                          setOpenTax(false);
                        }}
                        className="w-full"
                        key={tax}
                        variant={"ghost"}
                      >
                        {tax}
                      </Button>
                    ))}
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Pricing Type */}
        <div className="bg-white p-8 flex flex-col gap-2">
          <FormField
            control={form.control}
            name="pricingType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pricing Type</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pricingTypeArray.map((type, i) => (
                      <PricingTypeComponent
                        key={i}
                        isChoosen={field.value === type}
                        pricingType={type as SinglePricingType}
                        onChange={(val) => field.onChange(val)}
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* options */}
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
          <SortableContext items={form.watch("options")}>
            <div className="bg-white p-8 flex flex-col gap-2">
              <FormField
                control={form.control}
                name="options"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Options</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        <FormField
                          control={form.control}
                          name="isRequired"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2  space-y-0 mt-6">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel>Options are required</FormLabel>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex flex-col gap-3">
                          {form.watch("options").map((option, i) => (
                            <OptionItem
                              handleDelete={() => handleDelete(option.id)}
                              id={option.id}
                              form={form}
                              index={i}
                              key={option.id}
                            />
                          ))}
                          {form.formState.errors.options?.length && (
                            <span className="text-red-500 mt-4">
                              Invalid options inputs
                            </span>
                          )}
                        </div>

                        <Button
                          className="mt-8 bg-second text-white hover:bg-second/90"
                          type="button"
                          onClick={() =>
                            field.onChange([
                              ...form.watch("options"),
                              {
                                name: "",
                                description: "",
                                image: "",
                                enableQuantity: false,
                                id: String(Date.now()),
                              } as z.infer<typeof optionSchema>,
                            ])
                          }
                        >
                       <PlusIcon className="mr-3" size={14}/>   Add New Option
                        </Button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </SortableContext>
        </DndContext>
        <Scroller
          previousVar={previousVar}
          variable={form.watch("options").length}
        />

        <LoadingButton
          className="ml-auto  flex bg-second hover:bg-second/90"
          title={!service ? "Submit" : "Update"}
          isLoading={isLoading}
        />
      </form>
    </Form>
  );
};

export default ServiceForm;
