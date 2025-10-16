import { Card, CardContent } from "@/components/ui/card"
import { Gamepad2, Coins, Plus, Gift, CreditCard, Monitor, Shield, Smartphone, Wifi, Wallet } from "lucide-react"

const categories = [
  {
    icon: Gamepad2,
    title: "Game Keys",
    description: "Latest releases and classics",
    count: "15,000+",
    color: "bg-gradient-to-br from-blue-500/20 to-blue-600/10",
    iconColor: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    icon: Coins,
    title: "In-Game Currency",
    description: "Virtual points and credits",
    count: "8,000+",
    color: "bg-gradient-to-br from-yellow-500/20 to-yellow-600/10",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
  },
  {
    icon: Plus,
    title: "DLCs & Add-Ons",
    description: "Game extensions and content",
    count: "2,000+",
    color: "bg-gradient-to-br from-green-500/20 to-green-600/10",
    iconColor: "text-green-600 dark:text-green-400",
    iconBg: "bg-green-100 dark:bg-green-900/30",
  },
  {
    icon: Gift,
    title: "Gift Cards",
    description: "Steam, PlayStation, Xbox",
    count: "450+",
    color: "bg-gradient-to-br from-purple-500/20 to-purple-600/10",
    iconColor: "text-purple-600 dark:text-purple-400",
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    icon: CreditCard,
    title: "Subscriptions",
    description: "Monthly plans and services",
    count: "1,200+",
    color: "bg-gradient-to-br from-orange-500/20 to-orange-600/10",
    iconColor: "text-orange-600 dark:text-orange-400",
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
  },
  {
    icon: Monitor,
    title: "Software Licenses",
    description: "Professional tools & utilities",
    count: "5,000+",
    color: "bg-gradient-to-br from-indigo-500/20 to-indigo-600/10",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
  },
  {
    icon: Shield,
    title: "VPNs & Security",
    description: "Privacy and security tools",
    count: "850+",
    color: "bg-gradient-to-br from-red-500/20 to-red-600/10",
    iconColor: "text-red-600 dark:text-red-400",
    iconBg: "bg-red-100 dark:bg-red-900/30",
  },
  {
    icon: Smartphone,
    title: "Mobile Top-Ups",
    description: "Phone credits and data",
    count: "3,000+",
    color: "bg-gradient-to-br from-pink-500/20 to-pink-600/10",
    iconColor: "text-pink-600 dark:text-pink-400",
    iconBg: "bg-pink-100 dark:bg-pink-900/30",
  }
]

export function ProductCategories() {
  return (
    <section className="py-6 sm:py-8 lg:py-12 relative">
      <div className="container mx-auto px-3 sm:px-4">
        
        {/* Static Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <Card
                key={index}
                className={`group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 relative overflow-hidden backdrop-blur-sm hover:scale-105 h-[90px] sm:h-[100px] lg:h-[110px] rounded-lg ${category.color}`}
              >
                <CardContent className="p-1.5 sm:p-2 lg:p-3 relative z-10 h-full flex items-center space-x-1.5 sm:space-x-2 lg:space-x-3">
                  {/* Icon */}
                  <div className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-lg ${category.iconBg} group-hover:scale-110 transition-all duration-300 flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 ${category.iconColor}`} />
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-0.5 flex-1">
                    <h3 className="font-semibold text-xs sm:text-sm lg:text-base text-foreground group-hover:text-foreground/80 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed hidden sm:block">
                      {category.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}