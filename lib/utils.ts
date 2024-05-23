import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import bcrypt from "bcryptjs";
import { CustomError } from "@/custom-error";
import prisma from "./prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import * as clerkClient from '@clerk/clerk-sdk-node'
import { describe } from "node:test";



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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

  const { userId } = auth()
  if (!userId) throw new CustomError('Unauthorized')

  const user = await currentUser()




  const account = await prisma.account.findFirst({
    where: {
      userId
    }
  })



  if (!account) {

    const newAccount = await prisma.account.create({
      data: {
        userId,
        email: user?.emailAddresses[0].emailAddress!,
        firstName: user?.firstName!,
        lastName: user?.lastName!,
        image: user?.imageUrl

      }
    })
  }



  const company = await prisma.company.findFirst({
    where: {
      userId
    }
  })

  if (!company) return

  redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/${company.slug}`)


}


export function generateRandomSlug() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let slug = '';
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
      company: { slug: companySlug }
    },
    select: {
      id:true,
      name: true,
      description: true,
      options: true
    }
  })


  const refactoredServices = services.map(service => ({ id:service.id,name: service.name, description: service.description, price: service.options.reduce((acc, value) => acc + value.price, 0) }))

  return refactoredServices
}

//getch forms

export const getForms = async (companySlug: string, userId: string)=>{

  const forms = await prisma.form.findMany({
    where:{
      userId,
      company:{
        slug:companySlug
      }

    },
    select:{
      name:true,
      createdAt:true,
      slug:true
    }
  })

  return forms

}
