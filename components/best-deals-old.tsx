"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Timer } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import Link from "next/link"

const bestDealsProducts = [
  {
    id: "gta-v",
    title: "Grand Theft Auto V",
    category: "Action",
    originalPrice: 29.99,
    salePrice: 14.99,
    discount: 50,
    rating: 4.4,
    reviews: 5200,
    image: "/gta-v-action-game-cover.jpg",
    timeLeft: "2 days left",
  },
  {
    id: "photoshop-cc-2024",
    title: "Photoshop CC 2024",
    category: "Software",
    originalPrice: 239.99,
    salePrice: 119.99,
    discount: 50,
    rating: 4.7,
    reviews: 980,
    image: "/adobe-photoshop-software.jpg",
    timeLeft: "5 hours left",
  },
  {
    id: "fifa-24",
    title: "FIFA 24",
    category: "Sports",
    originalPrice: 69.99,
    salePrice: 27.99,
    discount: 60,
    rating: 4.1,
    reviews: 3100,
    image: "/fifa-24-soccer-game.jpg",
    timeLeft: "1 day left",
  },
  {
    id: "windows-11-pro",
    title: "Windows 11 Pro",
    category: "Software",
    originalPrice: 199.99,
    salePrice: 89.99,
    discount: 55,
    rating: 4.3,
    reviews: 1450,
    image: "/windows-11-operating-system.jpg",
    timeLeft: "3 days left",
  },
]

export function BestDeals() {
  const { addItem } = useCart()

  const handleAddToCart = (product: any) => {
    addItem({
      id: parseInt(product.id.replace(/\D/g, '')) || Math.random() * 1000, // Convert string ID to number
      title: product.title,
      price: product.salePrice,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      platform: "Digital", // Default platform
      discount: product.discount,
    })
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl lg:text-4xl font-bold">Best Deals</h2>
            <p className="text-muted-foreground">Limited time offers - grab them before they're gone!</p>
          </div>
          <Button
            variant="outline"
          >
            View All Deals
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestDealsProducts.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden dark:card-hover cursor-pointer">
              <div className="relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="destructive" className="bg-red-600 hover:bg-red-700">
                    -{product.discount}%
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-black/70 text-white gap-1">
                    <Timer className="h-3 w-3" />
                    {product.timeLeft}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4 space-y-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{product.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                    <span className="text-xl font-bold">${product.salePrice}</span>
                  </div>
                  <Button
                    size="sm"
                    className="w-full gap-2 hover:animate-pulse-glow"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleAddToCart(product)
                    }}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
