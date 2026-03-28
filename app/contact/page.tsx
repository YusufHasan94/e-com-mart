"use client"

import { useState } from "react"
import { apiService } from "@/lib/api-service"
import { useToast } from "@/components/ui/use-toast"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mail, MessageSquare, Clock, CheckCircle2 } from "lucide-react"

export default function ContactPage() {
  const { toast } = useToast()
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await apiService.submitContactForm(form)
      if (res.success) {
        setSent(true)
      } else {
        toast({ title: "Error", description: res.error || "Failed to send message.", variant: "destructive" })
      }
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    { icon: Mail, label: "Email", value: "support@gamehub.com" },
    { icon: MessageSquare, label: "Live Chat", value: "Available in dashboard" },
    { icon: Clock, label: "Response Time", value: "Within 24 hours" },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <section className="bg-gradient-to-b from-primary/10 to-background py-20 px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground">We're here to help. Get in touch with our team.</p>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-6">Get In Touch</h2>
              {contactInfo.map(({ icon: Icon, label, value }) => (
                <Card key={label}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <Icon className="h-6 w-6 text-primary shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">{label}</p>
                      <p className="font-medium">{value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Form */}
            <div className="md:col-span-2">
              <Card className="p-4">
                <CardContent>
                  {sent ? (
                    <div className="flex flex-col items-center gap-4 py-8">
                      <CheckCircle2 className="h-16 w-16 text-green-500" />
                      <p className="text-center font-medium">Message sent! We'll get back to you within 24 hours.</p>
                      <Button variant="outline" onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }) }}>
                        Send Another
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" name="name" placeholder="Your name" value={form.name} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" name="subject" placeholder="How can we help?" value={form.subject} onChange={handleChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" name="message" placeholder="Describe your issue or question…" rows={5} value={form.message} onChange={handleChange} required />
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…</> : "Send Message"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
