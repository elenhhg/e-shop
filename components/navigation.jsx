"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Search, ShoppingBag, Menu, X, User, Loader2, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { MiniCart } from "./mini-cart"
import { useCart } from "./cart-provider"

// Debounce helper function
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  
  return debouncedValue
}

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  
  const searchInputRef = useRef(null)
  const searchContainerRef = useRef(null)
  const searchResultsRef = useRef(null)
  const pathname = usePathname()
  const router = useRouter()
  const { totalItems } = useCart()
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Focus search input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchContainerRef.current && 
        !searchContainerRef.current.contains(e.target) &&
        (!searchResultsRef.current || !searchResultsRef.current.contains(e.target))
      ) {
        setIsSearchOpen(false)
        setShowResults(false)
      }
    }
    
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false)
        setShowResults(false)
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

  // Perform search when debounced query changes
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearchQuery.trim()) {
        setSearchResults([])
        setShowResults(false)
        return
      }

      setIsSearching(true)
      setShowResults(true)
      
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedSearchQuery)}`)
        
        if (!response.ok) {
          throw new Error('Search failed')
        }
        
        const data = await response.json()
        setSearchResults(data.results || [])
      } catch (error) {
        console.error("Search error:", error)
        setSearchResults([])
        // Fallback to client-side search if API fails
        fallbackSearch(debouncedSearchQuery)
      } finally {
        setIsSearching(false)
      }
    }

    performSearch()
  }, [debouncedSearchQuery])

  // Client-side fallback search
  const fallbackSearch = useCallback(async (query) => {
    try {
      // Import products dynamically to avoid circular dependencies
      const { products } = await import('@/lib/product')
      
      const lowercaseQuery = query.toLowerCase()
      const results = products.filter(product => 
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.materials?.some(material => material.toLowerCase().includes(lowercaseQuery))
      ).slice(0, 10)
      
      setSearchResults(results)
    } catch (error) {
      console.error("Fallback search error:", error)
      setSearchResults([])
    }
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsSearchOpen(false)
      setShowResults(false)
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
    }
  }

  const handleProductSelect = (productId) => {
    setIsSearchOpen(false)
    setShowResults(false)
    setSearchQuery("")
    router.push(`/product/${productId}`)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setShowResults(false)
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  const handleViewAllResults = () => {
    if (searchQuery.trim()) {
      setIsSearchOpen(false)
      setShowResults(false)
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
    }
  }

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
              {/* Search with dropdown */}
              <div ref={searchContainerRef} className="relative hidden sm:block">
                <div className="flex items-center">
                  <AnimatePresence>
                    {isSearchOpen && (
                      <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 280, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <form onSubmit={handleSearchSubmit} className="relative">
                          <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products..."
                            className="w-full bg-transparent border-b border-gray-400 text-sm py-1 pr-8 outline-none text-black placeholder:text-gray-500"
                          />
                          {searchQuery && (
                            <button
                              type="button"
                              onClick={handleClearSearch}
                              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <button
                    onClick={() => {
                      setIsSearchOpen(!isSearchOpen)
                      if (isSearchOpen) {
                        setShowResults(false)
                        setSearchQuery("")
                      }
                    }}
                    aria-label="Search"
                    className="p-2 text-gray-700 hover:text-black transition-colors"
                  >
                    {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                  </button>
                </div>

                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {isSearchOpen && showResults && (
                    <motion.div
                      ref={searchResultsRef}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50"
                    >
                      <div className="max-h-96 overflow-y-auto">
                        {isSearching ? (
                          <div className="p-4 text-center">
                            <Loader2 className="h-5 w-5 animate-spin mx-auto text-gray-500" />
                            <p className="text-sm text-gray-500 mt-2">Searching...</p>
                          </div>
                        ) : searchResults.length > 0 ? (
                          <>
                            <div className="p-3 border-b border-gray-100 bg-gray-50">
                              <p className="text-xs text-gray-600">
                                Found {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
                              </p>
                            </div>
                            
                            {searchResults.map((product, index) => (
                              <button
                                key={`${product.id}-${index}`}
                                onClick={() => handleProductSelect(product.id)}
                                className="w-full text-left p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 group"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate group-hover:text-black">
                                      {product.name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                                        {product.category}
                                      </span>
                                      <span className="text-sm text-gray-700">
                                        ${product.price}
                                      </span>
                                    </div>
                                  </div>
                                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-black flex-shrink-0" />
                                </div>
                              </button>
                            ))}
                            
                            {searchResults.length >= 10 && (
                              <button
                                onClick={handleViewAllResults}
                                className="w-full p-4 text-center border-t border-gray-100 hover:bg-gray-50 transition-colors"
                              >
                                <p className="text-sm font-medium text-gray-700 hover:text-black">
                                  View all results for "{searchQuery}"
                                </p>
                              </button>
                            )}
                          </>
                        ) : debouncedSearchQuery.trim() ? (
                          <div className="p-8 text-center">
                            <Search className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No products found</p>
                            <p className="text-sm text-gray-400 mt-1">
                              Try different keywords
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                    <form onSubmit={handleSearchSubmit}>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none text-black placeholder:text-gray-500 pr-10"
                      />
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    </form>
                    {isSearching && (
                      <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                      </div>
                    )}
                  </div>
                  
                  {/* Mobile search results */}
                  {searchResults.length > 0 && (
                    <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
                      {searchResults.slice(0, 5).map((product) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.id}`}
                          className="block p-3 border-b border-gray-100 hover:bg-gray-50 last:border-b-0"
                          onClick={() => {
                            setIsMenuOpen(false)
                            setSearchQuery("")
                          }}
                        >
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-gray-600">{product.category} • ${product.price}</p>
                        </Link>
                      ))}
                    </div>
                  )}
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