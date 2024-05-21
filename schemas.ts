import * as z from "zod";

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
    name:requiredString,
    description:optionalString.nullable().optional(),
    image:optionalString.nullable().optional(),
    enableQuantity:z.boolean(),
    price:z.coerce.number({message:'Enter valid number please'}).min(1)
  })



export const serviceSchema = z.object({
  name: requiredString,
  description: optionalString,
  pricingType: z.enum(pricingTypeEnum).default('SINGLE_PRICE').refine(el => pricingTypeEnum.includes(el), { message: "Invalid Pricing Type", path: ['pricingType'] }),
  isRequired: z.boolean().default(false),
  options:z.array(optionSchema).min(1,"Atleast one option"),
  addToQoutation:z.boolean().default(false)


})