import { useSelectedElement } from "@/hooks/selected-element-hook";
import {
  ElementTypeMapper,
  FieldTypeMapper,
  formSchema,
  serviceSchema,
} from "@/schemas";
import { Service } from "@prisma/client";
import React, { ReactNode, RefObject, useState } from "react";
import { Path, UseFormReturn, useFieldArray } from "react-hook-form";
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
import { Checkbox } from "../ui/checkbox";
import { v4 as uuidv4 } from "uuid";
import { inputsLabelsMap } from "@/mapping";
import { Switch } from "../ui/switch";

type Props = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  services: Service[];
  optionRef:RefObject<HTMLDivElement>
};

const FormRightController = ({ services, form ,optionRef}: Props) => {
  const componentsEditorMapper: { [key in ElementTypeMapper]: ReactNode } = {
    SERVICE_ELEMENT: <AddService services={services} form={form} />,
    FIELD: <FieldEditor form={form} />,
  };

  const { selectedElement, setSelectedElementNull } = useSelectedElement();
  const elementType = form
    .watch("elements")
    .find((el) => el.id === selectedElement?.id)?.field?.type;
  if (!selectedElement) return;

  return (
    <div ref={optionRef} className="bg-white  px-12 py-6 w-[400px]">
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold">
          {inputsLabelsMap[elementType!] || "Service"}
        </p>
        <Button
          size={"icon"}
          onClick={setSelectedElementNull}
          className=""
          variant={"ghost"}
        >
          <XIcon />
        </Button>
      </div>

      {componentsEditorMapper[selectedElement?.type]}
    </div>
  );
};

export default FormRightController;

const FieldEditor = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  const { selectedElement } = useSelectedElement();
  if (!selectedElement) return;
  const element = form
    .watch("elements")
    .find((el) => el.id === selectedElement.id)?.field;

  const componentsEditorMapper: { [key in FieldTypeMapper]: ReactNode } = {
    text: <TextInputEditor form={form} />,
    number: <NumberInputEditor form={form} />,
    breaker: <PageBreakEditor form={form} />,
    checkbox: <CheckboxInputEditor form={form} />,
    radio: <RadioGroupInputEditor form={form} />,
    select: <SelectInputEditor form={form} />,
    sectionBreaker: <SectionBreakEditor form={form} />,
    longText: <LongTextInputEditor form={form} />,
    address: <AddressInputEditor form={form} />,
    phone: <PhoneInputEditor form={form} />,
    name: <NameInputEditor form={form} />,
    email: <EmailInputEditor form={form} />,
    date:<DateInputEditor    form={form}    />
  };

  return <div>{componentsEditorMapper[element?.type!]}</div>;
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

  const elementIndex = form
    .watch("elements")
    .findIndex((el) => el.id === selectedElement.id);
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.label`, e.target.value);
  };
  const handlePlaceholderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.placeholder`, e.target.value);
  };
  const handleHintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.hint`, e.target.value);
  };

  const handleRequired = () => {
    form.setValue(
      `elements.${elementIndex}.field.validations.required`,
      !form.watch(`elements.${elementIndex}.field.validations.required`)
    );
  };

  const maxLength = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(
      `elements.${elementIndex}.field.validations.maxLength`,
      +e.target.value
    );
  };
  const minLength = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(
      `elements.${elementIndex}.field.validations.minLength`,
      +e.target.value
    );
  };
  return (
    <div className="space-y-3">
      <div>
        <Label>Label:</Label>
        <Input
          value={element?.field?.label}
          onChange={(e) => handleLabelChange(e)}
        />
      </div>
      <div>
        <Label>Placeholder:</Label>
        <Input
          value={element?.field?.placeholder || ""}
          onChange={(e) => handlePlaceholderChange(e)}
        />
      </div>
      <div>
        <Label>Hint:</Label>
        <Input
          value={element?.field?.hint || ""}
          onChange={(e) => handleHintChange(e)}
        />
      </div>
      <div className="flex items-center gap-1">
        <Checkbox
          id="required"
          onCheckedChange={handleRequired}
          checked={
            !!form.watch(`elements.${elementIndex}.field.validations.required`)
          }
        />
        <Label htmlFor="required">Is Required</Label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Max Length:</Label>
          <Input
            min={1}
            type="number"
            value={element?.field?.validations?.maxLength || undefined}
            onChange={(e) => maxLength(e)}
          />
        </div>
        <div>
          <Label>Min Length:</Label>
          <Input
            min={1}
            type="number"
            value={element?.field?.validations?.minLength || undefined}
            onChange={(e) => minLength(e)}
          />
        </div>
      </div>
    </div>
  );
};

const LongTextInputEditor = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  const { selectedElement } = useSelectedElement();
  if (!selectedElement) return;

  const element = form
    .watch("elements")
    .find((el) => el.id === selectedElement.id);

  const elementIndex = form
    .watch("elements")
    .findIndex((el) => el.id === selectedElement.id);
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.label`, e.target.value);
  };
  const handlePlaceholderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.placeholder`, e.target.value);
  };
  const handleHintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.hint`, e.target.value);
  };

  const handleRequired = () => {
    form.setValue(
      `elements.${elementIndex}.field.validations.required`,
      !form.watch(`elements.${elementIndex}.field.validations.required`)
    );
  };

  const maxLength = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(
      `elements.${elementIndex}.field.validations.maxLength`,
      +e.target.value
    );
  };
  const minLength = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(
      `elements.${elementIndex}.field.validations.minLength`,
      +e.target.value
    );
  };
  return (
    <div className="space-y-3">
      <div>
        <Label>Label:</Label>
        <Input
          value={element?.field?.label}
          onChange={(e) => handleLabelChange(e)}
        />
      </div>
      <div>
        <Label>Placeholder:</Label>
        <Input
          value={element?.field?.placeholder || ""}
          onChange={(e) => handlePlaceholderChange(e)}
        />
      </div>
      <div>
        <Label>Hint:</Label>
        <Input
          value={element?.field?.hint || ""}
          onChange={(e) => handleHintChange(e)}
        />
      </div>
      <div className="flex items-center gap-1">
        <Checkbox
          id="required"
          onCheckedChange={handleRequired}
          checked={
            !!form.watch(`elements.${elementIndex}.field.validations.required`)
          }
        />
        <Label htmlFor="required">Is Required</Label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Max Length:</Label>
          <Input
            min={1}
            type="number"
            value={element?.field?.validations?.maxLength || undefined}
            onChange={(e) => maxLength(e)}
          />
        </div>
        <div>
          <Label>Min Length:</Label>
          <Input
            min={1}
            type="number"
            value={element?.field?.validations?.minLength || undefined}
            onChange={(e) => minLength(e)}
          />
        </div>
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

  const elementIndex = form
    .watch("elements")
    .findIndex((el) => el.id === selectedElement.id);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.label`, e.target.value);
  };
  const handlePlaceholderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.placeholder`, e.target.value);
  };
  const handleHintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.hint`, e.target.value);
  };

  const handleRequired = () => {
    form.setValue(
      `elements.${elementIndex}.field.validations.required`,
      !form.watch(`elements.${elementIndex}.field.validations.required`)
    );
  };

  const max = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(
      `elements.${elementIndex}.field.validations.max`,
      +e.target.value
    );
  };
  const min = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(
      `elements.${elementIndex}.field.validations.min`,
      +e.target.value
    );
  };
  return (
    <div className="space-y-3">
      <div>
        <Label>Label:</Label>
        <Input
          value={element?.field?.label}
          onChange={(e) => handleLabelChange(e)}
        />
      </div>
      <div>
        <Label>Placeholder:</Label>
        <Input
          value={element?.field?.placeholder || ""}
          onChange={(e) => handlePlaceholderChange(e)}
        />
      </div>
      <div>
        <Label>Hint:</Label>
        <Input
          value={element?.field?.hint || ""}
          onChange={(e) => handleHintChange(e)}
        />
      </div>
      <div className="flex items-center gap-1">
        <Checkbox
          id="required"
          onCheckedChange={handleRequired}
          checked={
            !!form.watch(`elements.${elementIndex}.field.validations.required`)
          }
        />
        <Label htmlFor="required">Is Required</Label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Max Value:</Label>
          <Input
            min={1}
            type="number"
            value={element?.field?.validations?.max || undefined}
            onChange={(e) => max(e)}
          />
        </div>
        <div>
          <Label>Min Value:</Label>
          <Input
            min={0}
            type="number"
            value={element?.field?.validations?.min || undefined}
            onChange={(e) => min(e)}
          />
        </div>
      </div>
    </div>
  );
};

const SelectInputEditor = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  const { selectedElement } = useSelectedElement();

  type FieldArrayPath = `elements.${number}.field.options`;

  const element = form
    .watch("elements")
    .find((el) => el.id === selectedElement?.id);

  const elementIndex = form
    .watch("elements")
    .findIndex((el) => el.id === selectedElement?.id);

  const { fields, append } = useFieldArray({
    control: form.control,
    // @ts-ignore
    name: `elements.${elementIndex}.field.options` as FieldArrayPath,
  });

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.label`, e.target.value);
  };
  const handlePlaceholderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.placeholder`, e.target.value);
  };
  const handleHintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.hint`, e.target.value);
  };
  const handleRequired = () => {
    form.setValue(
      `elements.${elementIndex}.field.validations.required`,
      !form.watch(`elements.${elementIndex}.field.validations.required`)
    );
  };

  const handleOptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number
  ) => {
    form.setValue(
      `elements.${elementIndex}.field.options.${i}`,
      e.target.value
    );
  };

  const handleAddOption = () => {
    const options = form.getValues(`elements.${elementIndex}.field.options`);
    form.setValue(`elements.${elementIndex}.field.options`, [
      ...options,
      `Option ${options.length + 1}`,
    ]);
  };

  const handleDeleteOption = (i: number) => {
    const options = form.getValues(`elements.${elementIndex}.field.options`);
    const newOptions = options.filter((option, index) => index !== i);
    form.setValue(`elements.${elementIndex}.field.options`, newOptions);
  };
  return (
    <div className="space-y-3">
      <div>
        <Label>Label:</Label>
        <Input
          value={element?.field?.label}
          onChange={(e) => handleLabelChange(e)}
        />
      </div>
      <div>
        <Label>Placeholder:</Label>
        <Input
          value={element?.field?.placeholder || ""}
          onChange={(e) => handlePlaceholderChange(e)}
        />
      </div>
      <div>
        <Label>Hint:</Label>
        <Input
          value={element?.field?.hint || ""}
          onChange={(e) => handleHintChange(e)}
        />
      </div>
      <div className="flex items-center gap-1">
        <Checkbox
          id="required"
          onCheckedChange={handleRequired}
          checked={
            !!form.watch(`elements.${elementIndex}.field.validations.required`)
          }
        />
        <Label htmlFor="required">Is Required</Label>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <h3 className="">Options</h3>
          <Button
            onClick={handleAddOption}
            className="text-sm"
            variant={"secondary"}
          >
            Add Option
          </Button>
        </div>

        <div className="mt-4 space-y-2">
          {fields.map((field, i) => (
            <div key={field.id} className="flex items-center gap-4">
              <Input
                value={
                  form.watch(`elements.${elementIndex}.field.options.${i}`) ||
                  `Option ${i + 1}`
                }
                onChange={(e) => handleOptionChange(e, i)}
              />
              {!!(fields.length > 1) && (
                <Button
                  onClick={() => handleDeleteOption(i)}
                  size={"icon"}
                  variant={"ghost"}
                >
                  <XIcon />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CheckboxInputEditor = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  const { selectedElement } = useSelectedElement();

  type FieldArrayPath = `elements.${number}.field.options`;

  const element = form
    .watch("elements")
    .find((el) => el.id === selectedElement?.id);

  const elementIndex = form
    .watch("elements")
    .findIndex((el) => el.id === selectedElement?.id);

  const { fields, append } = useFieldArray({
    control: form.control,
    // @ts-ignore
    name: `elements.${elementIndex}.field.options` as FieldArrayPath,
  });

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.label`, e.target.value);
  };
  const handlePlaceholderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.placeholder`, e.target.value);
  };
  const handleHintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.hint`, e.target.value);
  };
  const handleRequired = () => {
    form.setValue(
      `elements.${elementIndex}.field.validations.required`,
      !form.watch(`elements.${elementIndex}.field.validations.required`)
    );
  };

  const handleOptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number
  ) => {
    form.setValue(
      `elements.${elementIndex}.field.options.${i}`,
      e.target.value
    );
  };

  const handleAddOption = () => {
    const options = form.getValues(`elements.${elementIndex}.field.options`);
    form.setValue(`elements.${elementIndex}.field.options`, [
      ...options,
      `Option ${options.length + 1}`,
    ]);
  };

  const handleDeleteOption = (i: number) => {
    const options = form.getValues(`elements.${elementIndex}.field.options`);
    const newOptions = options.filter((option, index) => index !== i);
    form.setValue(`elements.${elementIndex}.field.options`, newOptions);
  };
  return (
    <div className="space-y-3">
      <div>
        <Label>Label:</Label>
        <Input
          value={element?.field?.label}
          onChange={(e) => handleLabelChange(e)}
        />
      </div>

      <div>
        <Label>Hint:</Label>
        <Input
          value={element?.field?.hint || ""}
          onChange={(e) => handleHintChange(e)}
        />
      </div>
      <div className="flex items-center gap-1">
        <Checkbox
          id="required"
          onCheckedChange={handleRequired}
          checked={
            !!form.watch(`elements.${elementIndex}.field.validations.required`)
          }
        />
        <Label htmlFor="required">Is Required</Label>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <h3 className="">Options</h3>
          <Button
            onClick={handleAddOption}
            className="text-sm"
            variant={"secondary"}
          >
            Add Option
          </Button>
        </div>

        <div className="mt-4 space-y-2">
          {fields.map((field, i) => (
            <div key={field.id} className="flex items-center gap-4">
              <Input
                value={
                  form.watch(`elements.${elementIndex}.field.options.${i}`) ||
                  `Option ${i + 1}`
                }
                onChange={(e) => handleOptionChange(e, i)}
              />
              {!!(fields.length > 1) && (
                <Button
                  onClick={() => handleDeleteOption(i)}
                  size={"icon"}
                  variant={"ghost"}
                >
                  <XIcon />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RadioGroupInputEditor = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  const { selectedElement } = useSelectedElement();
  const elementIndex = form
    .watch("elements")
    .findIndex((el) => el.id === selectedElement?.id);

  const { fields, append } = useFieldArray({
    control: form.control,
    // @ts-ignore
    name: `elements.${elementIndex}.field.options` as FieldArrayPath,
  });

  type FieldArrayPath = `elements.${number}.field.options`;

  const element = form
    .watch("elements")
    .find((el) => el.id === selectedElement?.id);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.label`, e.target.value);
  };
  const handlePlaceholderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.placeholder`, e.target.value);
  };
  const handleHintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.hint`, e.target.value);
  };
  const handleRequired = () => {
    form.setValue(
      `elements.${elementIndex}.field.validations.required`,
      !form.watch(`elements.${elementIndex}.field.validations.required`)
    );
  };

  const handleOptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number
  ) => {
    form.setValue(
      `elements.${elementIndex}.field.options.${i}`,
      e.target.value
    );
  };

  const handleAddOption = () => {
    const options = form.getValues(`elements.${elementIndex}.field.options`);
    form.setValue(`elements.${elementIndex}.field.options`, [
      ...options,
      `Option ${options.length + 1}`,
    ]);
  };

  const handleDeleteOption = (i: number) => {
    const options = form.getValues(`elements.${elementIndex}.field.options`);
    const newOptions = options.filter((option, index) => index !== i);
    form.setValue(`elements.${elementIndex}.field.options`, newOptions);
  };
  return (
    <div className="space-y-3">
      <div>
        <Label>Label:</Label>
        <Input
          value={element?.field?.label}
          onChange={(e) => handleLabelChange(e)}
        />
      </div>

      <div>
        <Label>Hint:</Label>
        <Input
          value={element?.field?.hint || ""}
          onChange={(e) => handleHintChange(e)}
        />
      </div>
      <div className="flex items-center gap-1">
        <Checkbox
          id="required"
          onCheckedChange={handleRequired}
          checked={
            !!form.watch(`elements.${elementIndex}.field.validations.required`)
          }
        />
        <Label htmlFor="required">Is Required</Label>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <h3 className="">Options</h3>
          <Button
            onClick={handleAddOption}
            className="text-sm"
            variant={"secondary"}
          >
            Add Option
          </Button>
        </div>

        <div className="mt-4 space-y-2">
          {fields.map((field, i) => (
            <div key={field.id} className="flex items-center gap-4">
              <Input
                value={
                  form.watch(`elements.${elementIndex}.field.options.${i}`) ||
                  `Option ${i + 1}`
                }
                onChange={(e) => handleOptionChange(e, i)}
              />
              {!!(fields.length > 1) && (
                <Button
                  onClick={() => handleDeleteOption(i)}
                  size={"icon"}
                  variant={"ghost"}
                >
                  <XIcon />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PageBreakEditor = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  const { selectedElement } = useSelectedElement();
  if (!selectedElement) return;

  const element = form
    .watch("elements")
    .find((el) => el.id === selectedElement.id);

  const elementIndex = form
    .watch("elements")
    .findIndex((el) => el.id === selectedElement.id);
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.label`, e.target.value);
  };

  const handleHintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.hint`, e.target.value);
  };
  const handlePlaceholderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.placeholder`, e.target.value);
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>Label:</Label>
        <Input
          value={element?.field?.label}
          onChange={(e) => handleLabelChange(e)}
        />
      </div>

      <div>
        <Label>Placeholder:</Label>
        <Input
          value={element?.field?.placeholder || ""}
          onChange={(e) => handlePlaceholderChange(e)}
        />
      </div>
      <div>
        <Label>Hint:</Label>
        <Input
          value={element?.field?.hint || ""}
          onChange={(e) => handleHintChange(e)}
        />
      </div>
    </div>
  );
};

const SectionBreakEditor = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  const { selectedElement } = useSelectedElement();
  if (!selectedElement) return;

  const element = form
    .watch("elements")
    .find((el) => el.id === selectedElement.id);

  const elementIndex = form
    .watch("elements")
    .findIndex((el) => el.id === selectedElement.id);
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.label`, e.target.value);
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>Label:</Label>
        <Input
          value={element?.field?.label}
          onChange={(e) => handleLabelChange(e)}
        />
      </div>
    </div>
  );
};

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

    form.setValue(`elements.${elementIndex}.service`, newService);

    setOpen(false);
  };

  return (
    <div>
      <h3 className="text-sm text-muted-foreground">Add Service</h3>

      <Select open={open} onOpenChange={setOpen} >
        <SelectTrigger className="w-full capitalize font-semibold">
          <SelectValue
            className=""
            placeholder={service?.name || "Select service"}
          />
        </SelectTrigger>
        <SelectContent>
          {services.map((serviceElement) => (
            <Button
              key={serviceElement.id}
              className="w-full justify-start capitalize"
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

const AddressInputEditor = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  const { selectedElement } = useSelectedElement();
  if (!selectedElement) return;

  const element = form
    .watch("elements")
    .find((el) => el.id === selectedElement.id);

  const elementIndex = form
    .watch("elements")
    .findIndex((el) => el.id === selectedElement.id);
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.label`, e.target.value);
  };

  const handleHintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.hint`, e.target.value);
  };

  const handleRequired = () => {
    form.setValue(
      `elements.${elementIndex}.field.validations.required`,
      !form.watch(`elements.${elementIndex}.field.validations.required`)
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div>
          <Label>Label:</Label>
          <Input
            value={element?.field?.label}
            onChange={(e) => handleLabelChange(e)}
          />
        </div>

        <div>
          <Label>Hint:</Label>
          <Input
            value={element?.field?.hint || ""}
            onChange={(e) => handleHintChange(e)}
          />
        </div>
      </div>

      <div className="">
        <h3>Address Fields</h3>
        <div className="grid grid-cols-2 items-center gap-2 my-2">
          <p>Show Field</p>
          <p>Field Name</p>
        </div>
        <AddressControlItem
          value={
            form.watch(`elements.${elementIndex}.field.address.addressLabel`) ||
            ""
          }
          onChange={(value: string) =>
            form.setValue(
              `elements.${elementIndex}.field.address.addressLabel`,
              value
            )
          }

          showValue={!!form.watch(`elements.${elementIndex}.field.address.addressShow`)}
          showChange={(value:boolean)=>form.setValue(
            `elements.${elementIndex}.field.address.addressShow`,
            value
          )}
          label="Address"
        />
        <AddressControlItem
          value={
            form.watch(
              `elements.${elementIndex}.field.address.houseNumberLabel`
            ) || ""
          }
          onChange={(value: string) =>
            form.setValue(
              `elements.${elementIndex}.field.address.houseNumberLabel`,
              value
            )
          }
          showValue={!!form.watch(`elements.${elementIndex}.field.address.houseNumberShow`)}
          showChange={(value:boolean)=>form.setValue(
            `elements.${elementIndex}.field.address.houseNumberShow`,
            value
          )}
          label="House Number"
        />
        <AddressControlItem
          value={
            form.watch(
              `elements.${elementIndex}.field.address.postalCodeLabel`
            ) || ""
          }
          onChange={(value: string) =>
            form.setValue(
              `elements.${elementIndex}.field.address.postalCodeLabel`,
              value
            )
          }
          showValue={!!form.watch(`elements.${elementIndex}.field.address.postalCodeShow`)}
          showChange={(value:boolean)=>form.setValue(
            `elements.${elementIndex}.field.address.postalCodeShow`,
            value
          )}
          label="Postal Code"
        />
        <AddressControlItem
          value={
            form.watch(`elements.${elementIndex}.field.address.cityLabel`) || ""
          }
          onChange={(value: string) =>
            form.setValue(
              `elements.${elementIndex}.field.address.cityLabel`,
              value
            )
          }
          showValue={!!form.watch(`elements.${elementIndex}.field.address.cityShow`)}
          showChange={(value:boolean)=>form.setValue(
            `elements.${elementIndex}.field.address.cityShow`,
            value
          )}
          label="City"
        />
        <AddressControlItem
          value={
            form.watch(
              `elements.${elementIndex}.field.address.stateRegionLabel`
            ) || ""
          }
          onChange={(value: string) =>
            form.setValue(
              `elements.${elementIndex}.field.address.stateRegionLabel`,
              value
            )
          }
          showValue={!!form.watch(`elements.${elementIndex}.field.address.stateRegionShow`)}
          showChange={(value:boolean)=>form.setValue(
            `elements.${elementIndex}.field.address.stateRegionShow`,
            value
          )}
          label="State / Region"
        />
        <AddressControlItem
          value={
            form.watch(`elements.${elementIndex}.field.address.countryLabel`) ||
            ""
          }
          onChange={(value: string) =>
            form.setValue(
              `elements.${elementIndex}.field.address.countryLabel`,
              value
            )
          }
          showValue={!!form.watch(`elements.${elementIndex}.field.address.countryShow`)}
          showChange={(value:boolean)=>form.setValue(
            `elements.${elementIndex}.field.address.countryShow`,
            value
          )}
          label="Country"
        />
      </div>

      <div className="flex items-center gap-1">
        <Checkbox
          id="required"
          onCheckedChange={handleRequired}
          checked={
            !!form.watch(`elements.${elementIndex}.field.validations.required`)
          }
        />
        <Label htmlFor="required">Is Required</Label>
      </div>
    </div>
  );
};

function AddressControlItem({
  label,
  onChange,
  value,
  showValue,
  showChange
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
  showValue:boolean,
  showChange:(value:boolean)=>void
}) {
  return (
    <div className="grid grid-cols-2 items-center gap-2 mb-2">
      <div className="flex items-center gap-2">
        <Switch id={label}   checked={showValue} onCheckedChange={(value)=>showChange(value)} /> <Label className="text-xs" htmlFor={label}>{label}</Label>
      </div>
      <Input
      className="text-xs"
        placeholder={label}
        value={value || label}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

const PhoneInputEditor = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  const { selectedElement } = useSelectedElement();
  if (!selectedElement) return;

  const element = form
    .watch("elements")
    .find((el) => el.id === selectedElement.id);

  const elementIndex = form
    .watch("elements")
    .findIndex((el) => el.id === selectedElement.id);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.label`, e.target.value);
  };
  const handlePlaceholderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.placeholder`, e.target.value);
  };
  const handleHintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.hint`, e.target.value);
  };

  const handleRequired = () => {
    form.setValue(
      `elements.${elementIndex}.field.validations.required`,
      !form.watch(`elements.${elementIndex}.field.validations.required`)
    );
  };


  return (
    <div className="space-y-3">
      <div>
        <Label>Label:</Label>
        <Input
          value={element?.field?.label}
          onChange={(e) => handleLabelChange(e)}
        />
      </div>
      <div>
        <Label>Placeholder:</Label>
        <Input
          value={element?.field?.placeholder || ""}
          onChange={(e) => handlePlaceholderChange(e)}
        />
      </div>
      <div>
        <Label>Hint:</Label>
        <Input
          value={element?.field?.hint || ""}
          onChange={(e) => handleHintChange(e)}
        />
      </div>
      <div className="flex items-center gap-1">
        <Checkbox
          id="required"
          onCheckedChange={handleRequired}
          checked={
            !!form.watch(`elements.${elementIndex}.field.validations.required`)
          }
        />
        <Label htmlFor="required">Is Required</Label>
      </div>
    </div>
  );
};



const NameInputEditor = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  const { selectedElement } = useSelectedElement();
  if (!selectedElement) return;

  const element = form
    .watch("elements")
    .find((el) => el.id === selectedElement.id);

  const elementIndex = form
    .watch("elements")
    .findIndex((el) => el.id === selectedElement.id);

  const handlePlaceholderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.placeholder`, e.target.value);
  };
  const handleHintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.hint`, e.target.value);
  };

 


  return (
    <div className="space-y-3">
   
      <div>
        <Label>Placeholder:</Label>
        <Input
          value={element?.field?.placeholder || ""}
          onChange={(e) => handlePlaceholderChange(e)}
        />
      </div>
      <div>
        <Label>Hint:</Label>
        <Input
          value={element?.field?.hint || ""}
          onChange={(e) => handleHintChange(e)}
        />
      </div>
   
     
    </div>
  );
};



const EmailInputEditor = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  const { selectedElement } = useSelectedElement();
  if (!selectedElement) return;

  const element = form
    .watch("elements")
    .find((el) => el.id === selectedElement.id);

  const elementIndex = form
    .watch("elements")
    .findIndex((el) => el.id === selectedElement.id);

  const handlePlaceholderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.placeholder`, e.target.value);
  };
  const handleHintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.hint`, e.target.value);
  };

 


  return (
    <div className="space-y-3">
   
      <div>
        <Label>Placeholder:</Label>
        <Input
          value={element?.field?.placeholder || ""}
          onChange={(e) => handlePlaceholderChange(e)}
        />
      </div>
      <div>
        <Label>Hint:</Label>
        <Input
          value={element?.field?.hint || ""}
          onChange={(e) => handleHintChange(e)}
        />
      </div>
   
     
    </div>
  );
};


const DateInputEditor = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  const { selectedElement } = useSelectedElement();
  if (!selectedElement) return;

  const element = form
    .watch("elements")
    .find((el) => el.id === selectedElement.id);

  const elementIndex = form
    .watch("elements")
    .findIndex((el) => el.id === selectedElement.id);
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.label`, e.target.value);
  };
  const handlePlaceholderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.placeholder`, e.target.value);
  };
  const handleHintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(`elements.${elementIndex}.field.hint`, e.target.value);
  };

  const handleRequired = () => {
    form.setValue(
      `elements.${elementIndex}.field.validations.required`,
      !form.watch(`elements.${elementIndex}.field.validations.required`)
    );
  };

  
  return (
    <div className="space-y-3">
      <div>
        <Label>Label:</Label>
        <Input
          value={element?.field?.label}
          onChange={(e) => handleLabelChange(e)}
        />
      </div>
      <div>
        <Label>Placeholder:</Label>
        <Input
          value={element?.field?.placeholder || ""}
          onChange={(e) => handlePlaceholderChange(e)}
        />
      </div>
      <div>
        <Label>Hint:</Label>
        <Input
          value={element?.field?.hint || ""}
          onChange={(e) => handleHintChange(e)}
        />
      </div>
      <div className="flex items-center gap-1">
        <Checkbox
          id="required"
          onCheckedChange={handleRequired}
          checked={
            !!form.watch(`elements.${elementIndex}.field.validations.required`)
          }
        />
        <Label htmlFor="required">Is Required</Label>
      </div>
     
    </div>
  );
};