"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

const featuredProducts = [
  {
    id: 1,
    title: "Cyberpunk 2077",
    category: "RPG",
    originalPrice: 59.99,
    salePrice: 29.99,
    discount: 50,
    rating: 4.2,
    reviews: 1250,
    image: "/cyberpunk-futuristic-city-game.png",
    isNew: false,
    isBestseller: true,
  },
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
    isNew: true,
    isBestseller: false,
  },
  {
    id: 3,
    title: "Microsoft Office 365",
    category: "Software",
    originalPrice: 149.99,
    salePrice: 89.99,
    discount: 40,
    rating: 4.5,
    reviews: 850,
    image: "/office-productivity-software.jpg",
    isNew: false,
    isBestseller: false,
  },
  {
    id: 4,
    title: "Steam Gift Card",
    category: "Gift Card",
    originalPrice: 50.0,
    salePrice: 47.5,
    discount: 5,
    rating: 5.0,
    reviews: 3200,
    image: "/steam-gift-card-gaming.jpg",
    isNew: false,
    isBestseller: true,
  },
  {
    id: 5,
    title: "Adobe Creative Suite",
    category: "Software",
    originalPrice: 299.99,
    salePrice: 199.99,
    discount: 33,
    rating: 4.6,
    reviews: 1100,
    image: "/creative-design-software.jpg",
    isNew: false,
    isBestseller: false,
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
    isNew: true,
    isBestseller: false,
  },
]

export function FeaturedProducts() {
  const { addItem } = useCart()

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.salePrice,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      platform: "steam", // Default platform
      discount: product.discount,
    })
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl lg:text-4xl font-bold">Featured Products</h2>
            <p className="text-muted-foreground">Handpicked deals and trending items</p>
          </div>
          <Button variant="outline">View All</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
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
