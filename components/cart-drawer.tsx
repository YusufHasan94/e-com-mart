"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import Link from "next/link"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { state, updateQuantity, removeItem } = useCart()

  if (state.items.length === 0) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Shopping Cart
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="text-6xl text-muted-foreground">🛒</div>
            <h3 className="text-lg font-semibold">Your cart is empty</h3>
            <p className="text-muted-foreground text-center">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button onClick={onClose} className="mt-4">
              Continue Shopping
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({state.itemCount} items)
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-4">
            {state.items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded"
                />

                <div className="flex-1 space-y-2">
                  <div>
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {item.category} • {item.platform}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 bg-transparent"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 bg-transparent"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-xs text-muted-foreground line-through">
                          ${item.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-sm font-bold text-primary">${item.price.toFixed(2)}</span>
                      {item.discount && (
                        <Badge variant="destructive" className="text-xs">
                          -{item.discount}%
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4 space-y-4">
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total:</span>
            <span className="text-primary">${state.total.toFixed(2)}</span>
          </div>

          <div className="space-y-2">
            <Link href="/cart" onClick={onClose}>
              <Button variant="outline" className="w-full bg-transparent">
                View Cart
              </Button>
            </Link>
            <Link href="/checkout" onClick={onClose}>
              <Button className="w-full">Checkout</Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
