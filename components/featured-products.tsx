"use client"

import { useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

import { apiService, type ApiProduct } from "@/lib/api-service"
import { useState, useEffect } from "react"

export function FeaturedProducts() {
  const [productsList, setProductsList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      const response = await apiService.getTrendingProducts()
      if (response.success && Array.isArray(response.data)) {
        console.log("response.data", response.data);
        const mappedProducts = response.data.map(p => apiService.mapApiProductToProduct(p))
        console.log("mappedProducts", mappedProducts);
        setProductsList(mappedProducts)
      }
      setIsLoading(false)
    }

    fetchProducts()
  }, [])

  console.log("productsList", productsList);

  if (isLoading) {
    return (
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading featured products...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4">
          <div className="space-y-1 sm:space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Featured Products</h2>
            <p className="text-muted-foreground text-sm sm:text-base">Handpicked deals and trending items</p>
          </div>
          <Link href="/products">
            <Button variant="outline" className="w-full sm:w-auto rounded-[4px]">View All</Button>
          </Link>
        </div>

        <div className="relative">
          <Swiper
            spaceBetween={12}
            slidesPerView={1.2}
            breakpoints={{
              480: {
                slidesPerView: 1.5,
                spaceBetween: 12,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 2.5,
                spaceBetween: 16,
              },
              1024: {
                slidesPerView: 3.5,
                spaceBetween: 16,
              },
              1280: {
                slidesPerView: 5,
                spaceBetween: 16,
              },
            }}
            navigation={{
              nextEl: nextRef.current,
              prevEl: prevRef.current,
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            modules={[Navigation, Autoplay]}
            className="featured-products-swiper"
          >
            {productsList.map((product) => (
              <SwiperSlide key={product.id}>
                <Link href={`/product/${product.id}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden dark:card-hover cursor-pointer h-full rounded-lg">
                    <div className="relative">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        {product.isNew && <Badge className="bg-green-600 hover:bg-green-700 rounded-lg">New</Badge>}
                        {product.isBestseller && <Badge className="bg-orange-600 hover:bg-orange-700 rounded-lg">Bestseller</Badge>}
                        {product.discount > 0 && <Badge variant="destructive" className="rounded-lg">-{product.discount}%</Badge>}
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

                      <div className="flex flex-col gap-4 items-center justify-between">
                        <div className="space-y-1 text-start w-full">
                          <div className="flex items-start gap-0 flex-col">
                            <span className="text-sm text-muted-foreground">from</span>
                            <span className="text-xl font-bold text-primary">${product.salePrice}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button
            ref={prevRef}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-lg transition-all duration-200 group -ml-2 sm:-ml-4 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300 group-hover:scale-110 transition-transform" />
          </button>
          <button
            ref={nextRef}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-lg transition-all duration-200 group -mr-2 sm:-mr-4 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  )
}
