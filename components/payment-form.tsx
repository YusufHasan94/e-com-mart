"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { CreditCard, Smartphone, Wallet, ArrowRight, Loader2 } from "lucide-react"
import { apiService, ApiPaymentMethod } from "@/lib/api-service"
import { useAuth } from "@/contexts/auth-context"

interface PaymentFormProps {
  onSubmit: (data: any) => void
  selectedCountry?: string
}

export function PaymentForm({ onSubmit, selectedCountry }: PaymentFormProps) {
  const { token } = useAuth()
  const [paymentMethod, setPaymentMethod] = useState("")
  const [paymentMethods, setPaymentMethods] = useState<ApiPaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      if (token) {
        setIsLoading(true)
        const response = await apiService.getPaymentMethods(token)
        if (response.success && response.data) {
          // Filter methods that are active (or don't have is_active property)
          // Also filter by selected country if applicable
          const filtered = response.data.filter((m: any) => {
            const isActive = m.is_active !== false // True if undefined or true
            const countryMatch = !m.country || m.country === selectedCountry
            return isActive && countryMatch
          })

          setPaymentMethods(filtered)

          if (filtered.length > 0) {
            setPaymentMethod(filtered[0].code)
          }
        }
        setIsLoading(false)
      }
    }
    fetchPaymentMethods()
  }, [token, selectedCountry])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ ...formData, paymentMethod })
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Label>Payment Method</Label>
        {paymentMethods.length === 0 ? (
          <p className="text-muted-foreground italic">No payment methods available for {selectedCountry || "your region"}.</p>
        ) : (
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <Card key={method.code} className={paymentMethod === method.code ? "ring-2 ring-primary" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value={method.code} id={method.code} />
                      {/* Placeholder icons based on code */}
                      {method.code.toLowerCase().includes('card') || method.code.toLowerCase().includes('stripe') ? <CreditCard className="h-5 w-5" /> :
                        method.code.toLowerCase().includes('paypal') ? <Wallet className="h-5 w-5" /> :
                          method.code.toLowerCase().includes('apple') ? <Smartphone className="h-5 w-5" /> :
                            <Wallet className="h-5 w-5" />}
                      <Label htmlFor={method.code} className="flex-1 cursor-pointer font-medium">
                        {method.name}
                      </Label>
                      {method.logo && <img src={method.logo} alt={method.name} className="h-6 object-contain" />}
                    </div>
                    {paymentMethod === method.code && method.description && (
                      <div className="mt-2 ml-8 text-sm text-muted-foreground">
                        {method.description}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </RadioGroup>
        )}
      </div>

      {/* Show card form only if a card-like method is selected */}
      {(paymentMethod.toLowerCase() === "card" || paymentMethod.toLowerCase() === "stripe" || paymentMethod.toLowerCase() === "credit_card") && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={(e) => handleChange("cardNumber", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardName">Cardholder Name</Label>
            <Input
              id="cardName"
              placeholder="John Doe"
              value={formData.cardName}
              onChange={(e) => handleChange("cardName", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={(e) => handleChange("expiryDate", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={formData.cvv}
                onChange={(e) => handleChange("cvv", e.target.value)}
                required
              />
            </div>
          </div>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={!paymentMethod}>
        Continue to Review
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  )
}
