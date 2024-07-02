import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  
  export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
  }
  



export const GET = async (req:Request,{params}:{params:{formSlug:string}})=>{
console.log(params.formSlug)

    try {

        const formWithCompany = await prisma.form.findUnique({
            where:{
                slug:params.formSlug
            },
            include:{
                company:{
                    select:{
                        name:true,
                        companyEmail:true
                    }
                }
            }
        })

        return NextResponse.json({success:true,data:formWithCompany},{status:200})
        
    } catch (error) {
        console.error(error)

        return NextResponse.json({success:false,error:"Internal error"},{status:500})
    }

}