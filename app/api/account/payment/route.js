import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/user"
import { auth } from "@clerk/nextjs/server"

// GET /api/account/payment - Get all payment methods
export async function GET() {
  try {
    const session = await auth()
    const userId = session?.userId

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()
    
    const user = await User.findOne({ clerkId: userId })
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user.paymentMethods || [])
  } catch (error) {
    console.error("Payment GET error:", error)
    return NextResponse.json(
      { error: "Failed to fetch payment methods" },
      { status: 500 }
    )
  }
}

// POST /api/account/payment - Add new payment method
export async function POST(request) {
  try {
    const session = await auth()
    const userId = session?.userId

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    await dbConnect()

    // Validate required fields
    if (!body.cardLast4 || !body.cardBrand || !body.cardExpMonth || !body.cardExpYear || !body.cardHolderName) {
      return NextResponse.json(
        { error: "Missing required card information" },
        { status: 400 }
      )
    }

    const user = await User.findOne({ clerkId: userId })
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // If this is the first payment method or isDefault is true, remove default from others
    if (body.isDefault || user.paymentMethods.length === 0) {
      user.paymentMethods.forEach(method => {
        method.isDefault = false
      })
      body.isDefault = true
    }

    // Add new payment method
    user.paymentMethods.push({
      type: 'card',
      cardLast4: body.cardLast4,
      cardBrand: body.cardBrand,
      cardExpMonth: body.cardExpMonth,
      cardExpYear: body.cardExpYear,
      cardHolderName: body.cardHolderName,
      isDefault: body.isDefault || user.paymentMethods.length === 0
    })

    await user.save()

    return NextResponse.json({ 
      success: true, 
      paymentMethods: user.paymentMethods,
      message: "Payment method added successfully" 
    })
  } catch (error) {
    console.error("Payment POST error:", error)
    return NextResponse.json(
      { error: "Failed to add payment method" },
      { status: 500 }
    )
  }
}

// PUT /api/account/payment - Update payment method (set default)
export async function PUT(request) {
  try {
    const session = await auth()
    const userId = session?.userId

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const methodId = searchParams.get('id')
    const action = searchParams.get('action')

    if (!methodId) {
      return NextResponse.json(
        { error: "Payment method ID is required" },
        { status: 400 }
      )
    }

    await dbConnect()

    const user = await User.findOne({ clerkId: userId })
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (action === 'set-default') {
      // Remove default from all
      user.paymentMethods.forEach(method => {
        method.isDefault = false
      })
      
      // Set new default
      const method = user.paymentMethods.id(methodId)
      if (!method) {
        return NextResponse.json(
          { error: "Payment method not found" },
          { status: 404 }
        )
      }
      method.isDefault = true
    }

    await user.save()

    return NextResponse.json({ 
      success: true, 
      paymentMethods: user.paymentMethods 
    })
  } catch (error) {
    console.error("Payment PUT error:", error)
    return NextResponse.json(
      { error: "Failed to update payment method" },
      { status: 500 }
    )
  }
}

// DELETE /api/account/payment - Remove payment method
export async function DELETE(request) {
  try {
    const session = await auth()
    const userId = session?.userId

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const methodId = searchParams.get('id')

    if (!methodId) {
      return NextResponse.json(
        { error: "Payment method ID is required" },
        { status: 400 }
      )
    }

    await dbConnect()

    const user = await User.findOne({ clerkId: userId })
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Find the method to check if it's default
    const methodToDelete = user.paymentMethods.id(methodId)
    if (!methodToDelete) {
      return NextResponse.json(
        { error: "Payment method not found" },
        { status: 404 }
      )
    }

    const wasDefault = methodToDelete.isDefault

    // Remove the payment method
    user.paymentMethods.pull(methodId)

    // If we deleted the default method and there are other methods, make the first one default
    if (wasDefault && user.paymentMethods.length > 0) {
      user.paymentMethods[0].isDefault = true
    }

    await user.save()

    return NextResponse.json({ 
      success: true, 
      paymentMethods: user.paymentMethods,
      message: "Payment method removed successfully" 
    })
  } catch (error) {
    console.error("Payment DELETE error:", error)
    return NextResponse.json(
      { error: "Failed to delete payment method" },
      { status: 500 }
    )
  }
}