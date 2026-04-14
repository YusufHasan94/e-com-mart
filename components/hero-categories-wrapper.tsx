import { HeroSection } from "./hero-section"
import { ProductCategories } from "./product-categories"

export function HeroCategoriesWrapper() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/20 to-secondary/30">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          backgroundImage: 'url(/epic-gaming-scene-with-futuristic-elements.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.05
        }}
      />

      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent pointer-events-none" />

      {/* Content with proper z-index */}
      <div className="relative z-10">
        <HeroSection />
        <ProductCategories />
      </div>
    </section>
  )
}
