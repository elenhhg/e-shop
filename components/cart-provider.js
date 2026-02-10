// components/cart-provider.js
"use client"

import { createContext, useContext, useState, useCallback, useEffect } from "react"

const CartContext = createContext(undefined)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load cart from MongoDB on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        setIsLoading(true)
        console.log("Loading cart from API...")
        
        const response = await fetch("/api/cart", {
          credentials: 'include'
        })
        
        console.log("Cart API response status:", response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log("Cart API response data:", data)
          
          if (data.success) {
            console.log("Setting cart items:", data.items?.length || 0)
            setItems(data.items || [])
          } else {
            console.error("API returned error:", data.error)
            setItems([])
          }
        } else {
          console.error("Failed to load cart, status:", response.status)
          setItems([])
        }
      } catch (error) {
        console.error("Failed to load cart from MongoDB:", error)
        setItems([])
      } finally {
        setIsLoading(false)
      }
    }
    
    loadCart()
  }, [])

  // Save cart to MongoDB
  const saveCartToDB = useCallback(async (cartItems) => {
    try {
      console.log("Saving cart to DB with items:", cartItems.length)
      
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ items: cartItems }),
      })
      
      console.log("Save cart response status:", response.status)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save cart to database")
      }
      
      const result = await response.json()
      console.log("Cart saved successfully:", result)
      return result
    } catch (error) {
      console.error("Failed to save cart:", error)
      throw error
    }
  }, [])

  const addItem = useCallback(async (product, quantity = 1, selectedSize = null, selectedColor = null) => {
    console.log("Adding item to cart:", product, quantity, selectedSize, selectedColor)
    
    // Ensure product has required fields
    const validatedProduct = {
      id: product.id || product._id || "",
      name: product.name || "Unknown Product",
      price: Number(product.price) || 0,
      image: product.image || "",
      category: product.category || "",
      slug: product.slug || ""
    }
    
    setItems((prevItems) => {
      const newItems = [...prevItems]
      const existingItemIndex = newItems.findIndex(
        (item) =>
          item.product.id === validatedProduct.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      )

      if (existingItemIndex !== -1) {
        // Update existing item
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity
        }
      } else {
        // Add new item
        newItems.push({ 
          product: validatedProduct, 
          quantity, 
          selectedSize, 
          selectedColor 
        })
      }

      // Save to DB
      saveCartToDB(newItems).catch(console.error)
      
      return newItems
    })
    
    setIsCartOpen(true)
  }, [saveCartToDB])

  const removeItem = useCallback(async (productId, selectedSize = null, selectedColor = null) => {
    console.log("Removing item from cart:", productId, selectedSize, selectedColor)
    
    setItems((prevItems) => {
      const newItems = prevItems.filter(
        (item) =>
          !(item.product.id === productId &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor)
      )
      
      // Save to DB
      saveCartToDB(newItems).catch(console.error)
      
      return newItems
    })
  }, [saveCartToDB])

  const updateQuantity = useCallback(async (productId, quantity, selectedSize = null, selectedColor = null) => {
    console.log("Updating quantity:", productId, quantity)
    
    if (quantity <= 0) {
      await removeItem(productId, selectedSize, selectedColor)
      return
    }
    
    setItems((prevItems) => {
      const newItems = prevItems.map((item) =>
        item.product.id === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
          ? { ...item, quantity }
          : item
      )
      
      // Save to DB
      saveCartToDB(newItems).catch(console.error)
      
      return newItems
    })
  }, [removeItem, saveCartToDB])

  const clearCart = useCallback(async () => {
    console.log("Clearing cart")
    setItems([])
    
    // Clear from database
    await saveCartToDB([])
  }, [saveCartToDB])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

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
        isLoading,
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