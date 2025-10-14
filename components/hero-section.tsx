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
      <div className="container mx-auto px-4 py-16 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-start">
          
          <div className="lg:col-span-4">
            <div className="space-y-6">


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
                  className="w-full h-[450px]"
                >
                  {featuredContent.map((item) => (
                    <SwiperSlide key={item.id}>
                      <div className="relative overflow-hidden bg-gradient-to-br from-secondary to-muted shadow-2xl h-full">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                          <div className="space-y-0 text-center">
                            <Badge className="bg-transparent text-white">{item.badge}</Badge>
                            <h3 className="text-2xl lg:text-3xl font-bold text-white">{item.title}</h3>
                            <div className="pt-12">
                              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-6">
                                Get Offer
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                
                {/* Custom Navigation Buttons */}
                <button 
                  ref={prevRef}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-3 transition-all duration-200 group cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                </button>
                <button 
                  ref={nextRef}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-3 transition-all duration-200 group cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                </button>
              </div>

            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {/* Top Offer Card */}
            <Card className="relative overflow-hidden dark:card-hover group h-[217px] shadow-lg" 
                  style={{
                    backgroundImage: 'url(/steam-gift-card-gaming.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}>
            </Card>

            {/* Gaming Controller Card */}
            <Card className="relative overflow-hidden dark:card-hover group h-[217px] shadow-lg"
                  style={{
                    backgroundImage: 'url(/epic-gaming-scene-with-futuristic-elements.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}>
            </Card>

          </div>
        </div>
      </div>
    </section>
  )
}
