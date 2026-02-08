"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, ShoppingBag, Menu, X, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { MiniCart } from "./mini-cart"
import { useCart } from "./cart-provider"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef(null)
  const searchContainerRef = useRef(null)
  const pathname = usePathname()
  const { totalItems } = useCart()

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchOpen(false)
      }
    }
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false)
      }
    }
    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isSearchOpen])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/heritage", label: "Our Story" },
  ]

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
         className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border"
      >
        <nav className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 lg:h-20 items-center justify-between">

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-gray-700"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Desktop navigation */}
            <div className="hidden lg:flex items-center gap-12">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-wider uppercase transition-colors ${
                    pathname === link.href
                      ? "text-black"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Logo */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 font-serif text-xl lg:text-2xl tracking-wider uppercase text-black"
            >
              Haven
            </Link>

            {/* Right icons */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Search */}
              <div ref={searchContainerRef} className="relative hidden sm:flex items-center">
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 200, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-full bg-transparent border-b border-gray-400 text-sm py-1 pr-2 outline-none text-black placeholder:text-gray-500"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  aria-label="Search"
                  className="p-2 text-gray-700 hover:text-black transition-colors"
                >
                  {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                </button>
              </div>

              {/* Account */}
              <Link
                href="/account"
                aria-label="Account"
                className="p-2 hidden sm:block text-gray-700 hover:text-black transition-colors"
              >
                <User className="h-5 w-5" />
              </Link>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                aria-label="Shopping cart"
                className="p-2 -mr-2 relative text-gray-700 hover:text-black transition-colors"
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center bg-black text-white rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 w-[280px] z-50 bg-white border-r border-gray-200 lg:hidden"
            >
              <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                <span className="font-serif text-lg tracking-wider uppercase text-black">Menu</span>
                <button 
                  onClick={() => setIsMenuOpen(false)} 
                  className="p-2 -mr-2 text-gray-700 hover:text-black transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <nav className="px-6 py-8 flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-lg tracking-wider uppercase transition-colors ${
                      pathname === link.href
                        ? "text-black"
                        : "text-gray-600 hover:text-black"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {/* Mobile search */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none text-black placeholder:text-gray-500"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  </div>
                </div>
                
                {/* Mobile account link */}
                <Link
                  href="/account"
                  className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors pt-4 border-t border-gray-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span className="tracking-wider uppercase">Account</span>
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mini Cart */}
      <MiniCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}