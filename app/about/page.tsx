"use client"

import { useEffect, useState } from "react"
import { apiService } from "@/lib/api-service"
import { Footer } from "@/components/footer"
import { Loader2, Users, Award, Globe, Zap } from "lucide-react"

const defaultContent = {
  title: "About GameHub",
  content: `<div class="prose prose-invert max-w-none">
    <p class="text-lg text-muted-foreground">GameHub is your premier destination for digital game keys, software licenses, and entertainment content at the best prices.</p>
    <h2>Our Mission</h2>
    <p>We connect buyers with trusted sellers from around the world, making digital content accessible and affordable for everyone.</p>
    <h2>Why Choose GameHub?</h2>
    <ul>
      <li>Thousands of verified sellers with millions of products</li>
      <li>Instant digital delivery of license keys</li>
      <li>Secure payments with buyer protection</li>
      <li>24/7 customer support</li>
    </ul>
  </div>`
}

export default function AboutPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiService.getStaticPage("about").then((res) => {
      if (res.success && res.data) setData(res.data)
      setLoading(false)
    })
  }, [])

  const stats = [
    { icon: Users, label: "Active Users", value: "500K+" },
    { icon: Award, label: "Verified Sellers", value: "10K+" },
    { icon: Globe, label: "Countries", value: "150+" },
    { icon: Zap, label: "Instant Delivery", value: "99.9%" },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        {/* Hero */}
        <section className="relative bg-gradient-to-b from-primary/10 to-background py-24 px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            {data?.title || "About GameHub"}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your trusted marketplace for digital game keys and software licenses.
          </p>
        </section>

        {/* Stats */}
        <section className="py-16 px-4 border-y border-border">
          <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold">{value}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: data?.content || defaultContent.content }}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
