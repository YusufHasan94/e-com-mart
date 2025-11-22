import { Footer } from "@/components/footer"
import { CheckoutFlow } from "@/components/checkout-flow"

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <CheckoutFlow />
      </main>
      <Footer />
    </div>
  )
}
