"use client"

import { ReactLenis } from "lenis/react"
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"

export function HeroSection() {
  return (
    <div className="relative bg-background">
      <ReactLenis root options={{ lerp: 0.05 }}>
        <Hero />
        <ParallaxImages />
      </ReactLenis>
    </div>
  )
}

const SECTION_HEIGHT = 1500

function Hero() {
  return (
    <section
      style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
      className="relative w-full"
    >
      <CenterImage />
      <HeroContent />
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-background/0 to-background" />
    </section>
  )
}

function CenterImage() {
  const { scrollY } = useScroll()

  const clip1 = useTransform(scrollY, [0, SECTION_HEIGHT], [25, 0])
  const clip2 = useTransform(scrollY, [0, SECTION_HEIGHT], [75, 100])

  const clipPath = useMotionTemplate`
    polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)
  `

  const backgroundSize = useTransform(scrollY, [0, SECTION_HEIGHT + 500], ["100%", "50%"])
  const opacity = useTransform(scrollY, [SECTION_HEIGHT, SECTION_HEIGHT + 500], [1, 0])

  return (
    <motion.div
      className="sticky top-0 h-screen w-full z-0"
      style={{
        clipPath,
        backgroundSize,
        opacity,
        backgroundImage: "url('/images/studio.jpg')",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  )
}

function HeroContent() {
  const { scrollY } = useScroll()

  const titleY = useTransform(scrollY, [0, 600], [40, -20])
  const titleScale = useTransform(scrollY, [0, 600], [1.1, 1])
  const titleOpacity = useTransform(scrollY, [0, 400], [0.6, 1])

  const buttonOpacity = useTransform(scrollY, [200, 600], [0, 1])
  const buttonY = useTransform(scrollY, [200, 600], [20, 0])

  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center text-foreground px-4">
      <div className="text-center">
        <motion.h1
          style={{ y: titleY, scale: titleScale, opacity: titleOpacity }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif tracking-tight text-[#2f2b2b]"
        >
          HAVEN
        </motion.h1>

        <motion.div style={{ opacity: buttonOpacity, y: buttonY }} className="mt-6 sm:mt-10 pointer-events-auto">
          <Link
            href="/shop"
            className="inline-block px-8 sm:px-10 py-3 sm:py-4 text-xs sm:text-sm font-medium tracking-[0.25em] uppercase border border-foreground/60 backdrop-blur-sm bg-background/20 hover:bg-foreground hover:text-background transition-all duration-500 ease-out"
          >
            Shop Now
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

function ParallaxImages() {
  return (
    <div className="mx-auto max-w-full sm:max-w-3xl lg:max-w-5xl px-4 pt-[150px] sm:pt-[200px] space-y-12 sm:space-y-20 lg:space-y-40">
      {/* Πρώτη εικόνα με κείμενο */}
      <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-40">
        <ParallaxImgWithText
          src="/images/image3.webp"
          alt=""
          start={-200}
          end={200}
          text="Our hand-poured candles are delicately crafted to bring warmth and subtle fragrance, adding serenity and charm to your living space."
        />
      </div>

      {/* Δεύτερη εικόνα χωρίς κείμενο */}
      <ParallaxImg src="/images/image4.jpg" alt="" start={200} end={-250} className="w-full sm:w-2/3 mx-auto" />

      {/* Τρίτη εικόνα με κείμενο */}
      {/* Τρίτη εικόνα με κείμενο */}
<div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-40 pb-40 sm:pb-60 lg:pb-80">
  <ParallaxImgWithText
    src="/images/image2.jpg"
    alt=""
    start={-150} // μικρότερο start για να μην φτάνει στο άλλο section
    end={150}    // μικρότερο end για πιο ελεγχόμενο parallax
    text="Explore our handwoven textiles and artisanal vases, designed to bring timeless texture, color, and elegance into your home."
    reverse
  />
</div>

    </div>
  )
}

function ParallaxImgWithText({ className = "w-full sm:w-1/2 lg:w-1/3", alt, src, start, end, text, reverse = false }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${end * -1}px`],
  })

  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.85])
  const y = useTransform(scrollYProgress, [0, 1], [start, end])
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`

  const textY = useTransform(scrollYProgress, [0, 1], [start * 0.4, end * 1.5])
  const textTransform = useMotionTemplate`translateY(${textY}px)`

  return (
    <motion.div
      ref={ref}
      style={{ transform, opacity }}
      className={`flex flex-col ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-8 sm:gap-12 lg:gap-40 w-full`}
    >
      <img src={src} alt={alt} className={className} />
      <motion.div
        style={{ transform: textTransform }}
        className="max-w-full sm:max-w-sm lg:max-w-md text-center lg:text-left text-[#2f2b2b]"
      >
        <p className="text-sm sm:text-base tracking-[0.2em] font-light">{text}</p>
      </motion.div>
    </motion.div>
  )
}

function ParallaxImg({ className, alt, src, start, end }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${end * -1}px`],
  })

  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.85])
  const y = useTransform(scrollYProgress, [0, 1], [start, end])
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`

  return (
    <motion.img
      ref={ref}
      src={src}
      alt={alt}
      className={`${className} w-full sm:w-2/3 lg:w-auto mx-auto`}
      style={{ transform, opacity }}
    />
  )
}
