"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Instagram, Facebook, Twitter } from "lucide-react"

export function PremiumFooter() {
  return (
    <footer className="bg-[#988675] text-background"> 
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Brand + Social */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Link href="/" className="font-serif text-lg tracking-[0.3em] uppercase">
            Haven
          </Link>
          <div className="flex items-center gap-4">
            <a href="https://instagram.com" aria-label="Instagram" className="hover:opacity-60 transition-opacity">
              <Instagram className="h-4 w-4 stroke-[1.5]" />
            </a>
            <a href="https://facebook.com" aria-label="Facebook" className="hover:opacity-60 transition-opacity">
              <Facebook className="h-4 w-4 stroke-[1.5]" />
            </a>
            <a href="https://twitter.com" aria-label="Twitter" className="hover:opacity-60 transition-opacity">
              <Twitter className="h-4 w-4 stroke-[1.5]" />
            </a>
          </div>
        </div>

        {/* Minimal links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-background/50">
          <Link href="/privacy" className="hover:text-background/80 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-background/80 transition-colors">
            Terms of Service
          </Link>
          <span>2026 Haven. All rights reserved.</span>
        </div>

      </div>
    </footer>
  )
}
