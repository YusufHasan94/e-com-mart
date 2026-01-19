"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { apiService, AppProduct } from "@/lib/api-service"
import Link from "next/link"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

interface RelatedProductsProps {
  currentProductId: string
}

export function RelatedProducts({ currentProductId }: RelatedProductsProps) {
  const [products, setProducts] = useState<AppProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { addItem } = useCart()
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!currentProductId) return

      setIsLoading(true)
      try {
        const response = await apiService.getRelatedProducts(currentProductId)
        if (response.success && response.data) {
          const mapped = response.data.map(p => apiService.mapApiProductToProduct(p))
          setProducts(mapped)
        }
      } catch (error) {
        console.error("Failed to fetch related products", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRelatedProducts()
  }, [currentProductId])

  const handleAddToCart = (product: AppProduct) => {
    addItem({
      id: parseInt(product.id),
      title: product.title,
      price: product.salePrice,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      platform: product.platform,
      discount: product.discount,
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold font-heading">You might also like</h2>
          <p className="text-sm text-muted-foreground">Discover other products in this category</p>
        </div>
      </div>

      <div className="relative group/swiper px-1">
        <Swiper
          spaceBetween={16}
          slidesPerView={1.2}
          breakpoints={{
            480: { slidesPerView: 1.5 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 2.5 },
            1024: { slidesPerView: 3.5 },
            1280: { slidesPerView: 4 }
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onInit={(swiper) => {
            if (typeof swiper.params.navigation === 'object') {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.destroy();
              swiper.navigation.init();
              swiper.navigation.update();
            }
          }}
          onSwiper={(swiper) => {
            if (typeof swiper.params.navigation === 'object') {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.destroy();
              swiper.navigation.init();
              swiper.navigation.update();
            }
          }}
          onBeforeInit={(swiper) => {
            if (typeof swiper.params.navigation === 'object') {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }
          }}
          modules={[Navigation, Autoplay]}
          className="related-products-swiper !pb-8"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="h-auto">
              <Card className="group/card hover:shadow-xl transition-all duration-300 overflow-hidden dark:glass-effect dark:card-hover h-full flex flex-col border-border/50">
                <Link href={`/product/${product.id}`} className="block relative aspect-[16/9] overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-3 left-3">
                      <Badge variant="destructive" className="font-bold">-{product.discount}%</Badge>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button variant="secondary" size="sm" className="rounded-full shadow-lg">View Details</Button>
                  </div>
                </Link>

                <CardContent className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-primary uppercase tracking-wider">{product.category}</p>
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-semibold text-lg group-hover/card:text-primary transition-colors line-clamp-1">{product.title}</h3>
                    </Link>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold">{product.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">({product.reviews} reviews)</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/40 mt-1">
                    <div className="flex flex-col">
                      {product.discount > 0 && (
                        <span className="text-xs text-muted-foreground line-through decoration-destructive/50">${product.originalPrice}</span>
                      )}
                      <span className="text-xl font-bold text-primary">${product.salePrice}</span>
                    </div>
                    <Button
                      size="sm"
                      className="gap-2 shadow-sm rounded-lg h-9 px-4"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons - More visual and reliable */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 z-20 flex justify-between pointer-events-none px-2 sm:px-4">
          <button
            ref={prevRef}
            className="pointer-events-auto bg-white dark:bg-gray-800 hover:bg-primary hover:text-white dark:hover:bg-primary transition-all duration-300 rounded-full p-2.5 sm:p-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-border/40 hover:border-primary -ml-2 sm:-ml-4 group cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
          </button>
          <button
            ref={nextRef}
            className="pointer-events-auto bg-white dark:bg-gray-800 hover:bg-primary hover:text-white dark:hover:bg-primary transition-all duration-300 rounded-full p-2.5 sm:p-3 shadow-[0_8px_30_rgb(0,0,0,0.12)] border border-border/40 hover:border-primary -mr-2 sm:-mr-4 group cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  )
}
