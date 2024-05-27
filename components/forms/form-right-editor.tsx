import { useSelectedElement } from "@/hooks/selected-element-hook";
import { ElementTypeMapper, FieldTypeMapper, formSchema, serviceSchema } from "@/schemas";
import { Service } from "@prisma/client";
import React, { ReactNode, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type Props = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  services: Service[];
};

const FormRightController = ({ services, form }: Props) => {
  const componentsEditorMapper: { [key in ElementTypeMapper]: ReactNode } = {
    SERVICE_ELEMENT: <AddService services={services} form={form} />,
    FIELD: <FieldEditor form={form} />,
  };

  const { selectedElement, setSelectedElementNull } = useSelectedElement();

  if (!selectedElement) return;
  return (
    <div className="bg-white w-full px-12 py-6 relative">
      <Button
        size={"icon"}
        onClick={setSelectedElementNull}
        className="absolute top-1 right-1"
        variant={"ghost"}
      >
        <XIcon />
      </Button>
      {componentsEditorMapper[selectedElement?.type]}
    </div>
  );
};

export default FormRightController;

const AddService = ({
  services,
  form,
}: {
  services: Service[];
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  const [open, setOpen] = useState(false);
  const { selectedElement } = useSelectedElement();
  if (!selectedElement) return;

  const element = form
    .watch("elements")
    .find((el) => el.id === selectedElement.id);

  const service = element?.service;

  const onSelect = (serviceElement: Service) => {
    //extract selected element index to mutate it
    const elementIndex = form
      .watch("elements")
      .findIndex((el) => el.id === selectedElement.id);
    const newService = serviceElement;
    const elements = form.watch("elements");

    elements[elementIndex] = { ...elements[elementIndex], service: newService };

    form.setValue("elements", elements);

    setOpen(false);
  };

  return (
    <div>
      <h3 className="text-sm text-muted-foreground">Add Service</h3>

      <Select open={open} onOpenChange={setOpen}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={service?.name || "Select service"} />
        </SelectTrigger>
        <SelectContent>
          {services.map((serviceElement) => (
            <Button
              key={serviceElement.id}
              className="w-full"
              variant={"ghost"}
              onClick={() => onSelect(serviceElement)}
            >
              {serviceElement.name}
            </Button>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const FieldEditor = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
const {selectedElement}=useSelectedElement()
if(!selectedElement) return
const element = form.watch('elements').find(el=>el.id===selectedElement.id)?.field

    const componentsEditorMapper: { [key in FieldTypeMapper]: ReactNode } = {
       text:  <TextInputEditor form={form}/>,
        number: <NumberInputEditor form={form} />,
        breaker:null,
        checkbox:null,
        radio:null,
        select:null
      };

  return <div>
    {componentsEditorMapper[element?.type!]}
  </div>;
};



const TextInputEditor = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  const { selectedElement } = useSelectedElement();
  if (!selectedElement) return;

  const element = form
    .watch("elements")
    .find((el) => el.id === selectedElement.id);


const handleLabelChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const elementIndex = form
    .watch("elements")
    .findIndex((el) => el.id === selectedElement.id);

    form.setValue(`elements.${elementIndex}.field.label`, e.target.value)

}
const handlePlaceholderChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const elementIndex = form
    .watch("elements")
    .findIndex((el) => el.id === selectedElement.id);

    form.setValue(`elements.${elementIndex}.field.placeholder`, e.target.value)

}
const handleHintChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const elementIndex = form
    .watch("elements")
    .findIndex((el) => el.id === selectedElement.id);

    form.setValue(`elements.${elementIndex}.field.hint`, e.target.value)

}
  return (
    <div className="space-y-3">
      <div>
        <Label>Label:</Label>
        <Input value={element?.field?.label} onChange={e=>handleLabelChange(e)}/>
      </div>
      <div>
        <Label>Placeholder:</Label>
        <Input value={element?.field?.placeholder||''} onChange={e=>handlePlaceholderChange(e)}/>
      </div>
      <div>
        <Label>Hint:</Label>
        <Input value={element?.field?.hint||''} onChange={e=>handleHintChange(e)}/>
      </div>
    </div>
  );
};


const NumberInputEditor = ({
    form,
  }: {
    form: UseFormReturn<z.infer<typeof formSchema>>;
  }) => {
    const { selectedElement } = useSelectedElement();
    if (!selectedElement) return;
  
    const element = form
      .watch("elements")
      .find((el) => el.id === selectedElement.id);
  
  
  const handleLabelChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
      const elementIndex = form
      .watch("elements")
      .findIndex((el) => el.id === selectedElement.id);
  
      form.setValue(`elements.${elementIndex}.field.label`, e.target.value)
  
  }
  const handlePlaceholderChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
      const elementIndex = form
      .watch("elements")
      .findIndex((el) => el.id === selectedElement.id);
  
      form.setValue(`elements.${elementIndex}.field.placeholder`, e.target.value)
  
  }
  const handleHintChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
      const elementIndex = form
      .watch("elements")
      .findIndex((el) => el.id === selectedElement.id);
  
      form.setValue(`elements.${elementIndex}.field.hint`, e.target.value)
  
  }
    return (
      <div className="space-y-3">
        <div>
          <Label>Label:</Label>
          <Input value={element?.field?.label} onChange={e=>handleLabelChange(e)}/>
        </div>
        <div>
          <Label>Placeholder:</Label>
          <Input value={element?.field?.placeholder||''} onChange={e=>handlePlaceholderChange(e)}/>
        </div>
        <div>
          <Label>Hint:</Label>
          <Input value={element?.field?.hint||''} onChange={e=>handleHintChange(e)}/>
        </div>
      </div>
    );
  };
