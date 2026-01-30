import { Ce } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const stories = await Ce.getStories();
    return NextResponse.json(stories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
