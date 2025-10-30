"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { categories } from "@/lib/categories"

interface MegaMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [focusedCategory, setFocusedCategory] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const firstCategoryRef = useRef<HTMLAnchorElement>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Set first category as default when menu opens
  useEffect(() => {
    if (isOpen && hoveredCategory === null && categories.length > 0) {
      setHoveredCategory(categories[0].id)
      setFocusedCategory(categories[0].id)
    }
  }, [isOpen, hoveredCategory])

  // Clear timeout when component unmounts
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  const handleMouseEnter = () => {
    // Clear any pending close timeout when mouse enters menu
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  const handleMouseLeave = () => {
    // Add delay before closing to allow mouse movement between trigger and menu
    closeTimeoutRef.current = setTimeout(() => {
      onClose()
    }, 200) // 200ms delay
  }

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault()
        const currentIndex = categories.findIndex(cat => cat.id === (focusedCategory || hoveredCategory))
        if (currentIndex !== -1) {
          let newIndex = currentIndex
          if (e.key === "ArrowDown") {
            newIndex = (currentIndex + 1) % categories.length
          } else {
            newIndex = (currentIndex - 1 + categories.length) % categories.length
          }
          setFocusedCategory(categories[newIndex].id)
          setHoveredCategory(categories[newIndex].id)
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, focusedCategory, hoveredCategory, onClose])


  if (!isOpen) return null

  const activeCategory = focusedCategory || hoveredCategory

  return (
    <div 
      ref={menuRef}
      className="fixed top-16 left-0 right-0 bg-background border-b shadow-lg z-50 max-h-[calc(100vh-4rem)] overflow-y-auto"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="menu"
      aria-label="Category navigation menu"
    >
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Main Category Column */}
          <div className="lg:col-span-4 xl:col-span-3 border-b lg:border-b-0 lg:border-r pb-4 lg:pb-0 pr-0 lg:pr-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-foreground">Shop by Category</h3>
            <nav className="space-y-1 grid grid-cols-2 lg:grid-cols-1 gap-1 lg:gap-0" role="list">
              {categories.map((category, index) => (
                <Link
                  key={category.id}
                  ref={index === 0 ? firstCategoryRef : null}
                  href={`/products?category=${category.slug}`}
                  className={`group relative py-2 px-2 sm:px-3 rounded-lg transition-all cursor-pointer flex items-center justify-between ${
                    activeCategory === category.id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted/50 text-foreground"
                  } focus:outline-none`}
                  onMouseEnter={() => {
                    setHoveredCategory(category.id)
                    setFocusedCategory(category.id)
                  }}
                  onClick={(e) => {
                    // Allow direct navigation
                    onClose()
                  }}
                  role="menuitem"
                  aria-label={`Browse ${category.name} category`}
                  tabIndex={0}
                >
                  <span className="font-medium text-sm sm:text-base">{category.name}</span>
                  <ChevronRight className={`h-3 w-3 sm:h-4 sm:w-4 transition-opacity flex-shrink-0 ml-2 ${
                    activeCategory === category.id ? "opacity-100" : "opacity-0 lg:group-hover:opacity-100"
                  }`} />
                </Link>
              ))}
            </nav>
          </div>

          {/* Subcategories Columns */}
          <div className="lg:col-span-8 xl:col-span-9" role="region" aria-label="Subcategories">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 ${
                  activeCategory === category.id ? "block" : "hidden"
                }`}
                role="group"
                aria-labelledby={`category-${category.id}`}
              >
                {category.subcategories?.map((subcategory) => (
                  <div key={subcategory.id} className="space-y-2 sm:space-y-3">
                    <Link
                      href={`/products?category=${category.slug}&subcategory=${subcategory.slug}`}
                      className="block focus:outline-none rounded"
                      onClick={onClose}
                      role="menuitem"
                      tabIndex={activeCategory === category.id ? 0 : -1}
                    >
                      <h4 
                        id={`subcategory-${subcategory.id}`}
                        className="font-semibold text-sm sm:text-base text-foreground hover:text-primary transition-colors"
                      >
                        {subcategory.name}
                      </h4>
                    </Link>
                    
                    {subcategory.items && (
                      <ul className="space-y-1 sm:space-y-1.5" role="list">
                        {subcategory.items.map((item, index) => (
                          <li key={index}>
                            <Link
                              href={`/products?category=${category.slug}&subcategory=${subcategory.slug}&search=${item}`}
                              className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors block py-0.5 sm:py-1 focus:outline-none rounded"
                              onClick={onClose}
                              role="menuitem"
                              tabIndex={activeCategory === category.id ? 0 : -1}
                            >
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Compact version for mobile
export function MegaMenuCompact({ isOpen, onClose }: MegaMenuProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  // Handle keyboard navigation for mobile menu
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div 
      className="lg:hidden border-t bg-background shadow-lg max-h-[80vh] overflow-y-auto"
      role="menu"
      aria-label="Mobile category navigation menu"
    >
      <div className="px-3 sm:px-4 py-4 sm:py-6 space-y-2">
        {categories.map((category) => (
          <div key={category.id} className="space-y-2">
            <button
              className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors text-left active:bg-muted focus:outline-none"
              onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
              aria-expanded={expandedCategory === category.id}
              aria-controls={`mobile-subcategory-${category.id}`}
              role="menuitem"
            >
              <span className="font-medium text-sm sm:text-base">{category.name}</span>
              <ChevronRight 
                className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform flex-shrink-0 ${
                  expandedCategory === category.id ? "rotate-90" : ""
                }`}
                aria-hidden="true"
              />
            </button>
            
            {expandedCategory === category.id && category.subcategories && (
              <div 
                id={`mobile-subcategory-${category.id}`}
                className="ml-2 sm:ml-4 space-y-2 sm:space-y-3 border-l-2 border-primary/20 pl-3 sm:pl-4 animate-in slide-in-from-top-2 duration-200"
                role="group"
              >
                {category.subcategories.map((subcategory) => (
                  <div key={subcategory.id}>
                    <Link
                      href={`/products?category=${category.slug}&subcategory=${subcategory.slug}`}
                      className="block font-medium py-1 text-xs sm:text-sm hover:text-primary transition-colors active:text-primary focus:outline-none rounded"
                      onClick={onClose}
                      role="menuitem"
                      tabIndex={0}
                    >
                      {subcategory.name}
                    </Link>
                    
                    {subcategory.items && (
                      <ul className="mt-2 space-y-1 sm:space-y-1.5 ml-2 sm:ml-4" role="list">
                        {subcategory.items.map((item, index) => (
                          <li key={index}>
                            <Link
                              href={`/products?category=${category.slug}&subcategory=${subcategory.slug}&search=${item}`}
                              className="text-xs text-muted-foreground hover:text-primary transition-colors block py-0.5 sm:py-1 active:text-primary focus:outline-none rounded"
                              onClick={onClose}
                              role="menuitem"
                              tabIndex={0}
                            >
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

