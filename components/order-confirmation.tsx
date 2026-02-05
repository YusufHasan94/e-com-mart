"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

interface OrderConfirmationProps {
  orderId: string
  items?: any[]
  shippingData?: any
  paymentData?: any
  total?: number
  subtotal?: number
  discount?: number
  taxAmount?: number
}

export function OrderConfirmation({
  orderId,
  items = [],
  shippingData,
  paymentData,
  total = 0,
  subtotal = 0,
  discount = 0,
  taxAmount = 0
}: OrderConfirmationProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-12 text-foreground font-sans">
      {/* Thank You Section */}
      <section>
        <h1 className="text-4xl font-light mb-8">Thank You</h1>
      </section>

      {/* Downloads Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-light">Downloads</h2>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b">
                <th className="p-4 font-semibold text-sm">Product</th>
                <th className="p-4 font-semibold text-sm">Downloads remaining</th>
                <th className="p-4 font-semibold text-sm">Expires</th>
                <th className="p-4 font-semibold text-sm">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((item, idx) => (
                <tr key={idx} className="text-sm">
                  <td className="p-4">
                    <Link href={`/product/${item.productId || item.id}`} className="text-primary hover:underline">
                      {item.title}
                    </Link>
                  </td>
                  <td className="p-4">∞</td>
                  <td className="p-4">Never</td>
                  <td className="p-4">
                    <Button size="sm" className="bg-[#4a4a4f] hover:bg-[#3a3a3f] text-white rounded-none h-8 px-4 text-xs font-bold uppercase tracking-wider">
                      File {idx + 1}
                    </Button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr className="text-sm">
                  <td colSpan={4} className="p-4 text-center text-muted-foreground">No downloadable items found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Order Received Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-light">Order received</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border border-dashed border-muted-foreground/30 rounded-lg">
          <div className="space-y-1 border-r md:border-r pr-4 last:border-0">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold leading-tight">Order number:</p>
            <p className="text-sm font-bold">{orderId}</p>
          </div>
          <div className="space-y-1 border-r md:border-r pr-4 last:border-0 pl-0 md:pl-4">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold leading-tight">Date:</p>
            <p className="text-sm font-bold">{currentDate}</p>
          </div>
          <div className="space-y-1 border-r md:border-r pr-4 last:border-0 pl-0 md:pl-4">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold leading-tight">Name:</p>
            <p className="text-sm font-bold break-words">{shippingData?.firstName} {shippingData?.lastName}</p>
          </div>
          <div className="space-y-1 pl-0 md:pl-4 last:border-0">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold leading-tight">Payment method:</p>
            <p className="text-sm font-bold capitalize">{paymentData?.paymentMethod?.replace('_', ' ')}</p>
          </div>
        </div>
      </section>

      {/* Order Details Section */}
      <section className="space-y-6 pb-12">
        <h2 className="text-3xl font-light">Order details</h2>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b">
                <th className="p-4 font-semibold text-sm">Product</th>
                <th className="p-4 font-semibold text-sm">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((item, idx) => (
                <tr key={idx} className="text-sm">
                  <td className="p-4 whitespace-nowrap">
                    <Link href={`/product/${item.productId || item.id}`} className="text-primary hover:underline">
                      {item.title}
                    </Link>
                    <span className="font-bold ml-1">× 1</span>
                  </td>
                  <td className="p-4 font-medium">${item.price.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="text-sm">
                <td className="p-4 font-bold">Subtotal:</td>
                <td className="p-4 font-medium">${subtotal.toFixed(2)}</td>
              </tr>
              {discount > 0 && (
                <tr className="text-sm text-green-600 dark:text-green-400">
                  <td className="p-4 font-bold">Discount:</td>
                  <td className="p-4 font-medium">-${discount.toFixed(2)}</td>
                </tr>
              )}
              {taxAmount > 0 && (
                <tr className="text-sm">
                  <td className="p-4 font-bold">Tax:</td>
                  <td className="p-4 font-medium">${taxAmount.toFixed(2)}</td>
                </tr>
              )}
              <tr className="text-sm">
                <td className="p-4 font-bold">Payment method:</td>
                <td className="p-4 capitalize">{paymentData?.paymentMethod?.replace('_', ' ')}</td>
              </tr>
              <tr className="text-sm border-t-2">
                <td className="p-4 font-bold">Total:</td>
                <td className="p-4 font-bold">${total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer Actions */}
      <div className="flex justify-center flex-wrap gap-4 pt-4 border-t">
        <Button asChild variant="outline">
          <Link href="/account">View Order History</Link>
        </Button>
        <Button asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  )
}
