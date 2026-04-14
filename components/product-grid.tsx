"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart, Eye, Loader2, Monitor, Globe, Gamepad2, Layers } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { apiService } from "@/lib/api-service"
import { ProductCard } from "./product-card"
import { ProductCardHorizontal } from "./product-card-horizontal"
import Link from "next/link"

interface ProductGridProps {
  viewMode: "grid" | "list"
  filters: {
    search: string
    category: string
    priceRange: number[]
    platform: string
    type: string
    region: string
    language: string
    works_on: string
    developer: string
  }
  sortBy: string
  onTotalChange?: (total: number) => void
}

export function ProductGrid({ viewMode, filters, sortBy, onTotalChange }: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const itemsPerPage = 12
  const { addItem } = useCart()

  const [metadata, setMetadata] = useState<{
    categories: any[]
    platforms: any[]
    types: any[]
    regions: any[]
    languages: any[]
    worksOn: any[]
    developers: any[]
  }>({
    categories: [],
    platforms: [],
    types: [],
    regions: [],
    languages: [],
    worksOn: [],
    developers: []
  })

  // Fetch metadata for ID mapping
  useEffect(() => {
    const fetchMetadata = async () => {
      const [catRes, platRes, typeRes, regRes, langRes, worksRes, devRes] = await Promise.all([
        apiService.getCategories(),
        apiService.getPlatforms(),
        apiService.getTypes(),
        apiService.getRegions(),
        apiService.getLanguages(),
        apiService.getWorksOn(),
        apiService.getDevelopers()
      ])

      setMetadata({
        categories: catRes.success && catRes.data ? catRes.data : [],
        platforms: platRes.success && platRes.data ? platRes.data : [],
        types: typeRes.success && typeRes.data ? typeRes.data : [],
        regions: regRes.success && regRes.data ? regRes.data : [],
        languages: langRes.success && langRes.data ? langRes.data : [],
        worksOn: worksRes.success && worksRes.data ? worksRes.data : [],
        developers: devRes.success && devRes.data ? devRes.data : []
      })
    }
    fetchMetadata()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        // Map slugs to IDs
        const category_id = metadata.categories.find(c => c.slug === filters.category)?.id
        const platform_id = metadata.platforms.find(p => p.slug === filters.platform)?.id
        const type_id = metadata.types.find(t => t.slug === filters.type)?.id
        const region_id = metadata.regions.find(r => r.slug === filters.region)?.id
        const language_id = metadata.languages.find(l => l.slug === filters.language)?.id
        const works_on_id = metadata.worksOn.find(w => w.slug === filters.works_on)?.id
        const developer_id = metadata.developers.find(d => d.slug === filters.developer)?.id

        const response = await apiService.getProducts({
          search: filters.search,
          category_id,
          platform_id,
          type_id,
          region_id,
          language_id,
          works_on_id,
          developer_id,
          page: currentPage,
          per_page: itemsPerPage
        })

        if (response.success && response.data) {
          let dataArray: any[] = [];
          if (Array.isArray(response.data)) {
            dataArray = response.data;
          } else if (response.data && typeof response.data === 'object' && "products" in response.data) {
            dataArray = (response.data as any).products;
          }

          const mappedProducts = dataArray.map(p => apiService.mapApiProductToProduct(p))
          setProducts(mappedProducts)

          if (onTotalChange) {
            const total = (response.data as any).pagination?.total ?? mappedProducts.length
            onTotalChange(total)
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(() => {
      fetchProducts()
    }, 400)

    return () => clearTimeout(timer)
  }, [
    filters.search,
    filters.category,
    filters.platform,
    filters.type,
    filters.region,
    filters.language,
    filters.works_on,
    filters.developer,
    currentPage,
    metadata
  ])





  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.salePrice,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      categoryId: product.categoryId,  // Pass category ID
      platform: product.platform,
      discount: product.discount,
    })
  }

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    // If loading, return empty array
    if (isLoading) return []
    // If no products, return empty array
    if (!products || products.length === 0) return []

    const filtered = products.filter((product) => {
      // Category filter - only filter if specific category selected and not "all"
      if (filters.category && filters.category !== "" && filters.category !== "all" && product.categorySlug !== filters.category) return false

      // Price range filter - ensure valid numbers
      if (filters.priceRange && filters.priceRange.length === 2) {
        const price = typeof product.salePrice === 'number' ? product.salePrice : parseFloat(product.salePrice) || 0
        if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false
      }


      // Platform filter
      if (filters.platform && filters.platform !== "" && filters.platform !== "all" && product.platformSlug !== filters.platform) return false

      // Genre filter (now Type)
      if (filters.type && filters.type !== "" && filters.type !== "all" && product.typeSlug !== filters.type) return false

      // Region filter
      if (filters.region && filters.region !== "" && filters.region !== "all" && product.regionSlug !== filters.region) return false

      // Language filter
      if (filters.language && filters.language !== "" && filters.language !== "all" && !product.languages?.includes(filters.language)) return false

      // Works On filter
      if (filters.works_on && filters.works_on !== "" && !product.worksOnSlugs?.includes(filters.works_on)) return false

      // Developer filter
      if (filters.developer && filters.developer !== "" && product.developerSlug !== filters.developer) return false

      return true
    })

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (Number(a.salePrice) || 0) - (Number(b.salePrice) || 0))
        break
      case "price-high":
        filtered.sort((a, b) => (Number(b.salePrice) || 0) - (Number(a.salePrice) || 0))
        break
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case "newest":
        // Handle potentially missing dates safely
        filtered.sort((a, b) => {
          const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0
          const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0
          return dateB - dateA
        })
        break
      case "bestselling":
        filtered.sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
        break
      case "discount":
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0))
        break
      default:
        // Featured default sort
        break
    }

    return filtered
  }, [products, filters, sortBy, isLoading])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage)
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )



  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing {paginatedProducts.length} of {filteredAndSortedProducts.length} products
        </p>
      </div>

      {/* Products */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {paginatedProducts.map((product) => (

            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {paginatedProducts.map((product) => (
            <ProductCardHorizontal key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
              className="w-10"
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
