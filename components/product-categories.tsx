import { Card, CardContent } from "@/components/ui/card"
import { Gamepad2, Monitor, Gift, Smartphone, Headphones, Keyboard } from "lucide-react"

const categories = [
  {
    icon: Gamepad2,
    title: "PC Games",
    description: "Latest releases and classics",
    count: "15,000+",
    backgroundImage: "/epic-gaming-scene-with-futuristic-elements.jpg",
    contentImage: "/cyberpunk-futuristic-city-game.png",
  },
  {
    icon: Monitor,
    title: "Software",
    description: "Professional tools & utilities",
    count: "5,000+",
    backgroundImage: "/office-productivity-software.jpg",
    contentImage: "/adobe-photoshop-software.jpg",
  },
  {
    icon: Gift,
    title: "Gift Cards",
    description: "Steam, PlayStation, Xbox",
    count: "50+",
    backgroundImage: "/steam-gift-card-gaming.jpg",
    contentImage: "/steam-gift-card-gaming.jpg",
  },
  {
    icon: Smartphone,
    title: "Mobile Games",
    description: "iOS & Android premium games",
    count: "2,000+",
    backgroundImage: "/fifa-24-soccer-game.jpg",
    contentImage: "/fifa-soccer-game.jpg",
  },
  {
    icon: Headphones,
    title: "Gaming Gear",
    description: "Accessories & peripherals",
    count: "1,500+",
    backgroundImage: "/military-shooter.png",
    contentImage: "/gta-v-action-game-cover.jpg",
  },
  {
    icon: Keyboard,
    title: "Hardware",
    description: "Gaming keyboards & mice",
    count: "800+",
    backgroundImage: "/creative-design-software.jpg",
    contentImage: "/figma-design-collaboration-software.jpg",
  },
]

export function ProductCategories() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-balance">Browse by Category</h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Find exactly what you're looking for in our carefully curated categories
          </p>
        </div>

        {/* Marquee Container */}
        <div className="relative overflow-hidden">
          <div className="flex animate-marquee gap-6">
            {/* First set of cards */}
            {categories.map((category, index) => {
              const Icon = category.icon
              return (
                <Card
                  key={`first-${index}`}
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 flex-shrink-0 w-80 relative overflow-hidden hover:animate-glow"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${category.backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors backdrop-blur-sm">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors text-white">
                          {category.title}
                        </h3>
                        <p className="text-white/80 text-sm">{category.description}</p>
                        <p className="text-primary font-medium text-sm">{category.count} items</p>
                      </div>
                    </div>
                    
                    {/* Animated Content Image */}
                    <div className="absolute top-4 right-4 w-16 h-16 rounded-lg overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3 group-hover:animate-float">
                      <img 
                        src={category.contentImage} 
                        alt={category.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
            {/* Second set of cards for seamless loop */}
            {categories.map((category, index) => {
              const Icon = category.icon
              return (
                <Card
                  key={`second-${index}`}
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 flex-shrink-0 w-80 relative overflow-hidden hover:animate-glow"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${category.backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors backdrop-blur-sm">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors text-white">
                          {category.title}
                        </h3>
                        <p className="text-white/80 text-sm">{category.description}</p>
                        <p className="text-primary font-medium text-sm">{category.count} items</p>
                      </div>
                    </div>
                    
                    {/* Animated Content Image */}
                    <div className="absolute top-4 right-4 w-16 h-16 rounded-lg overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3 group-hover:animate-float">
                      <img 
                        src={category.contentImage} 
                        alt={category.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
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
