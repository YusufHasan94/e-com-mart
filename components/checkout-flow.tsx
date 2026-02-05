"use client"

import { useState, useEffect } from "react"
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
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { apiService } from "@/lib/api-service"
import { useToast } from "@/components/ui/use-toast"

export function CheckoutFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [shippingData, setShippingData] = useState<any>(null)
  const [paymentData, setPaymentData] = useState<any>(null)
  const [orderId, setOrderId] = useState("")
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [taxAmount, setTaxAmount] = useState(0)
  const { state, clearCart } = useCart()
  const { user, token } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/checkout")
      return
    }

    if (state.items.length === 0 && currentStep < 4) {
      router.push("/cart")
    }

    // Fetch user profile for pre-filling shipping form
    if (token) {
      apiService.getProfile(token).then((res) => {
        if (res.success && res.data) {
          const data = res.data.data || res.data
          setUserProfile({
            firstName: data.first_name || user?.name?.split(" ")[0] || "",
            lastName: data.last_name || user?.name?.split(" ").slice(1).join(" ") || "",
            email: data.email || user?.email || "",
            phone: data.mobile || data.phone || "",
            address: data.address_line1 || (typeof data.address === 'string' ? data.address : "") || "",
            city: data.city || "",
            state: data.state || "",
            zipCode: data.zip || data.postal_code || "",
            country: data.country || "US",
          })
        }
      })
    }
  }, [user, state.items.length, currentStep, router, token])

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleShippingSubmit = async (data: any) => {
    setShippingData(data)

    if (token) {
      try {
        const taxResponse = await apiService.calculateTax(token, {
          amount: state.total,
          country: data.country,
          state: data.state,
          city: data.city,
          seller_id: 1 // Default seller ID, or extract from items if available
        })

        if (taxResponse.success && taxResponse.data) {
          setTaxAmount(taxResponse.data.tax_total)
        }
      } catch (error) {
        console.error("Error calculating tax:", error)
      }
    }

    handleNextStep()
  }

  const handlePaymentSubmit = (data: any) => {
    setPaymentData(data)
    handleNextStep()
  }

  const [orderSummary, setOrderSummary] = useState<any>(null)

  const handlePlaceOrder = async () => {
    if (!user || !token || !shippingData || !paymentData) return

    setIsSubmitting(true)
    try {
      // Capture summary data before clearing cart
      const subtotal = state.total
      const shipping = subtotal > 50 ? 0 : 9.99
      const discount = state.discount || 0
      const total = subtotal + shipping + taxAmount - discount

      const summary = {
        items: [...state.items],
        subtotal: subtotal,
        discount: discount,
        total: total,
        taxAmount: taxAmount,
        shippingData: { ...shippingData },
        paymentData: { ...paymentData }
      }

      // Construct order payload
      const orderData: any = {
        currency: "USD", // TODO: Get from context/settings
        items: state.items.map(item => ({
          seller_offer_id: Number(item.id),
          quantity: 1
        })),
        billing: {
          name: `${shippingData.firstName} ${shippingData.lastName}`,
          email: shippingData.email,
          address: shippingData.address,
          city: shippingData.city,
          country: shippingData.country,
          phone: shippingData.phone,
          postcode: shippingData.zipCode
        },
        payment_method: paymentData.paymentMethod
      }

      // Add coupon code if applied
      if (state.couponCode) {
        orderData.coupon_code = state.couponCode
      }

      const response = await apiService.createOrder(token, orderData)

      if (response.success && response.data) {
        setOrderId(response.data.order_number)
        setOrderSummary(summary)
        clearCart() // This will also clear the coupon
        setCurrentStep(4) // Go to confirmation
        toast({
          title: "Order placed successfully!",
          description: `Order #${response.data.order_number} has been created.`,
        })
      } else {
        toast({
          title: "Order failed",
          description: response.error || "Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Order failed",
        description: "An unexpected error occurred.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return null
  }

  const steps = [
    { number: 1, title: "Shipping", description: "Delivery information" },
    { number: 2, title: "Payment", description: "Payment method" },
    { number: 3, title: "Review", description: "Order summary" },
    { number: 4, title: "Confirmation", description: "Order placed" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-[1440px] mx-auto px-5">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground">Complete your purchase securely</p>
        </div>

        <CheckoutSteps steps={steps} currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <Card>
                <CardHeader className="p-6">
                  <CardTitle className="text-xl sm:text-2xl">Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 sm:pt-0">
                  <ShippingForm
                    onSubmit={handleShippingSubmit}
                    initialData={userProfile}
                    onBack={() => router.push("/cart")}
                  />
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card>
                <CardHeader className="p-6 sm:p-8">
                  <CardTitle className="text-xl sm:text-2xl">Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 pt-0 sm:pt-0">
                  <PaymentForm
                    onSubmit={handlePaymentSubmit}
                    selectedCountry={shippingData?.country}
                    onBack={handlePrevStep}
                  />
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card>
                <CardHeader className="p-6 sm:p-8">
                  <CardTitle className="text-xl sm:text-2xl">Review Your Order</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6 sm:p-8 pt-0 sm:pt-0">
                  {/* Shipping Info */}
                  {shippingData && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">Shipping Address</h3>
                        <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>Edit</Button>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>
                          {shippingData.firstName} {shippingData.lastName}
                        </p>
                        <p>{shippingData.address}</p>
                        <p>
                          {shippingData.city}, {shippingData.state} {shippingData.zipCode}
                        </p>
                        <p>{shippingData.country}</p>
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Payment Info */}
                  {paymentData && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">Payment Method</h3>
                        <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)}>Edit</Button>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p className="capitalize">{paymentData.paymentMethod}</p>
                        {paymentData.cardNumber && (
                          <p>**** **** **** {paymentData.cardNumber.slice(-4)}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold mb-4">Order Items</h3>
                    <div className="space-y-3">
                      {state.items.map((item) => (
                        <div key={`${item.id}-${Math.random()}`} className="flex items-center gap-4">
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
                            <p className="font-medium">${item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Coupon Info */}
                  {state.couponCode && state.discount > 0 && (
                    <>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold">Coupon Applied</h3>
                        </div>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Code:</span>
                            <span className="font-mono font-semibold text-green-600 dark:text-green-400">{state.couponCode}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Discount:</span>
                            <span className="font-semibold text-green-600 dark:text-green-400">-${state.discount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <Separator />
                    </>
                  )}

                  <div className="flex gap-4 pt-4">
                    <Button variant="outline" onClick={handlePrevStep} className="flex-1 bg-transparent" disabled={isSubmitting}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button onClick={handlePlaceOrder} className="flex-1" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Place Order
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 4 && (
              <OrderConfirmation
                orderId={orderId}
                items={orderSummary?.items}
                shippingData={orderSummary?.shippingData}
                paymentData={orderSummary?.paymentData}
                subtotal={orderSummary?.subtotal}
                total={orderSummary?.total}
                discount={orderSummary?.discount}
                taxAmount={orderSummary?.taxAmount}
              />
            )}
          </div>

          {/* Order Summary Sidebar */}
          {currentStep < 4 && (
            <div className="lg:col-span-1">
              <OrderSummary taxAmount={taxAmount} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
