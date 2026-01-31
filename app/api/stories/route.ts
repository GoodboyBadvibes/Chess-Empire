import { Ce } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const stories = await Ce.getStories();
    return NextResponse.json(stories || []);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Error fetching stories:", errorMsg);
    return NextResponse.json([], { status: 200 });
  }
}
