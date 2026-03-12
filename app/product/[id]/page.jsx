"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/footer"
import { ProductGallery } from "@/components/product-gallery"
import { ProductDetailsAccordion } from "@/components/product-details"
import { RelatedProducts } from "@/components/related-product"
import { Button } from "@/components/ui/button"
import { products } from "@/lib/product"
import { Heart, Share2, Truck, RotateCcw, Shield, ShoppingBag, Check, X } from "lucide-react"
import Link from "next/link"
import { CartProvider } from "@/components/cart-provider"
import { useCart } from "@/components/cart-provider"

// Helper functions (ίδιες)
const getSizeString = (size) => {
  if (typeof size === 'string') return size
  if (typeof size === 'object' && size !== null) {
    return size.size || size.name || 'Size'
  }
  return 'Size'
}

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

const isSizeAvailable = (size) => {
  if (typeof size === 'object' && size !== null) {
    return size.available !== false
  }
  return true
}

function ProductPageContent() {
  const params = useParams()
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  
  // Modal states
  const [showAddedModal, setShowAddedModal] = useState(false)
  const [showValidationModal, setShowValidationModal] = useState(false)
  const [validationMessage, setValidationMessage] = useState("")
  
  // Refs
  const addedTimeoutRef = useRef(null)
  const [mounted, setMounted] = useState(false)

  const productId = Array.isArray(params?.id) ? params.id[0] : params?.id
  const product = products.find((p) => p.id === productId) || products[0]
  
  const { addItem } = useCart()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    return () => {
      if (addedTimeoutRef.current) {
        clearTimeout(addedTimeoutRef.current)
      }
    }
  }, [])

  // Normalize sizes
  const normalizedSizes = Array.isArray(product.sizes) 
    ? product.sizes.filter(size => size && isSizeAvailable(size)).map(size => ({
        label: getSizeString(size),
        original: size,
        available: isSizeAvailable(size)
      }))
    : []

  // Normalize colors
  const normalizedColors = Array.isArray(product.colors) 
    ? product.colors.filter(color => color && isColorAvailable(color)).map(color => ({
        value: getColorValue(color),
        name: getColorName(color),
        original: color,
        available: isColorAvailable(color)
      }))
    : []

  const relatedProducts = products
    .filter((p) => p.id !== product.id)
    .slice(0, 4)

  const handleAddToCart = () => {
    if (normalizedSizes.length > 0 && !selectedSize) {
      setValidationMessage("Please select a size")
      setShowValidationModal(true)
      return
    }

    if (normalizedColors.length > 0 && !selectedColor) {
      setValidationMessage("Please select a color")
      setShowValidationModal(true)
      return
    }

    setIsAddingToCart(true)
    
    try {
      addItem(
        {
          _id: product.id,
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || product.image,
          category: product.category,
          slug: product.id
        },
        1,
        selectedSize ? selectedSize.label : null,
        selectedColor ? selectedColor.name : null
      )
      
      // Show added modal
      setShowAddedModal(true)
      if (addedTimeoutRef.current) {
        clearTimeout(addedTimeoutRef.current)
      }
      addedTimeoutRef.current = setTimeout(() => {
        setShowAddedModal(false)
      }, 2000)
      
    } catch (error) {
      console.error("Error adding to cart:", error)
      setValidationMessage("Failed to add item. Please try again.")
      setShowValidationModal(true)
    } finally {
      setIsAddingToCart(false)
    }
  }

  // Check if product is in stock
  const isProductInStock = normalizedColors.some(color => color.available) && 
    normalizedSizes.some(size => size.available)

  // Modal content
  const addedModalContent = (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[99999] bg-black text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
      <Check className="h-5 w-5 text-green-400" />
      <span className="text-sm font-medium">Added to cart</span>
    </div>
  )

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
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm">
            <ol className="flex items-center gap-2 text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/shop" className="hover:text-foreground transition-colors">
                  Shop
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground">{product.name}</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Product Gallery */}
            <ProductGallery
              images={product.images}
              productName={product.name}
            />

            {/* Product Info */}
            <div className="lg:py-8">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground tracking-widest uppercase mb-2">
                  {product.category}
                </p>
                <h1 className="text-3xl lg:text-4xl font-light tracking-tight mb-4">
                  {product.name}
                </h1>
                <p className="text-2xl">
                  ${product.price?.toLocaleString()}
                </p>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Size Selector */}
              {normalizedSizes.length > 0 && (
                <div className="mb-8">
                  <div className="mb-3">
                    <label className="text-sm font-medium mb-2 block">
                      Size {selectedSize && `: ${selectedSize.label}`}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {normalizedSizes.map((size, index) => (
                        <button
                          key={`size-${index}-${size.label}`}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          disabled={!size.available}
                          className={`px-4 py-2 text-sm border transition-colors ${
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
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {normalizedColors.length > 0 && (
                <div className="mb-8">
                  <div className="mb-3">
                    <label className="text-sm font-medium mb-2 block">
                      Color {selectedColor && `: ${selectedColor.name}`}
                    </label>
                    <div className="flex flex-wrap gap-3 items-center">
                      {normalizedColors.map((color, index) => (
                        <button
                          key={`color-${index}-${color.name}`}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          disabled={!color.available}
                          className={`w-8 h-8 rounded-full border-2 transition-all relative ${
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
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 mb-8">
                <Button 
                  onClick={handleAddToCart}
                  disabled={!isProductInStock || isAddingToCart}
                  className="flex-1 h-14 text-sm tracking-widest uppercase bg-foreground text-background hover:bg-foreground/90 flex items-center justify-center gap-2"
                >
                  {isAddingToCart ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      Add to Cart
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 border-border hover:bg-secondary bg-transparent"
                >
                  <Heart className="h-5 w-5" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 border-border hover:bg-secondary bg-transparent"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Out of stock message */}
              {!isProductInStock && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700 text-sm">
                    This product is currently out of stock in all available options.
                  </p>
                </div>
              )}

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-4 py-8 border-y border-border mb-8">
                <div className="text-center">
                  <Truck className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    Free Shipping
                  </p>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    30-Day Returns
                  </p>
                </div>
                <div className="text-center">
                  <Shield className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    2-Year Warranty
                  </p>
                </div>
              </div>

              {/* Product Details */}
              <ProductDetailsAccordion
                materials={product.materials}
                dimensions={product.dimensions}
                care={product.care}
              />
            </div>
          </div>

          {/* Related Products */}
          <RelatedProducts products={relatedProducts} />
        </div>
      </div>

      <PremiumFooter />

      {/* Modals */}
      {mounted && (
        <>
          {showAddedModal && createPortal(addedModalContent, document.body)}
          {showValidationModal && createPortal(validationModalContent, document.body)}
        </>
      )}
    </main>
  )
}

export default function ProductPage() {
  return (
    <CartProvider>
      <ProductPageContent />
    </CartProvider>
  )
}