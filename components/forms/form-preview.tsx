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

type Props = {
  form: Form;
};

const FormPreview = ({ form }: Props) => {
  const { formPreview, onSubmit } = useFormPreview(form);
  console.log("fetchedForm", JSON.stringify(form, undefined, 2));
  console.log("previewForm", JSON.stringify(formPreview, null, 2));
  const formValues = formPreview.watch();
  return (
    <FormComponent {...formPreview}>
      <form
        onSubmit={formPreview.handleSubmit(onSubmit)}
        className="space-y-8 max-w-[600px]"
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
                                      <FormLabel htmlFor={`option-radio-${i}`} className="font-normal cursor-pointer">
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
                    <FormLabel className="capitalize">
                      {serviceElement.name}
                    </FormLabel>
                    <FormControl>
                      {serviceElement.pricingType === "SINGLE_PRICE" ? (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border w-fit bg-white p-4">
                          <FormControl>
                            <Checkbox
                              checked={!!field.value}
                              onCheckedChange={() =>
                                field.value
                                  ? field.onChange("")
                                  : field.onChange(
                                      String(serviceElement.options[0].price)
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
                                value={String(option.price)}
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
                        <FormItem className="space-y-3">
                          <FormLabel>{serviceElement.description}</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0 ">
                                {serviceElement.options.map((option) => (
                                  <div
                                    key={option.id}
                                    className="flex items-center gap-1 flex-col bg-white p-3 rounded-md border"
                                  >
                                    <FormLabel className="font-normal" htmlFor={option.id}>
                                      {option.name} ${option.price}
                                    </FormLabel>
                                    <FormControl >
                                      <RadioGroupItem
                                      id={option.id}
                                        value={String(option.price)}
                                      />
                                    </FormControl>
                                  </div>
                                ))}
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      ) : serviceElement.pricingType === "CHECKBOX_GROUP" ? (
                        <FormItem>
                          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {serviceElement.options.map((option) => (
                              <FormItem
                                key={option.id}
                                className={cn(
                                  "flex flex-row items-start space-x-3 space-y-0 p-6 border rounded-lg bg-white cursor-pointer",
                                  !!(field.value || []).includes(option.id) &&
                                    "bg-second text-white"
                                )}
                                onClick={() => {
                                  !(field.value || []).includes(option.id)
                                    ? field.onChange([
                                        ...(field.value || []),
                                        option.id,
                                      ])
                                    : field.onChange(
                                        field.value.filter(
                                          (el: string) => el !== option.id
                                        )
                                      );
                                }}
                              >
                                <div className="h-6">
                                  {!!(field.value || []).includes(option.id) ? (
                                    <SquareCheckBig className="h-6" />
                                  ) : (
                                    <Square className="h-6" />
                                  )}
                                </div>
                                <FormLabel className="flex flex-col">
                                  <span className="capitalize ">
                                    {" "}
                                    {option.name}
                                  </span>

                                  <span
                                    className={cn(
                                      "text-muted-foreground text-sm",
                                      {
                                        "text-white": (
                                          field.value || []
                                        ).includes(option.id),
                                      }
                                    )}
                                  >
                                    ${option.price}
                                  </span>
                                </FormLabel>
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
