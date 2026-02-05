import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero"
import { CollectionGrid } from "@/components/collection-grid"
// import { HeritageSection } from "@/components/heritage"
import { PremiumFooter } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <CollectionGrid />
      {/* <HeritageSection /> */}
      <PremiumFooter />
    </main>
  )
}
