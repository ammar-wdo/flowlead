import {
  FieldTypeMapper,
  LogicalOperatorType,
  elementSchema,
  formSchema,
  logicOperatorArray,
  logicOperatorEnum,
  ruleSchema,
  rulesActionArray,
} from "@/schemas";
import { ComparisonOperator, Element, FieldType, Form } from "@prisma/client";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../ui/button";
import { Plus, XIcon } from "lucide-react";
import {
  Form as FormComponent,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { operatorTypeMapp } from "@/mapping";
import { Input } from "../ui/input";
import LoadingButton from "../loading-button";
import { cn } from "@/lib/utils";

type Props = {
  fetchedForm: Form | undefined | null;
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
};

type Rule = z.infer<typeof ruleSchema>;

const RulesComponent = ({ fetchedForm, form, onSubmit }: Props) => {
  const addRule = () => {
    const rules = form.watch("rules") || [];
    form.setValue("rules", [
      ...rules,
      { id:uuidv4(),
        conditions: [
          {
          id:uuidv4(),
            value: "",
            field: "",
            operator: "NOT_EMPTY",
           logicalOperator:'AND'
          },
        ],
       
        then: { field: "", action: "SHOW" },
      },
    ]);
  };

  const addCondition = (ruleIndex: number) => {
    const rule = form.watch(`rules.${ruleIndex}`);
    const conditions = rule.conditions;
    form.setValue(`rules.${ruleIndex}`, {
      ...rule,
      conditions: [
        ...conditions,
        {
          id:uuidv4(),
          value: "",
          field: "",
          operator: "NOT_EMPTY",
          logicalOperator:'AND'

        
        },
      ],
    });
  };
  const handleDelete = (id: string) => {
    const rules = form.watch("rules");
    const filteredRules = rules?.filter((el, index) => el.id !==id);
    form.setValue("rules", filteredRules);
  };

  const handleDeleteCondition = (ruleIndex:number,conditionId:string)=>{

    const conditions = form.watch(`rules.${ruleIndex}.conditions`)
    const filteredConditions = conditions.filter((el,i)=>el.id !==conditionId)
    form.setValue(`rules.${ruleIndex}.conditions`,filteredConditions)

  }
  return (
    <section>
      <FormComponent {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          {form.watch("rules")?.map((rule, i) => (
            <FormField
              key={rule.id}
              control={form.control}
              name={`rules.${i}`}
              render={({ field }) => (
                <FormItem className="bg-white p-8 grid grid-cols-2 gap-24 items-start !space-y-0 relative group">
                  <Button
                    onClick={() => handleDelete(rule.id)}
                    type="button"
                    variant={"ghost"}
                    className="right-1  opacity-0 group-hover:opacity-100 
            transition top-1  absolute hover:bg-white
            bg-white  hover:shadow-gray-300  shadow-md rounded-lg
             text-gray-300 hover:shadow-lg flex items-center justify-center w-8 h-8  p-0.5"
                  >
                    <XIcon />
                  </Button>
                  {/* if */}
                  <div className="">
                    <h3>If</h3>
                    {form
                      .watch(`rules.${i}.conditions`)
                      .map((el, conditionsIndex) => (
                        <div
                          className={cn("p-6 hover:bg-muted/60 transition rounded-md relative group/two", )}
                          key={el.id}
                        >
                          { form
                      .watch(`rules.${i}.conditions`).length > 1 && <Button
                    onClick={() => handleDeleteCondition(i,el.id)}
                    type="button"
                    variant={"ghost"}
                    className="right-1  opacity-0 group-hover/two:opacity-100 
            transition top-1  absolute hover:bg-white
            bg-white  hover:shadow-gray-300  shadow-md rounded-lg
             text-gray-300 hover:shadow-lg flex items-center justify-center w-5 h-5  p-0.5"
                  >
                    <XIcon />
                  </Button>}
                          <FormField
                            control={form.control}
                            name={`rules.${i}.conditions.${conditionsIndex}.field`}
                            render={({ field }) => (
                              <FormItem className="">
                                <Select
                                  onValueChange={(val=>{field.onChange(val);form.setValue(`rules.${i}.conditions.${conditionsIndex}.value`,'')})}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="text-start">
                                      <SelectValue placeholder="Select a field please" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {form
                                      .watch("elements")
                                      .map((element, elementIndex) => {
                                        if (element.type === "SERVICE_ELEMENT")
                                          return (
                                            <SelectItem
                                              className="cursor-pointer"
                                              key={`element-${element.id}`}
                                              value={element.id}
                                            >
                                              <div className="flex flex-col ">
                                                <span className="capitalize">
                                                  {element.service?.name}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                  Service
                                                </span>
                                              </div>
                                            </SelectItem>
                                          );
                                        else {
                                          if (
                                            element.field?.type ===
                                              "sectionBreaker" ||
                                            element.field?.type === "breaker" ||
                                            element.field?.type === "address" ||
                                            element.field?.type === "email" || 
                                            element.field?.type === "name"
                                          )
                                            return;
                                          return (
                                            <SelectItem
                                              className="cursor-pointer"
                                              key={`element-${element.id}`}
                                              value={element.id}
                                            >
                                              <div className="flex flex-col items-start">
                                                <span className="capitalize text-start">
                                                  {element.field?.label}
                                                </span>
                                                <span className="text-xs text-muted-foreground capitalize">
                                                  {element.field?.type}
                                                </span>
                                              </div>
                                            </SelectItem>
                                          );
                                        }
                                      })}
                                  </SelectContent>
                                </Select>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {/* operator */}
                          <div className="grid grid-cols-3 gap-2 mt-4">
                            <FormField
                              control={form.control}
                              name={`rules.${i}.conditions.${conditionsIndex}.operator`}
                              render={({ field }) => {
                                const selectedField = form.watch(
                                  `rules.${i}.conditions.${conditionsIndex}.field`
                                );
                                const element = form
                                  .watch("elements")
                                  .find((el) => el.id === selectedField);
                                const fieldType =
                                  element?.field?.type || "radio";
                                const operators = selectedField
                                  ? fieldType
                                    ? operatorTypeMapp[
                                        fieldType as FieldTypeMapper
                                      ]
                                    : []
                                  : [];
                                return (
                                  <FormItem>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select an operator" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {operators.map((operator) => (
                                          <SelectItem
                                            key={operator}
                                            value={operator}
                                            className="cursor-pointer"
                                          >
                                            {operator}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                );
                              }}
                            />
                            {/* value */}
                            <FormField
                              control={form.control}
                              name={`rules.${i}.conditions.${conditionsIndex}.value`}
                              render={({ field }) => {
                                const selectedField = form.watch(
                                  `rules.${i}.conditions.${conditionsIndex}.field`
                                );
                                const operator = form.watch(
                                  `rules.${i}.conditions.${conditionsIndex}.operator`
                                );
                                const element =
                                  form
                                    .watch("elements")
                                    .find((el) => el.id === selectedField) ||
                                  null;
                                const fieldType =
                                  element?.field?.type || "radio";

                                return (
                                  <FormItem className="col-span-2 ">
                                    {renderValueComponent(
                                      fieldType,
                                      operator,
                                      field,
                                      element
                                    )}
                                    <FormMessage />
                                  </FormItem>
                                );
                              }}
                            />
                          </div>
                          {/* render logical operator only if we have conditions length more than the current index */}
                          {!!(
                            form.watch(`rules.${i}.conditions`).length >
                            conditionsIndex + 1
                          ) && (
                            <FormField
                              control={form.control}
                              name={`rules.${i}.conditions.${conditionsIndex}.logicalOperator`}
                              render={({ field }) => (
                                <FormItem className="mt-4">
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value as LogicalOperatorType}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a verified email to display" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {logicOperatorEnum.map((operator) => (
                                        <SelectItem
                                        key={operator}
                                          className="cursor-pointer"
                                          value={operator}
                                        >
                                          {operator}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>

                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>
                      ))}
                    <Button
                      type="button"
                      onClick={() => addCondition(i)}
                      variant={"link"}
                      className="text-second text-xs"
                    >
                      Add Condition
                    </Button>
                  </div>
                  {/* then */}
                  <div>
                    <h3>Then</h3>
                    <FormField
                      control={form.control}
                      name={`rules.${i}.then.action`}
                      render={({ field }) => (
                        <FormItem className=" p-6 ">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a verified email to display" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {rulesActionArray.map((action) => (
                                <SelectItem
                                  className="cursor-pointer"
                                  key={action}
                                  value={action}
                                >
                                  {action}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* check if we have chosen atleast one value to render the then value */}
                    {!form
                      .watch(`rules.${i}.conditions`)
                      .every((el) => !el.field) && (
                      <FormField
                        control={form.control}
                        name={`rules.${i}.then.field`}
                        render={({ field }) => (
                          <FormItem className="mt-4 px-6">
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className=" text-start">
                                  <SelectValue
                                    className=" text-start"
                                    placeholder="Select a field please"
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {form
                                  .watch("elements")
                                  .map((element, elementIndex) => {
                                    if (
                                      form
                                        .watch(`rules.${i}.conditions`)
                                        .some((el) => el.field === element.id)
                                    )
                                      return null;
                                    if (element.type === "SERVICE_ELEMENT")
                                      return (
                                        <SelectItem
                                          className="cursor-pointer"
                                          key={`value-element-${element.id}`}
                                          value={element.id}
                                        >
                                          <div className="flex flex-col items-start">
                                            <span className="capitalize">
                                              {element.service?.name}
                                            </span>
                                            <span className="text-xs text-muted-foreground text-start">
                                              Service
                                            </span>
                                          </div>
                                        </SelectItem>
                                      );
                                    else {
                                      if (
                                        element.field?.type ===
                                          "sectionBreaker" ||
                                        element.field?.type === "breaker" ||
                                        element.field?.type === "address" ||
                                        element.field?.type === "name" || 
                                        element.field?.type === "email"
                                      )
                                        return;
                                      return (
                                        <SelectItem
                                          className="cursor-pointer"
                                          key={`element-${element.id}`}
                                          value={element.id}
                                        >
                                          <div className="flex flex-col ">
                                            <span className="capitalize">
                                              {element.field?.label}
                                            </span>
                                            <span className="text-xs text-muted-foreground capitalize">
                                              {element.field?.type}
                                            </span>
                                          </div>
                                        </SelectItem>
                                      );
                                    }
                                  })}
                              </SelectContent>
                            </Select>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            onClick={addRule}
            variant={"link"}
            className="text-second"
          >
            <Plus className="mr-3" />
            Add Rule
          </Button>

          <LoadingButton
            title="Submit"
            isLoading={form.formState.isSubmitting}
          />
        </form>
      </FormComponent>
    </section>
  );
};

export default RulesComponent;

const renderValueComponent = (
  fieldType: FieldType,
  operator: ComparisonOperator,
  field: any,
  element: z.infer<typeof elementSchema> | null
) => {
  const emptyOperators = ["EMPTY", "NOT_EMPTY"];
  const showSelect = ["select", "checkbox", "radio"].includes(fieldType || "");
  const showTextInput = ["text", "longText", "number"].includes(
    fieldType || ""
  );

  if (!element) return null;

  if (emptyOperators.includes(operator || "")) {
    return null;
  }

  if (showSelect) {
    return (
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a value" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {element?.service?.options?.map((option: any) => (
            <SelectItem
              key={option.id}
              value={option.id}
              className="cursor-pointer"
            >
              {option.name}
            </SelectItem>
          ))}
          {element?.field?.options?.map((option: string, index: number) => (
            <SelectItem key={index} value={option} className="cursor-pointer">
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (showTextInput) {
    return <Input  placeholder="Enter value" {...field} />;
  }

  return null;
};
