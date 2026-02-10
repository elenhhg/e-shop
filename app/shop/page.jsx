// app/shop/page.jsx
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/footer"
import { products, categories, priceRanges } from "@/lib/product"
import { ArrowRight, SlidersHorizontal } from "lucide-react"
import { ProductCard } from "@/components/product-cart"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [activePriceRange, setActivePriceRange] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("featured")

  let filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory)

  if (activePriceRange) {
    const range = priceRanges.find((r) => r.label === activePriceRange)
    if (range) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price >= range.min && p.price <= range.max
      )
    }
  }

  if (sortBy === "price-low") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price)
  } else if (sortBy === "price-high") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price)
  } else if (sortBy === "name") {
    filteredProducts = [...filteredProducts].sort((a, b) =>
      a.name.localeCompare(b.name)
    )
  }

  const clearFilters = () => {
    setActiveCategory("All")
    setActivePriceRange(null)
    setSortBy("featured")
  }

  return (
    // ΑΦΑΙΡΕΣΤΕ ΑΥΤΗ ΤΗ ΓΡΑΜΜΗ: <CartProvider>
    <motion.main
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Navigation />

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-background/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-background/20 to-background" />
        
        <motion.div
          className="relative z-10 text-center px-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="font-serif text-5xl md:text-7xl mb-6">
            The Collection
          </h1>
          <p className="text-sm sm:text-base tracking-[0.2em] font-light">
            Thoughtfully curated pieces to transform your space.
          </p>
        </motion.div>
      </section>

      {/* Filters */}
      <section className="border-b sticky top-16 bg-background/95 backdrop-blur-sm z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 text-sm uppercase hover:text-foreground/80 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm bg-transparent border-none focus:outline-none focus:ring-0"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden px-6 pb-6 border-t"
            >
              <div className="space-y-4 pt-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Categories</h3>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat)
                        setShowFilters(false)
                      }}
                      className={`block w-full text-left py-1 ${
                        activeCategory === cat
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Products Grid */}
      <section className="py-12 max-w-7xl mx-auto px-6">
        {/* Active filters info */}
        {(activeCategory !== "All" || activePriceRange || sortBy !== "featured") && (
          <div className="mb-8 flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {activeCategory !== "All" && (
              <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                Category: {activeCategory}
              </span>
            )}
            {activePriceRange && (
              <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                Price: {activePriceRange}
              </span>
            )}
            {sortBy !== "featured" && (
              <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                Sorted: {
                  sortBy === "price-low" ? "Low to High" :
                  sortBy === "price-high" ? "High to Low" :
                  "A-Z"
                }
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-sm underline hover:text-foreground/80"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Products */}
        {filteredProducts.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  slug={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.images?.[0] || product.image}
                  hoverImage={product.images?.[1] || product.images?.[0]}
                  category={product.category}
                  index={index}
                  product={product}
                  sizes={product.sizes || []}
                  colors={product.colors || []}
                  inStock={product.inStock !== false}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-lg text-muted-foreground mb-4">
              No products found matching your filters.
            </p>
            <button
              onClick={clearFilters}
              className="text-sm underline hover:text-foreground/80"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </section>

      {/* CTA */}
      <motion.section
        className="border-t py-20 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="font-serif text-3xl mb-6">Made with Purpose</h2>
        <Link
          href="/heritage"
          className="inline-flex items-center gap-2 uppercase text-sm hover:gap-3 transition-all"
        >
          Discover Our Story <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.section>

      <PremiumFooter />
    </motion.main>
  
  )
}