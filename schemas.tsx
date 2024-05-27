import { ComparisonOperator, ElementType, FieldType, LogicOperator } from "@prisma/client";
import { ReactNode } from "react";
import * as z from "zod";
import { IoIosAddCircle } from "react-icons/io";
import { PiTextAa } from "react-icons/pi";
import { TiSortNumerically } from "react-icons/ti";
import { IoCheckboxSharp } from "react-icons/io5";
import { IoOptionsSharp } from "react-icons/io5";
import { IoArrowDownCircle } from "react-icons/io5";
import { BsFileBreakFill } from "react-icons/bs";

const requiredString = z.string().min(1, "Required field");
const optionalString = z.string().optional()
const phoneReg = requiredString.refine((value) => {
  const phoneRegex = /^(?:[0-9]){1,3}(?:[ -]*[0-9]){6,14}$/;
  return phoneRegex.test(value);
}, "Invalid phone number")



// COMPANY SCHEMA
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
  serviceEmail: z.string().email().optional().refine(data => data === undefined || z.string().email().safeParse(data).success, {
    message: 'Service Email must be a valid email or undefined',
  }),
  cocNumber: optionalString,
  industry: optionalString,
  vatNumber: requiredString,
  contactPerson: requiredString,
  IBAN: requiredString,
  termsUrl: optionalString,

})

//SERVICE SCHEMA
export const pricingTypeArray = ["SINGLE_PRICE",
  "CHECKBOX_GROUP",
  "RADIO_GROUP",
  "DROPDOWN_GROUP"]

export const pricingTypeEnum = ["SINGLE_PRICE",
  "CHECKBOX_GROUP",
  "RADIO_GROUP",
  "DROPDOWN_GROUP"] as const


export const optionSchema = z.object({
  id: requiredString,
  name: requiredString,
  description: optionalString.nullable().optional(),
  image: optionalString.nullable().optional(),
  enableQuantity: z.boolean(),
  price: z.coerce.number({ message: 'Enter valid number please' }).min(1)
})



export const serviceSchema = z.object({

  name: requiredString,
  description: optionalString.nullable(),
  pricingType: z.enum(pricingTypeEnum).default('SINGLE_PRICE').refine(el => pricingTypeEnum.includes(el), { message: "Invalid Pricing Type", path: ['pricingType'] }),
  isRequired: z.boolean().default(false),
  isLineItem: z.boolean().default(false),
  taxPercentage: z.coerce.number({ message: 'Enter valid number please' }).min(1),
  options: z.array(optionSchema).min(1, "Atleast one option"),
  addToQoutation: z.boolean().default(false)


})





//FORM SCHEMA 

export const fieldTypeArray = ["text",
  "number",
  "select",
  "radio",
  "checkbox",
  "breaker",
]

export type FieldTypeMapper = ["text",
"number",
"select",
"radio",
"checkbox",
"breaker",
][number]

  export const fieldTypeEnum = ["text",
  "number",
  "select",
  "radio",
  "checkbox",
  "breaker"] as const

 export const logicOperatorArray = [
    "AND","OR","NOT"
  ]
  export const logicOperatorEnum = [
    "AND","OR","NOT"
  ] as const

  export const comparisonOperatorArray =["EQ","NE","GT","LT","GTE","LTE"] 
  export const comparisonOperatorEnum =["EQ","NE","GT","LT","GTE","LTE"] as const

  const simpleConditionSchema = z.object({
    fieldId: z.string().nullable().optional(),
    operator: z.nativeEnum(ComparisonOperator).nullable().optional(),
    value: z.string().nullable().optional(),
  })

  const compundConditionSchema = z.object({
    logic:z.nativeEnum(LogicOperator),
    conditions:z.array(simpleConditionSchema).optional()
  })

  const conditionalOptions = z.object({
    logic:z.nativeEnum(LogicOperator),
    conditions:z.array(compundConditionSchema)
  })

  const validationOptionsSchema = z.object({
    required: z.boolean().nullable().optional(),
    minLength: z.coerce.number().nullable().optional(),
    maxLength: z.coerce.number().nullable().optional(),
    min: z.coerce.number().nullable().optional(),
    max: z.coerce.number().nullable().optional(),
    pattern: z.string().nullable().optional(),
  });
  export type ElementTypeMapper = (typeof elementTypeEnum)[number]
const elementTypeArray = ["FIELD","SERVICE_ELEMENT"]
  const elementTypeEnum = ["FIELD","SERVICE_ELEMENT"] as const

  const fieldSchema = z.object({
    id:requiredString,
    label:requiredString,
    placeholder:optionalString.nullable().optional(),
    hint:optionalString.nullable().optional(),
    type:z.nativeEnum(FieldType),
    options:z.array(requiredString),
    validations:validationOptionsSchema.nullable().optional(),
    conditional:conditionalOptions.nullable().optional()
  })


  export const elementSchema = z.object({
    id:requiredString,
    type:z.nativeEnum(ElementType),
    field:fieldSchema.nullable().optional(),
    service:serviceSchema.extend({
      id: requiredString,
    }).nullable().optional()
  })


 

  export const formSchema = z.object({
    name:requiredString,
    description:optionalString,
    isPublished:z.boolean().default(false),
    isWidjet:z.boolean().default(false),
    elements:z.array(elementSchema).min(1,"At least one field or service"),

  })

//fields and service elements types


  export type ElementComponentType = z.infer<typeof elementSchema> & {component:ReactNode}

  export const emptyServiceElement:ElementComponentType = {
    id:'',
    type:'SERVICE_ELEMENT',
    component:<div className="flex items-center gap-2 text-[12px] "><IoIosAddCircle size={20} />Add Service</div>,
    service:{
   id:'',
      addToQoutation:false,
      isLineItem:false,
      isRequired:false,
      name:'',
      options:[],
      pricingType:'CHECKBOX_GROUP',
      taxPercentage:0,
      description:''
    },
    field:null
  }

  export const emptyTextFieldElement:ElementComponentType = {
    id:'',
    type:'FIELD',
    component:<div className="flex items-center gap-2 text-[12px] "> <PiTextAa size={20} />Text</div>,
    field:{
      id:'',
      label:'Text Input',
      placeholder:"",
      options:[],
      type:'text',
      conditional:null,
      validations:null,  
    },
  }

  
  export const emptyNumberFieldElement:ElementComponentType = {
    id:'',
    type:'FIELD',
    component:<div className="flex items-center gap-2 text-[12px] "> <TiSortNumerically size={20} />Number</div>,
    field:{
      id:'',
      label:'Number Input',
      placeholder:"",
      options:[],
      type:'number',
      conditional:null,
      validations:null,  
    },
  }
  export const emptyCheckBoxFieldElement:ElementComponentType = {
    id:'',
    type:'FIELD',
    component:<div className="flex items-center gap-2 text-[12px] "> <IoCheckboxSharp size={20} />Check Box</div>,
    field:{
      id:'',
      label:'Check box',
      placeholder:"",
      options:["Option 1","Option 2","Option 3"],
      type:'checkbox',
      conditional:null,
      validations:null,  
    },
  }
  
  export const emptyRadioFieldElement:ElementComponentType = {
    id:'',
    type:'FIELD',
    component:<div className="flex items-center gap-2 text-[12px] "> <IoOptionsSharp size={20} />Option Group</div>,
    field:{
      id:'',
      label:'Option group',
      placeholder:"",
      options:["Option 1","Option 2","Option 3"],
      type:'radio',
      conditional:null,
      validations:null,  
    },
  }
  export const emptySelectElement:ElementComponentType = {
    id:'',
    type:'FIELD',
    component:<div className="flex items-center gap-2 text-[12px] "> <IoArrowDownCircle size={20} />Drop Down</div>,
    field:{
      id:'',
      label:'Drop Down',
      placeholder:"",
      options:["Option 1","Option 2","Option 3"],
      type:'select',
      conditional:null,
      validations:null,  
    },
  }
  export const emptyBreakerElement:ElementComponentType = {
    id:'',
    type:'FIELD',
    component:<div className="flex items-center gap-2 text-[12px] "> <BsFileBreakFill size={20} />Page Break</div>,
    field:{
      id:'',
      label:'Page Break',
      placeholder:"",
      options:[],
      type:'breaker',
      conditional:null,
      validations:null,  
    },
  }

  export const controllerElements = [

    {
      section:"Service Selection",
      elements:[emptyServiceElement]
    },
    {
      section:"Form Fields",
      elements:[emptyTextFieldElement,emptyNumberFieldElement,emptyCheckBoxFieldElement,emptyRadioFieldElement,emptySelectElement]
    },
    {
      section:"Utilities",
      elements:[emptyBreakerElement]
    },
  ]
  
