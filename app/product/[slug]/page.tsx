import { MultivendorProductPage } from "@/components/multivendor-product-page"
import { Footer } from "@/components/footer"

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <MultivendorProductPage productSlug={slug} />
      </main>
      <Footer />
    </div>
  )
}