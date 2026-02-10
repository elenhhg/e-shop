// app/api/cart/route.js
import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Cart from "@/models/cart"

// Helper function to get user ID from cookie
function getUserId(request) {
  const cookie = request.cookies.get("cart_user_id")
  
  if (!cookie) {
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    console.log("Generated new guest ID:", guestId)
    return guestId
  }
  
  return cookie.value
}

export async function GET(request) {
  try {
    console.log("GET /api/cart - Connecting to DB...")
    await dbConnect()
    
    const userId = getUserId(request)
    console.log("GET - User ID:", userId)
    
    let cart = await Cart.findOne({ userId })
    
    if (!cart) {
      console.log("No cart found, creating new one")
      cart = new Cart({ 
        userId, 
        items: [],
        updatedAt: new Date()
      })
      await cart.save()
    }
    
    console.log("GET - Cart found with items:", cart.items?.length || 0)
    
    const response = NextResponse.json({
      success: true,
      items: cart.items || []
    })
    
    // Set cookie if not present
    if (!request.cookies.get("cart_user_id")) {
      response.cookies.set("cart_user_id", userId, {
        path: "/",
        maxAge: 31536000,
        sameSite: "lax",
        httpOnly: true
      })
    }
    
    return response
    
  } catch (error) {
    console.error("Error in GET /api/cart:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        items: [] 
      },
      { status: 200 }
    )
  }
}

export async function POST(request) {
  try {
    await dbConnect()
    
    const userId = getUserId(request)
    console.log("POST - User ID:", userId)
    
    const { items } = await request.json()
    console.log("POST - Items to save:", items?.length || 0)
    
    const validatedItems = Array.isArray(items) ? items.map(item => {
      return {
        product: {
          id: item.product?.id || item.product?._id || "",
          name: item.product?.name || "Unknown Product",
          price: Number(item.product?.price) || 0,
          image: item.product?.image || "",
          category: item.product?.category || "",
          slug: item.product?.slug || ""
        },
        quantity: Number(item.quantity) || 1,
        selectedSize: item.selectedSize || null,
        selectedColor: item.selectedColor || null
      }
    }) : []
    
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { 
        items: validatedItems,
        updatedAt: new Date()
      },
      { 
        upsert: true,
        new: true,
        setDefaultsOnInsert: true 
      }
    )
    
    console.log("POST - Cart saved successfully, items:", cart.items?.length || 0)
    
    const response = NextResponse.json({ 
      success: true,
      items: cart.items || []
    })
    
    // Set cookie if not present
    if (!request.cookies.get("cart_user_id")) {
      response.cookies.set("cart_user_id", userId, {
        path: "/",
        maxAge: 31536000,
        sameSite: "lax",
        httpOnly: true
      })
    }
    
    return response
    
  } catch (error) {
    console.error("Error saving cart:", error)
    return NextResponse.json(
      { error: "Failed to save cart", details: error.message },
      { status: 500 }
    )
  }
}