import { HeroSection } from "./hero-section"
import { ProductCategories } from "./product-categories"

export function HeroCategoriesWrapper() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/20 to-secondary/30">
      {/* Single background image covering both sections */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url(/epic-gaming-scene-with-futuristic-elements.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.05
        }}
      />
      
      {/* Enhanced gradient overlay from bottom (darker) to top (lighter) for professional look */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
      
      {/* Smooth melting gradient that extends beyond section boundary */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-background/15 to-background/60" />
      
      {/* Content with proper z-index */}
      <div className="relative z-10">
        <HeroSection />
        <ProductCategories />
      </div>
    </section>
  )
}
