"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Star, TrendingUp, Users, Award, Percent, Users2 } from "lucide-react"
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCube, Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-cube'
import 'swiper/css/pagination'

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
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/20 to-secondary/30">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-start">
          
          <div className="lg:col-span-4">
            <div className="space-y-6">


              <div className="relative">
                <Swiper
                  effect={'cube'}
                  grabCursor={true}
                  cubeEffect={{
                    shadow: true,
                    slideShadows: true,
                    shadowOffset: 20,
                    shadowScale: 0.94,
                  }}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  pagination={{
                    clickable: true,
                  }}
                  modules={[EffectCube, Autoplay, Pagination]}
                  className="w-full h-[400px]"
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
                          <div className="space-y-0">
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
              </div>

            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {/* Top Offer Card */}
            <Card className="relative overflow-hidden dark:card-hover group h-48 shadow-lg" 
                  style={{
                    backgroundImage: 'url(/steam-gift-card-gaming.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-purple-400/60"></div>
              <div className="relative z-10 h-full flex items-center p-6">
                <div className="text-white">
                  <div className="text-sm font-normal mb-2">Top Offer</div>
                  <div className="text-yellow-400 text-2xl font-bold mb-2">Steam Gift Cards</div>
                  <div className="text-white text-sm font-normal">Discount 20% On Products</div>
                </div>
              </div>
            </Card>

            {/* Gaming Controller Card */}
            <Card className="relative overflow-hidden dark:card-hover group h-48 shadow-lg"
                  style={{
                    backgroundImage: 'url(/epic-gaming-scene-with-futuristic-elements.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/80 to-red-500/60"></div>
              <div className="relative z-10 h-full flex items-center p-6">
                <div className="text-white">
                  <div className="text-sm font-normal mb-2">Gamepad</div>
                  <div className="text-yellow-400 text-2xl font-bold mb-2">Gaming Edition 2024</div>
                  <div className="text-white text-sm font-normal">Best Choice Of The Year</div>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </div>
    </section>
  )
}
