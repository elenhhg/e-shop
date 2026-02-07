"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ProductCard } from "./product-cart"

export function CollectionGrid() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/products/featured")
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching products:", err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <p className="text-center py-12">Loading products...</p>
  }

  return (
    <section className="py-24 lg:py-32 px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-24"
        >
          <h2 className="font-serif text-3xl lg:text-5xl mb-4">
            Curated for You
          </h2>
          <p className="text-muted-foreground tracking-wide max-w-md mx-auto">
            Handpicked pieces that transform houses into homes
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {products.map((product, index) => (
            <div
              key={product._id}
              className={
                index % 3 === 0
                  ? "lg:pt-12"
                  : index % 3 === 2
                  ? "lg:pt-24"
                  : ""
              }
            >
              <ProductCard {...product} index={index} />
            </div>
          ))}
        </div>

        {/* Footer link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16 lg:mt-24"
        >
          <Link
            href="/shop"
            className="inline-flex items-center text-sm tracking-[0.2em] uppercase border-b border-foreground pb-1 hover:border-transparent transition-colors duration-300"
          >
            View Full Collection
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
