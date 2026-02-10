"use client"

import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/footer"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export default function HeritagePage() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref })
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  return (
    <main ref={ref} className="bg-background">
      <Navigation />

      {/* SCENE 1 – Hero */}
      <section className="min-h-screen lg:h-screen flex flex-col lg:grid lg:grid-cols-2">

        {/* TEXT LEFT */}
        <div className="flex items-center justify-center px-6 sm:px-10 lg:pl-24 py-16 lg:py-0 order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="text-center lg:text-left"
          >
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl mb-4">
              The Story of Haven
            </h2>

            <p className="text-sm sm:text-base tracking-[0.2em] font-light">
              A quiet exploration of materials, memory, and the poetry of crafted space.
            </p>
          </motion.div>
        </div>

        {/* IMAGE RIGHT */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="relative w-full h-[60vh] sm:h-[70vh] lg:h-full order-1 lg:order-2"
        >
          <Image
            src="/images/artisan-ceramics-workshop.jpg"
            alt=""
            fill
            priority
            className="object-cover"
          />
          <motion.div style={{ opacity }} className="absolute inset-0 bg-black/20" />
        </motion.div>
      </section>


      {/* SCENE 3 – Materials */}
      <section className="min-h-screen lg:h-screen flex flex-col lg:grid lg:grid-cols-2">

        {/* IMAGE LEFT */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="relative w-full h-[60vh] sm:h-[70vh] lg:h-full order-1"
        >
          <Image
            src="/images/natural-materials-sustainable.jpg"
            alt=""
            fill
            className="object-cover"
          />
        </motion.div>

        {/* TEXT RIGHT */}
        <div className="flex items-center px-6 sm:px-10 lg:pl-24 py-16 lg:py-0 order-2">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl mb-4">
              Materials that breathe
            </h2>

            <p className="text-sm sm:text-base tracking-[0.2em] font-light">
              We work with wood, stone, clay, linen and natural fibers — materials that age,
              change, and carry the passage of time within their surface.
              <br /><br />
              No plastic, no gloss, no artificial perfection. Only honest textures,
              subtle imperfections, and quiet tactile narratives that invite touch and reflection.
            </p>
          </motion.div>
        </div>
      </section>


      {/* SCENE 4 – Studio reveal */}
      <section className="relative min-h-screen">
        <Image
          src="/images/design-studio-interior.jpg"
          alt=""
          fill
          className="object-cover"
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 bg-black/30 flex items-center justify-center text-center text-background px-6"
        >
          <div>
            <h2 className="font-serif text-4xl sm:text-5xl mb-6">Our Studio</h2>

            <p className="text-sm sm:text-base tracking-[0.2em] font-light">
              A quiet environment designed to slow down perception.  
              A place where light, scale, and silence shape the experience of space,
              and where every object is allowed to exist without urgency.
            </p>
          </div>
        </motion.div>
      </section>


      {/* FINAL */}
      <section className="py-20 sm:py-32 text-center px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-xs sm:text-sm tracking-[0.3em] uppercase text-muted-foreground"
        >
          Since 2018 — Crafted slowly
        </motion.p>
      </section>

      <PremiumFooter />
    </main>
  )
}
