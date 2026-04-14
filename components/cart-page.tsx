"use client"

import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import Link from "next/link"

export function CartPage() {
  const { state, updateQuantity, removeItem, clearCart } = useCart()

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="text-8xl text-muted-foreground">🛒</div>
          <h1 className="text-3xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground text-lg">
            Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
          </p>
          <Link href="/products">
            <Button size="lg" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <Button variant="outline" onClick={clearCart} className="gap-2 bg-transparent">
            <Trash2 className="h-4 w-4" />
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-muted-foreground">
                          {item.category} • {item.platform}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-muted-foreground line-through">${item.originalPrice.toFixed(2)}</span>
                        )}
                        <span className="text-xl font-bold text-primary">${item.price.toFixed(2)}</span>
                        {item.discount && <Badge variant="destructive">-{item.discount}%</Badge>}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="text-lg font-medium w-12 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-bold">Order Summary</h2>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({state.itemCount} items)</span>
                    <span>${state.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${(state.total * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">${(state.total * 1.08).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 flex flex-col gap-1">
                  <Link href="/checkout">
                    <Button className="w-full" size="lg">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button variant="outline" className="w-full gap-2 bg-transparent">
                      <ArrowLeft className="h-4 w-4" />
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                <div className="pt-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <ShoppingBag className="h-4 w-4" />
                    <span>Secure checkout guaranteed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
