"use client";

import React, { memo, useCallback, useState } from "react";
import { useFormPreview } from "@/hooks/use-form-preview";
import { Element, Form, ServiceElement } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Form as FormComponent,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { cn, isFieldVisible } from "@/lib/utils";
import { CalendarIcon, CheckCircle, Circle, Loader, Square, SquareCheckBig } from "lucide-react";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { format } from "date-fns";

type Props = {
  form: Form;
};

const FormPreview = ({ form }: Props) => {
  const { formPreview, onSubmit, handleBlur,currentStep,setCurrentStep,steps,labels} = useFormPreview(form);
  const isLoading = formPreview.formState.isSubmitting;
  const formValues = formPreview.watch();

  const renderElement = (element: Element) => {
    const fieldElement = element.field;
    const serviceElement = element.service;

    if (fieldElement) {
      const isVisible = isFieldVisible(
        element.id,
        form.rules,
        form.elements,
        formValues
      );
      if (!isVisible) return null;
      return (
        <FormField
          key={element.id}
          control={formPreview.control}
          name={`${fieldElement.label}-field`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                {fieldElement.label}
                {fieldElement.validations?.required ? (
                  "*"
                ) : (
                  <span className="py-1 px-2 rounded-md text-muted-foreground bg-slate-200 text-[9px]">
                    Optional
                  </span>
                )}
              </FormLabel>
              <FormControl>
                <div>
                  {fieldElement.type === "text" && (
                    <Input
                      {...field}
                      value={field.value || ""}
                      placeholder={fieldElement.placeholder || ""}
                    />
                  )}
                  {fieldElement.type === "name" && (
                    <Input
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.trim())}
                      value={field.value || ""}
                      placeholder={fieldElement.placeholder || ""}
                    />
                  )}
                  {fieldElement.type === "email" && (
                    <Input
                      {...field}
                      value={field.value || ""}
                      placeholder={fieldElement.placeholder || ""}
                    />
                  )}
                  {fieldElement.type === "longText" && (
                    <Textarea
                      className="min-h-60 resize-none"
                      placeholder={fieldElement.placeholder || ""}
                      {...field}
                      value={field.value || ""}
                    />
                  )}
                  {fieldElement.type === "number" && (
                    <Input
                      type="number"
                      {...field}
                      placeholder={fieldElement.placeholder || ""}
                      value={field.value || ""}
                    />
                  )}
                  {fieldElement.type === "phone" && (
                    <Input
                      type="number"
                      {...field}
                      placeholder={fieldElement.placeholder || ""}
                    />
                  )}

                  {fieldElement.type === "checkbox" && (
                    <FormItem>
                      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fieldElement.options.map((option, i) => (
                          <FormItem
                            key={`option-checkbox-${i}`}
                            className={cn(
                              "flex flex-row items-center space-x-3 space-y-0 p-6 border rounded-lg bg-white cursor-pointer",
                              !!(field.value || []).includes(option) &&
                                "bg-second text-white"
                            )}
                            onClick={() => {
                              !(field.value || []).includes(option)
                                ? field.onChange([
                                    ...(field.value || []),
                                    option,
                                  ])
                                : field.onChange(
                                    field.value.filter(
                                      (el: string) => el !== option
                                    )
                                  );
                            }}
                          >
                            <div className="h-6 ">
                              {!!(field.value || []).includes(option) ? (
                                <SquareCheckBig className="h-6" />
                              ) : (
                                <Square className="h-6" />
                              )}
                            </div>
                            <FormLabel className="flex flex-col">
                              <span className="capitalize ">{option}</span>
                            </FormLabel>
                          </FormItem>
                        ))}{" "}
                      </div>
                    </FormItem>
                  )}
                  {fieldElement.type === "select" && (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an Option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fieldElement.options.map((option, i) => (
                          <SelectItem
                            className="cursor-pointer"
                            key={`option-select-${i}`}
                            value={String(option)}
                          >
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {fieldElement.type === "radio" && (
                    <FormItem className="">
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            console.log(value);
                            field.onChange(value);
                          }}
                          defaultValue={field.value}
                          className="flex flex-col "
                        >
                          <FormItem className="grid grid-cols-1 md:grid-cols-2 gap-3 space-y-0">
                            {fieldElement.options.map((option, i) => (
                              <div
                                key={`option-radio-${fieldElement.label}-${i}`}
                                className="flex items-center gap-1  bg-white p-3 rounded-md border w-full h-16"
                              >
                                <FormControl>
                                  <RadioGroupItem
                                    id={`option-radio-${fieldElement.label}-${i}`}
                                    value={String(option)}
                                  />
                                </FormControl>
                                <FormLabel
                                  htmlFor={`option-radio-${fieldElement.label}-${i}`}
                                  className="font-normal cursor-pointer"
                                >
                                  {option}
                                </FormLabel>
                              </div>
                            ))}
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                  {fieldElement.type === "address" && (
                    <>
                      {" "}
                      <AddressField
                        field={field}
                        fieldValue={field.value}
                        formPreview={formPreview}
                        fieldElement={fieldElement}
                      />
                    </>
                  )}
                  {fieldElement.type === "date" && (
                    <DatePickerView  field={field} fieldElement={fieldElement} fieldValue={field.value} formPreview={formPreview}  /> 
                  )}
                </div>
              </FormControl>
              {fieldElement.hint && (
                <FormDescription>{fieldElement.hint}</FormDescription>
              )}
              {fieldElement.type !== "address" && <FormMessage />}
              {!!formPreview.formState.errors[`${fieldElement.label}-field`] &&
                fieldElement.type === "address" && (
                  <p className="text-red-500 text-sm ">
                    Address fields are required
                  </p>
                )}
            </FormItem>
          )}
        />
      );
    }

    if (serviceElement) {
      const isVisible = isFieldVisible(
        element.id,
        form.rules,
        form.elements,
        formValues
      );
      if (!isVisible) return null;
      return (
        <FormField
          control={formPreview.control}
          key={element.id}
          name={`${serviceElement.name}-service`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="capitalize flex items-center gap-1">
                {serviceElement.name}
                {serviceElement.isRequired ? (
                  "*"
                ) : (
                  <span className="py-1 px-2 rounded-md text-muted-foreground bg-slate-200 text-[9px]">
                    Optional
                  </span>
                )}
              </FormLabel>
              <FormControl>
                {serviceElement.pricingType === "SINGLE_PRICE" ? (
                  <ServiceSinglepriceView
                    formPreview={formPreview}
                    field={field}
                    fieldValue={field.value}
                    serviceElement={serviceElement}
                  />
                ) : serviceElement.pricingType === "DROPDOWN_GROUP" ? (
                  <ServiceDropDownView
                    formPreview={formPreview}
                    field={field}
                    fieldValue={field.value}
                    serviceElement={serviceElement}
                  />
                ) : serviceElement.pricingType === "RADIO_GROUP" ? (
                  <ServiceRadioView
                    formPreview={formPreview}
                    field={field}
                    fieldValue={field.value}
                    serviceElement={serviceElement}
                  />
                ) : serviceElement.pricingType === "CHECKBOX_GROUP" ? (
                  <ServiceCheckBoxView
                    formPreview={formPreview}
                    field={field}
                    fieldValue={field.value}
                    serviceElement={serviceElement}
                  />
                ) : null}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    return null;
  };



  const handleNext = async () => {
    const fieldsToValidate = steps[currentStep]
      .map((element) => {
        if (element.field) {
          return `${element.field.label}-field`;
        } else if (element.service) {
          return `${element.service.name}-service`;
        }
        return null;
      })
      .filter((fieldName): fieldName is string => fieldName !== null);

    const isValid = await formPreview.trigger(fieldsToValidate);

    if (isValid) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };
  return (
    <FormComponent {...formPreview}>
      
      <section className="bg-white px-6 pb-12 pt-4 max-w-[800px] w-full min-h-[500px] h-full flex flex-col">
    {steps.length  > 1 &&  <StepsIndicator steps={steps.length} currentStep={currentStep}/>}
      <form
        onSubmit={formPreview.handleSubmit(onSubmit)}
        className="flex flex-col gap-8 flex-1 mt-12"
      >
        {steps[currentStep].map((element) => renderElement(element))}
        
        <div className="flex justify-between mt-auto w-full">
          {currentStep > 0 && (
            <Button variant={"secondary"}  className="px-8 py-2" type="button" onClick={() => setCurrentStep(currentStep - 1)}>
              Back
            </Button>
          )}
             {currentStep < steps.length - 1 && (
            <Button className="px-8 py-2 ml-auto bg-second hover:bg-second/80" type="button" onClick={handleNext}>
             {labels[currentStep] || 'Next'}
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button className="px-8 py-2 bg-second hover:bg-second/80" disabled={isLoading} type="submit">
              Submit
              {isLoading && <Loader size={12} className="ml-3 animate-spin" />}
            </Button>
          )}
          {JSON.stringify(formPreview.watch(),null,2)}
        </div>

      
      </form>
      </section>
    </FormComponent>
  );
};

export default FormPreview;

type AddressFieldProps = {
  field: ControllerRenderProps<
    {
      [x: string]: any;
    },
    `${string}-field`
  >;
  fieldValue: any;
  formPreview: UseFormReturn<any>;
  fieldElement: any; // Adjust this type based on your field element type
};

const AddressField: React.FC<AddressFieldProps> = ({
  field,
  fieldValue,
  formPreview,
  fieldElement,
}) => {
  return (
    <div className="">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
        {fieldElement.address?.addressShow && (
          <FormItem className=" col-span-1 md:col-span-3">
            <FormLabel>
              {fieldElement.address?.addressLabel || "Address"}
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                value={fieldValue?.address || ""}
                placeholder={
                  fieldElement.address?.addressLabel || "Enter address"
                }
                onChange={(e) =>
                  field.onChange({ ...fieldValue, address: e.target.value })
                }
              />
            </FormControl>
          </FormItem>
        )}
        {fieldElement.address?.houseNumberShow && (
          <FormItem className="col-span-1 md:col-span-2">
            <FormLabel>
              {fieldElement.address?.houseNumberLabel || "House Number"}
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                value={fieldValue?.houseNumber || ""}
                placeholder={
                  fieldElement.address?.houseNumberLabel || "Enter house number"
                }
                onChange={(e) =>
                  field.onChange({ ...fieldValue, houseNumber: e.target.value })
                }
              />
            </FormControl>
          </FormItem>
        )}

        {fieldElement.address?.postalCodeShow && (
          <FormItem className=" col-span-1 md:col-span-3">
            <FormLabel>
              {fieldElement.address?.postalCodeLabel || "Postal Code"}
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                value={fieldValue?.postalCode || ""}
                placeholder={
                  fieldElement.address?.postalCodeLabel || "Enter postal code"
                }
                onChange={(e) =>
                  field.onChange({ ...fieldValue, postalCode: e.target.value })
                }
              />
            </FormControl>
          </FormItem>
        )}
        {fieldElement.address?.cityShow && (
          <FormItem className=" col-span-1 md:col-span-2">
            <FormLabel>{fieldElement.address?.cityLabel || "City"}</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={fieldValue?.city || ""}
                placeholder={fieldElement.address?.cityLabel || "Enter city"}
                onChange={(e) =>
                  field.onChange({ ...fieldValue, city: e.target.value })
                }
              />
            </FormControl>
          </FormItem>
        )}
        {fieldElement.address?.stateRegionShow && (
          <FormItem className=" col-span-1 md:col-span-3">
            <FormLabel>
              {fieldElement.address?.stateRegionLabel || "State/Region"}
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                value={fieldValue?.stateRegion || ""}
                placeholder={
                  fieldElement.address?.stateRegionLabel || "Enter state/region"
                }
                onChange={(e) =>
                  field.onChange({ ...fieldValue, stateRegion: e.target.value })
                }
              />
            </FormControl>
          </FormItem>
        )}
        {fieldElement.address?.countryShow && (
          <FormItem className=" col-span-1 md:col-span-2">
            <FormLabel>
              {fieldElement.address?.countryLabel || "Country"}
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                value={fieldValue?.country || ""}
                placeholder={
                  fieldElement.address?.countryLabel || "Enter country"
                }
                onChange={(e) =>
                  field.onChange({ ...fieldValue, country: e.target.value })
                }
              />
            </FormControl>
          </FormItem>
        )}
      </div>
    </div>
  );
};

const ServiceCheckBoxView = ({
  serviceElement,
  fieldValue,
  formPreview,
  field,
}: {
  serviceElement: ServiceElement;
  fieldValue: { id: string; price: number; quantity: number ,taxPercentage:number}[];
  formPreview: UseFormReturn<
    {
      [x: string]: any;
    },
    any,
    undefined
  >;
  field: ControllerRenderProps<
    {
      [x: string]: any;
    },
    `${string}-service`
  >;
}) => {
  return (
    <FormItem>
      <div
        id="quill-content-container"
        className="quill-content prose"
        dangerouslySetInnerHTML={{ __html: serviceElement.description || "" }}
      />
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2   gap-1">
        {serviceElement.options.map((option , i) => (
          <FormItem
            key={option.id}
            className={cn(
              "grid grid-cols-2 gap-3 rounded-lg border bg-white p-4 ",
              !!(fieldValue || []).some((el: any) => el.id === option.id) &&
                "border-second"
            )}
            onClick={() => {
              !(fieldValue || []).some((el: any) => el.id === option.id)
                ? field.onChange([
                    ...(fieldValue || []),
                    {
                      ...option,
                      quantity: 1,
                      serviceName: serviceElement.name,
                      serviceId: serviceElement.id,
                      taxPercentage:serviceElement.taxPercentage
                    },
                  ])
                : field.onChange(
                    fieldValue.filter((el: any) => el.id !== option.id)
                  );
                
            }}
          >
            <div className="flex flex-col gap-1 justify-between">
              <FormLabel className=" capitalize cursor-pointer ">
                {option.name}
              </FormLabel>
              <p className="text-xs  font-light    line-clamp-4">
                {option.description}
              </p>
              <div className="flex items-center justify-between">
                <p className="">${option.price}</p>
                {!!option.enableQuantity &&
                (
                  formPreview.watch(`${serviceElement.name}-service`) || []
                ).some((el: any) => el.id === option.id) ? (
                  <div className="flex border items-center h-8 bg-white text-black rounded-lg overflow-hidden">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        //get all options
                        const serviceOptions = formPreview.watch(
                          `${serviceElement.name}-service`
                        ) as {
                          id: string;
                          price: number;
                          quantity: number;
                        }[];
                        //get current option
                        const currentOption = serviceOptions.find(
                          (el) => el.id === option.id
                        );
                        //get its index
                        const currentOptionIndex = serviceOptions.findIndex(
                          (el) => el.id === option.id
                        );

                        //change the quntity at the current index
                        serviceOptions[currentOptionIndex] = {
                          ...currentOption!,
                          quantity: currentOption!.quantity + 1,
                        };
                        formPreview.setValue(
                          `${serviceElement.name}-service`,
                          serviceOptions
                        );
                      }}
                      type="button"
                      className="flex items-center justify-center  cursor-pointer py-1 px-3 hover:bg-muted transition"
                    >
                      +
                    </button>
                    <p className="px-3 py-1">
                      {
                        (
                          formPreview.watch(
                            `${serviceElement.name}-service`
                          ) as {
                            id: string;
                            price: number;
                            quantity: number;
                          }[]
                        ).find((el) => el.id === option.id)?.quantity
                      }
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        //get all options
                        const serviceOptions = formPreview.watch(
                          `${serviceElement.name}-service`
                        ) as {
                          id: string;
                          price: number;
                          quantity: number;
                        }[];
                        //get current option
                        const currentOption = serviceOptions.find(
                          (el) => el.id === option.id
                        );
                        //get its index
                        const currentOptionIndex = serviceOptions.findIndex(
                          (el) => el.id === option.id
                        );
                        if (currentOption!.quantity === 1) return;

                        //change the quntity at the current index
                        serviceOptions[currentOptionIndex] = {
                          ...currentOption!,
                          quantity: currentOption!.quantity - 1,
                        };
                        formPreview.setValue(
                          `${serviceElement.name}-service`,
                          serviceOptions
                        );
                      }}
                      type="button"
                      className="flex items-center justify-center  cursor-pointer py-1 px-3 hover:bg-muted transition"
                    >
                      -
                    </button>
                  </div>
                ) : (
                  <div className="h-8" />
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <div className="relative aspect-square rounded-lg overflow-hidden flex-1">
                {option.image && (
                  <Image
                    src={option.image}
                    alt={option.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="h-6">
                {!!(fieldValue || []).some((el: any) => el.id === option.id) ? (
                  <SquareCheckBig className="h-6 text-second" />
                ) : (
                  <Square className="h-6" />
                )}
              </div>
            </div>
          </FormItem>
        ))}{" "}
      </div>
    </FormItem>
  );
};

const ServiceRadioView = ({
  serviceElement,
  fieldValue,
  formPreview,
  field,
}: {
  serviceElement: ServiceElement;
  fieldValue: { id: string; price: number; quantity: number ,taxPercentage:number};
  formPreview: UseFormReturn<
    {
      [x: string]: any;
    },
    any,
    undefined
  >;
  field: ControllerRenderProps<
    {
      [x: string]: any;
    },
    `${string}-service`
  >;
}) => {
  return (
    <FormItem className="space-y-0">
      <FormLabel className="flex flex-row items-center gap-1 space-y-0">
        <div
          id="quill-content-container"
          className="quill-content prose"
          dangerouslySetInnerHTML={{ __html: serviceElement.description || "" }}
        />
      </FormLabel>
      <FormControl>
        <FormItem className="grid grid-cols-1 lg:grid-cols-2 gap-1 space-y-0 ">
          {serviceElement.options.map((option, i) => (
            <div
              onClick={() =>
                field.onChange({
                  ...option,
                  quantity: 1,
                  serviceName: serviceElement.name,
                  serviceId: serviceElement.id,
                  taxPercentage:serviceElement.taxPercentage
                })
              }
              key={option.id}
              className={cn(
                "grid grid-cols-2 gap-3 bg-white p-4 rounded-md border",
                field.value?.id === option.id && "border-second"
              )}
            >
              <div className="flex flex-col gap-1 justify-between">
                <FormLabel
                  className="font-semibold capitalize cursor-pointer "
                  htmlFor={option.id}
                >
                  {option.name}
                </FormLabel>
                <p className="text-xs  font-light  text-[#6B778C]  line-clamp-4">
                  {option.description}
                </p>
                <div className="flex items-center justify-between">
                  <p className="">${option.price}</p>
                  {!!option.enableQuantity && field.value?.id === option.id ? (
                    <div className="flex border items-center  h-8 bg-white text-black rounded-lg overflow-hidden">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();

                          console.log(field.value);
                          let serviceOption = formPreview.watch(
                            `${serviceElement.name}-service`
                          ) as {
                            id: string;
                            price: number;
                            quantity: number;
                          };

                          const currentOption = serviceOption;
                          console.log("currentOption", currentOption);
                          serviceOption = {
                            ...currentOption,
                            quantity: currentOption.quantity + 1,
                          };
                          formPreview.setValue(
                            `${serviceElement.name}-service`,
                            serviceOption
                          );
                        }}
                        type="button"
                        className="flex items-center justify-center  cursor-pointer py-1 px-3 hover:bg-muted transition"
                      >
                        +
                      </button>
                      <p className="px-3 py-1">{field.value?.quantity || 0}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (field.value?.quantity === 1) return;
                          console.log(field.value);
                          let serviceOption = formPreview.watch(
                            `${serviceElement.name}-service`
                          ) as {
                            id: string;
                            price: number;
                            quantity: number;
                          };

                          const currentOption = serviceOption;
                          console.log("currentOption", currentOption);
                          serviceOption = {
                            ...currentOption,
                            quantity: currentOption.quantity - 1,
                          };
                          formPreview.setValue(
                            `${serviceElement.name}-service`,
                            serviceOption
                          );
                        }}
                        type="button"
                        className="flex items-center justify-center  cursor-pointer py-1 px-3 hover:bg-muted transition"
                      >
                        -
                      </button>
                    </div>
                  ) : (
                    <div className="h-8"></div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex-1 aspect-square relative rounded-lg overflow-hidden">
                  {option.image && (
                    <Image
                      src={option.image}
                      fill
                      className="objeccover"
                      alt={option.name}
                    />
                  )}
                </div>
                <FormControl>
                  {field.value?.id === option.id ? (
                    <Circle className="fill-second text-second" />
                  ) : (
                    <Circle />
                  )}
                </FormControl>
              </div>
            </div>
          ))}
        </FormItem>
      </FormControl>
    </FormItem>
  );
};

const ServiceDropDownView = ({
  serviceElement,
  fieldValue,
  formPreview,
  field,
}: {
  serviceElement: ServiceElement;
  fieldValue: { id: string; price: number; quantity: number,taxPercentage:number };
  formPreview: UseFormReturn<
    {
      [x: string]: any;
    },
    any,
    undefined
  >;
  field: ControllerRenderProps<
    {
      [x: string]: any;
    },
    `${string}-service`
  >;
}) => {
  return (
    <div>
      <div
        id="quill-content-container"
        className="quill-content prose"
        dangerouslySetInnerHTML={{ __html: serviceElement.description || "" }}
      />
      <Select
        onValueChange={(id: string) => {
          if (id === "NONE") {
            field.onChange(undefined);
            return;
          }
          const theOption = serviceElement.options.find((el) => el.id === id);
          field.onChange({
            ...theOption,
            quantity: 1,
            serviceName: serviceElement.name,
            serviceId: serviceElement.id,
            taxPercentage:serviceElement.taxPercentage
          });
        }}
        defaultValue={field.value}
      >
        <FormControl>
          <SelectTrigger className=" text-start p-4 !h-12">
            <SelectValue
              className=" text-start"
              placeholder="Select an Option"
            />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value={"NONE"} className="cursor-pointer">
            None
          </SelectItem>
          {serviceElement.options.map((option) => (
            <SelectItem
              className="cursor-pointer w-full "
              key={option.id}
              value={option.id}
            >
              <div className="flex items-center gap-12 ">
                <div className="flex flex-col ">
                  <span className="text-base text-black capitalize">
                    {option.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ${option.price}
                  </span>
                </div>
                <div className="relative aspect-square w-8 rounded-full overflow-hidden">
                  {option.image && (
                    <Image
                      src={option.image}
                      alt={option.name}
                      className="object-cover"
                      fill
                    />
                  )}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {formPreview.watch(
                        `${serviceElement.name}-service`
                      ) && (
        <FormItem
          className={cn(
            "grid grid-cols-2 gap-3 rounded-lg border bg-white p-4 mt-2 max-w-[400px]"
          )}
        >
          <div className="flex flex-col gap-1 justify-between">
            <FormLabel className=" capitalize cursor-pointer ">
              {field.value.name}
            </FormLabel>
            <p className="text-xs  font-light    line-clamp-4">
              {field.value.description}
            </p>
            <div className="flex items-center justify-between">
              <p className="">${field.value.price}</p>
              {!!field.value?.id &&
              !!serviceElement.options.find((el) => el.id === field.value.id)
                ?.enableQuantity ? (
                <div className="flex border items-center h-8 bg-white text-black rounded-lg overflow-hidden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      let serviceOptions = formPreview.watch(
                        `${serviceElement.name}-service`
                      ) as {
                        id: string;
                        price: number;
                        quantity: number;
                      };

                      const currentOption = serviceOptions;
                      console.log("currentOption", currentOption);
                      serviceOptions = {
                        ...currentOption,
                        quantity: currentOption.quantity + 1,
                      };
                      formPreview.setValue(
                        `${serviceElement.name}-service`,
                        serviceOptions
                      );
                    }}
                    type="button"
                    className="flex items-center justify-center  cursor-pointer py-1 px-3 hover:bg-muted transition"
                  >
                    +
                  </button>
                  <p className="px-3 py-1">{field.value?.quantity || 0}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (field.value?.quantity === 1) return;

                      let serviceOptions = formPreview.watch(
                        `${serviceElement.name}-service`
                      ) as {
                        id: string;
                        price: number;
                        quantity: number;
                      };

                      const currentOption = serviceOptions;
                      console.log("currentOption", currentOption);
                      serviceOptions = {
                        ...currentOption,
                        quantity: currentOption.quantity - 1,
                      };
                      formPreview.setValue(
                        `${serviceElement.name}-service`,
                        serviceOptions
                      );
                    }}
                    type="button"
                    className="flex items-center justify-center  cursor-pointer py-1 px-3 hover:bg-muted transition"
                  >
                    -
                  </button>
                </div>
              ) : (
                <div className="h-8" />
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <div className="relative aspect-square rounded-lg overflow-hidden flex-1">
              {!!serviceElement.options.find((el) => el.id === field.value?.id)
                ?.image && (
                <Image
                  src={
                    serviceElement.options.find(
                      (el) => el.id === field.value?.id
                    )?.image || ""
                  }
                  alt={
                    serviceElement.options.find(
                      (el) => el.id === field.value?.id
                    )?.name || ""
                  }
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>
        </FormItem>
      )}
    </div>
  );
};

const ServiceSinglepriceView = ({
  serviceElement,
  fieldValue,
  formPreview,
  field,
}: {
  serviceElement: ServiceElement;
  fieldValue: { id: string; price: number; quantity: number };
  formPreview: UseFormReturn<
    {
      [x: string]: any;
    },
    any,
    undefined
  >;
  field: ControllerRenderProps<
    {
      [x: string]: any;
    },
    `${string}-service`
  >;
}) => {
  return (
    <div>
      <div
        id="quill-content-container"
        className="quill-content prose"
        dangerouslySetInnerHTML={{ __html: serviceElement.description || "" }}
      />
      <FormItem
        className={cn(
          "grid grid-cols-2 gap-3 rounded-lg border bg-white p-4 max-w-[400px]",
          !!(field.value?.id === serviceElement.options[0].id) &&
            "border-second "
        )}
        onClick={() => {
          !field.value?.id
            ? field.onChange({
                ...serviceElement.options[0],
                quantity: 1,
                serviceName: serviceElement.name,
                serviceId: serviceElement.id,
                taxPercentage:serviceElement.taxPercentage
              })
            : field.onChange(undefined);
        }}
      >
        <div className="flex flex-col gap-1 justify-between">
          <FormLabel className=" capitalize cursor-pointer ">
            {serviceElement.options[0].name}
          </FormLabel>
          <p className="text-xs  font-light    line-clamp-4">
            {serviceElement.options[0].description}
          </p>
          <div className="flex items-center justify-between">
            <p className="">${serviceElement.options[0].price}</p>
            {!!serviceElement.options[0].enableQuantity &&
            field.value?.id === serviceElement.options[0].id ? (
              <div className="flex border items-center h-8 bg-white text-black rounded-lg overflow-hidden">
                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    let serviceOptions = formPreview.watch(
                      `${serviceElement.name}-service`
                    ) as {
                      id: string;
                      price: number;
                      quantity: number;
                    };

                    let currentOption = serviceOptions;
                    console.log("currentOption", currentOption);
                    serviceOptions = {
                      ...currentOption,
                      quantity: currentOption.quantity + 1,
                    };
                    formPreview.setValue(
                      `${serviceElement.name}-service`,
                      serviceOptions
                    );
                  }}
                  type="button"
                  className="flex items-center justify-center  cursor-pointer py-1 px-3 hover:bg-muted transition"
                >
                  +
                </button>
                <p className="px-3 py-1">{field.value?.quantity || 0}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (field.value?.quantity === 1) return;

                    let serviceOptions = formPreview.watch(
                      `${serviceElement.name}-service`
                    ) as {
                      id: string;
                      price: number;
                      quantity: number;
                    };

                    let currentOption = serviceOptions;
                    console.log("currentOption", currentOption);
                    serviceOptions = {
                      ...currentOption,
                      quantity: currentOption.quantity - 1,
                    };
                    formPreview.setValue(
                      `${serviceElement.name}-service`,
                      serviceOptions
                    );
                  }}
                  type="button"
                  className="flex items-center justify-center  cursor-pointer py-1 px-3 hover:bg-muted transition"
                >
                  -
                </button>
              </div>
            ) : (
              <div className="h-8" />
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <div className="relative aspect-square rounded-lg overflow-hidden flex-1">
            {serviceElement.options[0].image && (
              <Image
                src={serviceElement.options[0].image}
                alt={serviceElement.options[0].name}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className="h-6">
            {!!(field.value?.id === serviceElement.options[0].id) ? (
              <SquareCheckBig className="h-6 text-second" />
            ) : (
              <Square className="h-6" />
            )}
          </div>
        </div>
      </FormItem>
    </div>
  );
};

const DatePickerView = ({
  field,
  fieldElement,
  fieldValue,
  formPreview,
}: {
  field: ControllerRenderProps<
    {
      [x: string]: any;
    },
    `${string}-field`
  >;
  fieldValue: any;
  formPreview: UseFormReturn<any>;
  fieldElement: any;
}) => {

  const [open, setOpen] = useState(false)
  return  <Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger asChild>
    <Button
      variant={"outline"}
      className={cn(
        "w-[280px] justify-start text-left font-normal",
        !fieldValue && "text-muted-foreground"
      )}
    >
      <CalendarIcon className="mr-2 h-4 w-4" />
      {fieldValue ? format(fieldValue, "PPP") : <span>{fieldElement.placeHolder || "Pick a date"}</span>}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0">
    <Calendar
      mode="single"
      selected={fieldValue}
      onSelect={(date) => {
        
        if (date) {
          // Create a new date without timezone offset
          const adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
          field.onChange(adjustedDate);
          
        };
        setOpen(false)
      }
    
    }
      initialFocus
    />
  </PopoverContent>
</Popover>;
};


type StepsIndicatorProps = {
  steps: number;
  currentStep: number;
};

const StepsIndicator: React.FC<StepsIndicatorProps> = ({
  steps,
  currentStep,
}) => {

  const stepsArray = Array(steps).fill('')
  return (
    <div className="flex items-center  justify-between gap-3 w-full">
    {stepsArray.map((_, index) => (
      <React.Fragment key={index}>
        <div
          className={`relative text-sm  h-[24px] flex-1 flex items-center justify-center text-white ${
            index <= currentStep ? "bg-second" : "bg-gray-200"
          }`}
        >
          {index <= currentStep  ? (
            <>
              <div className="absolute right-[-12px] top-1/2 -translate-y-[50%]  w-0 h-0 border-t-[12px] border-t-transparent border-l-[12px] border-l-second border-b-[12px] border-b-transparent"></div>
              <div className="absolute left-[0px] top-1/2 -translate-y-[50%]  w-0 h-0 border-t-[12px] border-t-transparent border-l-[12px] border-l-white border-b-[12px] border-b-transparent"></div>
            </>
          ):<>
          <div className="absolute right-[-12px] top-1/2 -translate-y-[50%]  w-0 h-0 border-t-[12px] border-t-transparent border-l-[12px] border-l-gray-200 border-b-[12px] border-b-transparent"></div>
          <div className="absolute left-[0px] top-1/2 -translate-y-[50%]  w-0 h-0 border-t-[12px] border-t-transparent border-l-[12px] border-l-white border-b-[12px] border-b-transparent"></div>
        </>}
        { index < currentStep ? <CheckCircle size={15}/> : `Step ${index + 1}`}
        </div>
      </React.Fragment>
    ))}
  </div>
  );
};

