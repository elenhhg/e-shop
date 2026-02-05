"use client";

import { ReactLenis } from "lenis/react"; // σωστό import
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <div className="bg-amber-900/10">
      <ReactLenis
        root
        options={{
          lerp: 0.05,
        }}
      >
        <Hero />
        <ParallaxImages />
      </ReactLenis>
    </div>
  );
};

const SECTION_HEIGHT = 1500;

const Hero = () => {
  return (
    <div
      style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
      className="relative w-full"
    >
      <CenterImage />
      <HeroCenterButton />
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-white/0 to-white" />
    </div>
  );
};

const CenterImage = () => {
  const { scrollY } = useScroll();

  const clip1 = useTransform(scrollY, [0, SECTION_HEIGHT], [25, 0]);
  const clip2 = useTransform(scrollY, [0, SECTION_HEIGHT], [75, 100]);

  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;

  const backgroundSize = useTransform(scrollY, [0, SECTION_HEIGHT + 500], ["100%", "50%"]);
  const opacity = useTransform(scrollY, [SECTION_HEIGHT, SECTION_HEIGHT + 500], [1, 0]);

  return (
    <motion.div
      className="sticky top-0 h-screen w-full"
      style={{
        clipPath,
        backgroundSize,
        opacity,
        backgroundImage: "url('/images/studio.jpg')", // placeholder
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
};

// Κουμπί στο κέντρο της οθόνης, λίγο πιο κάτω από τη μέση
const HeroCenterButton = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const y = useTransform(scrollY, [0, 400], [0, 20]);

  return (
    <motion.div
  className="absolute top-[60%] left-1/2 -translate-x-1/2 z-10" // z-10 για να είναι πάνω από την εικόνα
  style={{ opacity, y }}
>
  <Link
    href="/shop"
    className="px-6 py-3 text-sm font-semibold tracking-[0.18em] uppercase text-black bg-black rounded hover:bg-gray-800 transition-colors"
  >
    VIEW COLLECTION
  </Link>
</motion.div>

  );
};

const ParallaxImages = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-[200px]">
      <ParallaxImg src="/images/image3.webp" alt="Image 1" start={-200} end={200} className="w-1/3" />
      <ParallaxImg src="/images/image2.jpg" alt="Image 2" start={200} end={-250} className="mx-auto w-2/3" />
      <ParallaxImg src="/images/image4.jpg" alt="Image 3" start={-200} end={200} className="ml-auto w-1/3" />
    </div>
  );
};

const ParallaxImg = ({ className, alt, src, start, end }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${end * -1}px`],
  });

  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.85]);
  const y = useTransform(scrollYProgress, [0, 1], [start, end]);
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`;

  return <motion.img ref={ref} src={src} alt={alt} className={className} style={{ transform, opacity }} />;
};
