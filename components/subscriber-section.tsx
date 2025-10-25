"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Bell, Gift, Star, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function SubscriberSection() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail("")
      // Reset after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  const benefits = [
    {
      icon: Bell,
      title: "Exclusive Deals",
      description: "Get early access to flash sales and special offers"
    },
    {
      icon: Gift,
      title: "Free Gifts",
      description: "Receive free games and gift cards on special occasions"
    },
    {
      icon: Star,
      title: "VIP Support",
      description: "Priority customer support and faster response times"
    }
  ]

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-[1440px] mx-auto text-center">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Mail className="h-3 w-3 mr-1" />
              Newsletter
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Stay Updated with the Latest
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
              Subscribe to our newsletter and never miss out on exclusive deals, new releases, and special offers from your favorite gaming platforms.
            </p>
          </div>

          {/* Subscription Form */}
          <Card className="mb-8 sm:mb-12 p-6 sm:p-8 bg-background/80 backdrop-blur-sm border-border/80 shadow-xl rounded-lg">
            <CardContent className="p-0">
              {!isSubscribed ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Join Our Community</h3>
                    <p className="text-sm text-muted-foreground">Get exclusive access to deals and updates</p>
                  </div>
                  
                  <form onSubmit={handleSubscribe} className="space-y-4 max-w-lg mx-auto">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 pl-10 bg-background/70 border-border/50 focus:border-primary shadow-sm rounded-lg"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
                    >
                      Subscribe Now
                    </Button>
                  </form>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    By subscribing, you agree to our privacy policy. Unsubscribe anytime.
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3 text-green-600 dark:text-green-400 py-8">
                  <CheckCircle className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-semibold text-lg">Successfully subscribed!</div>
                    <div className="text-sm text-muted-foreground">Welcome to our community</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <Card key={index} className="p-4 sm:p-6 bg-background/80 backdrop-blur-sm border-border/30 hover:border-border/60 transition-all duration-300 hover:shadow-lg hover:scale-105 group rounded-lg">
                  <CardContent className="p-0 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <Icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="font-semibold text-base sm:text-lg text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base group-hover:text-foreground transition-colors duration-300">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-lg border border-border/30 hover:border-border/60 transition-all duration-300 hover:shadow-lg hover:scale-105">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">50K+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Subscribers</div>
            </div>
            <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-lg border border-border/30 hover:border-border/60 transition-all duration-300 hover:shadow-lg hover:scale-105">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">95%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Satisfaction</div>
            </div>
            <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-lg border border-border/30 hover:border-border/60 transition-all duration-300 hover:shadow-lg hover:scale-105">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">24/7</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Support</div>
            </div>
            <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-lg border border-border/30 hover:border-border/60 transition-all duration-300 hover:shadow-lg hover:scale-105">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">100%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Secure</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
