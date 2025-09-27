"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

interface RelatedProductsProps {
  currentProductId: string
}

// Mock related products
const relatedProducts = [
  {
    id: 2,
    title: "Elden Ring",
    category: "Action RPG",
    originalPrice: 59.99,
    salePrice: 49.99,
    discount: 17,
    rating: 4.8,
    reviews: 2100,
    image: "/fantasy-medieval-game-world.jpg",
    platform: "steam",
  },
  {
    id: 7,
    title: "The Witcher 3: Wild Hunt",
    category: "RPG",
    originalPrice: 39.99,
    salePrice: 19.99,
    discount: 50,
    rating: 4.9,
    reviews: 5200,
    image: "/witcher-fantasy-game.jpg",
    platform: "gog",
  },
  {
    id: 6,
    title: "Call of Duty: MW3",
    category: "FPS",
    originalPrice: 69.99,
    salePrice: 55.99,
    discount: 20,
    rating: 4.3,
    reviews: 1800,
    image: "/military-shooter.png",
    platform: "steam",
  },
  {
    id: 8,
    title: "FIFA 24",
    category: "Sports",
    originalPrice: 69.99,
    salePrice: 39.99,
    discount: 43,
    rating: 4.1,
    reviews: 2800,
    image: "/fifa-soccer-game.jpg",
    platform: "origin",
  },
]

export function RelatedProducts({ currentProductId }: RelatedProductsProps) {
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

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">You might also like</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="relative">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.discount > 0 && (
                <div className="absolute top-3 left-3">
                  <Badge variant="destructive">-{product.discount}%</Badge>
                </div>
              )}
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
                <span className="text-sm text-muted-foreground">({product.reviews})</span>
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
                <Button size="sm" className="gap-2" onClick={() => handleAddToCart(product)}>
                  <ShoppingCart className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
