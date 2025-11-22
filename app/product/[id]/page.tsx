import { MultivendorProductPage } from "@/components/multivendor-product-page"
import { Footer } from "@/components/footer"

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <MultivendorProductPage productId={id} />
      </main>
      <Footer />
    </div>
  )
}