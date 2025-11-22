"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Search, ShoppingCart, User, Menu, X, LogOut, ChevronRight, LayoutDashboard, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { CartDrawer } from "@/components/cart-drawer"
import { MegaMenu, MegaMenuCompact } from "@/components/megamenu"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { products } from "@/lib/products"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { state, setOpenCartDrawer } = useCart()
  const { user, logout } = useAuth()

  // Register cart drawer open callback
  useEffect(() => {
    setOpenCartDrawer(() => setIsCartOpen(true))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      return []
    }

    const query = searchQuery.toLowerCase().trim()
    return products
      .filter((product) => {
        const titleMatch = product.title.toLowerCase().includes(query)
        const categoryMatch = product.category.toLowerCase().includes(query)
        const platformMatch = product.platform?.toLowerCase().includes(query)
        const descriptionMatch = product.description.toLowerCase().includes(query)
        
        return titleMatch || categoryMatch || platformMatch || descriptionMatch
      })
      .slice(0, 8) // Limit to 8 suggestions
  }, [searchQuery])

  // Update suggestions visibility when searchSuggestions change
  useEffect(() => {
    if (searchQuery.length >= 2) {
      setShowSuggestions(searchSuggestions.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }, [searchSuggestions, searchQuery])

  // Close search suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (searchRef.current && !searchRef.current.contains(target)) {
        setShowSuggestions(false)
        setSelectedIndex(-1)
      }
    }

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSuggestions])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isUserMenuOpen && !target.closest('[data-user-menu]')) {
        setIsUserMenuOpen(false)
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleMegaMenuOpen = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout)
      setCloseTimeout(null)
    }
    setIsMegaMenuOpen(true)
  }

  const handleMegaMenuClose = () => {
    // Add delay to allow mouse movement from trigger to menu
    const timeout = setTimeout(() => {
      setIsMegaMenuOpen(false)
    }, 200) // Increased delay to 200ms for better UX
    setCloseTimeout(timeout)
  }

  const handleMegaMenuEnter = () => {
    // Cancel close timeout when mouse enters trigger area again
    if (closeTimeout) {
      clearTimeout(closeTimeout)
      setCloseTimeout(null)
    }
  }

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setSelectedIndex(-1)
  }

  // Handle search submission
  const handleSearchSubmit = (query?: string) => {
    const searchTerm = query || searchQuery.trim()
    if (searchTerm) {
      router.push(`/products?search=${encodeURIComponent(searchTerm)}`)
      setSearchQuery("")
      setShowSuggestions(false)
      setSelectedIndex(-1)
      if (searchInputRef.current) {
        searchInputRef.current.blur()
      }
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || searchSuggestions.length === 0) {
      if (e.key === "Enter") {
        handleSearchSubmit()
      }
      return
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => 
          prev < searchSuggestions.length - 1 ? prev + 1 : prev
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < searchSuggestions.length) {
          handleSearchSubmit(searchSuggestions[selectedIndex].title)
        } else {
          handleSearchSubmit()
        }
        break
      case "Escape":
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  console.log("Header - User state:", user)

  return (
    <>
      <header 
        className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#2A2A2A]/95 backdrop-blur-md supports-[backdrop-filter]:bg-[#2A2A2A]/40' 
            : 'bg-[#2A2A2A]/95 backdrop-blur supports-[backdrop-filter]:bg-[#2A2A2A]/60'
        }`}
      >
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/" className="text-xl sm:text-2xl font-bold text-primary">
                GameHub
              </Link>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6 relative">
              <div
                className="relative"
                onMouseEnter={handleMegaMenuOpen}
                onMouseLeave={handleMegaMenuClose}
              >
                <button
                  className="text-sm xl:text-base font-medium hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-muted/50 flex items-center gap-1"
                >
                  Shop
                  <ChevronRight className="h-3 w-3 rotate-90 opacity-70" />
                </button>
              </div>
              <Link href="/products" className="text-sm xl:text-base font-medium hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-muted/50">
                All Products
              </Link>
              <Link href="/deals" className="text-sm xl:text-base font-medium hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-muted/50">
                Deals
              </Link>
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-md mx-4 xl:mx-6">
              <div className="relative w-full" ref={searchRef}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
                <Input 
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for games..." 
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => {
                    if (searchQuery.length >= 2) {
                      setShowSuggestions(true)
                    }
                  }}
                  className="pl-10 bg-muted/50 border-border/50 focus:border-primary" 
                />
                
                {/* Search Suggestions Dropdown */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-[400px] overflow-y-auto custom-scrollbar">
                    <div className="py-1">
                      {searchSuggestions.map((product, index) => (
                        <Link
                          key={product.id}
                          href={`/products?search=${encodeURIComponent(product.title)}`}
                          onClick={() => {
                            setSearchQuery("")
                            setShowSuggestions(false)
                            setSelectedIndex(-1)
                          }}
                          className={`flex items-center gap-3 px-3 py-2 hover:bg-accent cursor-pointer transition-colors ${
                            index === selectedIndex ? "bg-accent" : ""
                          }`}
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded overflow-hidden bg-muted">
                            <img 
                              src={product.image} 
                              alt={product.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder.jpg"
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-popover-foreground truncate">
                              {product.title}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {product.category} {product.platform ? `• ${product.platform}` : ""}
                            </div>
                          </div>
                          {product.salePrice && (
                            <div className="flex-shrink-0 text-sm font-semibold text-primary">
                              ${product.salePrice}
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                    {searchQuery.length >= 2 && (
                      <div className="border-t px-3 py-2">
                        <button
                          onClick={() => handleSearchSubmit()}
                          className="text-sm text-primary hover:underline font-medium w-full text-left"
                        >
                          View all results for "{searchQuery}"
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
              <ThemeToggle />

              {/* Cart */}
              <Button variant="ghost" size="sm" className="relative p-2 sm:p-2.5" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                {state.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-bold">
                    {state.itemCount}
                  </span>
                )}
              </Button>

              <div className="relative" data-user-menu>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2 sm:p-2.5 cursor-pointer focus:outline-none hover:bg-muted/50"
                  type="button"
                  aria-label="User menu"
                  aria-expanded={isUserMenuOpen}
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsUserMenuOpen(!isUserMenuOpen)
                  }}
                >
                  {user ? (
                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </Button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-md border bg-popover text-popover-foreground shadow-lg z-[9999] animate-in fade-in-0 zoom-in-95">
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-medium">{user.name}</div>
                              <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                            </div>
                            {user.role === "admin" && (
                              <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                                Admin
                              </Badge>
                            )}
                            {user.role === "seller" && (
                              <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                                Seller
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="p-1">
                          {user.role === "admin" && (
                            <Link 
                              href="/admin/dashboard" 
                              className="flex items-center px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Admin Dashboard
                            </Link>
                          )}
                          {user.role === "seller" && (
                            <Link 
                              href="/seller/dashboard" 
                              className="flex items-center px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <LayoutDashboard className="mr-2 h-4 w-4" />
                              Seller Dashboard
                            </Link>
                          )}
                          <Link 
                            href="/account" 
                            className="flex items-center px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            My Account
                          </Link>
                          <Link 
                            href="/account" 
                            className="flex items-center px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            My Orders
                          </Link>
                          <Link 
                            href="/account" 
                            className="flex items-center px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Wishlist
                          </Link>
                        </div>
                        <div className="border-t p-1">
                          <button
                            onClick={() => {
                              logout()
                              setIsUserMenuOpen(false)
                            }}
                            className="flex w-full items-center px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer text-red-600"
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-1">
                          <Link 
                            href="/login" 
                            className="flex items-center px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Sign In
                          </Link>
                          <Link 
                            href="/register" 
                            className="flex items-center px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Create Account
                          </Link>
                        </div>
                        <div className="border-t p-1">
                          <button
                            disabled
                            className="flex w-full items-center px-2 py-1.5 text-sm rounded-sm opacity-50 cursor-not-allowed"
                          >
                            My Orders
                          </button>
                          <button
                            disabled
                            className="flex w-full items-center px-2 py-1.5 text-sm rounded-sm opacity-50 cursor-not-allowed"
                          >
                            Wishlist
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <Button variant="ghost" size="sm" className="lg:hidden p-2 sm:p-2.5" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t py-4">
              <div className="flex flex-col space-y-4">
                <div className="relative" ref={searchRef}>
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
                  <Input 
                    type="text"
                    placeholder="Search for games..." 
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                    if (searchQuery.length >= 2) {
                      setShowSuggestions(true)
                    }
                  }}
                    className="pl-10 bg-muted/50" 
                  />
                  
                  {/* Mobile Search Suggestions Dropdown */}
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-[300px] overflow-y-auto custom-scrollbar">
                      <div className="py-1">
                        {searchSuggestions.map((product, index) => (
                          <Link
                            key={product.id}
                            href={`/products?search=${encodeURIComponent(product.title)}`}
                            onClick={() => {
                              setSearchQuery("")
                              setShowSuggestions(false)
                              setSelectedIndex(-1)
                              setIsMenuOpen(false)
                            }}
                            className={`flex items-center gap-3 px-3 py-2 hover:bg-accent cursor-pointer transition-colors ${
                              index === selectedIndex ? "bg-accent" : ""
                            }`}
                          >
                            <div className="flex-shrink-0 w-10 h-10 rounded overflow-hidden bg-muted">
                              <img 
                                src={product.image} 
                                alt={product.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/placeholder.jpg"
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-popover-foreground truncate">
                                {product.title}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {product.category} {product.platform ? `• ${product.platform}` : ""}
                              </div>
                            </div>
                            {product.salePrice && (
                              <div className="flex-shrink-0 text-sm font-semibold text-primary">
                                ${product.salePrice}
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                      {searchQuery.length >= 2 && (
                        <div className="border-t px-3 py-2">
                          <button
                            onClick={() => {
                              handleSearchSubmit()
                              setIsMenuOpen(false)
                            }}
                            className="text-sm text-primary hover:underline font-medium w-full text-left"
                          >
                            View all results for "{searchQuery}"
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <nav className="flex flex-col space-y-2">
                  <button
                    onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                    className="text-sm font-medium hover:text-primary transition-colors py-2 text-left flex items-center justify-between"
                  >
                    Shop
                    <ChevronRight className={`h-4 w-4 transition-transform ${isMegaMenuOpen ? 'rotate-90' : ''}`} />
                  </button>
                  <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors py-2">
                    All Products
                  </Link>
                  <Link href="/deals" className="text-sm font-medium hover:text-primary transition-colors py-2">
                    Deals
                  </Link>
                </nav>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-medium">Theme</span>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          )}
          
          {/* Mega Menu Compact for Mobile */}
          <MegaMenuCompact isOpen={isMegaMenuOpen && isMenuOpen} onClose={() => setIsMegaMenuOpen(false)} />
        </div>
      </header>

      {/* Mega Menu for Desktop */}
      <div
        onMouseEnter={handleMegaMenuEnter}
        onMouseLeave={handleMegaMenuClose}
      >
        <MegaMenu isOpen={isMegaMenuOpen} onClose={handleMegaMenuClose} />
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
