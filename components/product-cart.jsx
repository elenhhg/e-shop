"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"

export function ProductCard({
  slug,
  name,
  price,
  image,
  hoverImage,
  category,
  index,
  product, // Accept full product object for cart
  sizes = [],
  colors = [],
  inStock = true
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const containerRef = useRef(null)
  
  const { addItem } = useCart()

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!inStock) return
    
    setIsAddingToCart(true)
    
    try {
      // Add to cart with selected options
      addItem(
        {
          _id: product?._id || slug,
          id: product?._id || slug,
          name,
          price: typeof price === 'number' ? price : parseFloat(price),
          image,
          category
        },
        1,
        selectedSize,
        selectedColor
      )
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image with Link */}
      <Link
        href={`/product/${slug}`}
        className="block"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
          {/* Primary image */}
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-opacity duration-700 ease-in-out ${
              isHovered ? "opacity-0" : "opacity-100"
            }`}
          />

          {/* Hover image */}
          <Image
            src={hoverImage || image || "/placeholder.svg"}
            alt={`${name} alternate view`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-opacity duration-700 ease-in-out ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Shadow overlay */}
          <motion.div
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.1)]"
          />

          {/* Add to cart button (shown on hover) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: isHovered && inStock ? 1 : 0,
              y: isHovered && inStock ? 0 : 10
            }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10"
            onClick={(e) => e.preventDefault()} // Prevent link navigation
          >
            <Button
              onClick={handleAddToCart}
              disabled={!inStock || isAddingToCart}
              className="bg-black text-white hover:bg-gray-800 px-6 py-2 rounded-full text-sm font-medium shadow-lg"
            >
              {isAddingToCart ? (
                "Adding..."
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </motion.div>

          {/* Out of stock badge */}
          {!inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-sm font-medium px-3 py-1 bg-black/70">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="space-y-2">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest text-gray-500">
            {category}
          </p>
          <Link href={`/product/${slug}`}>
            <h3 className="font-serif text-lg hover:text-gray-600 transition-colors">
              {name}
            </h3>
          </Link>
          <p className="text-sm font-medium">
            ${typeof price === 'number' ? price.toFixed(2) : price}
          </p>
        </div>

        {/* Size selector (visible on hover) */}
        {sizes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              height: isHovered ? "auto" : 0
            }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-1 pt-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    setSelectedSize(selectedSize === size ? null : size)
                  }}
                  className={`px-2 py-1 text-xs border ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Color selector (visible on hover) */}
        {colors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              height: isHovered ? "auto" : 0
            }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 pt-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    setSelectedColor(selectedColor === color ? null : color)
                  }}
                  className={`w-5 h-5 rounded-full border ${
                    selectedColor === color
                      ? "border-2 border-black"
                      : "border-gray-300 hover:border-gray-400"
                    }`}
                  style={{ 
                    backgroundColor: color.toLowerCase(),
                    cursor: 'pointer'
                  }}
                  title={color}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Quick add button (always visible on mobile, hover on desktop) */}
        <div className="block md:hidden pt-2">
          <Button
            onClick={handleAddToCart}
            disabled={!inStock || isAddingToCart}
            variant="outline"
            size="sm"
            className="w-full text-sm"
          >
            {isAddingToCart ? (
              "Adding..."
            ) : (
              <>
                <ShoppingBag className="h-4 w-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}