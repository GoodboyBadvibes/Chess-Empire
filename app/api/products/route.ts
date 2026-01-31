import { Ce } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await Ce.getProducts();
    return NextResponse.json(products || []);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Error fetching products:", errorMsg);
    return NextResponse.json([], { status: 200 });
  }
}
