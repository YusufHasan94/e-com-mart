"use client"

import { useState } from "react"
import { apiService } from "@/lib/api-service"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const res = await apiService.forgotPassword(email)
      if (res.success) {
        setSent(true)
      } else {
        toast({ title: "Error", description: res.error || "Failed to send reset email.", variant: "destructive" })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Card className="p-4">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Forgot password</CardTitle>
            <CardDescription className="text-center">
              {sent
                ? "Check your inbox for a password reset link."
                : "Enter your email and we'll send you a reset link."}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {sent ? (
              <div className="flex flex-col items-center gap-4 py-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
                <p className="text-sm text-muted-foreground text-center">
                  A password reset link has been sent to <span className="font-semibold">{email}</span>. Please check your inbox (and spam folder).
                </p>
                <Button asChild variant="outline" className="w-full mt-2">
                  <Link href="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                  </Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…</> : "Send Reset Link"}
                </Button>
                <div className="text-center">
                  <Link href="/login" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                    <ArrowLeft className="h-3 w-3" /> Back to Login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
