"use client"

import { useEffect, useState } from "react"
import { apiService } from "@/lib/api-service"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Loader2, Search, ChevronDown, ChevronUp } from "lucide-react"

const fallbackFaqs = [
  {
    id: "1", category: "Orders",
    question: "How do I receive my game key?",
    answer: "After successful payment, your license key is delivered instantly to your account under 'My Keys'. You can also access it from your order details page."
  },
  {
    id: "2", category: "Orders",
    question: "What if my key doesn't work?",
    answer: "If a key is invalid, you can report it directly from the key details page within 7 days of purchase. Our team will investigate and issue a replacement or refund."
  },
  {
    id: "3", category: "Payments",
    question: "What payment methods are accepted?",
    answer: "We accept credit/debit cards via Stripe, PayPal, Cryptomus (crypto), and GameHub Wallet balance."
  },
  {
    id: "4", category: "Payments",
    question: "Is my payment information secure?",
    answer: "Yes. We use industry-standard encryption. Payments are processed by certified providers and we never store full card numbers."
  },
  {
    id: "5", category: "Account",
    question: "How do I reset my password?",
    answer: "Go to the Login page and click 'Forgot Password'. Enter your email and we'll send you a reset link."
  },
  {
    id: "6", category: "Sellers",
    question: "How do I become a seller?",
    answer: "Go to your Account Dashboard and click 'Become a Seller'. Fill in the application form and our team will review it."
  },
]

export default function FaqPage() {
  const [faqs, setFaqs] = useState<any[]>(fallbackFaqs)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    apiService.getFaqData().then((res) => {
      if (res.success && res.data) {
        const apiData = Array.isArray(res.data) ? res.data : res.data.faqs || res.data.data || []
        if (apiData.length > 0) setFaqs(apiData)
      }
      setLoading(false)
    })
  }, [])

  const categories = Array.from(new Set(faqs.map(f => f.category || "General")))
  const filtered = faqs.filter(f =>
    search === "" ||
    f.question?.toLowerCase().includes(search.toLowerCase()) ||
    f.answer?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <section className="bg-gradient-to-b from-primary/10 to-background py-20 px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground mb-8">Find answers to common questions about GameHub.</p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search FAQs…"
              className="pl-10 h-12 text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
              <div className="space-y-8">
                {(search ? ["Search Results"] : categories).map(category => {
                  const items = search
                    ? filtered
                    : filtered.filter(f => (f.category || "General") === category)
                  if (items.length === 0) return null
                  return (
                    <div key={category}>
                      <h2 className="text-xl font-semibold mb-4 text-primary">{category}</h2>
                      <div className="space-y-2">
                        {items.map((faq: any) => (
                          <div key={faq.id || faq.question} className="border border-border rounded-lg overflow-hidden">
                            <button
                              className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                              onClick={() => setOpenId(openId === (faq.id || faq.question) ? null : (faq.id || faq.question))}
                            >
                              <span className="font-medium pr-4">{faq.question}</span>
                              {openId === (faq.id || faq.question) ? (
                                <ChevronUp className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                              )}
                            </button>
                            {openId === (faq.id || faq.question) && (
                              <div className="px-4 pb-4 text-muted-foreground border-t border-border pt-3">
                                {faq.answer}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
                {filtered.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    No FAQs matching "<strong>{search}</strong>". Try different keywords or <a href="/contact" className="text-primary hover:underline">contact us</a>.
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
