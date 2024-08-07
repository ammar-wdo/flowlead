import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";
import { CustomError } from "@/custom-error";
import prisma from "./prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import * as clerkClient from "@clerk/clerk-sdk-node";
import { describe } from "node:test";
import { object, z } from "zod";
import { ComparisonOperator, Element, FieldType, Rule } from "@prisma/client";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function comparePasswords(
  plainPassword: string,
  hashedPassword: string
) {
  try {
    const passwordMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return passwordMatch;
  } catch (error) {
    throw new CustomError("Error comparing passwords");
  }
}

export const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

export async function prepareUser() {
  const { userId } = auth();
  if (!userId) throw new CustomError("Unauthorized");

  const user = await currentUser();

  const account = await prisma.account.findFirst({
    where: {
      userId,
    },
  });

  if (!account) {
    const newAccount = await prisma.account.create({
      data: {
        userId,
        email: user?.emailAddresses[0].emailAddress!,
        firstName: user?.firstName!,
        lastName: user?.lastName!,
        image: user?.imageUrl,
      },
    });
  }

  const company = await prisma.company.findFirst({
    where: {
      userId,
    },
  });

  if (!company) return;

  redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/${company.slug}`);
}

export function generateRandomSlug() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let slug = "";
  for (let i = 0; i < 9; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    slug += characters[randomIndex];
  }
  return slug;
}

//check mongidb id

export function isValidObjectId(id: string): boolean {
  const hexRegex = /^[0-9a-fA-F]{24}$/;
  return hexRegex.test(id);
}

//fetch services

export const getServices = async (companySlug: string, userId: string) => {
  const services = await prisma.service.findMany({
    where: {
      userId,
      company: { slug: companySlug },
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      company: {
        select: {
          slug: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const refactoredServices = services.map((service) => ({
    id: service.id,
    name: service.name,
    createdAt: service.createdAt,
    company: { slug: service.company.slug },
  }));

  return refactoredServices;
};

//fetch forms

export const getForms = async (companySlug: string, userId: string) => {
  const forms = await prisma.form.findMany({
    where: {
      userId,
      company: {
        slug: companySlug,
      },
    },
    select: {
      name: true,
      createdAt: true,
      slug: true,
      company: {
        select: {
          slug: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return forms;
};

//generate zod schema
export const generateSingleFieldSchema = (
  field: Element["field"],
  isRequired: boolean
) => {
  if (!field) return null;
  
  const dateTransformer = z.preprocess((val) => {
    if (typeof val === 'string' || val instanceof Date) {
      const date = new Date(val);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    return undefined;
  }, z.date().refine((val) => val !== undefined, {
    message: "Invalid date",
  }));
  let fieldSchema;

  switch (field.type) {
    case "name":
      fieldSchema = z.string().min(1, "Required");
      break;
    case "email":
      fieldSchema = z.string().email();
      break;
      case "number":
        fieldSchema = z
          .coerce.number({invalid_type_error:"enter valid number"})
          .refine((val) => !val || !isNaN(Number(val)), {
            message: "Please enter a valid number",
          })
          .transform((val) => (val ? Number(val) : undefined));
  
        if (field.validations) {
          const { min, max } = field.validations;
  
          if (!!min) {
            fieldSchema = fieldSchema.refine(
              (val) => val === undefined || val >= min,
              {
                message: `Value should be greater than or equal to ${min}`,
              }
            );
          }
  
          if (!!max) {
            fieldSchema = fieldSchema.refine(
              (val) => val === undefined || val <= max,
              {
                message: `Value should be less than or equal to ${max}`,
              }
            );
          }
        }
  
        if (!isRequired) {
          fieldSchema = fieldSchema.optional();
        } else {
          fieldSchema = fieldSchema.refine((val) => val !== undefined, {
            message: "Required",
          });
        }
        break;
  
      case "phone":
        fieldSchema = z
          .string()
          .refine((value) => {
  const phoneRegex = /^(?:[0-9]){1,3}(?:[ -]*[0-9]){6,14}$/;
  return phoneRegex.test(value);
}, "Invalid phone number").or(z.literal(undefined)).or(z.literal(''));;
  
        if (!isRequired) {
          fieldSchema = fieldSchema.optional();
        } else {
          fieldSchema = fieldSchema.refine((val) => val !== undefined, {
            message: "Required",
          }).refine(val=>val !=='', {
            message: "Required",
          });
        }
        break;
  

    case "text":
    case "radio":
    case "select":
    case "longText":
      fieldSchema = z.string();
      if (field.validations) {
        const { minLength, maxLength, pattern } = field.validations;
        if (pattern) fieldSchema = fieldSchema.regex(new RegExp(pattern));
        if (minLength !== undefined && minLength !== null)
          fieldSchema = fieldSchema.min(minLength);
        if (maxLength !== undefined && maxLength !== null)
          fieldSchema = fieldSchema.max(maxLength);
      }
      if (isRequired) {
        fieldSchema = fieldSchema.min(1, "Required");
      } else {
        fieldSchema = fieldSchema.optional();
      }
      break;

    case "checkbox":
      fieldSchema = z.array(z.string());
      if (isRequired) {
        fieldSchema = fieldSchema.min(1, "Choose at least one option");
      } else {
        fieldSchema = fieldSchema.optional();
      }
      break;
    case "address":
      fieldSchema = isRequired
        ? z.object({
            address:
              field.address?.addressShow && isRequired
                ? z.string().min(1, "Required")
                : z.string().optional(),
            houseNumber:
              field.address?.houseNumberShow && isRequired
                ? z.string().min(1, "Required")
                : z.string().optional(),
            postalCode:
              field.address?.postalCodeShow && isRequired
                ? z.string().min(1, "Required")
                : z.string().optional(),
            city:
              field.address?.cityShow && isRequired
                ? z.string().min(1, "Required")
                : z.string().optional(),
            stateRegion:
              field.address?.stateRegionShow && isRequired
                ? z.string().min(1, "Required")
                : z.string().optional(),
            country:
              field.address?.countryShow && isRequired
                ? z.string().min(1, "Required")
                : z.string().optional(),
          })
        : z
            .object({
              address:
                field.address?.addressShow && isRequired
                  ? z.string().min(1, "Required")
                  : z.string().optional(),
              houseNumber:
                field.address?.houseNumberShow && isRequired
                  ? z.string().min(1, "Required")
                  : z.string().optional(),
              postalCode:
                field.address?.postalCodeShow && isRequired
                  ? z.string().min(1, "Required")
                  : z.string().optional(),
              city:
                field.address?.cityShow && isRequired
                  ? z.string().min(1, "Required")
                  : z.string().optional(),
              stateRegion:
                field.address?.stateRegionShow && isRequired
                  ? z.string().min(1, "Required")
                  : z.string().optional(),
              country:
                field.address?.countryShow && isRequired
                  ? z.string().min(1, "Required")
                  : z.string().optional(),
            })
            .optional()
            .default({});

      break;
    case "date":
      fieldSchema = dateTransformer;
      if (!isRequired) {
        fieldSchema = fieldSchema.optional();
      } else {
        fieldSchema = fieldSchema.refine((val) => val !== undefined, {
          message: "Required",
        });
      }
      break;
    default:
      fieldSchema = z.string();
      if (isRequired) {
        fieldSchema = fieldSchema.min(1, "Required");
      } else {
        fieldSchema = fieldSchema.optional();
      }
      break;
  }

  return fieldSchema;
};

//generate service schema

export const generateSingleServiceSchema = (
  service: Element["service"],
  isRequired: boolean
) => {
  let serviceSchema: z.ZodTypeAny = z.string(); // Default value
  const optionSchema = z.object({
    id: z.string().min(1),
    price: z.coerce.number(),
    quantity: z.coerce.number(),
    name: z.string().min(1, "required"),
    description: z.string().optional(),
    image: z.string().optional(),
    serviceName: z.string().min(1),
    serviceId: z.string().min(1),
    taxPercentage:z.coerce.number(),
  });
  switch (service?.pricingType) {
    case "CHECKBOX_GROUP":
      serviceSchema = isRequired
        ? z.array(optionSchema).min(1, "At least one option")
        : z.array(optionSchema).optional();
      break;

    case "DROPDOWN_GROUP":
    case "RADIO_GROUP":
    case "SINGLE_PRICE":
      serviceSchema = isRequired ? optionSchema : optionSchema.optional();
      break;

    default:
      serviceSchema = z.string();
      break;
  }

  return serviceSchema;
};

const evaluateCondition = (
  fieldValue: any,
  operator: ComparisonOperator,
  value: any
): boolean => {
  switch (operator) {
    case "CONTAINS":
      return fieldValue.includes(value);
    case "EMPTY":
      return !fieldValue || fieldValue.length === 0;
    case "NOT_EMPTY":
      return !!fieldValue && fieldValue.length > 0;
    case "IS":
      return fieldValue === value;
    case "IS_NOT":
      return fieldValue !== value;
    case "EQ":
      return fieldValue === +value;
    case "NEQ":
      return fieldValue !== +value;
    case "GT":
      return fieldValue > +value;
    case "LT":
      return fieldValue < +value;
    case "BEFORE":
      return new Date(fieldValue) < new Date(value);
    case "AFTER":
      return new Date(fieldValue) > new Date(value);
    default:
      return false;
  }
};

// export const isFieldVisible = (
//   elementId: string,
//   rules: Rule[],
//   elements: Element[],
//   formValues: { [key: string]: any }
// ) => {
//   let visible = true;

//   for (const rule of rules) {
//     const thenElementId = rule.then.field; // Assuming this is the element ID
//     const action = rule.then.action;

//     let conditionsMet = true;

//     if (rule.conditions.length === 1) {
//       console.log('1 condition')

//       const condition = rule.conditions[0];
//       const conditionElement = elements.find(
//         (element) => element.id === condition.field // Assuming this is the element ID
//       );
//       if (!conditionElement) continue;

//       const fieldKey = conditionElement.field
//         ? `${conditionElement.field.label}-field`
//         : conditionElement.service
//         ? `${conditionElement.service.name}-service`
//         : "";

//       const fieldValue = formValues[fieldKey] ?? ""; // Use default value if undefined
//       console.log("Field Value",fieldValue)
//       console.log("operator",condition.operator)
//       console.log("value",condition.value)
//       conditionsMet = evaluateCondition(fieldValue, condition.operator, condition.value);
//       console.log('Conditions Met',conditionsMet)
//     } else {
//       for (const condition of rule.conditions) {
//         const conditionElement = elements.find(
//           (element) => element.id === condition.field // Assuming this is the element ID
//         );
//         if (!conditionElement) continue;

//         const fieldKey = conditionElement.field
//           ? `${conditionElement.field.label}-field`
//           : conditionElement.service
//           ? `${conditionElement.service.name}-service`
//           : "";

//         const fieldValue = formValues[fieldKey] ?? ""; // Use default value if undefined
//         console.log("Field Value",fieldValue)
//         console.log("operator",condition.operator)
//         console.log("value",condition.value)
//         const conditionMet = evaluateCondition(fieldValue, condition.operator, condition.value);
//         console.log('Condition Met',conditionMet)

//         if (condition.logicalOperator && condition.logicalOperator === "AND") {
//           console.log("AND")
//           console.log("operation",conditionsMet && conditionMet)
//           conditionsMet = conditionsMet && conditionMet;

//         } else if (condition.logicalOperator &&condition.logicalOperator === "OR") {
//           console.log("OR")
//           conditionsMet = conditionsMet || conditionMet;

//         }
//         console.log('conditions met',conditionsMet)
//       }
//     }

//     if (thenElementId === elementId) {
//       console.log("Ids are equal")
//       if (action === "SHOW" && !conditionsMet) {
//         console.log(action)
//         visible = false;
//       } else if (action === "HIDE" && conditionsMet) {
//         visible = false;
//         console.log(action)
//       }
//     }
//   }
//   console.log("visible",visible)
// console.log("##########################")
//   return visible;
// };

export const isFieldVisible = (
  elementId: string,
  rules: Rule[],
  elements: Element[],
  formValues: { [key: string]: any }
) => {
  let visible = true;

  for (const rule of rules) {
    const thenElementId = rule.then.field;
    const action = rule.then.action;

    let conditionsMet = rule.conditions.length > 0 ? true : false;

    if (rule.conditions.length === 1) {
      console.log("1 condition");

      const condition = rule.conditions[0];
      const conditionElement = elements.find(
        (element) => element.id === condition.field
      );
      if (!conditionElement) continue;

      const fieldKey = conditionElement.field
        ? `${conditionElement.field.label}-field`
        : conditionElement.service
        ? `${conditionElement.service.name}-service`
        : "";

      const fieldValue = formValues[fieldKey] ?? "";
      console.log("Field Value", fieldValue);
      console.log("operator", condition.operator);
      console.log("value", condition.value);
      //if entered value is array of objects mean it is a service so we take th id or check if enterd value is an array of only the chosen value with no other value then true, or if not an array then enter the value
      let enteredValue;

      if (Array.isArray(fieldValue)) {
        if (fieldValue.length === 1) {
          if (typeof fieldValue[0] === "string") {
            enteredValue = fieldValue[0];
          } else if (
            typeof fieldValue[0] === "object" &&
            fieldValue[0] !== null
          ) {
            enteredValue = fieldValue[0].id;
          } else {
            enteredValue = undefined;
          }
        } else {
          if (condition.operator === "NOT_EMPTY") {
            enteredValue = fieldValue;
          } else {
            enteredValue = undefined;
          }
        }
      } else {
        // Handle the case when fieldValue is not an array
        enteredValue = fieldValue;
      }
      console.log("entered value", enteredValue);

      conditionsMet = evaluateCondition(
        enteredValue,
        condition.operator,
        condition.value
      );
      console.log("Conditions Met", conditionsMet);
    } else {
      for (let i = 0; i < rule.conditions.length; i++) {
        const condition = rule.conditions[i];
        const conditionElement = elements.find(
          (element) => element.id === condition.field
        );
        if (!conditionElement) continue;

        const fieldKey = conditionElement.field
          ? `${conditionElement.field.label}-field`
          : conditionElement.service
          ? `${conditionElement.service.name}-service`
          : "";

        const fieldValue = formValues[fieldKey] ?? "";
        console.log("Field Value", fieldValue);
        console.log("operator", condition.operator);
        console.log("value", condition.value);
        //if entered value is array of objects mean it is a service so we take th id or check if enterd value is an array of only the chosen value with no other value then true, or if not an array then enter the value
        let enteredValue;

        if (Array.isArray(fieldValue)) {
          if (fieldValue.length === 1) {
            if (typeof fieldValue[0] === "string") {
              enteredValue = fieldValue[0];
            } else if (
              typeof fieldValue[0] === "object" &&
              fieldValue[0] !== null
            ) {
              enteredValue = fieldValue[0].id;
            } else {
              enteredValue = undefined;
            }
          } else {
            if (condition.operator === "NOT_EMPTY") {
              enteredValue = fieldValue;
            } else {
              enteredValue = undefined;
            }
          }
        } else {
          // Handle the case when fieldValue is not an array
          enteredValue = fieldValue;
        }
        console.log("entered value", enteredValue);
        const conditionMet = evaluateCondition(
          enteredValue,
          condition.operator,
          condition.value
        );
        console.log("Condition Met", conditionMet);

        if (i === 0) {
          conditionsMet = conditionMet;
        } else {
          const previousCondition = rule.conditions[i - 1];
          if (previousCondition.logicalOperator === "AND") {
            console.log("AND");
            console.log("operation", conditionsMet && conditionMet);
            conditionsMet = conditionsMet && conditionMet;
          } else if (previousCondition.logicalOperator === "OR") {
            console.log("OR");
            console.log("operation", conditionsMet || conditionMet);
            conditionsMet = conditionsMet || conditionMet;
          }
        }
        console.log("conditions met", conditionsMet);
      }
    }

    if (thenElementId === elementId) {
      console.log("Ids are equal");
      if (action === "SHOW" && !conditionsMet) {
        console.log(action);
        visible = false;
      } else if (action === "HIDE" && conditionsMet) {
        visible = false;
        console.log(action);
      }
    }
  }
  console.log("visible", visible);
  console.log("##########################");
  return visible;
};

export const generateZodSchema = (
  elements: Element[],
  rules: Rule[],
  formValues: { [key: string]: any }
) => {
  const zodSchema: { [key: string]: z.ZodTypeAny } = {};

  elements.forEach((element) => {
    const field = element.field;
    const isFieldRequired =
      !!field?.validations?.required &&
      isFieldVisible(element.id, rules, elements, formValues);

    const fieldSchema = generateSingleFieldSchema(field, !!isFieldRequired);

    if (field && fieldSchema) {
      zodSchema[`${field.label}-field`] = fieldSchema;
    }

    const service = element.service;
    const isServiceRequired =
      service?.isRequired &&
      isFieldVisible(element.id, rules, elements, formValues);
    const serviceSchema = generateSingleServiceSchema(
      service,
      !!isServiceRequired
    );

    if (service && serviceSchema) {
      zodSchema[`${service.name}-service`] = serviceSchema;
    }
  });

  return z.object(zodSchema);
};

export const insertAtCaret = (input: HTMLInputElement | null, text: string) => {
  if (input) {
    const startPos = input.selectionStart || 0;
    const endPos = input.selectionEnd || 0;

    const newValue =
      input.value.substring(0, startPos) +
      text +
      input.value.substring(endPos, input.value.length);
    input.value = newValue;

    // Move caret to the end of the inserted text
    input.setSelectionRange(startPos + text.length, startPos + text.length);
    input.focus();
  }
};

export const replacePlaceholders = (
  text: string | undefined | null
): string => {
  if (!text) return "";
  const currentYear = new Date().getFullYear();
  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based, so add 1 and pad with leading zero if necessary.

  return text
    .replace(/{year}/g, currentYear.toString())
    .replace(/{month}/g, currentMonth);
};

// zero paddding function
export const formatWithLeadingZeros = (
  number: number,
  length: number
): string => {
  return number.toString().padStart(length, "0");
};

export function formatFileSize(bytes?: number) {
  if (!bytes) {
    return "0 Bytes";
  }
  bytes = Number(bytes);
  if (bytes === 0) {
    return "0 Bytes";
  }
  const k = 1024;
  const dm = 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}





// This function splits the form elements into groups (steps) based on the presence of "breaker"
interface StepsWithLabels {
  steps: Element[][];
  labels: (string | null)[];
}

export function groupElementsBySteps(elements: Element[]): StepsWithLabels {
  const steps: Element[][] = [];
  const labels: (string | null)[] = [];
  let currentStep: Element[] = [];

  elements.forEach((element) => {
    if (element.field?.type === FieldType.breaker) {
      if (currentStep.length > 0) {
        steps.push(currentStep);
        currentStep = [];
      }
      labels.push(element.field?.placeholder || null); // Save the breaker label
    } else {
      currentStep.push(element);
    }
  });

  if (currentStep.length > 0) {
    steps.push(currentStep);
    labels.push(null); // No breaker after the last step
  }

  return { steps, labels };
}


export function replaceDates(content:string, quotationDate:Date, expiryDate:Date) {
  // Ensure dates are in a readable format (you can customize the format as needed)
  const formattedQuotationDate = format(new Date(quotationDate),"dd-MM-yyyy") ;
  const formattedExpiryDate = format(new Date(expiryDate),"dd-MM-yyyy");

  // Replace placeholders in the content
  const updatedContent = content
    .replace(/{quotation date}/g, formattedQuotationDate)
    .replace(/{expiration date}/g, formattedExpiryDate);

  return updatedContent;
}




export const parseDates = (data: any) => {
  for (const key in data) {
    if (typeof data[key] === 'string' && !isNaN(Date.parse(data[key]))) {
      data[key] = new Date(data[key]);
    }
  }
  return data;
};


export function checkFreeTrial(createdDate: Date): { valid: boolean, message: string } {
  const currentDate = new Date();
  const startDate =  createdDate;

  // Calculate the end date which is 7 days from the start date
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 7);

  // Calculate the difference in time
  const timeDifference = endDate.getTime() - currentDate.getTime();

  // Calculate the difference in days
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  if (daysDifference > 0) {
    return { valid: true, message: `Expires on ${format(endDate,"dd-MM-yyyy")}` };
  } else {
    return { valid: false, message: "Free trial finished" };
  }
}

export const checkCompanySubscription = async ({userId,companySlug}:{userId:string,companySlug:string})=>{
  const company = await prisma.company.findUnique({
    where:{
      slug:companySlug,
      userId
    },
    select:{
      plan:true,
      createdAt:true,
      slug:true
    }
  })
  if(!company) redirect('/')
  const {valid} = checkFreeTrial(company.createdAt)

  if(!valid && company.plan !=='PREMIUM') redirect(process.env.NEXT_PUBLIC_BASE_URL + `/${company.slug}/upgrade`)
}