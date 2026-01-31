"use client"

import { useState, useEffect } from "react"
import { apiService, ApiCategory } from "@/lib/api-service"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Gamepad2,
  Coins,
  Plus,
  Gift,
  CreditCard,
  Monitor,
  Shield,
  Smartphone,
  Wifi,
  Wallet,
  TrendingUp,
  Cpu,
  Layers,
  Database,
  Lock,
  Box,
  Layout,
  Terminal
} from "lucide-react"

// Helper to map category slugs/names to icons and colors
const getCategoryStyles = (slug: string, name: string) => {
  const normalized = slug.toLowerCase()

  if (normalized.includes('game')) return {
    icon: Gamepad2,
    color: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
    bgColor: "bg-blue-500/10",
    desc: "Gaming Essentials"
  }

  if (normalized.includes('antivirus') || normalized.includes('security')) return {
    icon: Shield,
    color: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
    bgColor: "bg-red-500/10",
    desc: "Privacy Tools"
  }

  if (normalized.includes('gift')) return {
    icon: Gift,
    color: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
    bgColor: "bg-purple-500/10",
    desc: "Digital Credits"
  }

  if (normalized.includes('graphic') || normalized.includes('design')) return {
    icon: Layout,
    color: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800",
    bgColor: "bg-indigo-500/10",
    desc: "Creative Software"
  }

  if (normalized.includes('office') || normalized.includes('productivity')) return {
    icon: Monitor,
    color: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
    bgColor: "bg-orange-500/10",
    desc: "Professional Tools"
  }

  if (normalized.includes('operating') || normalized.includes('system')) return {
    icon: Cpu,
    color: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800",
    bgColor: "bg-teal-500/10",
    desc: "Core Software"
  }

  if (normalized.includes('development') || normalized.includes('tools')) return {
    icon: Terminal,
    color: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800",
    bgColor: "bg-violet-500/10",
    desc: "Dev Resources"
  }

  // Fallback
  return {
    icon: Box,
    color: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800",
    bgColor: "bg-gray-500/10",
    desc: "Digital Goods"
  }
}

export function CategoryMarquee() {
  const [isHovered, setIsHovered] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await apiService.getCategories()
        if (response.success && response.data) {
          const mapped = response.data.map(cat => ({
            ...cat,
            ...getCategoryStyles(cat.slug, cat.name)
          }))
          setCategories(mapped)
        }
      } catch (error) {
        console.error("Failed to fetch marquee categories:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCategories()
  }, [])

  if (isLoading) {
    return (
      <section className="py-8 sm:py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-40 min-w-[200px] rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (categories.length === 0) return null

  // Duplicate categories for seamless loop
  const duplicatedCategories = [...categories, ...categories, ...categories]

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20">
            <TrendingUp className="h-3 w-3 mr-1" />
            Browse Categories
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Explore Our Vast Collection
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
            Discover thousands of products across multiple categories. From the latest games to professional software, we have everything you need.
          </p>
        </div>

        {/* Marquee Container */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Marquee */}
          <div
            className={`flex gap-4 transition-all duration-300 ${isHovered ? 'animate-pause' : 'animate-marquee'}`}
            style={{
              animationDuration: '30s',
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite'
            }}
          >
            {duplicatedCategories.map((category, index) => {
              const Icon = category.icon
              return (
                <Card
                  key={`${category.id}-${index}`}
                  className={`${category.bgColor} border-border/30 hover:border-border/60 transition-all duration-300 hover:shadow-lg hover:scale-105 flex-shrink-0 min-w-[200px] sm:min-w-[220px] group cursor-pointer relative overflow-hidden`}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="text-center space-y-3 relative z-10">
                      {/* Icon */}
                      <div className="w-12 h-12 mx-auto bg-background/60 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300 shadow-sm">
                        <Icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                      </div>

                      {/* Content */}
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
                          {category.name}
                        </h3>
                        <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                          {category.desc}
                        </p>
                      </div>
                    </div>
                    {/* Hover Effect Layer moved inside CardContent but behind content */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 sm:mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-lg border border-border/30 hover:border-border/60 transition-all duration-300 hover:shadow-lg hover:scale-105 group">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 group-hover:scale-110 transition-transform">50K+</div>
            <div className="text-xs sm:text-sm text-muted-foreground lowercase font-medium tracking-tight">Total Products</div>
          </div>
          <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-lg border border-border/30 hover:border-border/60 transition-all duration-300 hover:shadow-lg hover:scale-105 group">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 group-hover:scale-110 transition-transform">{categories.length}</div>
            <div className="text-xs sm:text-sm text-muted-foreground lowercase font-medium tracking-tight">Categories</div>
          </div>
          <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-lg border border-border/30 hover:border-border/60 transition-all duration-300 hover:shadow-lg hover:scale-105 group">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 group-hover:scale-110 transition-transform">2M+</div>
            <div className="text-xs sm:text-sm text-muted-foreground lowercase font-medium tracking-tight">Happy Customers</div>
          </div>
          <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-lg border border-border/30 hover:border-border/60 transition-all duration-300 hover:shadow-lg hover:scale-105 group">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 group-hover:scale-110 transition-transform">24/7</div>
            <div className="text-xs sm:text-sm text-muted-foreground lowercase font-medium tracking-tight">Support</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
        
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        
        .animate-pause {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
