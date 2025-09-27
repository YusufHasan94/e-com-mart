"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw, Award } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { ProductGallery } from "@/components/product-gallery"
import { ProductReviews } from "@/components/product-reviews"
import { RelatedProducts } from "@/components/related-products"

interface ProductDetailProps {
  productId: string
}

// Mock product data - in a real app, this would come from an API
const getProductById = (id: string) => {
  const products = {
    "1": {
      id: 1,
      title: "Cyberpunk 2077",
      category: "games",
      genre: "RPG",
      platform: "steam",
      originalPrice: 59.99,
      salePrice: 29.99,
      discount: 50,
      rating: 4.2,
      reviews: 1250,
      images: [
        "/cyberpunk-futuristic-city-game.png",
        "/cyberpunk-gameplay-1.jpg",
        "/cyberpunk-gameplay-2.jpg",
        "/cyberpunk-gameplay-3.jpg",
      ],
      isNew: false,
      isBestseller: true,
      releaseDate: "2020-12-10",
      developer: "CD Projekt Red",
      publisher: "CD Projekt",
      description:
        "Cyberpunk 2077 is an open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification. You play as V, a mercenary outlaw going after a one-of-a-kind implant that is the key to immortality.",
      features: [
        "Become a cyberpunk, an urban mercenary equipped with cybernetic enhancements",
        "Build your legend on the streets of Night City",
        "Enter the massive open world of Night City",
        "Customize your character's cyberware, skillset and playstyle",
        "Experience the world through the eyes of a mercenary outlaw",
      ],
      systemRequirements: {
        minimum: {
          os: "Windows 10 64-bit",
          processor: "Intel Core i5-3570K or AMD FX-8310",
          memory: "8 GB RAM",
          graphics: "NVIDIA GeForce GTX 780 or AMD Radeon RX 470",
          storage: "70 GB available space",
        },
        recommended: {
          os: "Windows 10 64-bit",
          processor: "Intel Core i7-4790 or AMD Ryzen 3 3200G",
          memory: "12 GB RAM",
          graphics: "NVIDIA GeForce GTX 1060 6GB or AMD Radeon R9 Fury",
          storage: "70 GB available space",
        },
      },
      tags: ["Open World", "RPG", "Futuristic", "Action", "Story Rich"],
    },
  }

  return products[id as keyof typeof products] || null
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  const product = getProductById(productId)

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
      </div>
    )
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        title: product.title,
        price: product.salePrice,
        originalPrice: product.originalPrice,
        image: product.images[0],
        category: product.category,
        platform: product.platform,
        discount: product.discount,
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <ProductGallery images={product.images} selectedImage={selectedImage} onImageSelect={setSelectedImage} />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{product.category}</Badge>
              <Badge variant="outline">{product.platform}</Badge>
              {product.isNew && <Badge className="bg-green-600">New</Badge>}
              {product.isBestseller && <Badge className="bg-orange-600">Bestseller</Badge>}
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-balance">{product.title}</h1>
            <p className="text-muted-foreground">
              by {product.developer} • Published by {product.publisher}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews} reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              {product.discount > 0 && (
                <span className="text-2xl text-muted-foreground line-through">${product.originalPrice}</span>
              )}
              <span className="text-4xl font-bold text-primary">${product.salePrice}</span>
              {product.discount > 0 && <Badge variant="destructive">-{product.discount}%</Badge>}
            </div>
            {product.discount > 0 && (
              <p className="text-sm text-green-600">
                You save ${(product.originalPrice - product.salePrice).toFixed(2)}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-semibold">About this game</h3>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <h3 className="font-semibold">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
                  +
                </Button>
              </div>
              <Button size="lg" className="flex-1 gap-2" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5" />
                Add to Cart - ${(product.salePrice * quantity).toFixed(2)}
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
                <Heart className="h-4 w-4" />
                Wishlist
              </Button>
              <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 text-blue-600" />
              <span>Instant Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <RotateCcw className="h-4 w-4 text-orange-600" />
              <span>30-Day Refund</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Award className="h-4 w-4 text-purple-600" />
              <span>Official Keys</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="features" className="mb-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="requirements">System Requirements</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Key Features</h3>
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Minimum Requirements</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">OS:</span>
                    <span className="ml-2 text-muted-foreground">{product.systemRequirements.minimum.os}</span>
                  </div>
                  <div>
                    <span className="font-medium">Processor:</span>
                    <span className="ml-2 text-muted-foreground">{product.systemRequirements.minimum.processor}</span>
                  </div>
                  <div>
                    <span className="font-medium">Memory:</span>
                    <span className="ml-2 text-muted-foreground">{product.systemRequirements.minimum.memory}</span>
                  </div>
                  <div>
                    <span className="font-medium">Graphics:</span>
                    <span className="ml-2 text-muted-foreground">{product.systemRequirements.minimum.graphics}</span>
                  </div>
                  <div>
                    <span className="font-medium">Storage:</span>
                    <span className="ml-2 text-muted-foreground">{product.systemRequirements.minimum.storage}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Recommended Requirements</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">OS:</span>
                    <span className="ml-2 text-muted-foreground">{product.systemRequirements.recommended.os}</span>
                  </div>
                  <div>
                    <span className="font-medium">Processor:</span>
                    <span className="ml-2 text-muted-foreground">
                      {product.systemRequirements.recommended.processor}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Memory:</span>
                    <span className="ml-2 text-muted-foreground">{product.systemRequirements.recommended.memory}</span>
                  </div>
                  <div>
                    <span className="font-medium">Graphics:</span>
                    <span className="ml-2 text-muted-foreground">
                      {product.systemRequirements.recommended.graphics}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Storage:</span>
                    <span className="ml-2 text-muted-foreground">{product.systemRequirements.recommended.storage}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <ProductReviews productId={productId} />
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      <RelatedProducts currentProductId={productId} />
    </div>
  )
}
