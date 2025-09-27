"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { CreditCard, Smartphone, Wallet, ArrowRight } from "lucide-react"

interface PaymentFormProps {
  onSubmit: (data: any) => void
}

export function PaymentForm({ onSubmit }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ ...formData, paymentMethod })
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Label>Payment Method</Label>
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
          <div className="space-y-3">
            <Card className={paymentMethod === "card" ? "ring-2 ring-primary" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="card" id="card" />
                  <CreditCard className="h-5 w-5" />
                  <Label htmlFor="card" className="flex-1 cursor-pointer">
                    Credit/Debit Card
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card className={paymentMethod === "paypal" ? "ring-2 ring-primary" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Wallet className="h-5 w-5" />
                  <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                    PayPal
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card className={paymentMethod === "apple" ? "ring-2 ring-primary" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="apple" id="apple" />
                  <Smartphone className="h-5 w-5" />
                  <Label htmlFor="apple" className="flex-1 cursor-pointer">
                    Apple Pay
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </RadioGroup>
      </div>

      {paymentMethod === "card" && (
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

      <Button type="submit" className="w-full">
        Continue to Review
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  )
}
