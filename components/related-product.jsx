"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import useSWR from "swr"

const fetcher = (url) => fetch(url).then((res) => res.json())

export function RelatedProducts({ currentProductId, category }) {
  const { data: products, isLoading } = useSWR(
    `/api/products?category=${category}&limit=4`,
    fetcher
  )

  // Filter out current product
  const relatedProducts = products?.filter(
    (p) => (p._id || p.id) !== currentProductId
  )?.slice(0, 4)

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 border-t border-muted">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-serif text-2xl md:text-3xl mb-10 text-center">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-muted mb-4" />
                <div className="h-4 bg-muted w-3/4 mb-2" />
                <div className="h-3 bg-muted w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!relatedProducts || relatedProducts.length === 0) return null

  return (
    <section className="py-16 md:py-24 border-t border-muted">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-serif text-2xl md:text-3xl mb-10 text-center">You May Also Like</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {relatedProducts.map((product, index) => (
            <motion.div
              key={product._id || product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={`/product/${product._id || product.id}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-4">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    loading="lazy"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-sm md:text-base group-hover:underline underline-offset-4">
                    {product.name}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">${product.price?.toLocaleString()}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
