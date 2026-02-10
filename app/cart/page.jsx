// app/cart/page.jsx
"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, ArrowLeft, Plus, Minus, Trash2, Loader2 } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart, isLoading } = useCart()
  const [isRemoving, setIsRemoving] = useState(null) // Track which item is being removed

  const handleRemoveItem = async (productId, selectedSize, selectedColor, itemId) => {
    setIsRemoving(itemId)
    try {
      await removeItem(productId, selectedSize, selectedColor)
    } catch (error) {
      console.error("Failed to remove item:", error)
    } finally {
      setIsRemoving(null)
    }
  }

  const handleUpdateQuantity = async (productId, newQuantity, selectedSize, selectedColor) => {
    await updateQuantity(productId, newQuantity, selectedSize, selectedColor)
  }

  if (isLoading && items.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 pb-20 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
        <PremiumFooter />
      </main>
    )
  }

  if (items.length === 0 && !isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 pb-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h1 className="text-2xl font-serif mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link href="/shop">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        </div>
        <PremiumFooter />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-serif">Shopping Cart</h1>
            <button
              onClick={clearCart}
              className="text-sm text-gray-500 hover:text-black transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Clearing..." : "Clear Cart"}
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {items.map((item, index) => {
                  const itemId = `${item.product.id}-${item.selectedSize}-${item.selectedColor}-${index}`
                  return (
                    <div
                      key={itemId}
                      className="flex gap-6 pb-6 border-b"
                    >
                      <div className="relative w-32 h-40 bg-gray-100 overflow-hidden">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between">
                          <div>
                            <h2 className="font-serif text-lg mb-1">{item.product.name}</h2>
                            {(item.selectedColor || item.selectedSize) && (
                              <p className="text-sm text-gray-500 mb-2">
                                {item.selectedColor && item.selectedColor}
                                {item.selectedColor && item.selectedSize && " / "}
                                {item.selectedSize && item.selectedSize}
                              </p>
                            )}
                            <p className="font-medium">${item.product.price.toFixed(2)}</p>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveItem(
                              item.product.id,
                              item.selectedSize,
                              item.selectedColor,
                              itemId
                            )}
                            className="text-gray-400 hover:text-black transition-colors h-fit disabled:opacity-50"
                            disabled={isLoading || isRemoving === itemId}
                          >
                            {isRemoving === itemId ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <Trash2 className="h-5 w-5" />
                            )}
                          </button>
                        </div>

                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center border border-gray-200 rounded">
                            <button
                              onClick={() => handleUpdateQuantity(
                                item.product.id,
                                item.quantity - 1,
                                item.selectedSize,
                                item.selectedColor
                              )}
                              className="p-2 hover:bg-gray-100 disabled:opacity-50"
                              disabled={isLoading || item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 text-center min-w-[3rem]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(
                                item.product.id,
                                item.quantity + 1,
                                item.selectedSize,
                                item.selectedColor
                              )}
                              className="p-2 hover:bg-gray-100 disabled:opacity-50"
                              disabled={isLoading}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <p className="font-medium">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-8">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Continue Shopping
                </Link>
              </div>
            </div>


{/* Order Summary */}
<div className="lg:col-span-1">
  <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
    <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
    
    {/* Προσθήκη λίστας προϊόντων στο summary */}
    <div className="space-y-4 mb-6">
      {items.map((item, index) => {
        const itemId = `${item.product.id}-${item.selectedSize}-${item.selectedColor}-${index}`
        return (
          <div key={itemId} className="flex justify-between text-sm">
            <div className="flex-1">
              <div className="font-medium">{item.product.name}</div>
              <div className="text-gray-600 text-xs">
                {item.selectedColor} {item.selectedSize && `/ ${item.selectedSize}`}
                <span className="ml-2">Qty: {item.quantity}</span>
              </div>
            </div>
            <div className="font-medium ml-4">
              ${(item.product.price * item.quantity).toFixed(2)}
            </div>
          </div>
        )
      })}
    </div>
    
    <div className="space-y-3 border-t pt-4">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Subtotal</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>
      
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Shipping</span>
        <span className="text-green-600 font-medium">Free</span>
      </div>
      
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Tax</span>
        <span>${(totalPrice * 0.08).toFixed(2)}</span>
      </div>
    </div>

    <div className="border-t mt-6 pt-6">
      <div className="flex justify-between text-lg font-semibold">
        <span>Total</span>
        <span>${(totalPrice + totalPrice * 0.08).toFixed(2)}</span>
      </div>
    </div>

    <Link href="/checkout" className="block w-full mt-6">
      <Button 
        className="w-full h-12 bg-black text-white hover:bg-gray-800 disabled:bg-gray-400"
        disabled={isLoading || items.length === 0}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Loading...
          </>
        ) : (
          "Proceed to Checkout"
        )}
      </Button>
    </Link>

    <p className="text-xs text-gray-500 mt-4 text-center">
      Shipping and taxes calculated at checkout
    </p>
  </div>
</div>
          </div>
        </div>
      </div>

      <PremiumFooter />
    </main>
  )
}