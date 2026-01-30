import { Ce } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const story = await Ce.getStory(Number(id));
    
    if (!story) {
      return NextResponse.json(
        { message: "Story not found" },
        { status: 404 },
      );
    }
    
    return NextResponse.json(story);
  } catch (error) {
    console.error("Error fetching story:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
