import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProducts } from "@/components/featured-products"
import { PromotionalBanner } from "@/components/promotional-banner"
import { ProductCategories } from "@/components/product-categories"
import { BestDeals } from "@/components/best-deals"
import { TrendyProducts } from "@/components/trendy-products"
import { CategoryTabs } from "@/components/category-tabs"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ProductCategories />
        <BestDeals />
        <CategoryTabs />
        <FeaturedProducts />
      </main>
      <Footer />
    </div>
  )
}
