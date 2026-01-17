"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, TrendingUp, Flame, Loader2 } from "lucide-react"
import Link from "next/link"
import { apiService } from "@/lib/api-service"
import { useState, useEffect } from "react"

export function TrendyProducts() {
  const [productsList, setProductsList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      const response = await apiService.getProducts()
      if (response.success && response.data?.products) {
        // Take some products and simulate ranking
        const mappedProducts = response.data.products
          .slice(0, 8)
          .map(apiService.mapApiProductToProduct)
          .map((p, index) => ({ ...p, trendingRank: index + 1 }))
        setProductsList(mappedProducts)
      }
      setIsLoading(false)
    }

    fetchProducts()
  }, [])

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading trending products...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl lg:text-4xl font-bold flex items-center gap-3">
              Trendy Products
            </h2>
            <p className="text-muted-foreground">What everyone's talking about right now</p>
          </div>
          <Link href="/products">
            <Button variant="outline">
              View All Trending
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productsList.map((product) => (
            <Card
              key={product.id}
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {product.isNew && <Badge className="bg-green-600 hover:bg-green-700">New</Badge>}
                  {product.discount > 0 && <Badge variant="destructive">-{product.discount}%</Badge>}
                </div>
                <div className="absolute top-3 right-3">
                  <Badge className="bg-purple-600 hover:bg-purple-700 gap-1">
                    <Flame className="h-3 w-3" />#{product.trendingRank} Trending
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4 space-y-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors cursor-pointer">{product.title}</h3>
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {product.discount > 0 && (
                        <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                      )}
                      <span className="text-xl font-bold text-primary">From ${product.salePrice}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
