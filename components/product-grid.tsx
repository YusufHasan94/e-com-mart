"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart, Eye } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

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

// Mock product data
const allProducts = [
  {
    id: 1,
    title: "Cyberpunk 2077",
    category: "games",
    genre: "rpg",
    platform: "steam",
    originalPrice: 59.99,
    salePrice: 29.99,
    discount: 50,
    rating: 4.2,
    reviews: 1250,
    image: "/cyberpunk-futuristic-city-game.png",
    isNew: false,
    isBestseller: true,
    releaseDate: "2020-12-10",
  },
  {
    id: 2,
    title: "Elden Ring",
    category: "games",
    genre: "action",
    platform: "steam",
    originalPrice: 59.99,
    salePrice: 49.99,
    discount: 17,
    rating: 4.8,
    reviews: 2100,
    image: "/fantasy-medieval-game-world.jpg",
    isNew: true,
    isBestseller: false,
    releaseDate: "2022-02-25",
  },
  {
    id: 3,
    title: "Microsoft Office 365",
    category: "software",
    genre: "productivity",
    platform: "microsoft",
    originalPrice: 149.99,
    salePrice: 89.99,
    discount: 40,
    rating: 4.5,
    reviews: 850,
    image: "/office-productivity-software.jpg",
    isNew: false,
    isBestseller: false,
    releaseDate: "2023-01-15",
  },
  {
    id: 4,
    title: "Steam Gift Card $50",
    category: "gift-cards",
    genre: "gift",
    platform: "steam",
    originalPrice: 50.0,
    salePrice: 47.5,
    discount: 5,
    rating: 5.0,
    reviews: 3200,
    image: "/steam-gift-card-gaming.jpg",
    isNew: false,
    isBestseller: true,
    releaseDate: "2023-01-01",
  },
  {
    id: 5,
    title: "Adobe Creative Suite",
    category: "software",
    genre: "creative",
    platform: "adobe",
    originalPrice: 299.99,
    salePrice: 199.99,
    discount: 33,
    rating: 4.6,
    reviews: 1100,
    image: "/creative-design-software.jpg",
    isNew: false,
    isBestseller: false,
    releaseDate: "2023-03-01",
  },
  {
    id: 6,
    title: "Call of Duty: MW3",
    category: "games",
    genre: "action",
    platform: "steam",
    originalPrice: 69.99,
    salePrice: 55.99,
    discount: 20,
    rating: 4.3,
    reviews: 1800,
    image: "/military-shooter.png",
    isNew: true,
    isBestseller: false,
    releaseDate: "2023-11-10",
  },
  // Add more products for demonstration
  {
    id: 7,
    title: "The Witcher 3: Wild Hunt",
    category: "games",
    genre: "rpg",
    platform: "gog",
    originalPrice: 39.99,
    salePrice: 19.99,
    discount: 50,
    rating: 4.9,
    reviews: 5200,
    image: "/witcher-fantasy-game.jpg",
    isNew: false,
    isBestseller: true,
    releaseDate: "2015-05-19",
  },
  {
    id: 8,
    title: "FIFA 24",
    category: "games",
    genre: "sports",
    platform: "origin",
    originalPrice: 69.99,
    salePrice: 39.99,
    discount: 43,
    rating: 4.1,
    reviews: 2800,
    image: "/fifa-soccer-game.jpg",
    isNew: false,
    isBestseller: false,
    releaseDate: "2023-09-29",
  },
]

export function ProductGrid({ viewMode, filters, sortBy }: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  const { addItem } = useCart()

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
    const filtered = allProducts.filter((product) => {
      // Search filter
      if (filters.search && filters.search.trim() !== "") {
        const searchTerm = filters.search.toLowerCase().trim()
        const productTitle = product.title.toLowerCase()
        if (!productTitle.includes(searchTerm)) return false
      }

      // Category filter
      if (filters.category && product.category !== filters.category) return false

      // Price range filter
      if (product.salePrice < filters.priceRange[0] || product.salePrice > filters.priceRange[1]) return false

      // Rating filter
      if (filters.rating > 0 && product.rating < filters.rating) return false

      // Platform filter
      if (filters.platform && product.platform !== filters.platform) return false

      // Genre filter
      if (filters.genre && product.genre !== filters.genre) return false

      return true
    })

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.salePrice - b.salePrice)
        break
      case "price-high":
        filtered.sort((a, b) => b.salePrice - a.salePrice)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
        break
      case "bestselling":
        filtered.sort((a, b) => b.reviews - a.reviews)
        break
      case "discount":
        filtered.sort((a, b) => b.discount - a.discount)
        break
      default:
        // Featured - keep original order but prioritize bestsellers
        filtered.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0))
    }

    return filtered
  }, [filters, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage)
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const ProductCard = ({ product }: { product: any }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
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
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors min-h-[50px]">{product.title}</h3>
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
          <div className="relative w-32 h-24 flex-shrink-0">
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
          </div>

          <div className="flex-1 space-y-2">
            <div>
              <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{product.title}</h3>
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
