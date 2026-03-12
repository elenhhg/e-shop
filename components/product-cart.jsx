"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"
import { ShoppingBag, Check, X } from "lucide-react"
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
  product,
  sizes = [],
  colors = [],
  inStock = true
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  
  // Modal states
  const [showAddedModal, setShowAddedModal] = useState(false)
  const [showValidationModal, setShowValidationModal] = useState(false)
  const [validationMessage, setValidationMessage] = useState("")
  
  // Refs
  const addedTimeoutRef = useRef(null)
  const containerRef = useRef(null)
  const [mounted, setMounted] = useState(false)
  
  const { addItem } = useCart()

  // Helper functions
  const getColorValue = (color) => {
    if (typeof color === 'string') return color
    if (typeof color === 'object' && color !== null) {
      return color.hex || color.value || '#cccccc'
    }
    return '#cccccc'
  }

  const getColorName = (color) => {
    if (typeof color === 'string') return color
    if (typeof color === 'object' && color !== null) {
      return color.name || 'Color'
    }
    return 'Color'
  }

  const isColorAvailable = (color) => {
    if (typeof color === 'object' && color !== null) {
      return color.available !== false
    }
    return true
  }

  const getSizeString = (size) => {
    if (typeof size === 'string') return size
    if (typeof size === 'object' && size !== null) {
      return size.size || size.name || 'Size'
    }
    return 'Size'
  }

  const isSizeAvailable = (size) => {
    if (typeof size === 'object' && size !== null) {
      return size.available !== false
    }
    return true
  }

  // Normalize colors and sizes
  const normalizedColors = Array.isArray(colors) 
    ? colors.filter(color => color && isColorAvailable(color)).map(color => ({
        value: getColorValue(color),
        name: getColorName(color),
        original: color,
        available: isColorAvailable(color)
      }))
    : []

  const normalizedSizes = Array.isArray(sizes) 
    ? sizes.filter(size => size && isSizeAvailable(size)).map(size => ({
        label: getSizeString(size),
        original: size,
        available: isSizeAvailable(size)
      }))
    : []

  const isProductInStock = inStock && 
    (normalizedColors.length === 0 || normalizedColors.some(color => color.available)) &&
    (normalizedSizes.length === 0 || normalizedSizes.some(size => size.available))

  // Για το portal (να ξέρουμε πότε είμαστε στον client)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (addedTimeoutRef.current) {
        clearTimeout(addedTimeoutRef.current)
      }
    }
  }, [])

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!inStock) return
    
    // Validate selections
    if (normalizedSizes.length > 0 && !selectedSize) {
      setValidationMessage("Please select a size")
      setShowValidationModal(true)
      console.log("VALIDATION MODAL: size missing")
      return
    }
    
    if (normalizedColors.length > 0 && !selectedColor) {
      setValidationMessage("Please select a color")
      setShowValidationModal(true)
      console.log("VALIDATION MODAL: color missing")
      return
    }
    
    setIsAddingToCart(true)
    
    try {
      const productData = {
        _id: product?.id || slug,
        id: product?.id || slug,
        name,
        price: typeof price === 'number' ? price : parseFloat(price),
        image: image || "/placeholder.svg",
        category,
        slug
      }
      
      addItem(
        productData, 
        1, 
        selectedSize ? getSizeString(selectedSize) : null,
        selectedColor ? getColorName(selectedColor) : null
      )
      
      // Show added modal
      setShowAddedModal(true)
      console.log("ADDED MODAL shown")
      if (addedTimeoutRef.current) {
        clearTimeout(addedTimeoutRef.current)
      }
      addedTimeoutRef.current = setTimeout(() => {
        setShowAddedModal(false)
        console.log("ADDED MODAL hidden")
      }, 2000)
      
    } catch (error) {
      console.error("Error adding to cart:", error)
      setValidationMessage("Failed to add item. Please try again.")
      setShowValidationModal(true)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleSizeSelect = (size, e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isSizeAvailable(size.original)) return
    setSelectedSize(selectedSize?.label === size.label ? null : size)
  }

  const handleColorSelect = (color, e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!color.available) return
    setSelectedColor(selectedColor?.name === color.name ? null : color)
  }

  // Περιεχόμενο του modal επιτυχίας
  const addedModalContent = (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[99999] bg-black text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
      <Check className="h-5 w-5 text-green-400" />
      <span className="text-sm font-medium">Added to cart</span>
    </div>
  )

  // Περιεχόμενο του validation modal
  const validationModalContent = (
    <>
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[99998]" 
        onClick={() => setShowValidationModal(false)}
      />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[99999] bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">Selection Required</h3>
          <button
            onClick={() => setShowValidationModal(false)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-gray-600 mb-6">{validationMessage}</p>
        <div className="flex justify-end">
          <Button
            onClick={() => setShowValidationModal(false)}
            variant="outline"
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            onClick={() => setShowValidationModal(false)}
            className="bg-black text-white hover:bg-gray-800"
          >
            OK
          </Button>
        </div>
      </div>
    </>
  )

  return (
    <>
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
          onClick={(e) => {
            if (e.target.closest('button') || e.target.closest('.add-to-cart-btn')) {
              e.preventDefault()
            }
          }}
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
                opacity: isHovered && isProductInStock ? 1 : 0,
                y: isHovered && isProductInStock ? 0 : 10
              }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10"
            >
              <Button
                onClick={handleAddToCart}
                disabled={!isProductInStock || isAddingToCart}
                className="add-to-cart-btn bg-black text-white hover:bg-gray-800 px-6 py-2 rounded-full text-sm font-medium shadow-lg min-w-[140px] transition-all duration-300"
              >
                {isAddingToCart ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </span>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
            </motion.div>

            {/* Out of stock badge */}
            {!isProductInStock && (
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
          {normalizedSizes.length > 0 && (
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
                <p className="text-xs text-gray-500 w-full mb-1">Size:</p>
                {normalizedSizes.map((size, index) => (
                  <button
                    key={`size-${index}-${size.label}`}
                    type="button"
                    onClick={(e) => handleSizeSelect(size, e)}
                    disabled={!size.available}
                    className={`px-3 py-1 text-xs border transition-colors ${
                      selectedSize?.label === size.label
                        ? "border-black bg-black text-white"
                        : size.available
                        ? "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                        : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Color selector (visible on hover) */}
          {normalizedColors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: isHovered ? 1 : 0,
                height: isHovered ? "auto" : 0
              }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 pt-2 items-center">
                <p className="text-xs text-gray-500 w-full mb-1">Color:</p>
                {normalizedColors.map((color, index) => (
                  <button
                    key={`color-${index}-${color.name}`}
                    type="button"
                    onClick={(e) => handleColorSelect(color, e)}
                    disabled={!color.available}
                    className={`w-6 h-6 rounded-full border-2 transition-all relative ${
                      selectedColor?.name === color.name
                        ? "border-black scale-110 shadow-md"
                        : color.available
                        ? "border-gray-300 hover:border-gray-400 hover:scale-105"
                        : "border-gray-200 opacity-50 cursor-not-allowed"
                    }`}
                    style={{ 
                      backgroundColor: typeof color.value === 'string' 
                        ? color.value.toLowerCase() 
                        : '#cccccc'
                    }}
                    title={color.available ? color.name : `${color.name} (Out of Stock)`}
                    aria-label={`Select color ${color.name}`}
                  >
                    {!color.available && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-px bg-gray-400 rotate-45"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Quick add button (always visible on mobile, hover on desktop) */}
          <div className="block md:hidden pt-2">
            <Button
              onClick={handleAddToCart}
              disabled={!isProductInStock || isAddingToCart || (normalizedSizes.length > 0 && !selectedSize) || (normalizedColors.length > 0 && !selectedColor)}
              variant="outline"
              size="sm"
              className="w-full text-sm add-to-cart-btn"
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

          {/* Selection indicators */}
          {(selectedSize || selectedColor) && (
            <div className="text-xs text-gray-500 pt-1 space-y-1">
              {selectedSize && (
                <p className="flex items-center">
                  <span className="mr-1">✓</span>
                  Size: <span className="font-medium ml-1">{selectedSize.label}</span>
                </p>
              )}
              {selectedColor && (
                <p className="flex items-center">
                  <span className="mr-1">✓</span>
                  Color: <span className="font-medium ml-1">{selectedColor.name}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Render modals with portal only on client */}
      {mounted && (
        <>
          {showAddedModal && createPortal(addedModalContent, document.body)}
          {showValidationModal && createPortal(validationModalContent, document.body)}
        </>
      )}
    </>
  )
}