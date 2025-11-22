import { Footer } from "@/components/footer"
import { CartPage } from "@/components/cart-page"

export default function Cart() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <CartPage />
      </main>
      <Footer />
    </div>
  )
}
