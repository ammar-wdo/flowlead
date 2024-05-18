import * as z from "zod";

const requiredString = z.string().min(1, "Required field");
const optionalString = z.string().optional()
const phoneReg = requiredString.refine((value) => {
    const phoneRegex = /^(?:[0-9]){1,3}(?:[ -]*[0-9]){6,14}$/;
    return phoneRegex.test(value);
  }, "Invalid phone number")



// COMPANY SCHEMA
export const companySchema = z.object({
    name:requiredString,
    address:requiredString,
    zipcode:requiredString,
    city:requiredString,
    country:requiredString,
    websiteUrl:optionalString,
    logo:optionalString,
    phone:phoneReg,
    companyEmail:requiredString.email(),
    serviceEmail:requiredString.email().optional().or(z.literal(undefined)),
    cocNumber:optionalString,
    industry:optionalString,
    vatNumber:requiredString,
    contactPerson:requiredString,
    IBAN:requiredString,
    termsUrl:optionalString,

})