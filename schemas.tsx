import {
  Action,
  ComparisonOperator,
  ElementType,
  FieldType,
  LogicalOperator,
} from "@prisma/client";
import { ReactNode } from "react";
import * as z from "zod";
import { IoIosAddCircle } from "react-icons/io";
import { PiTextAa } from "react-icons/pi";
import { TiSortNumerically } from "react-icons/ti";
import { IoCheckboxSharp } from "react-icons/io5";
import { IoOptionsSharp } from "react-icons/io5";
import { IoArrowDownCircle } from "react-icons/io5";
import { BsFileBreakFill } from "react-icons/bs";
import { Minus, NotepadText, Phone } from "lucide-react";
import { FaAddressCard } from "react-icons/fa";
import { MdLocalPhone } from "react-icons/md";

const requiredString = z.string().min(1, "Required field");
const optionalString = z.string().optional();
const phoneReg = requiredString.refine((value) => {
  const phoneRegex = /^(?:[0-9]){1,3}(?:[ -]*[0-9]){6,14}$/;
  return phoneRegex.test(value);
}, "Invalid phone number");

// COMPANY SCHEMA
export const quotationsSettings = z.object({
  dueDays: z.number().positive().default(14),
  prefix: optionalString.nullable(),
  nextNumber: z.number().nonnegative().default(0),
  senderName: requiredString,
  senderEmail: requiredString.email(),
  bcc: z.string().email().optional().nullable(),
  attachments: optionalString.nullable(),
  footNote: optionalString.nullable(),
  subject: optionalString,
  body: optionalString,
});

export const companySchema = z.object({
  name: requiredString,
  address: requiredString,
  zipcode: requiredString,
  city: requiredString,
  country: requiredString,
  websiteUrl: optionalString,
  logo: optionalString,
  phone: phoneReg,
  companyEmail: requiredString.email(),
  serviceEmail: z
    .string()
    .email()
    .optional()
    .refine(
      (data) =>
        data === undefined || z.string().email().safeParse(data).success,
      {
        message: "Service Email must be a valid email or undefined",
      }
    ),
  cocNumber: optionalString,
  industry: optionalString,
  vatNumber: requiredString,
  contactPerson: requiredString,
  IBAN: requiredString,
  termsUrl: optionalString,
});

//SERVICE SCHEMA
export const pricingTypeArray = [
  "SINGLE_PRICE",
  "CHECKBOX_GROUP",
  "RADIO_GROUP",
  "DROPDOWN_GROUP",
];

export const pricingTypeEnum = [
  "SINGLE_PRICE",
  "CHECKBOX_GROUP",
  "RADIO_GROUP",
  "DROPDOWN_GROUP",
] as const;

export const optionSchema = z.object({
  id: requiredString,
  name: requiredString,
  description: optionalString.nullable().optional(),
  image: optionalString.nullable().optional(),
  enableQuantity: z.boolean(),
  price: z.coerce.number({ message: "Enter valid number please" }).min(1),
});

export const serviceSchema = z.object({
  name: requiredString,
  description: optionalString.nullable(),
  pricingType: z
    .enum(pricingTypeEnum)
    .default("SINGLE_PRICE")
    .refine((el) => pricingTypeEnum.includes(el), {
      message: "Invalid Pricing Type",
      path: ["pricingType"],
    }),
  isRequired: z.boolean().default(false),
  isLineItem: z.boolean().default(false),
  taxPercentage: z.coerce
    .number({ message: "Enter valid number please" })
    .min(1),
  options: z.array(optionSchema).min(1, "Atleast one option"),
  addToQoutation: z.boolean().default(false),
});

//FORM SCHEMA

export const fieldTypeArray = [
  "text",
  "longText",
  "number",
  "select",
  "radio",
  "checkbox",
  "address",
  "phone",
  "breaker",
  "sectionBreaker",
];

export type FieldTypeMapper = [
  "text",
  "longText",
  "number",
  "select",
  "radio",
  "checkbox",
  "address",
  "phone",
  "breaker",
  "sectionBreaker"
][number];

export const fieldTypeEnum = [
  "text",
  "longText",
  "number",
  "select",
  "radio",
  "checkbox",
  "address",
  "phone",
  "breaker",
  "sectionBreaker",
] as const;

export const logicOperatorArray = ["AND", "OR", "NOT"];
export const logicOperatorEnum = ["AND", "OR", "NOT"] as const;
export type LogicalOperatorType = (typeof logicOperatorArray)[number];

export const comparisonOperatorArray = [
  "CONTAINS",
  "EMPTY",
  "NOT_EMPTY",
  "IS",
  "IS_NOT",
  "EQ",
  "NEQ",
  "GT",
  "LT",
  "BEFORE",
  "AFTER",
];

export const comparisonOperatorEnum = [
  "CONTAINS",
  "EMPTY",
  "NOT_EMPTY",
  "IS",
  "IS_NOT",
  "EQ",
  "NEQ",
  "GT",
  "LT",
  "BEFORE",
  "AFTER",
] as const;
export type ComparisonOperatorType = (typeof comparisonOperatorEnum)[number];

export const textComparisonOperatorArray = [
  "CONTAINS",
  "EMPTY",
  "NOT_EMPTY",
  "IS",
] as const;

export const numberComparisonOperator = [
  "EQ",
  "NEQ",
  "GT",
  "LT",
  "EMPTY",
  "NOT_EMPTY",
] as const;

export const serviceAndMultipleComparisonOperator = [
  "IS",
  "IS_NOT",
  "NOT_EMPTY",
  "EMPTY",
] as const;

export const dateComparisonOperator = ["BEFORE", "AFTER"] as const;

export const phoneComparisonOperator = ["EMPTY", "NOT_EMPTY"] as const;

export const rulesActionArray = ["SHOW", "HIDE"];

const validationOptionsSchema = z.object({
  required: z.boolean().nullable().optional(),
  minLength: z.coerce.number().nullable().optional(),
  maxLength: z.coerce.number().nullable().optional(),
  min: z.coerce.number().nullable().optional(),
  max: z.coerce.number().nullable().optional(),
  pattern: z.string().nullable().optional(),
});
export type ElementTypeMapper = (typeof elementTypeEnum)[number];
const elementTypeArray = ["FIELD", "SERVICE_ELEMENT"];
const elementTypeEnum = ["FIELD", "SERVICE_ELEMENT"] as const;

const addressSchema = z
  .object({
    addressLabel: z.string().optional().nullable(),
    addressShow: z.boolean().optional().nullable().default(true),
    houseNumberLabel: z.string().optional().nullable(),
    houseNumberShow: z.boolean().optional().nullable().default(true),
    postalCodeLabel: z.string().optional().nullable(),
    postalCodeShow: z.boolean().optional().nullable().default(true),
    cityLabel: z.string().optional().nullable(),
    cityShow: z.boolean().optional().nullable().default(true),
    stateRegionLabel: z.string().optional().nullable(),
    stateRegionShow: z.boolean().optional().nullable().default(true),
    countryLabel: z.string().optional().nullable(),
    countryShow: z.boolean().optional().nullable().default(true),
  })
  .optional()
  .nullable();

const fieldSchema = z.object({
  id: requiredString,
  label: requiredString,
  placeholder: optionalString.nullable().optional(),
  hint: optionalString.nullable().optional(),
  type: z.nativeEnum(FieldType),
  options: z.array(requiredString),
  address: addressSchema.optional().nullable(),
  validations: validationOptionsSchema.nullable().optional(),
});

export const elementSchema = z.object({
  id: requiredString,
  type: z.nativeEnum(ElementType),
  field: fieldSchema.nullable().optional(),
  service: serviceSchema
    .extend({
      id: requiredString,
    })
    .nullable()
    .optional(),
});

export const conditionSchema = z
  .object({
    id: requiredString,
    field: requiredString,
    operator: z.nativeEnum(ComparisonOperator),
    value: optionalString, // Using z.union to accommodate various types of values
    logicalOperator: z.nativeEnum(LogicalOperator).nullable().optional(),
  })
  .refine(
    (data) =>
      data.operator === "NOT_EMPTY" || data.operator === "EMPTY" || data.value,
    { message: "Required", path: ["value"] }
  );

const thenSchema = z.object({
  field: requiredString,
  action: z.nativeEnum(Action),
});

export const ruleSchema = z.object({
  id: requiredString,
  conditions: z.array(conditionSchema),
  then: thenSchema,
});

export const formSchema = z
  .object({
    name: requiredString,
    description: optionalString,
    isPublished: z.boolean().default(false),
    isWidjet: z.boolean().default(false),
    elements: z.array(elementSchema).min(1, "At least one field or service"),
    rules: z.array(ruleSchema).optional(),
  })
  .refine(
    (data) => {
      const labels = data.elements
        .filter(
          (element) => element.field !== undefined && element.field !== null
        )
        .map((element) => element.field!.label);
      return labels.length === new Set(labels).size;
    },
    {
      message: "Fields must have unique labels",
      path: ["elements"],
    }
  );

//fields and service elements types

export type ElementComponentType = z.infer<typeof elementSchema> & {
  component: ReactNode;
};

export const emptyServiceElement: ElementComponentType = {
  id: "",
  type: "SERVICE_ELEMENT",
  component: (
    <div className="flex items-center gap-2 text-[12px] ">
      <IoIosAddCircle size={20} />
      Add Service
    </div>
  ),
  service: {
    id: "",
    addToQoutation: false,
    isLineItem: false,
    isRequired: false,
    name: "",
    options: [],
    pricingType: "CHECKBOX_GROUP",
    taxPercentage: 0,
    description: "",
  },
  field: null,
};

export const emptyTextFieldElement: ElementComponentType = {
  id: "",
  type: "FIELD",
  component: (
    <div className="flex items-center gap-2 text-[12px] ">
      {" "}
      <PiTextAa size={20} />
      Text
    </div>
  ),
  field: {
    id: "",
    label: "Text Input",
    placeholder: "",
    options: [],
    type: "text",

    validations: null,
  },
};
export const emptyLongTextFieldElement: ElementComponentType = {
  id: "",
  type: "FIELD",
  component: (
    <div className="flex items-center gap-2 text-[12px] ">
      {" "}
      <NotepadText className=" " size={20} />
      Long Text
    </div>
  ),
  field: {
    id: "",
    label: "Long Text Input",
    placeholder: "",
    options: [],
    type: "longText",

    validations: null,
  },
};

export const emptyNumberFieldElement: ElementComponentType = {
  id: "",
  type: "FIELD",
  component: (
    <div className="flex items-center gap-2 text-[12px] ">
      {" "}
      <TiSortNumerically size={20} />
      Number
    </div>
  ),
  field: {
    id: "",
    label: "Number Input",
    placeholder: "",
    options: [],
    type: "number",

    validations: null,
  },
};
export const emptyCheckBoxFieldElement: ElementComponentType = {
  id: "",
  type: "FIELD",
  component: (
    <div className="flex items-center gap-2 text-[12px] ">
      {" "}
      <IoCheckboxSharp size={20} />
      Check Box
    </div>
  ),
  field: {
    id: "",
    label: "Check box",
    placeholder: "",
    options: ["Option 1", "Option 2", "Option 3"],
    type: "checkbox",

    validations: null,
  },
};

export const emptyRadioFieldElement: ElementComponentType = {
  id: "",
  type: "FIELD",
  component: (
    <div className="flex items-center gap-2 text-[12px] ">
      {" "}
      <IoOptionsSharp size={20} />
      Option Group
    </div>
  ),
  field: {
    id: "",
    label: "Option group",
    placeholder: "",
    options: ["Option 1", "Option 2", "Option 3"],
    type: "radio",

    validations: null,
  },
};
export const emptySelectElement: ElementComponentType = {
  id: "",
  type: "FIELD",
  component: (
    <div className="flex items-center gap-2 text-[12px] ">
      {" "}
      <IoArrowDownCircle size={20} />
      Drop Down
    </div>
  ),
  field: {
    id: "",
    label: "Drop Down",
    placeholder: "",
    options: ["Option 1", "Option 2", "Option 3"],
    type: "select",

    validations: null,
  },
};
export const emptyPhoneElement: ElementComponentType = {
  id: "",
  type: "FIELD",
  component: (
    <div className="flex items-center gap-2 text-[12px] ">
      {" "}
      <MdLocalPhone size={20} />
      Phone
    </div>
  ),
  field: {
    id: "",
    label: "Phone",
    placeholder: "",
    options: [],
    type: "phone",

    validations: null,
  },
};
export const emptyAddressElement: ElementComponentType = {
  id: "",
  type: "FIELD",
  component: (
    <div className="flex items-center gap-2 text-[12px] ">
      {" "}
      <FaAddressCard size={20} />
      Address
    </div>
  ),
  field: {
    id: "",
    label: "Add Address",
    placeholder: "",
    options: [],
    type: "address",
    address: {
      addressLabel: "Address",
      addressShow: true,
      houseNumberLabel: "House Number",
      houseNumberShow: true,
      postalCodeLabel: "Postal Code",
      postalCodeShow: true,
      cityLabel: "City",
      cityShow: true,
      stateRegionLabel: "State/Region",
      stateRegionShow: true,
      countryLabel: "Country",
      countryShow: true,
    },

    validations: null,
  },
};
export const emptyBreakerElement: ElementComponentType = {
  id: "",
  type: "FIELD",
  component: (
    <div className="flex items-center gap-2 text-[12px] ">
      {" "}
      <BsFileBreakFill size={20} />
      Page Break
    </div>
  ),
  field: {
    id: "",
    label: "Page Break",
    placeholder: "",
    options: [],
    type: "breaker",

    validations: null,
  },
};
export const emptySectionBreakerElement: ElementComponentType = {
  id: "",
  type: "FIELD",
  component: (
    <div className="flex items-center gap-2 text-[12px] ">
      {" "}
      <Minus size={20} />
      Section Break
    </div>
  ),
  field: {
    id: "",
    label: "Section Break",
    placeholder: "",
    options: [],
    type: "sectionBreaker",

    validations: null,
  },
};

export const controllerElements = [
  {
    section: "Service Selection",
    elements: [emptyServiceElement],
  },
  {
    section: "Client Profile",
    elements: [emptyAddressElement, emptyPhoneElement],
  },
  {
    section: "Form Fields",
    elements: [
      emptyTextFieldElement,
      emptyLongTextFieldElement,
      emptyNumberFieldElement,
      emptyCheckBoxFieldElement,
      emptyRadioFieldElement,
      emptySelectElement,
    ],
  },
  {
    section: "Utilities",
    elements: [emptyBreakerElement, emptySectionBreakerElement],
  },
];

export const VARIABLES = {
  quotationNumber: ["{month}", "{year}"],
  subject: [
    "{costumer name}",
    "{quotation date}",
    "{company name}",
    "{quotation number}",
  ],
  body: [
    "{customer name}",
    "{quotation date}",
    "{expiration date}",
    "{contact person}",
    "{company name}",
    "{company address}",
    "{company phone}",
    "{IBAN}",
    "{quotation number}",
    "{website url}",
    "{chamber of commerce}",
    "{terms and conditions url}",
  ],
  footnote: ["{expiration date}", "{quotation date}"],
} as const;
