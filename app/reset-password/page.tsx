"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { apiService } from "@/lib/api-service"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react"
import Link from "next/link"

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  // const token = searchParams.get("token") || ""
  // const email = searchParams.get("email") || ""

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTY0YjE4ZGE4YjY0YjQ5YjQ5YjQ5YjEiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQxMzQ0NzY2LCJleHAiOjE3NDE0MzExNjZ9.0l892Q86-12345678901234567890123456789012"
  const requestedEmail = "hasan@yopmail.com"


  const [email, setEmail] = useState(requestedEmail)
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      toast({ title: "Passwords do not match", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const res = await apiService.resetPassword({ email, token, password, password_confirmation: confirm })
      if (res.success) {
        setDone(true)
        setTimeout(() => router.push("/login"), 2500)
      } else {
        toast({ title: "Error", description: res.error || "Failed to reset password.", variant: "destructive" })
      }
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Invalid or expired reset link. Please{" "}
        <Link href="/forgot-password" className="text-primary hover:underline">request a new one</Link>.
      </div>
    )
  }

  return done ? (
    <div className="flex flex-col items-center gap-4 py-4">
      <CheckCircle2 className="h-16 w-16 text-green-500" />
      <p className="text-sm text-muted-foreground text-center">Password reset successfully! Redirecting to login…</p>
    </div>
  ) : (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={true}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPw ? "text" : "password"}
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="pr-10"
          />
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPw(!showPw)}>
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirm"
            type={showConfirmPw ? "text" : "password"}
            placeholder="Repeat new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowConfirmPw(!showConfirmPw)}>
            {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting…</> : "Reset Password"}
      </Button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Card className="p-4">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">Enter your new password below.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Suspense fallback={<div className="py-8 text-center text-muted-foreground">Loading…</div>}>
              <ResetPasswordForm />
            </Suspense>
            <div className="mt-4 text-center">
              <Link href="/login" className="text-sm text-primary hover:underline">Back to Login</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
