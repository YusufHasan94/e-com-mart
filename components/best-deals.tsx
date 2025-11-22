"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, ChevronRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

const hotDealsProducts = [
  {
    id: "gta-v",
    title: "Grand Theft Auto V",
    category: "Action Game",
    originalPrice: 1200.00,
    salePrice: 550.00,
    discount: 54,
    rating: 4.4,
    reviews: 2,
    image: "/gta-v-action-game-cover.jpg",
    sold: 68,
    total: 70,
  },
  {
    id: "photoshop-cc-2024",
    title: "Adobe Photoshop CC 2024",
    category: "Design Software",
    originalPrice: 950.74,
    salePrice: 550.74,
    discount: 42,
    rating: 4.7,
    reviews: 3,
    image: "/adobe-photoshop-software.jpg",
    sold: 60,
    total: 70,
  },
  {
    id: "fifa-24",
    title: "FIFA 24 Ultimate Edition",
    category: "Sports Game",
    originalPrice: 1200.00,
    salePrice: 800.00,
    discount: 33,
    rating: 4.1,
    reviews: 5,
    image: "/fifa-24-soccer-game.jpg",
    sold: 54,
    total: 70,
  },
  {
    id: "windows-11-pro",
    title: "Windows 11 Pro License",
    category: "Operating System",
    originalPrice: 1200.00,
    salePrice: 990.00,
    discount: 18,
    rating: 4.3,
    reviews: 4,
    image: "/windows-11-operating-system.jpg",
    sold: 54,
    total: 70,
  },
]

// Countdown Timer Component
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 18,
    minutes: 39,
    seconds: 47
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Hurry Up! Offer ends in:</span>
      <div className="flex gap-1">
        <div className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-bold min-w-[32px] text-center">
          {timeLeft.days.toString().padStart(2, '0')}
        </div>
        <div className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-bold min-w-[32px] text-center">
          {timeLeft.hours.toString().padStart(2, '0')}
        </div>
        <div className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-bold min-w-[32px] text-center">
          {timeLeft.minutes.toString().padStart(2, '0')}
        </div>
        <div className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-bold min-w-[32px] text-center">
          {timeLeft.seconds.toString().padStart(2, '0')}
        </div>
      </div>
    </div>
  )
}

export function BestDeals() {

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-background relative">
      {/* Gradient overlay to melt with top section */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-background" />
      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <h2 className="text-2xl sm:text-3xl font-bold text-primary">HOT DEALS!</h2>
            </div>
            <span className="text-muted-foreground text-sm sm:text-lg">GET OUR BEST PRICES</span>
          </div>
          <CountdownTimer />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Promotional Banner */}
          <div className="lg:col-span-1">
            <Card className="relative overflow-hidden bg-primary h-[200px] sm:h-[250px] lg:h-full rounded-lg">
              <CardContent className="p-4 sm:p-6 lg:p-8 h-full flex flex-col justify-between relative">
                {/* Sparkle Effects */}
                <div className="absolute inset-0 overflow-hidden">
                  <Sparkles className="absolute top-4 left-8 h-4 w-4 text-primary-foreground/60 opacity-60" />
                  <Sparkles className="absolute top-12 right-12 h-3 w-3 text-primary-foreground/40 opacity-40" />
                  <Sparkles className="absolute bottom-16 left-16 h-5 w-5 text-primary-foreground/50 opacity-50" />
                  <Sparkles className="absolute bottom-8 right-8 h-4 w-4 text-primary-foreground/60 opacity-60" />
                  <Sparkles className="absolute top-1/2 left-4 h-3 w-3 text-primary-foreground/30 opacity-30" />
                </div>

                <div className="relative z-10">
                  <div className="text-primary-foreground text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-4">HURRY UP</div>

                  <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                    <div className="text-primary-foreground text-sm sm:text-lg font-semibold writing-mode-vertical transform rotate-180 hidden sm:block">
                      SAVE UP TO
                    </div>
                    <div className="text-primary-foreground text-4xl sm:text-6xl lg:text-8xl font-black">80%</div>
                  </div>

                  <div className="text-primary-foreground text-sm sm:text-lg mb-4 sm:mb-8">THIS WEEK ONLY SHOPPING DAYS</div>
                </div>

                <div className="relative z-10">
                  <div className="text-primary-foreground text-3xl sm:text-4xl lg:text-6xl font-black tracking-wider" style={{
                    textShadow: '2px 2px 0px var(--primary), -2px -2px 0px var(--primary), 2px -2px 0px var(--primary), -2px 2px 0px var(--primary)',
                    filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))'
                  }}>
                    12.12
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Cards */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={16}
                slidesPerView={1}
                navigation={{
                  nextEl: '.swiper-button-next-custom',
                  prevEl: '.swiper-button-prev-custom',
                }}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 1.5,
                    spaceBetween: 16,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 16,
                  },
                  1024: {
                    slidesPerView: 2.5,
                    spaceBetween: 16,
                  },
                  1280: {
                    slidesPerView: 3,
                    spaceBetween: 16,
                  },
                }}
                className="hot-deals-swiper"
              >
                {hotDealsProducts.map((product) => (
                  <SwiperSlide key={product.id}>
                    <Link href={`/product/${product.id}`}>
                      <Card className="dark:glass-effect dark:card-hover cursor-pointer h-full rounded-lg">
                        <CardContent className="h-full flex flex-col">
                          <div className="relative mb-4">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.title}
                              className="w-full h-48 object-cover"
                            />
                            <Badge className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white">
                              ON SALE
                            </Badge>
                          </div>

                          <div className="space-y-3 flex-1 flex flex-col p-4">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">{product.title}</h3>
                              <p className="text-sm text-muted-foreground">{product.category}</p>
                            </div>

                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-muted-foreground ml-1">({product.reviews} reviews)</span>
                            </div>



                            <div className="space-y-2 mt-auto">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Sold: {product.sold}/{product.total} Products</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${(product.sold / product.total) * 100}%` }}
                                ></div>
                              </div>
                            </div>

                            <div className="flex items-start gap-0 flex-col">
                              <span className="text-sm text-muted-foreground">from</span>
                              <span className="text-xl font-bold text-primary">${product.salePrice.toFixed(2)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Buttons */}
              <Button
                variant="outline"
                size="icon"
                className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1 sm:-translate-x-2 bg-white/90 hover:bg-white z-10 rounded-full"
              >
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 translate-x-1 sm:translate-x-2 bg-white/90 hover:bg-white z-10 rounded-full"
              >
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 rotate-180" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
