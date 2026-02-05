import dbConnect from "@/lib/mongodb"
import Product from "@/models/product"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await dbConnect()

    console.log("[v0] DB:", Product.db?.name)
    console.log("[v0] Collection:", Product.collection.name)

    // First, let's check ALL products to debug
    const allProducts = await Product.find({}).lean()
    console.log("[v0] Total products in collection:", allProducts.length)
    console.log("[v0] Sample product:", allProducts[0])

    // Now get featured products
    const products = await Product.find({ featured: true }).lean()
    console.log("[v0] Found featured products:", products.length)

    // If no featured products, return all products for debugging
    if (products.length === 0 && allProducts.length > 0) {
      console.log("[v0] No featured products found, returning all products")
      return NextResponse.json(allProducts)
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error("[v0] Error fetching featured products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products", details: String(error) },
      { status: 500 }
    )
  }
}
