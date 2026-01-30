import { Ce } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const roles = await Ce.getRoles();
    return NextResponse.json(roles || []);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Error fetching roles:", errorMsg);
    return NextResponse.json(
      { message: errorMsg, error: "Internal server error" },
      { status: 500 },
    );
  }
}
