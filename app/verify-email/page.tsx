"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { apiService } from "@/lib/api-service"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""
  const email = searchParams.get("email") || ""
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("No verification token found in the URL.")
      return
    }
    apiService.verifyEmail(token, email || undefined).then((res) => {
      if (res.success) {
        setStatus("success")
        setMessage(res.message || "Your email has been verified successfully!")
      } else {
        setStatus("error")
        setMessage(res.error || "Verification failed. The link may have expired.")
      }
    })
  }, [token, email])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {status === "loading" && (
          <>
            <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto" />
            <h1 className="text-2xl font-bold">Verifying your email…</h1>
            <p className="text-muted-foreground">Please wait a moment.</p>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            <h1 className="text-2xl font-bold">Email Verified!</h1>
            <p className="text-muted-foreground">{message}</p>
            <Button asChild>
              <Link href="/login">Continue to Login</Link>
            </Button>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="h-16 w-16 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold">Verification Failed</h1>
            <p className="text-muted-foreground">{message}</p>
            <div className="flex gap-3 justify-center">
              <Button asChild variant="outline">
                <Link href="/login">Back to Login</Link>
              </Button>
              <Button asChild>
                <Link href="/account">Resend Email</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
