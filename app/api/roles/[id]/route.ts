import { Ce } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const role = await Ce.getRole(Number(id));
    
    if (!role) {
      return NextResponse.json(
        { message: "Role not found" },
        { status: 404 },
      );
    }
    
    return NextResponse.json(role);
  } catch (error) {
    console.error("Error fetching role:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
