import { Ce } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await Ce.getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
