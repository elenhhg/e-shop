"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Plus, Minus, ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart"

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
        className={`fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 ${
          isClosing ? "animate-fade-out" : "animate-backdrop-in"
        }`}
        onClick={handleClose}
        role="button"
        tabIndex={0}
        aria-label="Close cart"
        onKeyDown={(e) => e.key === "Enter" && handleClose()}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border z-50 flex flex-col ${
          isClosing ? "animate-slide-out-right" : "animate-slide-in-right"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-serif text-xl">Shopping Bag</h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 -mr-2 text-foreground/70 hover:text-foreground transition-colors duration-300"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground mb-6">
                Your bag is empty
              </p>
              <Link
                href="/shop"
                onClick={handleClose}
                className="text-sm tracking-wide underline underline-offset-4 hover:text-foreground transition-colors duration-300"
              >
                Continue shopping
              </Link>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item, index) => (
                <li
                  key={item.product.id}
                  className="flex gap-4 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Link
                    href={`/shop/${item.product.id}`}
                    onClick={handleClose}
                    className="relative h-24 w-20 flex-shrink-0 bg-secondary/50 overflow-hidden group"
                  >
                    <Image
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between">
                      <div>
                        <Link
                          href={`/shop/${item.product.id}`}
                          onClick={handleClose}
                          className="font-serif text-sm hover:text-muted-foreground transition-colors duration-300"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.product.category}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        className="p-1 -mr-1 text-muted-foreground hover:text-foreground transition-colors duration-300"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-border">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity - 1
                            )
                          }
                          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors duration-300"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>

                        <span className="px-3 text-sm">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity + 1
                            )
                          }
                          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors duration-300"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <p className="text-sm">
                        ${item.product.price * item.quantity}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Subtotal
              </span>
              <span className="font-serif text-lg">
                ${totalPrice}
              </span>
            </div>

            <p className="text-xs text-muted-foreground">
              Shipping and taxes calculated at checkout
            </p>

            <Link
              href="/checkout"
              onClick={handleClose}
              className="block w-full py-4 bg-primary text-primary-foreground text-sm tracking-wide text-center hover:bg-primary/90 transition-all duration-300 hover:shadow-lg"
            >
              Checkout
            </Link>

            <button
              type="button"
              onClick={handleClose}
              className="w-full text-center text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-300 underline underline-offset-4"
            >
              Continue shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
