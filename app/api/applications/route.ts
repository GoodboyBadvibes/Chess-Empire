import { Ce } from "@/lib/db";
import { insertApplicationSchema } from "@shared/schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = insertApplicationSchema.parse(body);
    const application = await Ce.createApplication(parsed);
    
    return NextResponse.json(application, { status: 201 });
  } catch (error: any) {
    console.error("Error creating application:", error);
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          message: error.errors[0]?.message || "Validation failed",
          field: error.errors[0]?.path?.join("."),
        },
        { status: 400 },
      );
    }
    
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
