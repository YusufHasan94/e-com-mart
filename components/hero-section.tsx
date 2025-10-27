"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Star, TrendingUp, Users, Award, Percent, Users2, ChevronLeft, ChevronRight } from "lucide-react"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

// Featured content data
const featuredContent = [
  {
    id: 1,
    title: "Cyberpunk Adventure",
    description: "Experience the future of gaming",
    image: "/epic-gaming-scene-with-futuristic-elements.jpg",
    price: 39.99,
    originalPrice: 59.99,
    discount: 33,
    badge: "Featured"
  },
  {
    id: 2,
    title: "Fantasy RPG World",
    description: "Embark on epic quests",
    image: "/fantasy-medieval-game-world.jpg",
    price: 49.99,
    originalPrice: 69.99,
    discount: 29,
    badge: "New Release"
  },
  {
    id: 3,
    title: "Space Exploration",
    description: "Discover the cosmos",
    image: "/starfield-space-exploration-rpg-game.jpg",
    price: 59.99,
    originalPrice: 79.99,
    discount: 25,
    badge: "Best Seller"
  },
  {
    id: 4,
    title: "Superhero Action",
    description: "Save the city from villains",
    image: "/spider-man-2-superhero-action-game.jpg",
    price: 44.99,
    originalPrice: 64.99,
    discount: 31,
    badge: "Hot Deal"
  }
]

export function HeroSection() {
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  return (
    <section className="relative">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 items-start">
          
          <div className="lg:col-span-4">
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">

              <div className="relative">
                <Swiper
                  grabCursor={true}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  pagination={{
                    clickable: true,
                    dynamicBullets: true,
                  }}
                  navigation={{
                    nextEl: nextRef.current,
                    prevEl: prevRef.current,
                  }}
                  modules={[Autoplay, Pagination, Navigation]}
                  className="w-full h-[200px] sm:h-[300px] lg:h-[450px]"
                >
                  {featuredContent.map((item) => (
                    <SwiperSlide key={item.id}>
                      <div className="relative overflow-hidden shadow-2xl h-full rounded-lg">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-black/80" />
                        <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 lg:bottom-6 lg:left-6 lg:right-6">
                          <div className="space-y-1 sm:space-y-2 text-center">
                            <h3 className="text-base sm:text-xl lg:text-2xl font-bold text-white drop-shadow-lg">{item.title}</h3>
                            <Button className="mt-2 sm:mt-3 bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 text-sm sm:text-sm rounded-[4px] hover:animate-pulse-glow">
                              Shop Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                
                {/* Custom Navigation Buttons */}
                <button 
                  ref={prevRef}
                  className="absolute left-1 sm:left-2 lg:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white dark:bg-black/50 dark:hover:bg-black/70 backdrop-blur-sm rounded-full p-2 transition-all duration-200 group cursor-pointer shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white group-hover:scale-110 transition-transform" />
                </button>
                <button 
                  ref={nextRef}
                  className="absolute right-1 sm:right-2 lg:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white dark:bg-black/50 dark:hover:bg-black/70 backdrop-blur-sm rounded-full p-2 transition-all duration-200 group cursor-pointer shadow-lg"
                >
                  <ChevronRight className="w-6 h-6 text-gray-800 dark:text-white group-hover:scale-110 transition-transform" />
                </button>
              </div>

            </div>
          </div>

          <div className="lg:col-span-2 space-y-3 sm:space-y-4 hidden lg:block">
            {/* Top Offer Card */}
            <Card className="relative overflow-hidden dark:card-hover group h-[180px] lg:h-[200px] xl:h-[217px] shadow-lg rounded-lg" 
                  style={{
                    backgroundImage: 'url(/steam-gift-card-gaming.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-3 left-3 right-3 lg:bottom-4 lg:left-4 lg:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-white font-semibold text-base lg:text-lg drop-shadow-lg">Steam Gift Cards</h3>
                <p className="text-white/90 text-xs lg:text-sm drop-shadow-lg">Digital Gaming Credits</p>
              </div>
            </Card>

            {/* Gaming Controller Card */}
            <Card className="relative overflow-hidden dark:card-hover group h-[180px] lg:h-[200px] xl:h-[217px] shadow-lg rounded-lg"
                  style={{
                    backgroundImage: 'url(/epic-gaming-scene-with-futuristic-elements.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-3 left-3 right-3 lg:bottom-4 lg:left-4 lg:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-white font-semibold text-base lg:text-lg drop-shadow-lg">Gaming Accessories</h3>
                <p className="text-white/90 text-xs lg:text-sm drop-shadow-lg">Premium Gaming Gear</p>
              </div>
            </Card>

          </div>
        </div>
      </div>
    </section>
  )
}
