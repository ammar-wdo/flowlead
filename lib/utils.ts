import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";
import { CustomError } from "@/custom-error";
import prisma from "./prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import * as clerkClient from "@clerk/clerk-sdk-node";
import { describe } from "node:test";
import { z } from "zod";
import { ComparisonOperator, Element, Rule } from "@prisma/client";

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

  redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/${company.slug}`);
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
      description: true,
      options: true,
    },
  });

  const refactoredServices = services.map((service) => ({
    id: service.id,
    name: service.name,
    description: service.description,
    price: service.options.reduce((acc, value) => acc + value.price, 0),
  }));

  return refactoredServices;
};

//getch forms

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
  });

  return forms;
};

//generate zod schema
export const generateSingleFieldSchema = (
  field: Element["field"],
  isRequired: boolean
) => {
  if (!field) return null;

  let fieldSchema;

  switch (field.type) {
    case "number":
    case "phone":
      fieldSchema = z
      .string()
      .refine(val => !val || !isNaN(Number(val)), { message: "Please enter a valid number" })
      .transform(val => (val ? Number(val) : undefined));
    
    if (field.validations) {
      const { min, max } = field.validations;

      if (!!min) {
        fieldSchema = fieldSchema.refine(val => val === undefined || val >= min, {
          message: `Value should be greater than or equal to ${min}`,
        });
      }

      if (!!max) {
        fieldSchema = fieldSchema.refine(val => val === undefined || val <= max, {
          message: `Value should be less than or equal to ${max}`,
        });
      }
    }

    if (!isRequired) {
      fieldSchema = fieldSchema.optional();
    } else {
      fieldSchema = fieldSchema.refine(val => val !== undefined, {
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
        if (minLength !== undefined && minLength !== null) fieldSchema = fieldSchema.min(minLength);
        if (maxLength !== undefined  && maxLength !== null) fieldSchema = fieldSchema.max(maxLength);
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
  id:z.string().min(1),
  price:z.coerce.number(),
  quantity:z.coerce.number()
})
  switch (service?.pricingType) {
    case "CHECKBOX_GROUP":
      serviceSchema = isRequired
        ? z.array(optionSchema).min(1, "At least one option")
        : z.array(optionSchema).optional();
      break;

    case "DROPDOWN_GROUP":
    case "RADIO_GROUP":
    case "SINGLE_PRICE":
      serviceSchema = isRequired
        ? optionSchema
        : optionSchema.optional();
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
      case 'EMPTY':
        return !fieldValue || fieldValue.length === 0;
      case 'NOT_EMPTY':
        return !!fieldValue && fieldValue.length > 0;
    case "IS":
      return fieldValue === value;
    case "IS_NOT":
      return fieldValue !== value;
    case "EQ":
      return fieldValue === value;
    case "NEQ":
      return fieldValue !== value;
    case "GT":
      return fieldValue > value;
    case "LT":
      return fieldValue < value;
    case "BEFORE":
      return new Date(fieldValue) < new Date(value);
    case "AFTER":
      return new Date(fieldValue) > new Date(value);
    default:
      return false;
  }
};

export const isFieldVisible = (
  fieldId: string,
  rules: Rule[],
  elements: Element[],
  formValues: { [key: string]: any }
) => {
  for (const rule of rules) {
    const thenField = rule.then.field;
    const action = rule.then.action;

    let conditionsMet = true;

    for (const condition of rule.conditions) {
      const conditionField = elements.find(
        (element) => element.id === condition.field
      );
      if (!conditionField) continue;

      const fieldValue =
        formValues[
          conditionField.field?.label || conditionField.service?.name || ""
        ];
      const conditionMet = evaluateCondition(
        fieldValue,
        condition.operator,
        condition.value
      );

      if (condition.logicalOperator === "AND") {
        conditionsMet = conditionsMet && conditionMet;
      } else if (condition.logicalOperator === "OR") {
        conditionsMet = conditionsMet || conditionMet;
      } else {
        conditionsMet = conditionMet;
      }
    }

    if (thenField === fieldId && conditionsMet) {
      return action !== "HIDE";
    }
  }

  return true;
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
      isFieldVisible(field.id, rules, elements, formValues);
    const fieldSchema = generateSingleFieldSchema(field, !!isFieldRequired);

    if (field && fieldSchema) {
      zodSchema[`${field.label}-field`] = fieldSchema;
    }

    const service = element.service;
    const isServiceRequired =
      service?.isRequired &&
      isFieldVisible(service.id, rules, elements, formValues);
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
