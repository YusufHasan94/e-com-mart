import { Card, CardContent } from "@/components/ui/card"
import { Gamepad2, Monitor, Gift, Smartphone, Headphones, Keyboard, Cpu, Zap, Music, Camera, Shield, Star } from "lucide-react"

const categories = [
  {
    icon: Gamepad2,
    title: "PC Games",
    description: "Latest releases and classics",
    count: "15,000+",
    backgroundImage: "/epic-gaming-scene-with-futuristic-elements.jpg",
  },
  {
    icon: Monitor,
    title: "Software",
    description: "Professional tools & utilities",
    count: "5,000+",
    backgroundImage: "/office-productivity-software.jpg",
  },
  {
    icon: Gift,
    title: "Gift Cards",
    description: "Steam, PlayStation, Xbox",
    count: "50+",
    backgroundImage: "/steam-gift-card-gaming.jpg",
  },
  {
    icon: Smartphone,
    title: "Mobile Games",
    description: "iOS & Android premium games",
    count: "2,000+",
    backgroundImage: "/fifa-24-soccer-game.jpg",
  }
]

export function ProductCategories() {
  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        
        {/* Static Grid Layout */}
        <div className="grid grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 relative overflow-hidden bg-card/50 backdrop-blur-sm hover:bg-card/80 h-[125px]"
              >
                <div 
                  className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                  style={{
                    backgroundImage: `url(${category.backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                />
                
                <CardContent className="p-4 relative z-10 h-full flex items-center space-x-4">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-1 flex-1">
                    <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">
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
