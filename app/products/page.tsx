import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCatalog } from "@/components/product-catalog"

export default function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ProductCatalog />
      </main>
      <Footer />
    </div>
  )
}
