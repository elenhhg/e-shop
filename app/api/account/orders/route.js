import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Order from "@/models/order"
import { auth } from "@clerk/nextjs/server"

// GET /api/account/orders - Get user's orders
export async function GET() {
  try {
    const session = await auth()
    const userId = session?.userId

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()
    
    // Fetch orders for the authenticated user
    const orders = await Order.find({ clerkId: userId })
      .sort({ date: -1 }) // Most recent first
      .lean() // Convert to plain JavaScript objects

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Orders GET error:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}

// POST /api/account/orders - Create a new order
export async function POST(request) {
  try {
    const session = await auth()
    const userId = session?.userId

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()
    const body = await request.json()

    // Validate required fields
    if (!body.items || !body.items.length) {
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 }
      )
    }

    if (!body.shippingAddress) {
      return NextResponse.json(
        { error: "Shipping address is required" },
        { status: 400 }
      )
    }

    // Generate order ID
    const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`

    const order = await Order.create({
      clerkId: userId,
      orderId,
      date: new Date(),
      status: "Processing",
      total: body.total,
      items: body.items.map(item => ({
        productId: item.product?._id || item.product?.id,
        name: item.product.name,
        image: item.product.image || "/placeholder.svg",
        color: item.selectedColor || null,
        size: item.selectedSize || null,
        price: item.product.price,
        quantity: item.quantity || 1
      })),
      shippingAddress: body.shippingAddress,
      paymentMethod: body.paymentMethod || "Credit Card",
      paymentStatus: "Pending"
    })

    return NextResponse.json({ 
      success: true, 
      order: {
        _id: order._id,
        orderId: order.orderId,
        date: order.date,
        status: order.status,
        total: order.total
      },
      message: "Order created successfully" 
    })
  } catch (error) {
    console.error("Order POST error:", error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}