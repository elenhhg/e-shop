"use client"

import { useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/footer"
import { ProductGallery } from "@/components/product-gallery"
import { SizeSelector } from "@/components/size-selector"
import { ColorSelector } from "@/components/color-selector"
import { ProductDetailsAccordion } from "@/components/product-details"
import { RelatedProducts } from "@/components/related-product"
import { Button } from "@/components/ui/button"
import { products } from "@/lib/product"
import { Heart, Share2, Truck, RotateCcw, Shield } from "lucide-react"
import Link from "next/link"

export default function ProductPage() {
  const params = useParams()

  const productId = Array.isArray(params?.id) ? params.id[0] : params?.id
  const product = products.find((p) => p.id === productId) || products[0]

  const relatedProducts = products
    .filter((p) => p.id !== product.id)
    .slice(0, 4)

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
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-8">
                  <SizeSelector sizes={product.sizes} />
                </div>
              )}

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-8">
                  <ColorSelector colors={product.colors} />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 mb-8">
                <Button className="flex-1 h-14 text-sm tracking-widest uppercase bg-foreground text-background hover:bg-foreground/90">
                  Add to Cart
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
    </main>
  )
}
