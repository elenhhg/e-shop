// app/api/cart/transfer/route.js - ΔΙΟΡΘΩΜΕΝΟ
import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Cart from "@/models/cart"
import { currentUser } from "@clerk/nextjs/server" // Αλλαγή: χρησιμοποίησε currentUser

export async function POST(request) {
  try {
    await dbConnect()
    
    const user = await currentUser() // Αλλαγή: χρησιμοποίησε currentUser()
    const clerkUserId = user?.id
    const { guestUserId } = await request.json()
    
    console.log("Transferring cart from guest:", guestUserId, "to user:", clerkUserId)
    
    if (!clerkUserId || !guestUserId) {
      return NextResponse.json(
        { error: "Missing user IDs" },
        { status: 400 }
      )
    }
    
    // Find guest cart
    const guestCart = await Cart.findOne({ userId: guestUserId })
    
    if (!guestCart || guestCart.items.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No cart to transfer",
        items: []
      })
    }
    
    // Find or create user cart
    let userCart = await Cart.findOne({ userId: clerkUserId })
    
    if (!userCart) {
      userCart = new Cart({
        userId: clerkUserId,
        items: guestCart.items,
        updatedAt: new Date()
      })
    } else {
      // Merge carts
      const mergedItems = [...userCart.items]
      
      guestCart.items.forEach(guestItem => {
        const existingIndex = mergedItems.findIndex(
          item => 
            item.product.id === guestItem.product.id &&
            item.selectedSize === guestItem.selectedSize &&
            item.selectedColor === guestItem.selectedColor
        )
        
        if (existingIndex !== -1) {
          mergedItems[existingIndex].quantity += guestItem.quantity
        } else {
          mergedItems.push(guestItem)
        }
      })
      
      userCart.items = mergedItems
    }
    
    await userCart.save()
    
    // Delete guest cart
    await Cart.deleteOne({ userId: guestUserId })
    
    return NextResponse.json({
      success: true,
      message: "Cart transferred successfully",
      items: userCart.items
    })
    
  } catch (error) {
    console.error("Error transferring cart:", error)
    return NextResponse.json(
      { error: "Failed to transfer cart" },
      { status: 500 }
    )
  }
}