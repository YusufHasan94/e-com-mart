"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart, Eye, Loader2 } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { apiService } from "@/lib/api-service"
import Link from "next/link"

interface ProductGridProps {
  viewMode: "grid" | "list"
  filters: {
    search: string
    category: string
    priceRange: number[]
    rating: number
    platform: string
    genre: string
  }
  sortBy: string
}

export function ProductGrid({ viewMode, filters, sortBy }: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const itemsPerPage = 12
  const { addItem } = useCart()

  const [categories, setCategories] = useState<any[]>([])
  const [platforms, setPlatforms] = useState<any[]>([])

  // Fetch metadata for ID mapping
  useEffect(() => {
    const fetchMetadata = async () => {
      const [catRes, platRes] = await Promise.all([
        apiService.getCategories(),
        apiService.getPlatforms()
      ])
      if (catRes.success && catRes.data) setCategories(catRes.data)
      if (platRes.success && platRes.data) setPlatforms(platRes.data)
    }
    fetchMetadata()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        // Map slugs to IDs
        const category_id = categories.find(c => c.slug === filters.category)?.id
        const platform_id = platforms.find(p => p.slug === filters.platform)?.id

        const response = await apiService.getProducts({
          search: filters.search,
          category_id,
          platform_id,
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
  }, [filters.search, filters.category, filters.platform, currentPage, categories, platforms])

  console.log("all products: ", products);



  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.salePrice,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
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

      // Rating filter
      if (filters.rating > 0 && (product.rating || 0) < filters.rating) return false

      // Platform filter
      if (filters.platform && filters.platform !== "" && filters.platform !== "all" && product.platformSlug !== filters.platform) return false

      // Genre filter
      if (filters.genre && filters.genre !== "all" && product.genre !== filters.genre) return false

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

  const ProductCard = ({ product }: { product: any }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative">
        <Link href={`/product/${product.id}`}>
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <div className="absolute top-3 left-3 flex gap-2">
          {product.isNew && <Badge className="bg-green-600 hover:bg-green-700">New</Badge>}
          {product.isBestseller && <Badge className="bg-orange-600 hover:bg-orange-700">Bestseller</Badge>}
          {product.discount > 0 && <Badge variant="destructive">-{product.discount}%</Badge>}
        </div>
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors min-h-[50px]">{product.title}</h3>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
        </div>

        <div className="flex flex-col gap-4 items-center justify-between">
          <div className="space-y-1 text-start w-full">
            <div className="flex items-center gap-2">
              {product.discount > 0 && (
                <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
              )}
              <span className="text-xl font-bold text-primary">${product.salePrice}</span>
            </div>
          </div>
          <Button size="sm" className="gap-2 w-full" onClick={() => handleAddToCart(product)}>
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const ProductListItem = ({ product }: { product: any }) => (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Link href={`/product/${product.id}`} className="relative w-32 h-24 flex-shrink-0">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              className="w-full h-full object-cover rounded group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-1 left-1 flex gap-1">
              {product.isNew && <Badge className="bg-green-600 hover:bg-green-700 text-xs">New</Badge>}
              {product.isBestseller && <Badge className="bg-orange-600 hover:bg-orange-700 text-xs">Bestseller</Badge>}
              {product.discount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  -{product.discount}%
                </Badge>
              )}
            </div>
          </Link>

          <div className="flex-1 space-y-2">
            <div>
              <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
              <Link href={`/product/${product.id}`}>
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{product.title}</h3>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>
          </div>

          <div className="flex flex-col items-end justify-between">
            <div className="text-right">
              {product.discount > 0 && (
                <div className="text-sm text-muted-foreground line-through">${product.originalPrice}</div>
              )}
              <div className="text-xl font-bold text-primary">${product.salePrice}</div>
            </div>
            <Button size="sm" className="gap-2" onClick={() => handleAddToCart(product)}>
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
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
        <div className="space-y-4">
          {paginatedProducts.map((product) => (
            <ProductListItem key={product.id} product={product} />
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
