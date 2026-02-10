// components/mini-cart.js
"use client"

import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, Minus, Plus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useCart } from "./cart-provider"

export function MiniCart({ isOpen, onClose }) {
  const { items, removeItem, updateQuantity, totalPrice, isLoading } = useCart()

  const handleRemove = async (productId, selectedSize, selectedColor) => {
    await removeItem(productId, selectedSize, selectedColor)
  }

  const handleUpdateQuantity = async (productId, newQuantity, selectedSize, selectedColor) => {
    await updateQuantity(productId, newQuantity, selectedSize, selectedColor)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/40 z-50"
          />

          {/* Cart panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-serif text-xl">Shopping Bag</h2>
              <button
                onClick={onClose}
                className="p-2 -mr-2 hover:opacity-60 transition-opacity"
                aria-label="Close cart"
              >
                <X className="h-5 w-5 stroke-[1.5]" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-6">Your bag is empty</p>
                  <Button onClick={onClose} variant="outline">
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item, index) => (
                    <motion.div
                      key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="w-24 h-30 bg-muted flex-shrink-0 relative">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          sizes="96px"
                          loading="lazy"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif text-sm mb-1">{item.product.name}</h3>
                        {(item.selectedSize || item.selectedColor) && (
                          <p className="text-xs text-muted-foreground mb-3">
                            {item.selectedColor && `Color: ${item.selectedColor}`}
                            {item.selectedColor && item.selectedSize && " / "}
                            {item.selectedSize && `Size: ${item.selectedSize}`}
                          </p>
                        )}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleUpdateQuantity(
                              item.product.id,
                              item.quantity - 1,
                              item.selectedSize,
                              item.selectedColor
                            )}
                            className="p-1 hover:opacity-60 transition-opacity"
                            disabled={isLoading}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.selectedSize,
                              item.selectedColor
                            )}
                            className="p-1 hover:opacity-60 transition-opacity"
                            disabled={isLoading}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <span className="text-sm">
                          ${(item.product.price * item.quantity).toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleRemove(
                            item.product.id,
                            item.selectedSize,
                            item.selectedColor
                          )}
                          className="text-xs text-muted-foreground underline hover:text-foreground transition-colors"
                          disabled={isLoading}
                        >
                          Remove
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping and taxes calculated at checkout
                </p>
                <Link href="/checkout" onClick={onClose}>
                  <Button 
                    className="w-full py-6 text-sm tracking-[0.2em] uppercase"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Proceed to Checkout"}
                  </Button>
                </Link>
                <button
                  onClick={onClose}
                  className="w-full text-center text-sm tracking-wide underline underline-offset-4 hover:no-underline transition-all"
                  disabled={isLoading}
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}