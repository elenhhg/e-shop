import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Order from "@/models/order"
import { auth } from "@clerk/nextjs/server"

export async function POST(request) {
  try {
    const session = await auth()
    const userId = session?.userId

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()
    const body = await request.json()

    // Generate order ID
    const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`

    const order = await Order.create({
      clerkId: userId,
      orderId,
      date: new Date(),
      status: "Processing",
      total: body.total,
      items: body.items.map(item => ({
        productId: item.product._id,
        name: item.product.name,
        image: item.product.image,
        color: item.selectedColor,
        size: item.selectedSize,
        price: item.product.price,
        quantity: item.quantity
      })),
      shippingAddress: body.shippingAddress,
      paymentMethod: body.paymentMethod,
      paymentStatus: "Pending"
    })

    return NextResponse.json({ 
      success: true, 
      orderId: order.orderId,
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