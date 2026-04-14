"use client"

import { useEffect, useState } from "react"
import { apiService } from "@/lib/api-service"
import { Footer } from "@/components/footer"
import { Loader2 } from "lucide-react"

const fallbackContent = `<h2>Privacy Policy</h2>
<p>Last updated: March 2026</p>
<p>This Privacy Policy describes how GameHub collects, uses, and protects your personal information when you use our platform.</p>
<h3>Information We Collect</h3>
<ul>
  <li>Account information (name, email, password)</li>
  <li>Purchase history and transaction data</li>
  <li>Device and usage information</li>
</ul>
<h3>How We Use Your Data</h3>
<ul>
  <li>To process your orders and deliver digital products</li>
  <li>To send important account and order notifications</li>
  <li>To improve our platform and services</li>
  <li>To prevent fraud and maintain security</li>
</ul>
<h3>Data Protection</h3>
<p>We employ industry-standard security measures to protect your data. Payments are processed by certified payment processors and we never store full card details.</p>
<h3>Contact</h3>
<p>For privacy concerns, contact us at privacy@gamehub.com</p>`

export default function PrivacyPolicyPage() {
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiService.getStaticPage("privacy-policy").then((res) => {
      if (res.success && res.data?.content) setContent(res.data.content)
      setLoading(false)
    })
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <section className="bg-gradient-to-b from-primary/10 to-background py-20 px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Your privacy matters to us.</p>
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
