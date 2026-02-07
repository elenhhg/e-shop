// app/api/products/featured/route.ts
import dbConnect from "@/lib/mongodb"
import Product from "@/models/product"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Έλεγχος αν υπάρχει MONGODB_URI
    if (!process.env.MONGODB_URI) {
      console.warn("[v0] MONGODB_URI not defined, skipping DB connection")
      return NextResponse.json([], { status: 200 })
    }

    // Σύνδεση στη βάση
    await dbConnect()

    console.log("[v0] DB:", Product.db?.name)
    console.log("[v0] Collection:", Product.collection.name)

    // Πάρε όλα τα προϊόντα (προαιρετικά για fallback)
    const allProducts = await Product.find({}).lean()
    console.log("[v0] Total products in collection:", allProducts.length)
    console.log("[v0] Sample product:", allProducts[0])

    // Πάρε μόνο τα featured προϊόντα
    const products = await Product.find({ featured: true }).lean()
    console.log("[v0] Found featured products:", products.length)

    // Αν δεν υπάρχουν featured, επέστρεψε όλα τα προϊόντα
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
