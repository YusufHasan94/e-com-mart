"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CheckoutSteps } from "@/components/checkout-steps"
import { ShippingForm } from "@/components/shipping-form"
import { PaymentForm } from "@/components/payment-form"
import { OrderSummary } from "@/components/order-summary"
import { OrderConfirmation } from "@/components/order-confirmation"
import { StripeProvider } from "@/components/stripe-provider"
import { ArrowLeft, ArrowRight, Loader2, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { apiService } from "@/lib/api-service"
import { useToast } from "@/components/ui/use-toast"

// ─── Helpers ─────────────────────────────────────────────────────────────────
const STRIPE_CODES = ["stripe", "card", "credit_card"]
const isStripeMethod = (m: string) => STRIPE_CODES.some((c) => m.toLowerCase().includes(c))
const isWalletMethod = (m: string) => m.toLowerCase() === "wallet"

export function CheckoutFlow() {
  // ── Step ──────────────────────────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(1)

  // ── Form data ─────────────────────────────────────────────────────────────
  const [shippingData, setShippingData] = useState<any>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
  const [userProfile, setUserProfile] = useState<any>(null)

  // ── Session (from createCheckoutSession) ──────────────────────────────────
  const [sessionUuid, setSessionUuid] = useState("")
  const [sessionSummary, setSessionSummary] = useState<any>(null) // totals from server

  // ── Stripe-specific ───────────────────────────────────────────────────────
  const [stripeClientSecret, setStripeClientSecret] = useState("")
  const [isFetchingPaySession, setIsFetchingPaySession] = useState(false)

  // ── Loading flags ─────────────────────────────────────────────────────────
  const [isValidating, setIsValidating] = useState(false)
  const [isCreatingSession, setIsCreatingSession] = useState(false)
  const [isPaying, setIsPaying] = useState(false)
  const [isPolling, setIsPolling] = useState(false)

  // ── Order (from polling result) ───────────────────────────────────────────
  const [orderId, setOrderId] = useState("")
  const [orderSummary, setOrderSummary] = useState<any>(null)

  // ── Polling timer ─────────────────────────────────────────────────────────
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const { state, clearCart } = useCart()
  const { user, token } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // ── Auth & empty-cart guard ────────────────────────────────────────────────
  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/checkout")
      return
    }
    if (state.items.length === 0 && currentStep < 4) {
      router.push("/cart")
    }
    if (token) {
      apiService.getProfile(token).then((res) => {
        if (res.success && res.data) {
          const data = res.data.data || res.data
          setUserProfile({
            firstName: data.first_name || user?.name?.split(" ")[0] || "",
            lastName: data.last_name || user?.name?.split(" ").slice(1).join(" ") || "",
            email: data.email || user?.email || "",
            phone: data.mobile || data.phone || "",
            address: data.address_line1 || (typeof data.address === "string" ? data.address : "") || "",
            city: data.city || "",
            state: data.state || "",
            zipCode: data.zip || data.postal_code || "",
            country: data.country || "US",
          })
        }
      })
    }
  }, [user, state.items.length, currentStep, router, token])

  // ── Pre-fetch Stripe client_secret when Step 2 is reached & Stripe is chosen ─
  useEffect(() => {
    if (
      currentStep === 2 &&
      isStripeMethod(selectedPaymentMethod) &&
      sessionUuid &&
      token &&
      !stripeClientSecret &&
      !isFetchingPaySession
    ) {
      setIsFetchingPaySession(true)
      apiService
        .payCheckoutSession(token, sessionUuid, { payment_method: selectedPaymentMethod })
        .then((res) => {
          if (res.success && res.data?.payment?.client_secret) {
            setStripeClientSecret(res.data.payment.client_secret)
          } else if (!res.success) {
            toast({
              title: "Could not prepare Stripe payment",
              description: res.error || "Please try again.",
              variant: "destructive",
            })
          }
        })
        .finally(() => setIsFetchingPaySession(false))
    }
  }, [currentStep, selectedPaymentMethod, sessionUuid, token]) // eslint-disable-line

  // When Stripe method changes reset the cached secret so a fresh pay session is fetched
  useEffect(() => {
    setStripeClientSecret("")
  }, [selectedPaymentMethod])

  // ── Cleanup polling on unmount ────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
    }
  }, [])

  const handleNextStep = () => { if (currentStep < 4) setCurrentStep(currentStep + 1) }
  const handlePrevStep = () => { if (currentStep > 1) setCurrentStep(currentStep - 1) }

  // ── Step 1 → Validate + Create Session ────────────────────────────────────
  const handleShippingSubmit = async (data: any) => {
    if (!token) return

    // 1. Validate cart (stock + prices)
    setIsValidating(true)
    try {
      const cartItems = state.items.map((item) => ({ seller_offer_id: Number(item.id), quantity: 1 }))
      const validation = await apiService.validateCart(token, cartItems)

      if (!validation.success) {
        toast({ title: "Cart validation failed", description: validation.error || "Please try again.", variant: "destructive" })
        return
      }

      const validatedItems: any[] = Array.isArray(validation.data) ? validation.data : []
      const problems: string[] = []
      validatedItems.forEach((v: any) => {
        if (!v.available) problems.push(`"${v.title || `Item #${v.seller_offer_id}`}" is out of stock`)
        else if (v.price_changed) problems.push(`"${v.title || `Item #${v.seller_offer_id}`}" price changed to $${v.current_price}`)
      })
      if (problems.length > 0) {
        toast({ title: "Cart has issues — please review", description: problems.join(" · "), variant: "destructive" })
        return
      }
    } catch (err) {
      console.error("Cart validation error:", err)
      // Non-blocking — proceed
    } finally {
      setIsValidating(false)
    }

    // 2. Create checkout session (server validates, locks in prices/stock for 30 min)
    setIsCreatingSession(true)
    try {
      const sessionResp = await apiService.createCheckoutSession(token, {
        items: state.items.map((item) => ({ seller_offer_id: Number(item.id), quantity: 1 })),
        billing: {
          name: `${data.firstName} ${data.lastName}`.trim(),
          email: data.email,
          phone: data.phone || "",
          address: data.address,
          city: data.city,
          state: data.state || "",
          country: data.country,
          postcode: data.zipCode || "",
        },
        currency: "USD",
        ...(state.couponCode ? { coupon_code: state.couponCode } : {}),
      })

      if (!sessionResp.success) {
        toast({ title: "Could not start checkout", description: sessionResp.error || "Please try again.", variant: "destructive" })
        return
      }

      setSessionUuid(sessionResp.data?.uuid || "")
      setSessionSummary(sessionResp.data) // includes totals.subtotal / .tax / .discount / .total
    } catch (err) {
      console.error("Session creation error:", err)
      toast({ title: "Error", description: "Could not create checkout session.", variant: "destructive" })
      return
    } finally {
      setIsCreatingSession(false)
    }

    setShippingData(data)
    handleNextStep() // → Step 2 (Payment)
  }

  // ── Step 2 → Payment form submit (Stripe confirmPayment done) ──────────────
  // For Stripe: received after stripe.confirmPayment() succeeds → go to polling screen (step 3)
  // For others (wallet / PayPal / Cryptomus / fallback): just advance to Review (step 3)
  const handlePaymentSubmit = (data: any) => {
    if (data.stripePaymentIntentId || data.stripeStatus) {
      // Stripe payment confirmed by card form — start polling immediately
      setIsPolling(true)
      startPolling(sessionUuid)
      setCurrentStep(3) // Step 3 will show the polling UI
    } else {
      // Non-Stripe: advance to Review step
      setCurrentStep(3)
    }
  }

  // ── Step 3 → "Confirm & Pay" for non-Stripe methods ──────────────────────
  const handleConfirmAndPay = async () => {
    if (!token || !sessionUuid) return
    setIsPaying(true)

    try {
      const isWallet = isWalletMethod(selectedPaymentMethod)
      const payResult = await apiService.payCheckoutSession(token, sessionUuid, {
        payment_method: selectedPaymentMethod,
        ...(isWallet ? { use_wallet: true } : {}),
      })

      if (!payResult.success) {
        toast({ title: "Payment failed", description: payResult.error || "Please try again.", variant: "destructive" })
        return
      }

      const payment = payResult.data?.payment

      if (payment?.approval_url) {
        // PayPal — open gateway in new tab
        window.open(payment.approval_url, "_blank", "noopener,noreferrer")
      } else if (payment?.payment_url) {
        // Cryptomus — open gateway in new tab
        window.open(payment.payment_url, "_blank", "noopener,noreferrer")
      }
      // For wallet: order is instant — poll will confirm immediately

      // Start polling regardless of gateway
      setIsPolling(true)
      startPolling(sessionUuid)
    } catch (err) {
      console.error("Payment initiation error:", err)
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" })
    } finally {
      setIsPaying(false)
    }
  }

  // ── Polling — GET /checkout/sessions/{uuid}/result every 2.5s ─────────────
  const startPolling = (uuid: string) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)

    let attempts = 0
    const MAX_ATTEMPTS = 24 // ~60 seconds

    pollIntervalRef.current = setInterval(async () => {
      attempts++
      try {
        const result = await apiService.getCheckoutResult(token!, uuid)

        if (result.success && result.data?.status === "completed") {
          clearInterval(pollIntervalRef.current!)
          pollIntervalRef.current = null
          setIsPolling(false)

          const order = result.data.order || result.data
          setOrderId(order?.order_number || order?.id || "")
          setOrderSummary({
            items: [...state.items],
            subtotal: sessionSummary?.totals?.subtotal ?? state.total,
            discount: sessionSummary?.totals?.discount ?? (state.discount || 0),
            total: sessionSummary?.totals?.total ?? state.total,
            taxAmount: sessionSummary?.totals?.tax ?? 0,
            shippingData: shippingData ? { ...shippingData } : null,
          })
          clearCart()
          setCurrentStep(4)
          toast({
            title: "Order placed!",
            description: `Order #${order?.order_number || order?.id} has been confirmed.`,
          })
        }
      } catch (e) {
        console.error("Poll error:", e)
      }

      if (attempts >= MAX_ATTEMPTS) {
        clearInterval(pollIntervalRef.current!)
        pollIntervalRef.current = null
        setIsPolling(false)
        toast({
          title: "Payment is still processing",
          description: "Check your email for order confirmation or visit your account orders.",
        })
      }
    }, 2500)
  }

  if (!user) return null

  const steps = [
    { number: 1, title: "Shipping", description: "Delivery information" },
    { number: 2, title: "Payment", description: "Payment method" },
    { number: 3, title: "Review", description: "Confirm & pay" },
    { number: 4, title: "Confirmation", description: "Order placed" },
  ]

  // Prefer server-calculated totals; fall back to cart state
  const subtotal = sessionSummary?.totals?.subtotal ?? state.total
  const discount = sessionSummary?.totals?.discount ?? (state.discount || 0)
  const tax = sessionSummary?.totals?.tax ?? 0
  const total = sessionSummary?.totals?.total ?? Math.max(0, state.total - discount + tax)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-[1440px] mx-auto px-5">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground">Complete your purchase securely</p>
        </div>

        <div className="flex justify-center">
          <CheckoutSteps steps={steps} currentStep={currentStep} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className={`${currentStep === 4 ? "lg:col-span-3" : "lg:col-span-2"}`}>

            {/* ── Step 1: Shipping ────────────────────────────────────────── */}
            {currentStep === 1 && (
              <Card>
                <CardHeader className="p-6">
                  <CardTitle className="text-xl sm:text-2xl">Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 sm:pt-0">
                  {(isValidating || isCreatingSession) ? (
                    <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-sm font-medium">
                        {isValidating ? "Validating your cart…" : "Securing your checkout session…"}
                      </p>
                    </div>
                  ) : (
                    <ShippingForm
                      onSubmit={handleShippingSubmit}
                      initialData={userProfile}
                      onBack={() => router.push("/cart")}
                    />
                  )}
                </CardContent>
              </Card>
            )}

            {/* ── Step 2: Payment method ───────────────────────────────────── */}
            {currentStep === 2 && (
              <Card>
                <CardHeader className="p-6 sm:p-8">
                  <CardTitle className="text-xl sm:text-2xl">Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 pt-0 sm:pt-0">
                  {isFetchingPaySession ? (
                    <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-sm font-medium">Preparing secure payment…</p>
                    </div>
                  ) : (
                    <StripeProvider clientSecret={stripeClientSecret}>
                      <PaymentForm
                        onSubmit={handlePaymentSubmit}
                        onMethodChange={setSelectedPaymentMethod}
                        selectedCountry={shippingData?.country}
                        onBack={handlePrevStep}
                        clientSecret={stripeClientSecret}
                        amount={total}
                        currency="USD"
                      />
                    </StripeProvider>
                  )}
                </CardContent>
              </Card>
            )}

            {/* ── Step 3: Review + Confirm & Pay (or Polling screen) ─────── */}
            {currentStep === 3 && (
              <Card>
                <CardHeader className="p-6 sm:p-8">
                  <CardTitle className="text-xl sm:text-2xl">
                    {isPolling ? "Processing Payment" : "Review Your Order"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6 sm:p-8 pt-0 sm:pt-0">

                  {/* ── Polling / waiting UI ─────────────────────────────── */}
                  {isPolling ? (
                    <div className="flex flex-col items-center gap-6 py-12 text-center">
                      <div className="relative h-24 w-24">
                        <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                        <Loader2 className="h-12 w-12 animate-spin text-primary absolute inset-0 m-auto" />
                      </div>
                      <div className="space-y-2">
                        <p className="font-semibold text-lg">Waiting for payment confirmation</p>
                        <p className="text-sm text-muted-foreground max-w-sm">
                          {isStripeMethod(selectedPaymentMethod)
                            ? "Verifying your payment with Stripe…"
                            : "Complete your payment in the opened tab. This page will update automatically once confirmed."}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Checking every few seconds…</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Shipping summary */}
                      {shippingData && (
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold">Shipping Address</h3>
                            <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>Edit</Button>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>{shippingData.firstName} {shippingData.lastName}</p>
                            <p>{shippingData.address}</p>
                            <p>{shippingData.city}{shippingData.state ? `, ${shippingData.state}` : ""} {shippingData.zipCode}</p>
                            <p>{shippingData.country}</p>
                          </div>
                        </div>
                      )}

                      <Separator />

                      {/* Payment method summary */}
                      {selectedPaymentMethod && (
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold">Payment Method</h3>
                            <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)}>Edit</Button>
                          </div>
                          <p className="text-sm text-muted-foreground capitalize">{selectedPaymentMethod}</p>
                        </div>
                      )}

                      <Separator />

                      {/* Order items */}
                      <div>
                        <h3 className="font-semibold mb-4">Order Items</h3>
                        <div className="space-y-3">
                          {state.items.map((item) => (
                            <div key={`${item.id}-review`} className="flex items-center gap-4">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.title}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium">{item.title}</h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Badge variant="outline">{item.platform}</Badge>
                                  <span>Qty: 1</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">${item.price.toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Totals (from session) */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between text-green-600 dark:text-green-400">
                            <span>Discount {state.couponCode && `(${state.couponCode})`}</span>
                            <span>−${discount.toFixed(2)}</span>
                          </div>
                        )}
                        {tax > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tax</span>
                            <span>${tax.toFixed(2)}</span>
                          </div>
                        )}
                        <Separator />
                        <div className="flex justify-between font-bold text-base">
                          <span>Total</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Coupon badge */}
                      {state.couponCode && discount > 0 && (
                        <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3 flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                          <span>
                            Coupon <strong>{state.couponCode}</strong> applied — saving ${discount.toFixed(2)}
                          </span>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex gap-4 pt-4">
                        <Button
                          variant="outline"
                          onClick={handlePrevStep}
                          className="flex-1 bg-transparent"
                          disabled={isPaying}
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back
                        </Button>
                        <Button
                          onClick={handleConfirmAndPay}
                          className="flex-1"
                          disabled={isPaying || isValidating}
                        >
                          {isPaying ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing…
                            </>
                          ) : (
                            <>
                              Confirm & Pay
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* ── Step 4: Confirmation ─────────────────────────────────────── */}
            {currentStep === 4 && (
              <OrderConfirmation
                orderId={orderId}
                items={orderSummary?.items}
                shippingData={orderSummary?.shippingData}
                paymentData={null}
                subtotal={orderSummary?.subtotal}
                total={orderSummary?.total}
                discount={orderSummary?.discount}
                taxAmount={orderSummary?.taxAmount}
              />
            )}
          </div>

          {/* Order summary sidebar */}
          {currentStep < 4 && (
            <div className="lg:col-span-1">
              <OrderSummary taxAmount={tax} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
