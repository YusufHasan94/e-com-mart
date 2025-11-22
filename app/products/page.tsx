import { Suspense } from "react"
import { Footer } from "@/components/footer"
import { ProductCatalog } from "@/components/product-catalog"

export default function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <main className="flex-1">
        <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
          <ProductCatalog />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
