import { Card, CardContent } from "@/components/ui/card"
import { Gamepad2, Monitor, Gift, Smartphone, Headphones, Keyboard } from "lucide-react"

const categories = [
  {
    icon: Gamepad2,
    title: "PC Games",
    description: "Latest releases and classics",
    count: "15,000+",
  },
  {
    icon: Monitor,
    title: "Software",
    description: "Professional tools & utilities",
    count: "5,000+",
  },
  {
    icon: Gift,
    title: "Gift Cards",
    description: "Steam, PlayStation, Xbox",
    count: "50+",
  },
  {
    icon: Smartphone,
    title: "Mobile Games",
    description: "iOS & Android premium games",
    count: "2,000+",
  },
  {
    icon: Headphones,
    title: "Gaming Gear",
    description: "Accessories & peripherals",
    count: "1,500+",
  },
  {
    icon: Keyboard,
    title: "Hardware",
    description: "Gaming keyboards & mice",
    count: "800+",
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">{category.description}</p>
                      <p className="text-primary font-medium text-sm">{category.count} items</p>
                    </div>
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
