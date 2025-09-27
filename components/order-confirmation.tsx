"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Download, Mail } from "lucide-react"
import Link from "next/link"

interface OrderConfirmationProps {
  orderId: string
}

export function OrderConfirmation({ orderId }: OrderConfirmationProps) {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-600" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-green-600">Order Confirmed!</h1>
        <p className="text-muted-foreground">Thank you for your purchase. Your order has been successfully placed.</p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Order Number</p>
            <p className="font-mono font-bold text-lg">{orderId}</p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-green-600 font-medium">Processing</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Delivery:</span>
              <span>Instant (Digital)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Download Games
        </Button>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Mail className="h-4 w-4" />
          Email Receipt
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">A confirmation email has been sent to your email address.</p>
        <div className="flex justify-center gap-4 text-sm">
          <Link href="/account" className="text-primary hover:underline">
            View Order History
          </Link>
          <Link href="/" className="text-primary hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
