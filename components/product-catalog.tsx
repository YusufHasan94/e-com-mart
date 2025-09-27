"use client"

import { useState } from "react"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { ProductSort } from "@/components/product-sort"
import { Button } from "@/components/ui/button"
import { Filter, Grid, List } from "lucide-react"

export function ProductCatalog() {
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">All Products</h1>
        <p className="text-muted-foreground">Discover thousands of games, software, and digital content</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>

          <div className="flex items-center gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex justify-end">
          <ProductSort sortBy={sortBy} onSortChange={setSortBy} />
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <div className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-64 flex-shrink-0`}>
          <ProductFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <ProductGrid viewMode={viewMode} filters={filters} sortBy={sortBy} />
        </div>
      </div>
    </div>
  )
}
