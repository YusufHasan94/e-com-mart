"use client"

import { useState, useEffect, useRef } from "react"
import {
  Search, ShoppingCart, User, Menu, X, LogOut,
  ChevronRight, ChevronLeft, LayoutDashboard, Shield, ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useCurrency } from "@/contexts/currency-context"
import { CartDrawer } from "@/components/cart-drawer"
import { MegaMenu } from "@/components/megamenu"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { CurrencyDropdown } from "@/components/currency-dropdown"
import { Globe, Loader2 } from "lucide-react"
import { apiService, AppProduct, type MenuItem, type MenuData } from "@/lib/api-service"

export function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [drawerViewStack, setDrawerViewStack] = useState<MenuItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [activeMegaMenuId, setActiveMegaMenuId] = useState<number | null>(null)
  // const [activeMegaMenuId, setActiveMegaMenuId] = useState<number | null>(1)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  // Reset drawer stack gracefully when closing
  useEffect(() => {
    if (!isDrawerOpen) {
      const timer = setTimeout(() => setDrawerViewStack([]), 300)
      return () => clearTimeout(timer)
    }
  }, [isDrawerOpen])
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const mobileSearchRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { state, setOpenCartDrawer } = useCart()
  const { user, logout } = useAuth()
  const { currencySymbol } = useCurrency()
  const [apiSuggestions, setApiSuggestions] = useState<AppProduct[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Menu data from API
  const [headerMenuItems, setHeaderMenuItems] = useState<MenuItem[]>([])
  const [isLoadingMenu, setIsLoadingMenu] = useState(true)
  // Mobile drawer: which item is expanded
  const [drawerExpandedId, setDrawerExpandedId] = useState<number | null>(null)

  // Fetch menus on mount
  useEffect(() => {
    setIsLoadingMenu(true)
    apiService.getMenus()
      .then(res => {
        if (res.success && res.data) {
          const headerMenu = res.data.find((m: MenuData) => m.location === "header")
          if (headerMenu) setHeaderMenuItems(headerMenu.items)
        }
      })
      .catch(console.error)
      .finally(() => setIsLoadingMenu(false))
  }, [])

  // Register cart drawer open callback
  useEffect(() => {
    setOpenCartDrawer(() => setIsCartOpen(true))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isDrawerOpen])

  // Search suggestions from API
  useEffect(() => {
    if (searchQuery.trim().length >= 1) {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
      setApiSuggestions([])
      return
    }

    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const response = await apiService.searchProducts(searchQuery)
        if (response.success && response.data) {
          setApiSuggestions(response.data.map(p => apiService.mapApiProductToProduct(p)))
        } else {
          setApiSuggestions([])
        }
      } catch {
        setApiSuggestions([])
      } finally {
        setIsSearching(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Close search suggestions outside click
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

  // Close user menu outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserMenuOpen && !(event.target as HTMLElement).closest('[data-user-menu]')) {
        setIsUserMenuOpen(false)
      }
    }
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])

  // Megamenu hover handlers
  const handleMegaMenuOpen = (itemId: number) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setActiveMegaMenuId(itemId)
  }

  const handleMegaMenuClose = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    closeTimeoutRef.current = setTimeout(() => setActiveMegaMenuId(null), 200)
  }

  const handleMegaMenuEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  // Search handlers
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setSelectedIndex(-1)
  }

  const handleSearchSubmit = (query?: string) => {
    const term = query || searchQuery.trim()
    if (term) {
      router.push(`/products?search=${encodeURIComponent(term)}`)
      setSearchQuery("")
      setShowSuggestions(false)
      setSelectedIndex(-1)
      setIsMobileSearchOpen(false)
      searchInputRef.current?.blur()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || apiSuggestions.length === 0) {
      if (e.key === "Enter") handleSearchSubmit()
      return
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex(p => p < apiSuggestions.length - 1 ? p + 1 : p)
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex(p => p > 0 ? p - 1 : -1)
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0) handleSearchSubmit(apiSuggestions[selectedIndex].title)
        else handleSearchSubmit()
        break
      case "Escape":
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  const activeMegaMenuItem = headerMenuItems.find(item => item.id === activeMegaMenuId) ?? null

  // Search suggestions dropdown (shared)
  const SearchSuggestionsDropdown = () => (
    <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-xl z-50 max-h-[400px] overflow-y-auto custom-scrollbar">
      {isSearching ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
        </div>
      ) : apiSuggestions.length > 0 ? (
        <div className="py-1">
          {apiSuggestions.map((product, index) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              onClick={() => { setSearchQuery(""); setShowSuggestions(false); setSelectedIndex(-1) }}
              className={`flex items-center gap-3 px-3 py-2 hover:bg-accent cursor-pointer transition-colors ${index === selectedIndex ? "bg-accent" : ""}`}
            >
              <div className="shrink-0 w-10 h-10 rounded overflow-hidden bg-muted">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).src = "/placeholder.jpg" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-popover-foreground truncate">{product.title}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {product.category}{product.platform ? ` • ${product.platform}` : ""}
                </div>
              </div>
              {product.salePrice && (
                <div className="shrink-0 text-sm font-semibold text-primary">
                  {currencySymbol}{typeof product.salePrice === 'number' ? product.salePrice.toFixed(2) : product.salePrice}
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-sm text-muted-foreground">
          No products found for "{searchQuery}"
        </div>
      )}
      <div className="border-t px-3 py-2 bg-muted/30">
        <button onClick={() => handleSearchSubmit()} className="text-sm text-primary hover:underline font-medium w-full text-left">
          {isSearching ? 'Search all products...' : `View all results for "${searchQuery}"`}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* ═══════════════════════════════════════════════ HEADER ═══════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 w-full bg-background border-b">

        {/* ── ROW 1: Logo + Search + Actions (desktop) / Compact bar (mobile) ── */}
        <div className="border-b border-border/60">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
            <div className="flex h-14 items-center gap-3 sm:gap-4">

              {/* Hamburger – mobile only */}
              <button
                className="lg:hidden shrink-0 p-1.5 rounded-md hover:bg-muted/60 transition-colors"
                onClick={() => setIsDrawerOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Logo */}
              <Link href="/" className="shrink-0 flex-1 text-xl sm:text-2xl font-extrabold text-primary tracking-tight">
                GameHub
              </Link>

              {/* Search bar – desktop */}
              <div className="hidden lg:flex flex-2 max-w-2xl mx-4" ref={searchRef}>
                <div className="relative w-full">
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search for games, software and more..."
                    value={searchQuery}
                    onChange={e => handleSearchChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => { if (searchQuery.length >= 1) setShowSuggestions(true) }}
                    className="pr-12 h-10 bg-muted/50 border-border focus:border-primary rounded-lg text-sm"
                  />
                  <button
                    onClick={() => handleSearchSubmit()}
                    className="absolute right-0 top-0 h-full px-4 bg-primary text-primary-foreground rounded-r-lg hover:bg-primary/90 transition-colors flex items-center"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                  {showSuggestions && <SearchSuggestionsDropdown />}
                </div>
              </div>

              {/* Right actions */}
              <div className="ml-auto flex  flex-1 items-center justify-end gap-1 sm:gap-2">
                {/* Mobile: search toggle */}
                <button
                  className="lg:hidden p-2 rounded-md hover:bg-muted/60 transition-colors"
                  onClick={() => setIsMobileSearchOpen(v => !v)}
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </button>


                <ThemeToggle />

                {/* Cart */}
                <button
                  className="relative p-2 rounded-md hover:bg-muted/60 transition-colors"
                  onClick={() => setIsCartOpen(true)}
                  aria-label="Cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {state.itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {state.itemCount}
                    </span>
                  )}
                </button>

                {/* User menu */}
                <div className="relative" data-user-menu>
                  <button
                    className="p-2 rounded-md hover:bg-muted/60 transition-colors flex items-center gap-1.5"
                    aria-label="User menu"
                    onClick={e => { e.stopPropagation(); setIsUserMenuOpen(v => !v) }}
                  >
                    {user ? (
                      <>
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback className="text-xs">{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:block text-xs font-medium max-w-[80px] truncate">{user.name}</span>
                      </>
                    ) : (
                      <>
                        <User className="h-5 w-5" />
                        <span className="hidden sm:block text-xs font-medium">Sign In</span>
                      </>
                    )}
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border bg-popover text-popover-foreground shadow-xl z-[9999] animate-in fade-in-0 zoom-in-95">
                      {user ? (
                        <>
                          <div className="px-4 py-3 border-b">
                            <div className="flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <div className="text-sm font-semibold truncate">{user.name}</div>
                                <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                              </div>
                              {user.role === "admin" && <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-xs shrink-0">Admin</Badge>}
                              {user.role === "seller" && <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs shrink-0">Seller</Badge>}
                            </div>
                          </div>
                          <div className="p-1">
                            {user.role === "admin" && (
                              <Link href="/admin/dashboard" className="flex items-center px-2 py-1.5 text-sm rounded-md hover:bg-accent cursor-pointer" onClick={() => setIsUserMenuOpen(false)}>
                                <Shield className="mr-2 h-4 w-4" />Admin Dashboard
                              </Link>
                            )}
                            {user.role === "seller" && (
                              <Link href="/seller/dashboard" className="flex items-center px-2 py-1.5 text-sm rounded-md hover:bg-accent cursor-pointer" onClick={() => setIsUserMenuOpen(false)}>
                                <LayoutDashboard className="mr-2 h-4 w-4" />Seller Dashboard
                              </Link>
                            )}
                            <Link href="/profile" className="flex items-center px-2 py-1.5 text-sm rounded-md hover:bg-accent cursor-pointer" onClick={() => setIsUserMenuOpen(false)}>
                              <User className="mr-2 h-4 w-4" />My Profile
                            </Link>
                            <Link href="/account" className="flex items-center px-2 py-1.5 text-sm rounded-md hover:bg-accent cursor-pointer" onClick={() => setIsUserMenuOpen(false)}>
                              My Account
                            </Link>
                            <Link href="/account" className="flex items-center px-2 py-1.5 text-sm rounded-md hover:bg-accent cursor-pointer" onClick={() => setIsUserMenuOpen(false)}>
                              My Orders
                            </Link>
                            <Link href="/account" className="flex items-center px-2 py-1.5 text-sm rounded-md hover:bg-accent cursor-pointer" onClick={() => setIsUserMenuOpen(false)}>
                              Wishlist
                            </Link>
                          </div>
                          <div className="border-t p-1">
                            <button onClick={() => { logout(); setIsUserMenuOpen(false) }}
                              className="flex w-full items-center px-2 py-1.5 text-sm rounded-md hover:bg-accent cursor-pointer text-red-500">
                              <LogOut className="mr-2 h-4 w-4" />Sign Out
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-1">
                            <Link href="/login" className="flex items-center px-2 py-1.5 text-sm rounded-md hover:bg-accent cursor-pointer font-medium" onClick={() => setIsUserMenuOpen(false)}>
                              Sign In
                            </Link>
                            <Link href="/register" className="flex items-center px-2 py-1.5 text-sm rounded-md hover:bg-accent cursor-pointer" onClick={() => setIsUserMenuOpen(false)}>
                              Create Account
                            </Link>
                          </div>
                          <div className="border-t p-1">
                            <button disabled className="flex w-full items-center px-2 py-1.5 text-sm rounded-md opacity-40 cursor-not-allowed">My Orders</button>
                            <button disabled className="flex w-full items-center px-2 py-1.5 text-sm rounded-md opacity-40 cursor-not-allowed">Wishlist</button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile search bar (expandable) */}
            {isMobileSearchOpen && (
              <div className="lg:hidden pb-3" ref={searchRef}>
                <div className="relative">
                  <Input
                    ref={mobileSearchRef}
                    autoFocus
                    type="text"
                    placeholder="Search for games..."
                    value={searchQuery}
                    onChange={e => handleSearchChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pr-10 h-10 bg-muted/50 rounded-lg text-sm"
                  />
                  <button
                    onClick={() => handleSearchSubmit()}
                    className="absolute right-0 top-0 h-full px-3 bg-primary text-primary-foreground rounded-r-lg hover:bg-primary/90 transition-colors"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                  {showSuggestions && <SearchSuggestionsDropdown />}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── ROW 2: Navigation links (desktop only) ── */}
        <div className="hidden lg:block">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
            <nav className="flex items-center h-10 gap-0">
              {isLoadingMenu ? (
                <div className="flex items-center h-full gap-4 px-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-4 w-16 bg-muted/60 animate-pulse rounded" />
                  ))}
                </div>
              ) : (
                headerMenuItems.map(item => {
                  const hasMegamenu = item.type === "megamenu"
                  const isActive = activeMegaMenuId === item.id

                  return (
                    <div
                      key={item.id}
                      className="relative h-full flex items-center"
                      onMouseEnter={() => hasMegamenu ? handleMegaMenuOpen(item.id) : undefined}
                      onMouseLeave={() => hasMegamenu ? handleMegaMenuClose() : undefined}
                    >
                      <Link
                        href={item.url}
                        target={item.target}
                        className={`h-full flex items-center gap-1.5 px-3 text-sm font-medium transition-colors whitespace-nowrap
                          ${isActive
                            ? "text-primary border-b-2 border-primary"
                            : "text-foreground hover:text-primary border-b-2 border-transparent hover:border-primary/40"
                          }`}
                        onClick={e => { if (hasMegamenu && isActive) e.preventDefault() }}
                      >
                        {item.icon && <i className={`${item.icon} text-sm`} />}
                        {item.title}
                        {hasMegamenu && (
                          <ChevronDown className={`h-3 w-3 opacity-60 transition-transform ${isActive ? "rotate-180" : ""}`} />
                        )}
                      </Link>
                    </div>
                  )
                })
              )}

              {/* Language + Currency — right side of nav row */}
              <div className="ml-auto flex items-center gap-1 pl-4 border-l border-border/40">
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs gap-1">
                  <Globe className="h-3.5 w-3.5 opacity-70" />
                  EN
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
                <CurrencyDropdown />
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* ── Desktop Mega Menu ── */}
      <div onMouseEnter={handleMegaMenuEnter} onMouseLeave={handleMegaMenuClose}>
        <MegaMenu
          isOpen={activeMegaMenuId !== null}
          onClose={() => setActiveMegaMenuId(null)}
          menuItem={activeMegaMenuItem}
        />
      </div>

      {/* ═══════════════════════════════════════════ MOBILE DRAWER ═══════════════════════════════════════════ */}
      {/* Backdrop */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed top-0 left-0 z-70 h-full w-[300px] bg-background shadow-2xl lg:hidden flex flex-col transition-transform duration-300 ease-in-out ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Drawer header */}
        {drawerViewStack.length > 0 ? (
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 shrink-0 bg-background">
            <button
              className="flex items-center text-base font-bold text-foreground hover:text-primary transition-colors"
              onClick={() => setDrawerViewStack(prev => prev.slice(0, -1))}
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              {drawerViewStack[drawerViewStack.length - 1].title}
            </button>
            <button
              className="p-1.5 rounded-md hover:bg-muted/60 transition-colors"
              onClick={() => setIsDrawerOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 shrink-0 bg-background">
            <Link href="/" className="text-xl font-extrabold text-primary tracking-tight" onClick={() => setIsDrawerOpen(false)}>
              GameHub
            </Link>
            <button
              className="p-1.5 rounded-md hover:bg-muted/60 transition-colors"
              onClick={() => setIsDrawerOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Drawer nav items */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
          {isLoadingMenu ? (
            <div className="flex flex-col gap-3 p-5">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-6 w-3/4 bg-muted/60 animate-pulse rounded" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col">
              {(() => {
                const currentItems = drawerViewStack.length > 0 ? drawerViewStack[drawerViewStack.length - 1].children : headerMenuItems;

                const groupedItems: MenuItem[] = [];
                let currentVirtualFolder: MenuItem | null = null;

                for (const item of currentItems) {
                  if (item.type === "heading") {
                    // Turn headings into clickable virtual folders that contain subsequent links
                    currentVirtualFolder = { ...item, type: "megamenu", children: [] };
                    groupedItems.push(currentVirtualFolder);
                  } else {
                    if (currentVirtualFolder) {
                      currentVirtualFolder.children.push(item);
                    } else {
                      groupedItems.push(item);
                    }
                  }
                }

                return groupedItems.map(item => {
                  const hasChildren = item.children && item.children.length > 0;

                  return (
                    <div key={item.id} className="border-b border-border/50">
                      {hasChildren ? (
                        <button
                          className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium hover:bg-muted/50 transition-colors text-left"
                          onClick={() => setDrawerViewStack(prev => [...prev, item])}
                        >
                          <span className="flex items-center gap-2.5">
                            {item.icon && <i className={`${item.icon} text-base text-muted-foreground`} />}
                            {item.title}
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </button>
                      ) : (
                        <Link
                          href={item.url}
                          target={item.target}
                          className="flex items-center gap-2.5 px-5 py-3.5 text-sm font-medium hover:bg-muted/50 transition-colors"
                          onClick={() => setIsDrawerOpen(false)}
                        >
                          {item.icon && <i className={`${item.icon} text-base text-muted-foreground`} />}
                          {item.title}
                        </Link>
                      )}
                    </div>
                  )
                });
              })()}
            </div>
          )}
        </div>

        {/* Drawer footer: Language + Currency */}
        <div className="shrink-0 border-t px-5 py-4 flex items-center gap-3">
          <Button variant="outline" size="sm" className="flex-1 gap-1.5 justify-center text-xs">
            <Globe className="h-3.5 w-3.5" />
            English
            <ChevronDown className="h-3 w-3 opacity-60" />
          </Button>
          <div className="flex-1">
            <CurrencyDropdown upward />
          </div>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
