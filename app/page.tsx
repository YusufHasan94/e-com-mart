import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroCategoriesWrapper } from "@/components/hero-categories-wrapper"
import { FeaturedProducts } from "@/components/featured-products"
import { PromotionalBanner } from "@/components/promotional-banner"
import { BestDeals } from "@/components/best-deals"
import { TrendyProducts } from "@/components/trendy-products"
import { CategoryTabs } from "@/components/category-tabs"
import { SubscriberSection } from "@/components/subscriber-section"
import { BannerSection } from "@/components/banner-section"
import { CategoryMarquee } from "@/components/category-marquee"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroCategoriesWrapper />
        <FeaturedProducts />
        <BannerSection />
        <CategoryTabs />
        <CategoryMarquee />
        <BestDeals />
        <SubscriberSection />
      </main>
      <Footer />
    </div>
  )
}
