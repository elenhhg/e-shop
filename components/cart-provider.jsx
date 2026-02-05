"use client"

import { createContext, useContext, useState, useCallback, useEffect } from "react"

const CartContext = createContext(undefined)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.error("Failed to parse cart from localStorage")
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product, quantity = 1, selectedSize = null, selectedColor = null) => {
    setItems((prevItems) => {
      // Create unique key based on product id, size, and color
      const itemKey = `${product._id || product.id}-${selectedSize}-${selectedColor}`
      const existingItem = prevItems.find(
        (item) =>
          (item.product._id || item.product.id) === (product._id || product.id) &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      )

      if (existingItem) {
        return prevItems.map((item) =>
          (item.product._id || item.product.id) === (product._id || product.id) &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prevItems, { product, quantity, selectedSize, selectedColor }]
    })
    setIsCartOpen(true)
  }, [])

  const removeItem = useCallback((productId, selectedSize = null, selectedColor = null) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !((item.product._id || item.product.id) === productId &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor)
      )
    )
  }, [])

  const updateQuantity = useCallback(
    (productId, quantity, selectedSize = null, selectedColor = null) => {
      if (quantity <= 0) {
        removeItem(productId, selectedSize, selectedColor)
        return
      }
      setItems((prevItems) =>
        prevItems.map((item) =>
          (item.product._id || item.product.id) === productId &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
            ? { ...item, quantity }
            : item
        )
      )
    },
    [removeItem]
  )

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
