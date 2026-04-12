"use client"

import { useEffect, useState } from "react"
import { apiService } from "@/lib/api-service"
import { Footer } from "@/components/footer"
import { Loader2 } from "lucide-react"

const fallbackContent = `<h2>Terms & Conditions</h2>
<p>Last updated: March 2026</p>
<p>By using GameHub, you agree to these terms and conditions.</p>
<h3>Account & Eligibility</h3>
<ul>
  <li>You must be 18+ or have parental consent to use GameHub.</li>
  <li>You are responsible for maintaining the security of your account.</li>
  <li>You agree not to misuse the platform or engage in fraudulent activity.</li>
</ul>
<h3>Purchases & Refunds</h3>
<ul>
  <li>All digital product sales are subject to our refund policy.</li>
  <li>Keys once revealed are generally non-refundable unless proven invalid.</li>
  <li>Disputes must be raised within 7 days of purchase.</li>
</ul>
<h3>Seller Responsibilities</h3>
<ul>
  <li>Sellers must provide genuine, working license keys.</li>
  <li>Sellers are responsible for accurate product descriptions and stock levels.</li>
  <li>GameHub reserves the right to suspend accounts that violate seller policies.</li>
</ul>
<h3>Limitation of Liability</h3>
<p>GameHub is not liable for losses exceeding the purchase price of the product in question.</p>`

export default function TermsPage() {
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiService.getStaticPage("terms-conditions").then((res) => {
      if (res.success && res.data?.content) setContent(res.data.content)
      setLoading(false)
    })
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <section className="bg-gradient-to-b from-primary/10 to-background py-20 px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-muted-foreground">Please read these terms carefully before using GameHub.</p>
        </section>
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
              <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content || fallbackContent }} />
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
