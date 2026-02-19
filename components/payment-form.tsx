"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { CreditCard, Smartphone, Wallet, ArrowRight, Loader2, ArrowLeft, ShieldCheck } from "lucide-react"
import { apiService, ApiPaymentMethod } from "@/lib/api-service"
import { useAuth } from "@/contexts/auth-context"

interface PaymentFormProps {
  onSubmit: (data: any) => void
  selectedCountry?: string
  onBack?: () => void
  clientSecret?: string
}

// ─── Inner form rendered inside <Elements> when Stripe is selected ───────────
function StripeCardForm({
  onSubmit,
  onBack,
  paymentMethod,
}: {
  onSubmit: (data: any) => void
  onBack?: () => void
  paymentMethod: string
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsProcessing(true)
    setErrorMessage("")

    // Confirm the payment with Stripe – this tokenises card details
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    })

    if (error) {
      setErrorMessage(error.message || "Payment failed. Please try again.")
      setIsProcessing(false)
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSubmit({
        paymentMethod,
        stripePaymentIntentId: paymentIntent.id,
        stripeStatus: paymentIntent.status,
      })
    } else {
      // For test keys, still allow progression with payment intent ID
      onSubmit({
        paymentMethod,
        stripePaymentIntentId: paymentIntent?.id,
        stripeStatus: paymentIntent?.status,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label className="text-sm font-medium">Card Details</Label>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <PaymentElement
            options={{
              layout: "tabs",
              defaultValues: {
                billingDetails: { address: { country: "US" } },
              },
            }}
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
          <span>Your payment is secured and encrypted by Stripe</span>
        </div>
        {errorMessage && (
          <p className="text-sm text-red-500 font-medium">{errorMessage}</p>
        )}
      </div>

      <div className="flex gap-4">
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack} className="flex-1 bg-transparent" disabled={isProcessing}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
        <Button type="submit" className="flex-1" disabled={!stripe || !elements || isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Continue to Review
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

// ─── Non-Stripe fallback form (PayPal, wallets, etc.) ───────────────────────
function FallbackPaymentForm({
  paymentMethod,
  methodName,
  onSubmit,
  onBack,
}: {
  paymentMethod: string
  methodName: string
  onSubmit: (data: any) => void
  onBack?: () => void
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ paymentMethod })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
        You selected <span className="font-semibold text-foreground">{methodName}</span>. You will be redirected to complete your payment after placing the order.
      </div>
      <div className="flex gap-4">
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack} className="flex-1 bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
        <Button type="submit" className="flex-1">
          Continue to Review
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}

// ─── Main PaymentForm component ───────────────────────────────────────────────
export function PaymentForm({ onSubmit, selectedCountry, onBack, clientSecret }: PaymentFormProps) {
  const { token } = useAuth()
  const [paymentMethod, setPaymentMethod] = useState("")
  const [paymentMethods, setPaymentMethods] = useState<ApiPaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      if (token) {
        setIsLoading(true)
        const response = await apiService.getPaymentMethods(token)
        if (response.success && response.data) {
          const filtered = response.data.filter((m: any) => {
            const isActive = m.is_active !== false
            const countryMatch = !m.country || m.country === selectedCountry
            return isActive && countryMatch
          })
          setPaymentMethods(filtered)
          if (filtered.length > 0) setPaymentMethod(filtered[0].code)
        }
        setIsLoading(false)
      }
    }
    fetchPaymentMethods()
  }, [token, selectedCountry])

  const isStripeMethod =
    paymentMethod.toLowerCase() === "card" ||
    paymentMethod.toLowerCase() === "stripe" ||
    paymentMethod.toLowerCase() === "credit_card"

  const selectedMethodObj = paymentMethods.find((m) => m.code === paymentMethod)

  if (isLoading) {
    return <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-6">
      {/* Payment method selector */}
      <div className="space-y-4">
        <Label>Payment Method</Label>
        {paymentMethods.length === 0 ? (
          // If no API methods available, show Stripe card as the default option
          <div>
            <Card className="ring-2 ring-primary">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span className="font-medium">Credit / Debit Card</span>
                  <span className="ml-auto text-xs text-muted-foreground">Secured by Stripe</span>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <Card key={method.code} className={paymentMethod === method.code ? "ring-2 ring-primary" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value={method.code} id={method.code} />
                      {method.code.toLowerCase().includes("card") || method.code.toLowerCase().includes("stripe")
                        ? <CreditCard className="h-5 w-5" />
                        : method.code.toLowerCase().includes("paypal")
                          ? <Wallet className="h-5 w-5" />
                          : method.code.toLowerCase().includes("apple")
                            ? <Smartphone className="h-5 w-5" />
                            : <Wallet className="h-5 w-5" />}
                      <Label htmlFor={method.code} className="flex-1 cursor-pointer font-medium">
                        {method.name}
                      </Label>
                      {method.logo && <img src={method.logo} alt={method.name} className="h-6 object-contain" />}
                    </div>
                    {paymentMethod === method.code && method.description && (
                      <div className="mt-2 ml-8 text-sm text-muted-foreground">{method.description}</div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </RadioGroup>
        )}
      </div>

      {/* Stripe card form or fallback */}
      {isStripeMethod && clientSecret ? (
        <StripeCardForm
          onSubmit={onSubmit}
          onBack={onBack}
          paymentMethod={paymentMethod}
        />
      ) : isStripeMethod && !clientSecret ? (
        // clientSecret not yet ready – show a spinner
        <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Preparing secure payment form…
        </div>
      ) : (
        <FallbackPaymentForm
          paymentMethod={paymentMethod}
          methodName={selectedMethodObj?.name || paymentMethod}
          onSubmit={onSubmit}
          onBack={onBack}
        />
      )}
    </div>
  )
}
