"use client";
import { useFormPreview } from "@/hooks/use-form-preview";
import { Form } from "@prisma/client";
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
import { Input } from "@/components/ui/input";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Sree_Krushnadevaraya } from "next/font/google";
import { cn, isFieldVisible } from "@/lib/utils";
import { Square, SquareCheckBig } from "lucide-react";
import { Textarea } from "../ui/textarea";
import Image from "next/image";

type Props = {
  form: Form;
};

const FormPreview = ({ form }: Props) => {
  const { formPreview, onSubmit } = useFormPreview(form);

  const formValues = formPreview.watch();
  return (
    <FormComponent {...formPreview}>
      <form
        onSubmit={formPreview.handleSubmit(onSubmit)}
        className="space-y-8 max-w-[800px]"
      >
        {form.elements.map((element) => {
          const fieldElement = element.field;
          const serviceElement = element.service;

          if (fieldElement) {
            const isVisible = isFieldVisible(
              fieldElement.id,
              form.rules,
              form.elements,
              formValues
            );
            if (!isVisible) return null;
            return (
              <FormField
                key={element.id}
                control={formPreview.control}
                name={fieldElement.label}
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
                            placeholder={fieldElement.placeholder || ""}
                            {...field}
                          />
                        )}
                        {fieldElement.type === "longText" && (
                          <Textarea
                            className="min-h-60 resize-none"
                            placeholder={fieldElement.placeholder || ""}
                            {...field}
                          />
                        )}
                        {fieldElement.type === "number" && (
                          <Input
                            type="number"
                            {...field}
                            placeholder={fieldElement.placeholder || ""}
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
                                    <span className="capitalize ">
                                      {" "}
                                      {option}
                                    </span>
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
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col "
                              >
                                <FormItem className="grid grid-cols-1 md:grid-cols-2 gap-3 space-y-0">
                                  {fieldElement.options.map((option, i) => (
                                    <div
                                      key={`option-radio-${i}`}
                                      className="flex items-center gap-1  bg-white p-3 rounded-md border w-full h-16"
                                    >
                                      <FormControl>
                                        <RadioGroupItem
                                          id={`option-radio-${i}`}
                                          value={String(option)}
                                        />
                                      </FormControl>
                                      <FormLabel
                                        htmlFor={`option-radio-${i}`}
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
                      </div>
                    </FormControl>
                    {fieldElement.hint && (
                      <FormDescription>{fieldElement.hint}</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          }

          if (serviceElement) {
            const isVisible = isFieldVisible(
              serviceElement.id,
              form.rules,
              form.elements,
              formValues
            );
            if (!isVisible) return null;
            return (
              <FormField
                control={formPreview.control}
                key={element.id}
                name={serviceElement.name}
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
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border w-fit bg-white p-4">
                          <FormControl>
                            <Checkbox
                              checked={!!field.value.id}
                              onCheckedChange={() =>
                                field.value.id
                                  ? field.onChange({})
                                  : field.onChange(
                                      String(serviceElement.options[0])
                                    )
                              }
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none  ">
                            <FormLabel>
                              ${serviceElement.options[0].price}
                            </FormLabel>
                            <FormDescription>
                              {serviceElement.options[0].description}
                            </FormDescription>
                          </div>
                        </FormItem>
                      ) : serviceElement.pricingType === "DROPDOWN_GROUP" ? (
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
                            {serviceElement.options.map((option) => (
                              <SelectItem
                                className="cursor-pointer"
                                key={option.id}
                                value={option.id}
                              >
                                <div className="flex flex-col ">
                                  <strong>{option.description}</strong>
                                  <span className="text-xs text-muted-foreground">
                                    $ {option.price}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : serviceElement.pricingType === "RADIO_GROUP" ? (
                        <FormItem className="space-y-0">
                          <FormLabel className="flex flex-row items-center gap-1 space-y-0">
                            {serviceElement.description}
                          
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-0"
                            >
                              <FormItem className="grid grid-cols-1 lg:grid-cols-2 gap-1 space-y-0 ">
                                {serviceElement.options.map((option) => (
                                  <div
                                    key={option.id}
                                    className="grid grid-cols-2 gap-1 bg-white p-4 rounded-md border"
                                  >
                                    <div className="flex flex-col gap-1 justify-between">
                                      <FormLabel
                                        className="font-semibold capitalize cursor-pointer "
                                        htmlFor={option.id}
                                      >
                                        {option.name}
                                      </FormLabel>
                                      <p
                                        className="text-xs  font-light  text-[#6B778C]  line-clamp-4"
                                       
                                      >
                                        {option.description}
                                      </p>
                                      <strong className="">
                                        ${option.price}
                                      </strong>
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
                                        <RadioGroupItem
                                          id={option.id}
                                          value={option.id}
                                        />
                                      </FormControl>
                                    </div>
                                  </div>
                                ))}
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      ) : serviceElement.pricingType === "CHECKBOX_GROUP" ? (
                        <FormItem>
                          <div className="mb-4 grid grid-cols-1 md:grid-cols-2  p-6 ">
                            {serviceElement.options.map((option,i) => (
                              <FormItem
                                key={option.id}
                                className={cn(
                                  "grid grid-cols-2 gap-3 rounded-lg border bg-white p-4 ",
                                  !!(field.value || []).some((el:any)=>el.id ===option.id) &&
                                    "bg-second text-white"
                                )}
                                onClick={() => {
                                  !(field.value || []).some((el:any)=>el.id ===option.id)
                                    ? field.onChange([
                                        ...(field.value || []),
                                        {...option,quantity:1},
                                      ])
                                    : field.onChange(
                                        field.value.filter(
                                          (el: any) => el.id !== option.id
                                        )
                                      );
                                }}
                              >
                               <div className="flex flex-col gap-1 justify-between">
                                      <FormLabel
                                        className="font-semibold capitalize cursor-pointer "
                                      
                                      >
                                        {option.name}
                                      </FormLabel>
                                      <p
                                        className="text-xs  font-light    line-clamp-4"
                                       
                                      >
                                        {option.description}
                                      </p>
                                      <div className="flex items-center justify-between">
                                      <strong className="">
                                        ${option.price}
                                      </strong>
                                      {!!option.enableQuantity &&(field.value || []).some((el:any)=>el.id===option.id) && <div className="flex border items-center  bg-white text-black rounded-lg overflow-hidden">
                                        <button
                                        onClick={(e)=>{e.stopPropagation();
                                           
                                            
                                            const serviceOptions = formPreview.watch(serviceElement.name) as {id:string,price:number,quantity:number}[]
                                         
                                            const currentOption = serviceOptions[i]
                                            console.log('currentOption',currentOption)
                                            serviceOptions[i] = {...currentOption,quantity:currentOption.quantity + 1}
                                            formPreview.setValue(serviceElement.name,serviceOptions)
                                           
                                           


                                        }}
                                        type="button"  className="flex items-center justify-center  cursor-pointer py-1 px-3 hover:bg-muted transition">+</button>
                                       <p className="px-3 py-1">{field.value[i]?.quantity || 0}</p>
                                        <button
                                         onClick={(e)=>{e.stopPropagation();
                                           if(field.value[i]?.quantity===1) return 
                                            
                                            const serviceOptions = formPreview.watch(serviceElement.name) as {id:string,price:number,quantity:number}[]
                                         
                                            const currentOption = serviceOptions[i]
                                            console.log('currentOption',currentOption)
                                            serviceOptions[i] = {...currentOption,quantity:currentOption.quantity - 1}
                                            formPreview.setValue(serviceElement.name,serviceOptions)
                                         }}
                                        type="button" className="flex items-center justify-center  cursor-pointer py-1 px-3 hover:bg-muted transition">-</button>
                                        </div>}
                                      </div>
                                     
                                    </div>
                               
                                <div className="flex items-center gap-1">
                                    <div className="relative aspect-square rounded-lg overflow-hidden flex-1">
{option.image && <Image src={option.image} alt={option.name} fill className="object-cover"/>}
                                    </div>
                                <div className="h-6">
                                  {!!(field.value || []).some((el:any)=>el.id ===option.id) ? (
                                    <SquareCheckBig className="h-6" />
                                  ) : (
                                    <Square className="h-6" />
                                  )}
                                </div>
                                </div>
                              </FormItem>
                            ))}{" "}
                          </div>
                        </FormItem>
                      ) : null}
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          }

          return null;
        })}
        <Button type="submit">Submit</Button>
      </form>
    </FormComponent>
  );
};

export default FormPreview;
