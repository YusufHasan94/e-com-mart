"use client"

import { useCart } from "@/contexts/cart-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface OrderSummaryProps {
  taxAmount?: number
}

export function OrderSummary({ taxAmount = 0 }: OrderSummaryProps) {
  const { state } = useCart()

  const subtotal = state.total
  const shipping = subtotal > 50 ? 0 : 9.99
  const total = subtotal + shipping + taxAmount

  return (
    <Card className="sticky top-4">
      <CardHeader className="p-3">
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 p-3 pt-0">
        <div className="space-y-3">
          {state.items.map((item) => (
            <div key={`${item.id}-${Math.random()}`} className="flex items-center gap-3">
              <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-12 h-12 object-cover rounded" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.title}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {item.platform}
                  </Badge>
                </div>
              </div>
              <p className="font-medium text-sm">${item.price}</p>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal ({state.itemCount} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${taxAmount.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {shipping === 0 && (
          <div className="text-xs text-green-600 text-center">🎉 Free shipping on orders over $50!</div>
        )}
      </CardContent>
    </Card>
  )
}
