import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/footer"
import Image from "next/image"

export const metadata = {
  title: "Our Story | Haven Home",
  description: "Discover the artisanal heritage behind Haven Home curated collections.",
}

export default function HeritagePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[70vh]">
            <div>
              <h1 className="text-4xl lg:text-6xl font-light tracking-tight mb-8">
                Crafting Spaces <br />
                <span className="italic">With Soul</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Haven Home was born from a simple belief: your home should tell your story. Every piece we curate
                carries the warmth of handcrafted excellence and the quiet confidence of timeless design.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Since our founding in 2018, we have partnered with artisans around the world who share our
                commitment to sustainable materials, ethical practices, and extraordinary craftsmanship.
              </p>
            </div>

            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/artisan-ceramics-workshop.jpg"
                alt="Artisan crafting ceramics in workshop"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="text-3xl lg:text-4xl font-light tracking-tight text-center mb-16">
            Our Values
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="relative aspect-square mb-8 overflow-hidden">
                <Image
                  src="/images/artisan-ceramics-workshop.jpg"
                  alt="Artisan craftsmanship"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-light mb-4">Artisan Craftsmanship</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every piece is crafted by skilled artisans using time-honored techniques passed down through
                generations.
              </p>
            </div>

            <div className="text-center">
              <div className="relative aspect-square mb-8 overflow-hidden">
                <Image
                  src="/images/natural-materials-sustainable.jpg"
                  alt="Sustainable materials"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-light mb-4">Sustainable Materials</h3>
              <p className="text-muted-foreground leading-relaxed">
                We source only the finest natural and sustainable materials, ensuring beauty that respects our
                planet.
              </p>
            </div>

            <div className="text-center">
              <div className="relative aspect-square mb-8 overflow-hidden">
                <Image
                  src="/images/minimalist-decor-styling.jpg"
                  alt="Timeless design"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-light mb-4">Timeless Design</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our collections transcend trends, offering pieces that grow more beautiful with time and use.
              </p>
            </div>
          </div>
        </div>
      </section>

     

      {/* Studio Section */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/design-studio-interior.jpg"
                alt="Haven Home Design Studio"
                fill
                className="object-cover"
              />
            </div>

            <div>
              <h2 className="text-3xl lg:text-4xl font-light tracking-tight mb-8">
                Our Studio
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Nestled in the heart of the design district, our studio serves as both a creative workshop and
                a curated showroom where you can experience our collections firsthand.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Visit us to explore our latest pieces, consult with our design team, and discover how Haven
                Home can transform your living spaces into sanctuaries of style and comfort.
              </p>

              <div className="text-sm text-muted-foreground">
                <p className="mb-2">
                  <strong className="text-foreground">Address:</strong> 142 Design District, Suite 200
                </p>
                <p className="mb-2">
                  <strong className="text-foreground">Hours:</strong> Mon–Sat 10am–6pm
                </p>
                <p>
                  <strong className="text-foreground">Contact:</strong> studio@havenhome.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PremiumFooter />
    </main>
  )
}
