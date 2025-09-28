"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Star, TrendingUp, Users, Award } from "lucide-react"
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
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 items-start">
          
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
                  className="w-full h-[500px]"
                >
                  {featuredContent.map((item) => (
                    <SwiperSlide key={item.id}>
                      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-secondary to-muted shadow-2xl h-full">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                          <div className="space-y-3">
                            <Badge className="bg-primary text-primary-foreground">{item.badge}</Badge>
                            <h3 className="text-2xl lg:text-3xl font-bold text-white">{item.title}</h3>
                            <p className="text-white/80 text-lg">{item.description}</p>
                            <div className="flex items-center justify-between pt-3">
                              <div className="flex items-center gap-3">
                                <span className="text-white/60 line-through text-lg">${item.originalPrice}</span>
                                <span className="text-3xl font-bold text-white">${item.price}</span>
                                <Badge variant="destructive" className="text-sm">-{item.discount}%</Badge>
                              </div>
                              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-6">
                                Add to Cart
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
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/20 border-primary/20">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">50K+</h3>
                <p className="text-sm text-muted-foreground">Games Available</p>
                <div className="mt-3 text-xs text-primary/80">
                  Updated daily
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/10 to-muted/20 border-secondary/20">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-secondary-foreground mb-2">2M+</h3>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
                <div className="mt-3 text-xs text-secondary-foreground/80">
                  Join the community
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </section>
  )
}
