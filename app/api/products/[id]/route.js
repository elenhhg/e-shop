import dbConnect from "@/lib/mongodb"
import Product from "@/models/product"
import { NextResponse } from "next/server"

export async function GET(req, { params }) {
  try {
    await dbConnect()
    const { id } = await params

    // Try to find by MongoDB _id first, then by custom id field
    let product = null

    // Check if it's a valid MongoDB ObjectId (24 hex characters)
    if (/^[a-f\d]{24}$/i.test(id)) {
      product = await Product.findById(id).lean()
    }

    // If not found by _id, try finding by the custom id field
    if (!product) {
      product = await Product.findOne({ id: id }).lean()
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}
