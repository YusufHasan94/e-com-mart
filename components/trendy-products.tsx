"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, TrendingUp, Flame, Loader2 } from "lucide-react"
import Link from "next/link"
import { ProductCard } from "./product-card"
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
          .map(p => apiService.mapApiProductToProduct(p))
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
            <ProductCard
              key={product.id}
              product={product}
              showTrendingBadge={true}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
