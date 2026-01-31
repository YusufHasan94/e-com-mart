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
import { ProductCard } from "./product-card"

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

        const mappedProducts = response.data.map(p => apiService.mapApiProductToProduct(p))

        setProductsList(mappedProducts)
      }
      setIsLoading(false)
    }

    fetchProducts()
  }, [])



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
                <ProductCard product={product} />
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
