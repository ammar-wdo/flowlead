import { controllerElements, formSchema } from "@/schemas";
import { Form, Service } from "@prisma/client";
import React, { MouseEvent, MutableRefObject, RefObject, useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import FormItemWrapper from "./form-item-wrapper";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import {
  Form as FormComponent,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import QuillEditor from "../quill-editor";
import LoadingButton from "../loading-button";
import { Label } from "../ui/label";
import FormViewItem from "./form-view-item";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Scroller from "../scroller";
import { useSelectedElement } from "@/hooks/selected-element-hook";
import FormRightController from "./form-right-editor";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SingleImageDropzone } from "../single-image-dropeZone";

type Props = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: (
    values: z.infer<typeof formSchema>
  ) => Promise<string | number | undefined>;
  services: Service[];
  fetchedForm: Form | null | undefined;
  formRef:RefObject<HTMLDivElement>
  optionRef:RefObject<HTMLDivElement>
  ImagePlaceholder: () => React.JSX.Element | undefined
  file: File | undefined
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>
  uploadImage: () => Promise<void>
 
};

const FieldsComponent = ({ form, onSubmit, services, fetchedForm ,formRef,optionRef,ImagePlaceholder,file,setFile,uploadImage }: Props) => {
  const previousVar = useRef(1);

  const { selectedElement, setSelectedElementNull } = useSelectedElement();

  const handleDelete = (id: string, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    // Update elements
    const newOptions = form.watch("elements");
    const filteredOptions = newOptions.filter((el) => el.id !== id);
    form.setValue("elements", filteredOptions);
    previousVar.current--;

    // Update selected element if necessary
    if (selectedElement && id === selectedElement.id) {
      setSelectedElementNull();
    }

    // Update rules and check if any rule is deleted
    const rules = form.watch("rules") || [];
    let ruleDeleted = false;
    const filteredRules = rules.filter((rule) => {
      const conditionsContainElement = rule.conditions.some(
        (condition) => condition.field === id
      );
      const thenContainsElement = rule.then.field === id;
      if (conditionsContainElement || thenContainsElement) {
        ruleDeleted = true;
      }
      return !(conditionsContainElement || thenContainsElement);
    });
    form.setValue("rules", filteredRules);

    // Show toast notification if a rule is deleted
    if (ruleDeleted) {
      toast.success("A rule that contains this element has been also deleted");
    }
  };
  const isLoading = form.formState.isSubmitting;

 


 

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const items = form.watch("elements");
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newElements = arrayMove(items, oldIndex, newIndex);

      form.setValue("elements", newElements);
    }
  };

 

  const labels = form
    .watch("elements")
    .filter((element) => element.field !== undefined && element.field !== null)
    .map((element) => element.field!.label);

  const hasDuplicateLabels = labels.length !== new Set(labels).size;
  return (
    <section className="flex 2xl:gap-40 gap-20  ">
      {/* left part _canvas_ */}
      <div  className="flex-1 ">
        <div className="max-w-[1100px]">
          <FormComponent {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Form name */}
              <div className="bg-white p-8 space-y-8">
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
                      <FormLabel>
                        Service Description{" "}
                        <span className="bg-muted px-2 py-1 rounded-md text-xs">
                          Optional
                        </span>
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
                    <FormField
                    control={form.control}
                    name={`logo`}
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
                                            className={`${(!file || !!form.watch(`logo`)) && 'hidden'}`}

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
              {/* Form Elements */}
              <DndContext  onDragEnd={handleDragEnd}   >
                <SortableContext items={form.watch("elements")}>
                  <div ref={formRef}  className="bg-white p-8 space-y-8">
                    <FormField
                      control={form.control}
                      name="elements"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="">
                              {!field.value.length ? (
                                <div className="text-muted-foreground border-dashed p-8 flex items-center justify-center border-2 ">
                                  Start by drag and drop a field...
                                </div>
                              ) : (
                                field.value.map((element, i) => (
                                  <div
                                    key={element.id}
                                   
                                  >
                                    <FormViewItem
                                     
                                      handleDelete={(
                                        id: string,
                                        e: MouseEvent<HTMLButtonElement>
                                      ) => handleDelete(id, e)}
                                      element={element}
                                      form={form}
                                      i={i}
                                    />
                                  </div>
                                ))
                              )}
                            </div>
                          </FormControl>

                          {form.formState.errors.elements &&
                            form.watch("elements").length === 0 && (
                              <span className="text-red-500 mt-3">
                                At least one field or service
                              </span>
                            )}
                          {!!form.formState.errors.elements &&
                            form
                              .watch("elements")
                              .some(
                                (el) => !!el.service && !el.service?.id
                              ) && (
                              <span className="text-rose-500 mt-12 block">
                                Please choose service
                              </span>
                            )}
                          {!!form.formState.errors.rules &&
                            form
                              .watch("rules")
                              ?.some(
                                (el) =>
                                  el.conditions.some(
                                    (el) => !el.field || !el.value
                                  ) || !el.then.field
                              ) && (
                              <span className="text-rose-500 mt-12 block">
                                Please Enter Valid Rules Inputs
                              </span>
                            )}
                          {!!(
                            form.formState.errors.elements && hasDuplicateLabels
                          ) && (
                            <span className="text-rose-500 mt-12 block">
                              Fields must have unique labels
                            </span>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                </SortableContext>
                <DragOverlay
             
                  className="  w-fit "
                >
                  {
                    <div
                 
                    className=" ring-[1px] rounded-lg bg-white w-[200px] p-12 flex items-center justify-center text-xl font-bold text-gray-500 ">
                      Drop Field
                    </div>
                  }
                </DragOverlay>
              </DndContext>
              <Scroller
                variable={form.watch("elements").length}
                previousVar={previousVar}
              />
              <LoadingButton
                isLoading={isLoading}
                title={fetchedForm ? "Update" : "Submit"}
              />
              {JSON.stringify(form.formState.errors, null, 2)}
            </form>
          </FormComponent>
        </div>
      </div>

      {/* right part _controller_ */}
      <div  >
        <div className="sticky top-40 shrink-0   w-[400px]">
          {!selectedElement ? (
            <div  className="space-y-6">
              {controllerElements.map((element) => (
                <div key={uuidv4()}>
                  <h3 className="text-sm text-muted-foreground">
                    {element.section}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {element.elements.map((elementComponent) => (
                      <FormItemWrapper
                        key={uuidv4()}
                        elementComponent={elementComponent}
                        form={form}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <FormRightController optionRef={optionRef} services={services} form={form} />
          )}
        </div>{" "}
      </div>
    </section>
  );
};

export default FieldsComponent;
