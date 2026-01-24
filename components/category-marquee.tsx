"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  TrendingUp
} from "lucide-react"

export function CategoryMarquee() {
  const [isHovered, setIsHovered] = useState(false)

  const categories = [
    {
      id: "game-keys",
      name: "Game Keys",
      icon: Gamepad2,
      count: "15K+",
      description: "Latest Releases",
      color: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
      bgColor: "bg-blue-500/10"
    },
    {
      id: "in-game-currency",
      name: "In-Game Currency",
      icon: Coins,
      count: "8K+",
      description: "Virtual Points",
      color: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800",
      bgColor: "bg-yellow-500/10"
    },
    {
      id: "dlcs-addons",
      name: "DLCs & Add-Ons",
      icon: Plus,
      count: "2K+",
      description: "Game Extensions",
      color: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
      bgColor: "bg-green-500/10"
    },
    {
      id: "gift-cards",
      name: "Gift Cards",
      icon: Gift,
      count: "450+",
      description: "Digital Credits",
      color: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
      bgColor: "bg-purple-500/10"
    },
    {
      id: "subscriptions",
      name: "Subscriptions",
      icon: CreditCard,
      count: "1.2K+",
      description: "Monthly Plans",
      color: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
      bgColor: "bg-orange-500/10"
    },
    {
      id: "software-licenses",
      name: "Software Licenses",
      icon: Monitor,
      count: "5K+",
      description: "Professional Tools",
      color: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800",
      bgColor: "bg-indigo-500/10"
    },
    {
      id: "vpn-security",
      name: "VPNs & Security",
      icon: Shield,
      count: "850+",
      description: "Privacy Tools",
      color: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
      bgColor: "bg-red-500/10"
    },
    {
      id: "mobile-topups",
      name: "Mobile Top-Ups",
      icon: Smartphone,
      count: "3K+",
      description: "Phone Credits",
      color: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-800",
      bgColor: "bg-pink-500/10"
    },
    {
      id: "esims",
      name: "eSIMs",
      icon: Wifi,
      count: "180+",
      description: "Data Plans",
      color: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800",
      bgColor: "bg-teal-500/10"
    },
    {
      id: "digital-wallet",
      name: "Digital Wallets",
      icon: Wallet,
      count: "950+",
      description: "Payment Vouchers",
      color: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800",
      bgColor: "bg-violet-500/10"
    }
  ]

  // Duplicate categories for seamless loop
  const duplicatedCategories = [...categories, ...categories]

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
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-background z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-background z-10 pointer-events-none"></div>

          {/* Marquee */}
          <div
            className={`flex gap-4 transition-all duration-300 ${isHovered ? 'animate-pause' : 'animate-marquee'
              }`}
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
                  className={`${category.bgColor} border-border/30 hover:border-border/60 transition-all duration-300 hover:shadow-lg hover:scale-105 flex-shrink-0 min-w-[200px] sm:min-w-[220px] group cursor-pointer`}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="text-center space-y-3">
                      {/* Icon */}
                      <div className="w-12 h-12 mx-auto bg-background/60 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                        <Icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                      </div>

                      {/* Content */}
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors duration-300">
                          {category.name}
                        </h3>
                        <div className="flex items-center justify-center gap-2">
                          <Badge className={`${category.color} text-xs px-2 py-0.5 font-medium`}>
                            {category.count}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                          {category.description}
                        </p>
                      </div>

                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 sm:mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-lg border border-border/30 hover:border-border/60 transition-all duration-300 hover:shadow-lg hover:scale-105">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">50K+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Total Products</div>
          </div>
          <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-lg border border-border/30 hover:border-border/60 transition-all duration-300 hover:shadow-lg hover:scale-105">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">12</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Categories</div>
          </div>
          <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-lg border border-border/30 hover:border-border/60 transition-all duration-300 hover:shadow-lg hover:scale-105">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">2M+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Happy Customers</div>
          </div>
          <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-lg border border-border/30 hover:border-border/60 transition-all duration-300 hover:shadow-lg hover:scale-105">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">24/7</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Support</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        
        .animate-pause {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
