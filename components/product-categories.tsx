"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Gamepad2, Coins, Plus, Gift, CreditCard, Monitor, Shield, Smartphone, Wifi, Wallet, Loader2 } from "lucide-react"
import { apiService, type ApiType } from "@/lib/api-service"
import Link from "next/link"

// Icon and color mapping based on type slug
const getTypeStyle = (slug: string) => {
  const styles: Record<string, any> = {
    'game': {
      icon: Gamepad2,
      color: "bg-blue-500/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      description: "Latest releases and classics"
    },
    'dlc': {
      icon: Plus,
      color: "bg-green-500/20",
      iconColor: "text-green-600 dark:text-green-400",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      description: "Game extensions and content"
    },
    'gift-card': {
      icon: Gift,
      color: "bg-purple-500/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      description: "Steam, PlayStation, Xbox"
    },
    'software': {
      icon: Monitor,
      color: "bg-indigo-500/20",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
      description: "Professional tools & utilities"
    },
    'subscription': {
      icon: CreditCard,
      color: "bg-orange-500/20",
      iconColor: "text-orange-600 dark:text-orange-400",
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
      description: "Monthly plans and services"
    }
  }

  return styles[slug] || {
    icon: Wallet,
    color: "bg-gray-500/20",
    iconColor: "text-gray-600 dark:text-gray-400",
    iconBg: "bg-gray-100 dark:bg-gray-900/30",
    description: "Digital products"
  }
}

export function ProductCategories() {
  const [types, setTypes] = useState<ApiType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTypes = async () => {
      setIsLoading(true)
      const response = await apiService.getTypes()
      if (response.success && response.data) {
        setTypes(response.data)
      }
      setIsLoading(false)
    }

    fetchTypes()
  }, [])

  if (isLoading) {
    return (
      <section className="py-6 sm:py-8 lg:py-12 relative">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-6 sm:py-8 lg:py-12 relative border-t border-border/20">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
          {types.map((type) => {
            const style = getTypeStyle(type.slug)
            const Icon = style.icon
            return (
              <Link key={type.id} href={`/products?type=${type.slug}`}>
                <Card
                  className={`card-premium group relative overflow-hidden h-[90px] sm:h-[100px] lg:h-[110px] rounded-lg ${style.color}`}
                >
                  <CardContent className="p-1.5 sm:p-2 lg:p-3 relative z-10 h-full flex items-center space-x-1.5 sm:space-x-2 lg:space-x-3">
                    {/* Icon */}
                    <div className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-lg ${style.iconBg} group-hover:scale-110 transition-all duration-300 flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 ${style.iconColor}`} />
                    </div>

                    {/* Content */}
                    <div className="space-y-0.5 flex-1">
                      <h3 className="font-semibold text-[14px] sm:text-sm lg:text-base text-foreground group-hover:text-brand-500 transition-colors">
                        {type.name}
                      </h3>
                      <p className="text-muted-foreground text-xs leading-relaxed hidden sm:block">
                        {style.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
