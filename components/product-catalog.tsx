"use client"

import { useState } from "react"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { ProductSort } from "@/components/product-sort"
import { Button } from "@/components/ui/button"
import { Filter, Grid, List } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

export function ProductCatalog() {
  const { theme } = useTheme()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: "",
    priceRange: [0, 300],
    rating: 0,
    platform: "",
    genre: "",
  })
  const [sortBy, setSortBy] = useState("featured")

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-background text-foreground' 
        : 'bg-background text-foreground'
    }`}>
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-foreground">
            All Products
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Discover thousands of games, software, and digital content
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowFilters(!showFilters)} 
              className="lg:hidden h-10 px-3 sm:px-4"
            >
              <Filter className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Filters</span>
            </Button>

            <div className="flex items-center gap-1 sm:gap-2">
              <Button 
                variant={viewMode === "grid" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setViewMode("grid")}
                className="h-10 w-10 sm:w-auto sm:px-3"
              >
                <Grid className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Grid</span>
              </Button>
              <Button 
                variant={viewMode === "list" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setViewMode("list")}
                className="h-10 w-10 sm:w-auto sm:px-3"
              >
                <List className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">List</span>
              </Button>
            </div>
          </div>

          <div className="flex-1 flex justify-end">
            <ProductSort sortBy={sortBy} onSortChange={setSortBy} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 xl:gap-8">
          {/* Filters Sidebar */}
          <div className={`${
            showFilters ? "block" : "hidden"
          } lg:block w-full lg:w-72 xl:w-80 flex-shrink-0`}>
            <div className="sticky top-4">
              <ProductFilters filters={filters} onFiltersChange={setFilters} />
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            <ProductGrid viewMode={viewMode} filters={filters} sortBy={sortBy} />
          </div>
        </div>
      </div>
    </div>
  )
}
