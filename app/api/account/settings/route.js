import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import { auth } from "@clerk/nextjs/server"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await dbConnect()
    const user = await db
      .collection("users")
      .findOne({ clerkId: userId }, { projection: { settings: 1 } })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(
      user.settings || {
        newArrivals: true,
        exclusiveOffers: true,
        orderUpdates: true,
        editorialContent: false,
        personalizedRecommendations: true,
        analyticsCookies: true,
      }
    )
  } catch (error) {
    console.error("Settings GET error:", error)
    return NextResponse.json(
      { error: "Failed to fetch settings" },
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

    const db = await getDb()
    const body = await request.json()

    await db.collection("users").updateOne(
      { clerkId: userId },
      {
        $set: {
          settings: body,
          updatedAt: new Date(),
        },
      }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Settings PUT error:", error)
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    )
  }
}
