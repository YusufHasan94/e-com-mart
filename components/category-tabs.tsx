"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ChevronRight, Check, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { apiService, type ApiCategory, type AppProduct } from "@/lib/api-service"
import { ProductCard } from "./product-card"

interface CategoryWithCount extends ApiCategory {
  productCount: number
}

export function CategoryTabs() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [products, setProducts] = useState<AppProduct[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [swiperKey, setSwiperKey] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Fetch categories and their product counts on mount
  useEffect(() => {
    const fetchCategoriesWithCounts = async () => {
      setIsLoadingCategories(true)

      // Fetch all categories
      const categoriesResponse = await apiService.getCategories()
      if (!categoriesResponse.success || !categoriesResponse.data) {
        setIsLoadingCategories(false)
        return
      }

      // Fetch product counts for each category
      const categoriesWithCounts: CategoryWithCount[] = []

      for (const category of categoriesResponse.data) {
        const productsResponse = await apiService.getProducts({
          category_id: category.id,
          per_page: 1 // Just to get the count
        })

        const count = productsResponse.success && productsResponse.data
          ? (productsResponse.data as any).pagination?.total || 0
          : 0

        // Only include categories with products
        if (count > 0) {
          categoriesWithCounts.push({
            ...category,
            productCount: count
          })
        }
      }

      if (categoriesWithCounts.length > 0) {
        setCategories(categoriesWithCounts)
        // Set first category with products as active
        setActiveCategory(categoriesWithCounts[0].slug)
      }

      setIsLoadingCategories(false)
    }

    fetchCategoriesWithCounts()
  }, [])

  // Fetch latest 10 products when active category changes
  useEffect(() => {
    if (!activeCategory) return

    const fetchProducts = async () => {
      setIsLoadingProducts(true)

      // Find category ID from slug
      const category = categories.find(c => c.slug === activeCategory)
      if (!category) {
        setIsLoadingProducts(false)
        return
      }

      const response = await apiService.getProducts({
        category_id: category.id,
        per_page: 10,
        sort: 'latest' // Request latest products
      })

      if (response.success && response.data) {
        const productsArray = response.data.products || []
        const mappedProducts = productsArray.map(p => apiService.mapApiProductToProduct(p))
        setProducts(mappedProducts)
      }

      setIsLoadingProducts(false)
    }

    fetchProducts()
  }, [activeCategory, categories])

  const handleCategoryChange = (categorySlug: string) => {
    if (categorySlug === activeCategory) return

    setIsAnimating(true)
    setActiveCategory(categorySlug)

    // Reset swiper to first slide when category changes
    setSwiperKey(prev => prev + 1)

    // Reset animation state after transition
    setTimeout(() => {
      setIsAnimating(false)
    }, 500)
  }

  const activeCategoryData = categories.find(c => c.slug === activeCategory)

  if (isLoadingCategories) {
    return (
      <section className="py-8 sm:py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    )
  }

  if (categories.length === 0) {
    return null
  }

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Category Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 sm:mb-8 gap-4 lg:gap-8">
          <div className="w-full">
            {/* Category Tabs - Horizontal Scrollable */}
            <div
              ref={scrollContainerRef}
              className="flex gap-2 sm:gap-3 lg:gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2 -mx-4 px-4"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.slug)}
                  className={`px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-105 rounded-[4px] whitespace-nowrap flex-shrink-0 ${activeCategory === category.slug
                    ? 'bg-primary text-foreground'
                    : 'text-foreground hover:text-foreground hover:bg-primary bg-muted/50'
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* <Link href={`/products?category=${activeCategory}`}>
            <Button variant="outline" className="w-full sm:w-auto rounded-[4px]">
              View All
            </Button>
          </Link> */}
        </div>

        {/* Product Grid */}
        {isLoadingProducts ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found in this category.</p>
          </div>
        ) : (
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
              {products.map((product, index) => (
                <SwiperSlide key={`${product.id}-${swiperKey}`}>
                  <ProductCard
                    product={product}
                    className={isAnimating ? 'animate-fade-in-up' : ''}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'both'
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Arrows */}
            <Button
              variant="outline"
              size="icon"
              className="category-swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1 sm:-translate-x-2 bg-white/90 hover:bg-white z-10 rounded-full"
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="category-swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 translate-x-1 sm:translate-x-2 bg-white/90 hover:bg-white z-10 rounded-full"
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 rotate-180" />
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
