import { Ce } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const roles = await Ce.getRoles();
    return NextResponse.json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
