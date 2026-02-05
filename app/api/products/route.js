import dbConnect from "@/lib/mongodb"
import Product from "@/models/product"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await dbConnect()

    const products = await Product.find({}).lean()

    console.log("[v0] DB:", Product.db?.name)
    console.log("[v0] Collection:", Product.collection.name)
    console.log("[v0] Found products:", products.length)

    return NextResponse.json(products)
  } catch (error) {
    console.error("[v0] Error fetching products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}
