import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Zap } from "lucide-react"

export function PromotionalBanner() {
  return (
    <section className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-2">
            <Zap className="h-6 w-6" />
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Flash Sale
            </Badge>
            <Zap className="h-6 w-6" />
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold text-balance">Extra 25% Off Digital Products & Services</h2>

          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto text-pretty">
            Limited time offer! Get exclusive discounts on game keys, software licenses, gift cards, VPNs, and more digital services. Don't miss out on these incredible deals.
          </p>

          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Ends in 23:45:12</span>
            </div>
          </div>

          <Button size="lg" variant="secondary" className="text-lg px-8">
            Shop Now
          </Button>
        </div>
      </div>
    </section>
  )
}
