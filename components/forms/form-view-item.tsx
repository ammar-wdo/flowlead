import React, { MouseEvent, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { elementSchema, formSchema } from "@/schemas";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { v4 as uuidv4 } from "uuid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Check,
  GripVertical,
  Square,
  SquareCheckBig,
  Trash,
  XIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelectedElement } from "@/hooks/selected-element-hook";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";

type Form = UseFormReturn<z.infer<typeof formSchema>>;
type FieldType = ControllerRenderProps<
  z.infer<typeof formSchema>,
  `elements.${number}.field`
>;
type ServiceElementType = ControllerRenderProps<
  z.infer<typeof formSchema>,
  `elements.${number}.service`
>;
type Element = z.infer<typeof elementSchema>;
type Props = {
  form: Form;
  i: number;
  element: Element;
  handleDelete: (id: string, e: MouseEvent<HTMLButtonElement>) => void;
};

const FormViewItem = ({ form, i, element, handleDelete }: Props) => {
  const { setSelectedElement, selectedElement } = useSelectedElement();

  const handleSelectedElementClick = () => {
    setSelectedElement({ id: element.id, type: element.type });
    console.log(element);
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { height: "auto", width: "auto" } : {}),
  };

  if (element.type === "SERVICE_ELEMENT")
    return (
      <div
        onClick={(e) => handleSelectedElementClick()}
        ref={setNodeRef}
        className={cn(
          " p-8 relative  group h-fit cursor-pointer rounded-lg hover:ring-[1px]  mb-4",
          isDragging && "z-10 opacity-60 relative",
          selectedElement?.id === element.id && "bg-muted/50 ring-[1px]"
        )}
        style={style}
      >
        <Button
          size={"icon"}
          onClick={(e) => handleDelete(element.id, e)}
          type="button"
          variant={"ghost"}
          className="right-1  opacity-0 group-hover:opacity-100 
            transition top-1  absolute hover:bg-white
            bg-white  hover:shadow-gray-300  shadow-md rounded-lg
             text-gray-300 hover:shadow-lg flex items-center justify-center w-8 h-8  p-0.5"
        >
          <XIcon />
        </Button>
        <Button
          {...attributes}
          {...listeners}
          type="button"
          variant={"ghost"}
          className="-left-6 text-gray-300 opacity-0 group-hover:opacity-100 
          transition top-1/2 -translate-y-1/2 absolute hover:bg-transparent !p-0"
        >
          <GripVertical />
        </Button>

        <FormField
          control={form.control}
          name={`elements.${i}.service`}
          render={({ field }) => (
            <FormItem>
              {!!(element.type === "SERVICE_ELEMENT") && (
                <ServiceViewItem i={i} form={form} field={field} />
              )}
            </FormItem>
          )}
        />
      </div>
    );
  else
    return (
      <div
        ref={setNodeRef}
        className={cn(
          " p-8 relative  group h-fit cursor-pointer rounded-lg hover:ring-[1px] mb-4",
          isDragging && "z-10 opacity-60 relative ",
          selectedElement?.id === element.id && "bg-muted/50 ring-[1px]"
        )}
        style={style}
        onClick={handleSelectedElementClick}
      >
       {element.field?.type !=='name' && element.field?.type !=='email' && <Button
          onClick={(e) => handleDelete(element.id, e)}
          type="button"
          variant={"ghost"}
          className="right-1  opacity-0 group-hover:opacity-100 
            transition top-1  absolute hover:bg-white
            bg-white  hover:shadow-gray-300  shadow-md rounded-lg
             text-gray-300 hover:shadow-lg flex items-center justify-center w-8 h-8  p-0.5"
        >
          <XIcon />
        </Button>}

        <Button
          {...attributes}
          {...listeners}
          type="button"
          variant={"ghost"}
          className="-left-6 text-gray-300 opacity-0 group-hover:opacity-100 
        transition top-1/2 -translate-y-1/2 absolute hover:bg-transparent !p-0"
        >
          <GripVertical />
        </Button>
        <FormField
          control={form.control}
          name={`elements.${i}.field`}
          render={({ field }) => (
            <FormItem>
              {!!(
                element.type === "FIELD" && element.field?.type === "text"
              ) && <TextInputViewItem form={form} index={i} />}
              {!!(
                element.type === "FIELD" && element.field?.type === "name"
              ) && <NameInputViewItem form={form} index={i} />}
              {!!(
                element.type === "FIELD" && element.field?.type === "email"
              ) && <EmailInputViewItem form={form} index={i} />}
              {!!(
                element.type === "FIELD" && element.field?.type === "number"
              ) && <NumberInputViewItem form={form} index={i} />}
              {!!(
                element.type === "FIELD" && element.field?.type === "checkbox"
              ) && <CheckboxInputViewItem form={form} index={i} />}
              {!!(
                element.type === "FIELD" && element.field?.type === "radio"
              ) && <RadioInputViewItem form={form} index={i} />}
              {!!(
                element.type === "FIELD" && element.field?.type === "select"
              ) && <SelectInputViewItem form={form} index={i} />}
              {!!(
                element.type === "FIELD" && element.field?.type === "breaker"
              ) && <Breaker form={form} index={i} />}
              {!!(
                element.type === "FIELD" &&
                element.field?.type === "sectionBreaker"
              ) && <SectionBreaker form={form} index={i} />}
              {!!(
                element.type === "FIELD" && element.field?.type === "longText"
              ) && <LongTextInputViewItem form={form} index={i} />}
              {!!(
                element.type === "FIELD" && element.field?.type === "address"
              ) && <AddressInputViewItem form={form} index={i} />}
              {!!(
                element.type === "FIELD" && element.field?.type === "phone"
              ) && <PhoneInputViewItem form={form} index={i} />}
            </FormItem>
          )}
        />
      </div>
    );
};

export default FormViewItem;

const TextInputViewItem = ({ index, form }: { index: number; form: Form }) => {
  return (
    <FormControl>
      <FormField
        control={form.control}
        name={`elements.${index}.field.label`}
        render={({ field }) => (
          <FormItem>
            <div className="flex flex-col gap-1">
              <Label className="flex items-center gap-1">
                {form.watch("elements")[index].field?.label}
                {form.watch("elements")[index].field?.validations?.required ? (
                  "*"
                ) : (
                  <span className="py-1 px-2 rounded-md text-muted-foreground bg-slate-200 text-[9px]">Optional</span>
                )}
              </Label>
              {form.watch("elements")[index].field?.hint && (
                <Label className="text-sm text-muted-foreground font-light ">
                  {form.watch("elements")[index].field?.hint}
                </Label>
              )}
              <Input
                placeholder={
                  form.watch("elements")[index].field?.placeholder || ""
                }
                readOnly
                className="pointer-events-none"
              />
            </div>

            <FormMessage />
          </FormItem>
        )}
      />
    </FormControl>
  );
};

const EmailInputViewItem = ({ index, form }: { index: number; form: Form }) => {
  return (
    <FormControl>
      <FormField
        control={form.control}
        name={`elements.${index}.field.label`}
        render={({ field }) => (
          <FormItem>
            <div className="flex flex-col gap-1">
              <Label className="flex items-center gap-1">
                {form.watch("elements")[index].field?.label}
                {form.watch("elements")[index].field?.validations?.required ? (
                  "*"
                ) : (
                  <span className="py-1 px-2 rounded-md text-muted-foreground bg-slate-200 text-[9px]">Optional</span>
                )}
              </Label>
              {form.watch("elements")[index].field?.hint && (
                <Label className="text-sm text-muted-foreground font-light ">
                  {form.watch("elements")[index].field?.hint}
                </Label>
              )}
              <Input
                placeholder={
                  form.watch("elements")[index].field?.placeholder || ""
                }
                readOnly
                className="pointer-events-none"
              />
            </div>

            <FormMessage />
          </FormItem>
        )}
      />
    </FormControl>
  );
};
const NameInputViewItem = ({ index, form }: { index: number; form: Form }) => {
  return (
    <FormControl>
      <FormField
        control={form.control}
        name={`elements.${index}.field.label`}
        render={({ field }) => (
          <FormItem>
            <div className="flex flex-col gap-1">
              <Label className="flex items-center gap-1">
                {form.watch("elements")[index].field?.label}
                {form.watch("elements")[index].field?.validations?.required ? (
                  "*"
                ) : (
                  <span className="py-1 px-2 rounded-md text-muted-foreground bg-slate-200 text-[9px]">Optional</span>
                )}
              </Label>
              {form.watch("elements")[index].field?.hint && (
                <Label className="text-sm text-muted-foreground font-light ">
                  {form.watch("elements")[index].field?.hint}
                </Label>
              )}
              <Input
                placeholder={
                  form.watch("elements")[index].field?.placeholder || ""
                }
                readOnly
                className="pointer-events-none"
              />
            </div>

            <FormMessage />
          </FormItem>
        )}
      />
    </FormControl>
  );
};

const LongTextInputViewItem = ({
  index,
  form,
}: {
  index: number;
  form: Form;
}) => {
  return (
    <FormControl>
      <FormField
        control={form.control}
        name={`elements.${index}.field.label`}
        render={({ field }) => (
          <FormItem>
            <div className="flex flex-col gap-1">
              <Label className="flex items-center gap-1">
                {form.watch("elements")[index].field?.label}
                {form.watch("elements")[index].field?.validations?.required ? (
                  "*"
                ) : (
                  <span className="py-1 px-2 rounded-md text-muted-foreground bg-slate-200 text-[9px]">Optional</span>
                )}
              </Label>
              {form.watch("elements")[index].field?.hint && (
                <Label className="text-sm text-muted-foreground font-light">
                  {form.watch("elements")[index].field?.hint}
                </Label>
              )}

              <Textarea
                placeholder={
                  form.watch("elements")[index].field?.placeholder || ""
                }
                readOnly
                className="pointer-events-none resize-none min-h-[200px]"
              />
            </div>

            <FormMessage />
          </FormItem>
        )}
      />
    </FormControl>
  );
};

const NumberInputViewItem = ({
  index,
  form,
}: {
  index: number;
  form: Form;
}) => {
  return (
    <FormControl>
      <FormField
        control={form.control}
        name={`elements.${index}.field.label`}
        render={({ field }) => (
          <FormItem>
       
              <div className="flex flex-col gap-1">
                <Label className="flex items-center gap-1">
                  {form.watch("elements")[index].field?.label}
                  {form.watch("elements")[index].field?.validations
                    ?.required ? (
                    "*"
                  ) : (
                    <span className="py-1 px-2 rounded-md text-muted-foreground bg-slate-200 text-[9px]">Optional</span>
                  )}
                </Label>
                <Label className="text-sm text-muted-foreground font-light">
                  {form.watch("elements")[index].field?.hint}
                </Label>
                <Input
                placeholder={
                  form.watch("elements")[index].field?.placeholder || ""
                }
                type="number"
                readOnly
                className="pointer-events-none"
              />
              </div>
      
            <FormMessage />
          </FormItem>
        )}
      />
    </FormControl>
  );
};

const SelectInputViewItem = ({
  form,
  index,
}: {
  form: Form;
  index: number;
}) => {
  return (
    <div>
      <FormField
        control={form.control}
        name={`elements.${index}.field.label`}
        render={({ field }) => (
          <FormItem>
            <div>
              <div className="flex flex-col gap-1">
                <Label className="flex items-center gap-1">
                  {form.watch("elements")[index].field?.label}
                  {form.watch("elements")[index].field?.validations
                    ?.required ? (
                    "*"
                  ) : (
                    <span className="py-1 px-2 rounded-md text-muted-foreground bg-slate-200 text-[9px]">Optional</span>
                  )}
                </Label>
                <Label className="text-sm text-muted-foreground font-light">
                  {form.watch("elements")[index].field?.hint}
                </Label>
              </div>

              {/* select */}
              <Select>
                <SelectTrigger className="w-[380px]">
                  <SelectValue
                    placeholder={
                      form.watch("elements")[index].field?.placeholder ||
                      "Select Item"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {form
                    .watch("elements")
                    [index].field?.options.map((option, i) => (
                      <SelectItem
                        className="cursor-pointer"
                        key={uuidv4()}
                        value={option || `Option ${i + 1}`}
                      >
                        {option || `Option ${i + 1}`}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const CheckboxInputViewItem = ({
  form,
  index,
}: {
  form: Form;
  index: number;
}) => {
  const [checkedOptions, setCheckedOptions] = useState<string[]>([]);

  const handleClick = (value: string) => {
    if (!!checkedOptions.includes(value)) {
      setCheckedOptions((prev) => prev.filter((el) => el !== value));
    } else {
      setCheckedOptions((prev) => [...prev, value]);
    }
  };

  return (
    <FormControl>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name={`elements.${index}.field.label`}
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-col gap-1">
                <Label className="flex items-center gap-1">
                  {form.watch("elements")[index].field?.label}
                  {form.watch("elements")[index].field?.validations
                    ?.required ? (
                    "*"
                  ) : (
                    <span className="py-1 px-2 rounded-md text-muted-foreground bg-slate-200 text-[9px]">Optional</span>
                  )}
                </Label>
                <Label className="text-sm text-muted-foreground font-light">
                  {form.watch("elements")[index].field?.hint}
                </Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem className="grid grid-cols-2 gap-3 space-y-0">
          {(form.watch(`elements.${index}.field.options`) || []).map(
            (item, i) => (
              <FormField
                key={uuidv4()}
                control={form.control}
                name={`elements.${index}.field.options.${i}`}
                render={({ field }) => (
                  <FormItem
                    key={uuidv4()}
                    className={cn(
                      "flex flex-row items-center space-x-3 space-y-0 p-6 border rounded-lg bg-white cursor-pointer",
                      !!checkedOptions.includes(item) && "bg-second text-white"
                    )}
                    onClick={() => handleClick(item)}
                  >
                    <div className="h-6">
                      {!!checkedOptions.includes(item) ? (
                        <SquareCheckBig className="h-6" />
                      ) : (
                        <Square className="h-6" />
                      )}
                    </div>
                    <FormLabel className="font-normal">
                      {item || `Option ${i + 1}`}
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )
          )}
        </FormItem>
      </div>
    </FormControl>
  );
};

const RadioInputViewItem = ({ form, index }: { form: Form; index: number }) => {
  return (
    <FormControl>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name={`elements.${index}.field.label`}
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-col gap-1">
                <Label className="flex items-center gap-1">
                  {form.watch("elements")[index].field?.label}
                  {form.watch("elements")[index].field?.validations
                    ?.required ? (
                    "*"
                  ) : (
                    <span className="py-1 px-2 rounded-md text-muted-foreground bg-slate-200 text-[9px]">Optional</span>
                  )}
                </Label>
                <Label className="text-sm text-muted-foreground font-light">
                  {form.watch("elements")[index].field?.hint}
                </Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Options */}
        <RadioGroup
          className="grid grid-cols-2 gap-3 space-y-0"
          name="options"
          defaultValue={form.watch(`elements.${index}.field.options`)[0]}
        >
          {(form.watch(`elements.${index}.field.options`) || []).map(
            (item, i) => (
              <div
                key={uuidv4()}
                className="flex flex-row items-start space-x-3 space-y-0 p-6 border rounded-lg bg-white cursor-pointer"
              >
                <RadioGroupItem value={item} id={`option-${item}-${i}`} />
                <FormLabel
                  htmlFor={`option-${item}-${i}`}
                  className="font-normal"
                >
                  {item}
                </FormLabel>
              </div>
            )
          )}
        </RadioGroup>
      </div>
    </FormControl>
  );
};

const ServiceViewItem = ({
  field,
  form,
  i,
}: {
  field: ServiceElementType;
  form: UseFormReturn<z.infer<typeof formSchema>>;
  i: number;
}) => {
  if (!form.watch("elements")[i].service?.id)
    return (
      <div className="flex p-3 text-center rounded-md border-dashed border-2  justify-center">
        <p className="font-semibold leading-relaxed text-muted-foreground ">
          Click to choose a service
        </p>
      </div>
    );
  else
    return (
      <div>
        <h3 className="capitalize ">
          service selected:{" "}
          <span className="text-muted-foreground">
            {form.watch("elements")[i].service?.name}
          </span>
        </h3>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {form.watch("elements")[i].service?.options?.map((option, i) => (
            <div
              key={option.name + i}
              className="border rounded-lg p-4 bg-white"
            >
              <h4 className="capitalize">{option.name}</h4>
              <p>€ {option.price}</p>
            </div>
          ))}
        </div>
      </div>
    );
};

const Breaker = ({ index, form }: { index: number; form: Form }) => {
  return (
    <div>
      <FormControl>
        <FormField
          control={form.control}
          name={`elements.${index}.field.label`}
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-col gap-2">
                <Button className="w-fit px-8 py-2" disabled={true}>
                  {form.watch("elements")[index].field?.label || ""}
                </Button>
                {!!form.watch("elements")[index].field?.hint && (
                  <p className="text-sm text-muted-foreground">
                    {form.watch("elements")[index].field?.hint}
                  </p>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormControl>
    </div>
  );
};

const SectionBreaker = ({ index, form }: { index: number; form: Form }) => {
  return (
    <div>
      <FormControl>
        <FormField
          control={form.control}
          name={`elements.${index}.field.hint`}
          render={({ field }) => (
            <FormItem>
              <div className="">
                {!!form.watch("elements")[index].field?.label && (
                  <p className="text-sm text-muted-foreground">
                    {form.watch("elements")[index].field?.label}
                  </p>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormControl>
    </div>
  );
};

const AddressInputViewItem = ({ index, form }: { index: number; form: Form }) => {
  return (
    <FormControl>
      {/* address meta data */}
      <FormField
        control={form.control}
        name={`elements.${index}.field.label`}
        render={({ field }) => (
          <FormItem>
            <div className="flex flex-col gap-1">
              <Label className="flex items-center gap-1">
                {form.watch("elements")[index].field?.label}
                {form.watch("elements")[index].field?.validations?.required ? (
                  "*"
                ) : (
                  <span className="py-1 px-2 rounded-md text-muted-foreground bg-slate-200 text-[9px]">Optional</span>
                )}
              </Label>
              {form.watch("elements")[index].field?.hint && (
                <Label className="text-sm text-muted-foreground font-light ">
                  {form.watch("elements")[index].field?.hint}
                </Label>
              )}
           

              {/* address fields */}

              <div className="flex items-center gap-8  flex-wrap mt-6">
              {form.watch(`elements.${index}.field.address.addressShow`) && <FormField
        control={form.control}
        name={`elements.${index}.field.address.addressLabel`}
        render={({ field }) => (
          <FormItem className="min-w-[60%] flex-1 ">
            <div className="flex flex-col gap-1">
              <Label className="flex items-center gap-1">
                {form.watch("elements")[index].field?.address?.addressLabel}
               
              </Label>
              
              <Input
                placeholder={
                  form.watch("elements")[index].field?.address?.addressLabel || ""
                }
                readOnly
                className="pointer-events-none"
              />
              
            </div>

            <FormMessage />
          </FormItem>
        )}
      />}
        {form.watch(`elements.${index}.field.address.houseNumberShow`) && <FormField
        control={form.control}
        name={`elements.${index}.field.address.houseNumberLabel`}
        render={({ field }) => (
          <FormItem className="flex-1 min-w-[25%]">
            <div className="flex flex-col gap-1">
              <Label className="flex items-center gap-1">
                {form.watch("elements")[index].field?.address?.houseNumberLabel}
               
              </Label>
             
              <Input
                placeholder={
                  form.watch("elements")[index].field?.address?.houseNumberLabel || ""
                }
                readOnly
                className="pointer-events-none"
              />
              
            </div>

            <FormMessage />
          </FormItem>
        )}
      />}
       {form.watch(`elements.${index}.field.address.postalCodeShow`) && <FormField
        control={form.control}
        name={`elements.${index}.field.address.postalCodeLabel`}
        render={({ field }) => (
          <FormItem className=" flex-1 min-w-[40%]">
            <div className="flex flex-col gap-1">
              <Label className="flex items-center gap-1">
                {form.watch("elements")[index].field?.address?.postalCodeLabel}
               
              </Label>
              
              <Input
                placeholder={
                  form.watch("elements")[index].field?.address?.postalCodeLabel || ""
                }
                readOnly
                className="pointer-events-none"
              />
              
            </div>

            <FormMessage />
          </FormItem>
        )}
      />}
        {form.watch(`elements.${index}.field.address.cityShow`) && <FormField
        control={form.control}
        name={`elements.${index}.field.address.cityLabel`}
        render={({ field }) => (
          <FormItem className=" flex-1 min-w-[40%]">
            <div className="flex flex-col gap-1">
              <Label className="flex items-center gap-1">
                {form.watch("elements")[index].field?.address?.cityLabel}
               
              </Label>
              
              <Input
                placeholder={
                  form.watch("elements")[index].field?.address?.cityLabel || ""
                }
                readOnly
                className="pointer-events-none"
              />
              
            </div>

            <FormMessage />
          </FormItem>
        )}
      />}
        {form.watch(`elements.${index}.field.address.stateRegionShow`) && <FormField
        control={form.control}
        name={`elements.${index}.field.address.stateRegionLabel`}
        render={({ field }) => (
          <FormItem className=" flex-1 min-w-[40%]">
            <div className="flex flex-col gap-1">
              <Label className="flex items-center gap-1">
                {form.watch("elements")[index].field?.address?.stateRegionLabel}
               
              </Label>
              
              <Input
                placeholder={
                  form.watch("elements")[index].field?.address?.stateRegionLabel || ""
                }
                readOnly
                className="pointer-events-none"
              />
              
            </div>

            <FormMessage />
          </FormItem>
        )}
      />}
        {form.watch(`elements.${index}.field.address.countryShow`) && <FormField
        control={form.control}
        name={`elements.${index}.field.address.countryLabel`}
        render={({ field }) => (
          <FormItem className=" flex-1 min-w-[40%]">
            <div className="flex flex-col gap-1">
              <Label className="flex items-center gap-1">
                {form.watch("elements")[index].field?.address?.countryLabel}
               
              </Label>
              
              <Input
                placeholder={
                  form.watch("elements")[index].field?.address?.countryLabel || ""
                }
                readOnly
                className="pointer-events-none"
              />
              
            </div>

            <FormMessage />
          </FormItem>
        )}
      />}
              </div>
           
            
            </div>

            <FormMessage />
          </FormItem>
        )}
      />
    </FormControl>
  );
};

const PhoneInputViewItem = ({
  index,
  form,
}: {
  index: number;
  form: Form;
}) => {
  return (
    <FormControl>
      <FormField
        control={form.control}
        name={`elements.${index}.field.label`}
        render={({ field }) => (
          <FormItem>
       
              <div className="flex flex-col gap-1">
                <Label className="flex items-center gap-1">
                  {form.watch("elements")[index].field?.label}
                  {form.watch("elements")[index].field?.validations
                    ?.required ? (
                    "*"
                  ) : (
                    <span className="py-1 px-2 rounded-md text-muted-foreground bg-slate-200 text-[9px]">Optional</span>
                  )}
                </Label>
                <Label className="text-sm text-muted-foreground font-light">
                  {form.watch("elements")[index].field?.hint}
                </Label>
                <Input
                placeholder={
                  form.watch("elements")[index].field?.placeholder || ""
                }
                type="number"
                readOnly
                className="pointer-events-none"
              />
              </div>
      
            <FormMessage />
          </FormItem>
        )}
      />
    </FormControl>
  );
};
