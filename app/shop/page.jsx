"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/footer"
import { products, categories, priceRanges } from "@/lib/product"
import { ArrowRight, SlidersHorizontal } from "lucide-react"

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
    <motion.main
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Navigation />

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/shop-hero-home-decor.jpg"
          alt="Shop hero"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-foreground/40" />

        <motion.div
          className="relative z-10 text-center text-background px-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="font-serif text-5xl md:text-7xl mb-6">
            The Collection
          </h1>
          <p className="max-w-xl mx-auto text-background/80">
            Thoughtfully curated pieces to transform your space.
          </p>
        </motion.div>
      </section>

      {/* Filters */}
      <section className="border-b sticky top-16 bg-background z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 text-sm uppercase"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm bg-transparent"
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
              className="lg:hidden overflow-hidden px-6 pb-6"
            >
              <div className="space-y-4">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="block text-left text-muted-foreground hover:text-foreground"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Products */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={item}
                layout
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Link href={`/product/${product.id}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                    <Image
                      src={
                        product.images?.[0] ||
                        product.image ||
                        "/placeholder.svg"
                      }
                      alt={product.name}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="mt-3 font-serif">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    ${product.price}
                  </p>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p>No products found.</p>
            <button onClick={clearFilters} className="underline">
              Clear filters
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
          className="inline-flex items-center gap-2 uppercase text-sm"
        >
          Discover Our Story <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.section>

      <PremiumFooter />
    </motion.main>
  )
}
