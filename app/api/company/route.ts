import { NextResponse } from "next/server"

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
  }
  

export const GET = async (req:Request)=>{
    try {

        console.log('done')
        return NextResponse.json({success:true,message:"hello"},{status:200, headers: corsHeaders })
    } catch (error) {
        console.error(error)

        return NextResponse.json({error:"Internal error "},{status:500, headers: corsHeaders })
    }
}