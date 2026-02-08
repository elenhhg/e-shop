"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Plus, Minus, ShoppingBag } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
  } = useCart()

  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsCartOpen(false)
      setIsClosing(false)
    }, 300)
  }

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isCartOpen) {
        handleClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isCartOpen])

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isCartOpen])

  if (!isCartOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleClose}
        role="button"
        tabIndex={0}
        aria-label="Close cart"
        onKeyDown={(e) => e.key === "Enter" && handleClose()}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ${
          isClosing ? "translate-x-full" : "translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Shopping Cart</h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Link
                href="/shop"
                onClick={handleClose}
                className="text-sm underline hover:no-underline"
              >
                Continue shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.product._id}-${item.selectedSize}-${item.selectedColor}`}
                  className="flex gap-4 pb-4 border-b"
                >
                  <div className="relative h-24 w-20 bg-gray-100 overflow-hidden">
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
                        <h3 className="font-medium text-sm">{item.product.name}</h3>
                        {(item.selectedSize || item.selectedColor) && (
                          <p className="text-xs text-gray-500 mt-1">
                            {item.selectedColor && item.selectedColor}
                            {item.selectedColor && item.selectedSize && " / "}
                            {item.selectedSize && item.selectedSize}
                          </p>
                        )}
                        <p className="text-sm font-medium mt-2">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-gray-200 rounded">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.product._id,
                              item.quantity - 1,
                              item.selectedSize,
                              item.selectedColor
                            )
                          }
                          className="p-1 hover:bg-gray-100"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>

                        <span className="px-3 text-sm min-w-[2rem] text-center">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.product._id,
                              item.quantity + 1,
                              item.selectedSize,
                              item.selectedColor
                            )
                          }
                          className="p-1 hover:bg-gray-100"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeItem(
                            item.product._id,
                            item.selectedSize,
                            item.selectedColor
                          )
                        }
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">${totalPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="text-green-600">Free</span>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between font-semibold text-lg mb-4">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <Link
                href="/checkout"
                onClick={handleClose}
                className="block w-full"
              >
                <Button className="w-full py-3 bg-black text-white hover:bg-gray-800">
                  Proceed to Checkout
                </Button>
              </Link>

              <p className="text-xs text-gray-500 mt-2 text-center">
                Shipping and taxes calculated at checkout
              </p>

              <button
                type="button"
                onClick={handleClose}
                className="w-full text-center text-sm mt-4 hover:underline"
              >
                Continue shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}