import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import dbConnect from "@/lib/mongodb"
import Address from "@/models/address"
import mongoose from "mongoose"

//
// GET – Fetch addresses
//
export async function GET(req) {
  try {
    // Χρησιμοποίησε το auth() με await
    const session = await auth()
    const userId = session?.userId
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const addresses = await Address.find({ clerkId: userId })
      .sort({ isDefault: -1, createdAt: -1 })
      .lean()

    return NextResponse.json(addresses)
  } catch (error) {
    console.error("GET addresses error:", error)
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 })
  }
}

//
// POST – Create address
//
export async function POST(req) {
  try {
    const session = await auth()
    const userId = session?.userId
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { label, name, street, city, state, zip, country, phone, isDefault } = body

    if (!label || !name || !street || !city || !state || !zip || !country) {
      return NextResponse.json({ error: "All address fields are required" }, { status: 400 })
    }

    await dbConnect()

    if (isDefault) {
      await Address.updateMany({ clerkId: userId }, { isDefault: false })
    }

    const address = await Address.create({
      clerkId: userId,
      label,
      name,
      street,
      city,
      state,
      zip,
      country,
      phone: phone || "",
      isDefault: !!isDefault,
    })

    return NextResponse.json({ success: true, _id: address._id.toString() })
  } catch (error) {
    console.error("POST addresses error:", error)
    return NextResponse.json({ error: "Failed to create address" }, { status: 500 })
  }
}

//
// PUT – Update address
//
export async function PUT(req) {
  try {
    const session = await auth()
    const userId = session?.userId
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { _id, isDefault, ...rest } = body
    if (!_id) return NextResponse.json({ error: "Address ID required" }, { status: 400 })

    await dbConnect()
    const objectId = new mongoose.Types.ObjectId(_id)

    if (isDefault) {
      await Address.updateMany({ clerkId: userId }, { isDefault: false })
    }

    await Address.findOneAndUpdate(
      { _id: objectId, clerkId: userId }, 
      { ...rest, isDefault: !!isDefault }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PUT addresses error:", error)
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 })
  }
}

//
// DELETE – Remove address
//
export async function DELETE(req) {
  try {
    const session = await auth()
    const userId = session?.userId
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "Address ID required" }, { status: 400 })

    await dbConnect()
    const objectId = new mongoose.Types.ObjectId(id)
    const address = await Address.findOne({ _id: objectId, clerkId: userId })

    if (address?.isDefault) return NextResponse.json({ error: "Cannot delete default address" }, { status: 400 })

    await Address.deleteOne({ _id: objectId, clerkId: userId })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE addresses error:", error)
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 })
  }
}