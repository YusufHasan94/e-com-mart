"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, TrendingUp, Flame } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import Link from "next/link"

const trendyProducts = [
  {
    id: "netflix-gift-card",
    title: "Netflix Gift Card",
    category: "Gift Cards",
    originalPrice: 25.99,
    salePrice: 23.38,
    discount: 10,
    rating: 4.8,
    reviews: 25000,
    image: "/placeholder.jpg",
    isNew: false,
    isTrending: true,
    trendingRank: 1,
  },
  {
    id: "baldurs-gate-3",
    title: "Baldur's Gate 3",
    category: "RPG",
    originalPrice: 59.99,
    salePrice: 59.99,
    discount: 0,
    rating: 4.9,
    reviews: 8500,
    image: "/baldurs-gate-3-fantasy-rpg-game.jpg",
    isNew: true,
    isTrending: true,
    trendingRank: 2,
  },
  {
    id: "chatgpt-plus",
    title: "ChatGPT Plus",
    category: "AI Software",
    originalPrice: 20.0,
    salePrice: 20.0,
    discount: 0,
    rating: 4.8,
    reviews: 12000,
    image: "/chatgpt-ai-assistant-software.jpg",
    isNew: false,
    isTrending: true,
    trendingRank: 3,
  },
  {
    id: "spider-man-2",
    title: "Spider-Man 2",
    category: "Action",
    originalPrice: 69.99,
    salePrice: 59.99,
    discount: 14,
    rating: 4.6,
    reviews: 4200,
    image: "/spider-man-2-superhero-action-game.jpg",
    isNew: true,
    isTrending: true,
    trendingRank: 4,
  },
  {
    id: "notion-pro",
    title: "Notion Pro",
    category: "Productivity",
    originalPrice: 96.0,
    salePrice: 96.0,
    discount: 0,
    rating: 4.7,
    reviews: 6800,
    image: "/notion-productivity-workspace-software.jpg",
    isNew: false,
    isTrending: true,
    trendingRank: 5,
  },
  {
    id: "starfield",
    title: "Starfield",
    category: "Sci-Fi RPG",
    originalPrice: 69.99,
    salePrice: 49.99,
    discount: 29,
    rating: 4.2,
    reviews: 3600,
    image: "/starfield-space-exploration-rpg-game.jpg",
    isNew: true,
    isTrending: true,
    trendingRank: 6,
  },
]

export function TrendyProducts() {
  const { addItem } = useCart()

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.salePrice,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      platform: "steam",
      discount: product.discount,
    })
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
          <Button
            variant="outline"
          >
            View All Trending
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendyProducts.map((product) => (
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
                      <span className="text-xl font-bold text-primary">${product.salePrice}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="gap-2 "
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
