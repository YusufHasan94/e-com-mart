"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, ChevronRight, Check } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

const categories = [
  { id: "bags-accessories", name: "Bags & Accessories" },
  { id: "electronic-digital", name: "Electronic & Digital", active: true },
  { id: "garden-kitchen", name: "Garden & Kitchen" },
  { id: "home-kitchen", name: "Home & Kitchen", featured: true },
]

const categoryProducts = {
  "bags-accessories": [
    {
      id: "leather-backpack",
      title: "Premium Leather Backpack",
      category: "Bags",
      price: 89.99,
      originalPrice: 129.99,
      discount: 31,
      rating: 4.5,
      reviews: 2,
      image: "/placeholder.jpg",
      inStock: true,
      onSale: true,
    },
    {
      id: "wireless-headphones",
      title: "Noise Cancelling Headphones",
      category: "Accessories",
      price: 199.99,
      originalPrice: null,
      discount: 0,
      rating: 4.5,
      reviews: 2,
      image: "/placeholder.jpg",
      inStock: true,
      onSale: false,
    },
    {
      id: "smart-watch-band",
      title: "Silicone Watch Band",
      category: "Accessories",
      price: 29.99,
      originalPrice: 39.99,
      discount: 25,
      rating: 4.5,
      reviews: 2,
      image: "/placeholder.jpg",
      inStock: true,
      onSale: true,
    },
    {
      id: "laptop-sleeve",
      title: "Protective Laptop Sleeve",
      category: "Bags",
      price: 45.99,
      originalPrice: null,
      discount: 0,
      rating: 4.5,
      reviews: 2,
      image: "/placeholder.jpg",
      inStock: true,
      onSale: false,
    },
    {
      id: "phone-case",
      title: "Clear Phone Case",
      category: "Accessories",
      price: 19.99,
      originalPrice: 29.99,
      discount: 33,
      rating: 4.5,
      reviews: 2,
      image: "/placeholder.jpg",
      inStock: true,
      onSale: true,
    },
    {
      id: "camera-bag",
      title: "Professional Camera Bag",
      category: "Bags",
      price: 79.99,
      originalPrice: 99.99,
      discount: 20,
      rating: 4.5,
      reviews: 2,
      image: "/placeholder.jpg",
      inStock: true,
      onSale: true,
    },
  ],
  "electronic-digital": [
    {
      id: "red-smartphone",
      title: "vulputate velit esse molestie consequat",
      category: "Smartphones",
      price: 699.00,
      originalPrice: null,
      discount: 0,
      rating: 4.5,
      reviews: 2,
      image: "/placeholder.jpg",
      inStock: true,
      onSale: false,
    },
    {
      id: "white-smartwatch",
      title: "Lorem ipsum diam nonumy eirmod tempor ut labore",
      category: "Smartwatches",
      price: 550.00,
      priceRange: { min: 550.00, max: 650.00 },
      originalPrice: null,
      discount: 0,
      rating: 4.5,
      reviews: 2,
      image: "/placeholder.jpg",
      inStock: true,
      onSale: false,
    },
    {
      id: "rose-gold-smartwatch",
      title: "Invidunt sed diam nonumy eirmod tempor ut labore",
      category: "Smartwatches",
      price: 550.00,
      priceRange: { min: 550.00, max: 650.00 },
      originalPrice: null,
      discount: 0,
      rating: 4.5,
      reviews: 2,
      image: "/placeholder.jpg",
      inStock: true,
      onSale: false,
    },
    {
      id: "silver-desktop",
      title: "Stet clita kasd gubergren Consetetur sadipscing elitr",
      category: "Desktop Computers",
      price: 850.00,
      originalPrice: 1119.00,
      discount: 24,
      rating: 4.5,
      reviews: 2,
      image: "/placeholder.jpg",
      inStock: true,
      onSale: true,
    },
    {
      id: "dual-smartphones",
      title: "Duis autem vel eum iriure dolor in hendrerit",
      category: "Smartphones",
      price: 464.00,
      originalPrice: 774.00,
      discount: 40,
      rating: 4.5,
      reviews: 2,
      image: "/placeholder.jpg",
      inStock: true,
      onSale: true,
    },
    {
      id: "pink-tablet",
      title: "Lorem ipsum dolor sit amet consetetur",
      category: "Tablets",
      price: 750.00,
      originalPrice: 1204.00,
      discount: 38,
      rating: 4.5,
      reviews: 2,
      image: "/placeholder.jpg",
      inStock: true,
      onSale: true,
    },
  ],
  "garden-kitchen": [
    {
      id: "smart-garden-kit",
      title: "Smart Garden Growing Kit",
      category: "Garden",
      price: 149.99,
      originalPrice: 199.99,
      discount: 25,
      rating: 4.5,
      reviews: 2,
      image: "/placeholder.jpg",
      inStock: true,
      onSale: true,
    },
    {
      id: "bluetooth-speaker",
      title: "Waterproof Bluetooth Speaker",
      category: "Kitchen",
      price: 79.99,
      originalPrice: null,
      discount: 0,
      rating: 4.5,
      reviews: 2,
      image: "/placeholder.jpg",
      inStock: true,
      onSale: false,
    },
    {
      id: "smart-thermometer",
      title: "Digital Meat Thermometer",
      category: "Kitchen",
      price: 39.99,
      originalPrice: 59.99,
      discount: 33,
      rating: 4.5,
      reviews: 2,
      image: "/placeholder.jpg",
      inStock: true,
      onSale: true,
    },
    {
      id: "plant-monitor",
      title: "Smart Plant Monitor",
      category: "Garden",
      price: 89.99,
      originalPrice: null,
      discount: 0,
      rating: 4.5,
      reviews: 2,
      image: "/placeholder.jpg",
      inStock: true,
      onSale: false,
    },
    {
      id: "coffee-grinder",
      title: "Electric Coffee Grinder",
      category: "Kitchen",
      price: 129.99,
      originalPrice: 179.99,
      discount: 28,
      rating: 4.5,
      reviews: 2,
      image: "/placeholder.jpg",
      inStock: true,
      onSale: true,
    },
    {
      id: "garden-tools",
      title: "Professional Garden Tool Set",
      category: "Garden",
      price: 199.99,
      originalPrice: 249.99,
      discount: 20,
      rating: 4.5,
      reviews: 2,
      image: "/placeholder.jpg",
      inStock: true,
      onSale: true,
    },
  ],
  "home-kitchen": [
    {
      id: "smart-home-hub",
      title: "Smart Home Control Hub",
      category: "Home",
      price: 299.99,
      originalPrice: 399.99,
      discount: 25,
      rating: 4.5,
      reviews: 2,
      image: "/placeholder.jpg",
      inStock: true,
      onSale: true,
    },
    {
      id: "air-fryer",
      title: "Digital Air Fryer",
      category: "Kitchen",
      price: 159.99,
      originalPrice: null,
      discount: 0,
      rating: 4.5,
      reviews: 2,
      image: "/placeholder.jpg",
      inStock: true,
      onSale: false,
    },
    {
      id: "robot-vacuum",
      title: "Smart Robot Vacuum",
      category: "Home",
      price: 399.99,
      originalPrice: 499.99,
      discount: 20,
      rating: 4.5,
      reviews: 2,
      image: "/placeholder.jpg",
      inStock: true,
      onSale: true,
    },
    {
      id: "smart-thermostat",
      title: "WiFi Smart Thermostat",
      category: "Home",
      price: 249.99,
      originalPrice: null,
      discount: 0,
      rating: 4.5,
      reviews: 2,
      image: "/placeholder.jpg",
      inStock: true,
      onSale: false,
    },
    {
      id: "instant-pot",
      title: "Multi-Function Pressure Cooker",
      category: "Kitchen",
      price: 179.99,
      originalPrice: 229.99,
      discount: 22,
      rating: 4.5,
      reviews: 2,
      image: "/placeholder.jpg",
      inStock: true,
      onSale: true,
    },
    {
      id: "smart-lighting",
      title: "Smart LED Light Strip",
      category: "Home",
      price: 49.99,
      originalPrice: 79.99,
      discount: 38,
      rating: 4.5,
      reviews: 2,
      image: "/placeholder.jpg",
      inStock: true,
      onSale: true,
    },
  ],
}

export function CategoryTabs() {
  const { addItem } = useCart()
  const [activeCategory, setActiveCategory] = useState("electronic-digital")
  const [isAnimating, setIsAnimating] = useState(false)
  const [swiperKey, setSwiperKey] = useState(0)

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === activeCategory) return
    
    setIsAnimating(true)
    setActiveCategory(categoryId)
    
    // Reset swiper to first slide when category changes
    setSwiperKey(prev => prev + 1)
    
    // Reset animation state after transition
    setTimeout(() => {
      setIsAnimating(false)
    }, 500)
  }

  const handleAddToCart = (product: any) => {
    addItem({
      id: parseInt(product.id.replace(/\D/g, '')) || Math.random() * 1000,
      title: product.title,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      platform: "Digital",
      discount: product.discount,
    })
  }

  const currentProducts = categoryProducts[activeCategory as keyof typeof categoryProducts] || []

  const renderProducts = () => {
    return currentProducts.map((product, index) => (
      <SwiperSlide key={`${product.id}-${swiperKey}`}>
        <Link href={`/product/${product.id}`}>
          <Card 
            className={`group hover:shadow-xl transition-all duration-500 overflow-hidden dark:card-hover cursor-pointer min-h-[280px] sm:min-h-[380px] lg:min-h-[440px] h-full rounded-lg ${
              isAnimating ? 'animate-fade-in-up' : ''
            }`}
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both'
            }}
          >
            <CardContent className="h-full flex flex-col p-0">
              <div className="relative mb-3 sm:mb-4 p-3 sm:p-4 pb-0">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-32 sm:h-36 lg:h-40 xl:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {product.onSale && (
                  <Badge className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-red-600 hover:bg-red-700 text-white animate-pulse text-xs sm:text-sm">
                    ON SALE
                  </Badge>
                )}
              </div>

              <div className="flex-1 flex flex-col p-3 sm:p-4 pt-0">
                <div className="space-y-2 sm:space-y-3 flex-1">
                  <div>
                    <h3 className="font-semibold text-xs sm:text-sm mb-1 line-clamp-2">{product.title}</h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs sm:text-sm text-muted-foreground ml-1">({product.reviews} reviews)</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {(product as any).priceRange ? (
                      <span className="text-sm sm:text-lg font-bold text-primary">
                        ${(product as any).priceRange.min.toFixed(2)} - ${(product as any).priceRange.max.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-sm sm:text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
                    )}
                    {product.originalPrice && (
                      <span className="text-xs sm:text-sm text-muted-foreground line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                    <span className="text-xs sm:text-sm text-foreground">In Stock</span>
                  </div>
                </div>

                <div className="mt-auto pt-3">
                  <Button
                    size="sm"
                    className="w-full h-[32px] gap-2 hover:animate-pulse-glow transition-all duration-300 hover:scale-105 text-xs sm:text-sm"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleAddToCart(product)
                    }}
                  >
                    <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </SwiperSlide>
    ))
  }

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-background via-muted/20 to-secondary/30">
      <div className="container mx-auto px-4">
        {/* Category Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 sm:mb-8 gap-4 lg:gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 lg:gap-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold uppercase">Electronic & Digital</h2>
            
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-105 rounded-lg ${
                      activeCategory === category.id
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="relative">
          <Swiper
            key={swiperKey}
            modules={[Navigation]}
            spaceBetween={12}
            slidesPerView={1.2}
            navigation={{
              nextEl: '.category-swiper-button-next',
              prevEl: '.category-swiper-button-prev',
            }}
            breakpoints={{
              480: {
                slidesPerView: 1.5,
                spaceBetween: 12,
              },
              640: {
                slidesPerView: 2.5,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 3.5,
                spaceBetween: 16,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 16,
              },
              1280: {
                slidesPerView: 5,
                spaceBetween: 16,
              },
            }}
            className="category-swiper"
          >
            {renderProducts()}
          </Swiper>
          
          {/* Navigation Arrow */}
          <Button 
            variant="outline" 
            size="icon" 
            className="category-swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1 sm:-translate-x-2 bg-white/90 hover:bg-white z-10"
          >
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="category-swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 translate-x-1 sm:translate-x-2 bg-white/90 hover:bg-white z-10"
          >
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 rotate-180" />
          </Button>
        </div>
      </div>
    </section>
  )
}
