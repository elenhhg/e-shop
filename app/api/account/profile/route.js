import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/user"
import { auth } from "@clerk/nextjs/server"

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    let user = await User.findOne({ clerkId: userId })

    if (!user) {
      // Create user if doesn't exist
      user = await User.create({
        clerkId: userId,
        firstName: "",
        lastName: "",
        phone: "",
        settings: {}
      })
    }

    return NextResponse.json({
      _id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      birthday: user.birthday,
      settings: user.settings
    })
  } catch (error) {
    console.error("Profile GET error:", error)
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()
    const body = await request.json()

    const { firstName, lastName, phone, birthday } = body

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "First name and last name are required" },
        { status: 400 }
      )
    }

    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      {
        $set: {
          firstName,
          lastName,
          phone: phone || "",
          birthday: birthday || null,
          updatedAt: new Date(),
        },
      },
      { new: true, upsert: true }
    )

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("Profile PUT error:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}