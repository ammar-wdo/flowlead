import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import bcrypt from "bcryptjs";
import { CustomError } from "@/custom-error";
import prisma from "./prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";



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

  const {userId} = auth()
  if(!userId) return 

  const user = await currentUser()

  const account = await prisma.account.findFirst({where:{
    userId
  }})

  if(account) return 


const newAccount = await prisma.account.create({
  data:{
    userId,
    email:user?.emailAddresses[0].emailAddress!,
    firstName:user?.firstName!,
    lastName:user?.lastName!,
    image:user?.imageUrl

  }
})

const company  = await prisma.company.findFirst({
  where:{
    userId
  }
})

if(!company) return 

redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/${company.slug}`)
 
  
}
