import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Star } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/20 to-secondary/30">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="text-sm font-medium">
                🎮 New Release
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-balance">
                Discover Your Next
                <span className="text-primary block">Gaming Adventure</span>
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-md">
                Get instant access to thousands of games, software, and digital content at unbeatable prices. Join
                millions of gamers worldwide.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8">
                Browse Games
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                <Play className="mr-2 h-5 w-5" />
                Watch Trailer
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Games Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">2M+</div>
                <div className="text-sm text-muted-foreground">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary">
                  4.8 <Star className="h-5 w-5 fill-current" />
                </div>
                <div className="text-sm text-muted-foreground">User Rating</div>
              </div>
            </div>
          </div>

          {/* Right Content - Featured Game */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-secondary to-muted shadow-2xl">
              <img src="/epic-gaming-scene-with-futuristic-elements.jpg" alt="Featured Game" className="w-full h-[400px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="space-y-2">
                  <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                  <h3 className="text-2xl font-bold text-white">Cyberpunk Adventure</h3>
                  <p className="text-white/80">Experience the future of gaming</p>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-white/60 line-through">$59.99</span>
                      <span className="text-2xl font-bold text-white">$39.99</span>
                      <Badge variant="destructive">-33%</Badge>
                    </div>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
