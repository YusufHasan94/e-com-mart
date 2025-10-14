import { HeroSection } from "./hero-section"
import { ProductCategories } from "./product-categories"

export function HeroCategoriesWrapper() {
  return (
    <section className="relative overflow-hidden bg-gradient-muted">
      {/* Single background image covering both sections */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url(/epic-gaming-scene-with-futuristic-elements.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.1
        }}
      />
      
      {/* Enhanced gradient overlay from bottom (darker) to top (lighter) for professional look */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050C11] via-[#050C11]/10 to-transparent" />
      
      {/* Smooth melting gradient that extends beyond section boundary */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-black/15 to-[#050C11]" />
      
      {/* Content with proper z-index */}
      <div className="relative z-10">
        <HeroSection />
        <ProductCategories />
      </div>
    </section>
  )
}
