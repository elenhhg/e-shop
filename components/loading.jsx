"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

export function LoadingScreen() {
  const [loading, setLoading] = useState(true)

  // Τρέχει μόνο όταν φορτώνει η σελίδα για πρώτη φορά
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1800) // 1.8s smooth
    return () => clearTimeout(timeout)
  }, []) // << empty dependency array σημαίνει μόνο στο mount

  // Letters animation
  const letters = "HAVEN".split("")

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#fbefe2]"
        >
          <div className="flex space-x-2 relative">
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, z: -20 }}
                animate={{ opacity: 1, z: 0, textShadow: "2px 2px 10px rgba(0,0,0,0.3)" }}
                transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
                className="font-serif text-6xl sm:text-8xl text-[#2e2c2b] tracking-widest"
              >
                {letter}
              </motion.span>
            ))}
          </div>

          {/* Loading line κάτω από το HAVEN */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: letters.length * 0.15 + 0.2, duration: 1, ease: "easeInOut" }}
            className="mt-6 h-1 w-40 bg-[#030303] origin-left rounded-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
