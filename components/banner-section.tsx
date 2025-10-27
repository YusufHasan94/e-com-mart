import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, TrendingUp, Users, Award, Shield, Zap } from "lucide-react"
import Link from "next/link"

export function BannerSection() {
  const bannerData = {
    id: 1,
    title: "Digital Marketplace Mega Sale",
    subtitle: "Up to 80% Off",
    description: "Don't miss the biggest digital sale of the year! Get your favorite game keys, software licenses, gift cards, and digital services at incredible prices.",
    cta: "Shop Now",
    href: "/deals/mega-sale",
    badge: "Limited Time",
    badgeColor: "bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:border-primary/30",
    background: "bg-primary/10",
    icon: Zap,
    stats: "2M+ Digital Items Sold"
  }

  const Icon = bannerData.icon

  return (
    <section className="py-6 sm:py-8 lg:py-12 overflow-hidden">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="relative">
          {/* Main Banner */}
          <Card className={`${bannerData.background} border-border/30 overflow-hidden transition-all duration-500 shadow-lg hover:shadow-xl rounded-lg`}>
            <CardContent className="p-4 sm:p-6 lg:p-8 xl:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
                {/* Content */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <Badge className={`${bannerData.badgeColor} text-xs px-2 sm:px-3 py-1 font-medium w-fit rounded-[4px]`}>
                      {bannerData.badge}
                    </Badge>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="font-medium">{bannerData.stats}</span>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground leading-tight">
                      {bannerData.title}
                    </h2>
                    <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-primary">
                      {bannerData.subtitle}
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base lg:text-lg leading-relaxed">
                      {bannerData.description}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button asChild className="h-8 sm:h-10 px-4 sm:px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base rounded-[4px]">
                      <Link href={bannerData.href}>
                        {bannerData.cta}
                        <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                      </Link>
                    </Button>
                      <Button variant="outline" className="h-8 sm:h-10 px-4 sm:px-6 border-border/50 hover:border-border hover:bg-muted/50 transition-all duration-300 text-sm sm:text-base rounded-[4px]">
                        <Link href={bannerData.href}>
                          <span className="ml-2">Learn More</span>
                        </Link>
                    </Button>
                  </div>
                </div>

                {/* Visual */}
                <div className="relative">
                  <div className="w-full h-48 sm:h-64 lg:h-80 xl:h-96 bg-primary/20 rounded-xl sm:rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <div className="relative z-10 text-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-primary/20 rounded-full flex items-center justify-center shadow-lg">
                        <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                      </div>
                      <div className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary/30">
                        {bannerData.id}
                      </div>
                    </div>
                    
                    {/* Floating Elements */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-4 h-4 sm:w-6 sm:h-6 bg-primary/10 rounded-full animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 right-6 sm:right-8 w-3 h-3 sm:w-4 sm:h-4 bg-primary/10 rounded-full animate-pulse delay-500"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
            {[
              { icon: Users, label: "Active Users", value: "2M+" },
              { icon: Award, label: "Products", value: "50K+" },
              { icon: Shield, label: "Secure", value: "100%" },
              { icon: TrendingUp, label: "Growth", value: "25%" }
            ].map((stat, index) => {
              const StatIcon = stat.icon
              return (
                <Card key={index} className="p-3 sm:p-4 bg-background/80 backdrop-blur-sm border-border/30 hover:border-border/60 transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-lg">
                  <CardContent className="p-0 text-center">
                    <StatIcon className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2 text-primary" />
                    <div className="text-base sm:text-lg font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}