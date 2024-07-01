import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export const GET = async (
  req: Request,
  { params }: { params: { slug: string } }
) => {
  headers().set("Access-Control-Allow-Origin", "*");
  headers().set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  headers().set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  console.log("done");
  if (!params.slug)
    return NextResponse.json(
      { success: false, error: "Company slug is required" },
      { status: 400, headers: corsHeaders }
    );
  try {
    const company = await prisma.company.findUnique({
      where: {
        slug: params.slug,
      },
      include: {
        forms: true,
      },
    });
    return NextResponse.json(
      { data: company, success: true },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
};
