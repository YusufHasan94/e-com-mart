"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Tag, X, Check } from "lucide-react"
import { apiService } from "@/lib/api-service"
import { useCart } from "@/contexts/cart-context"

interface CouponInputProps {
    onCouponApplied?: (code: string, discount: number) => void
}

export function CouponInput({ onCouponApplied }: CouponInputProps) {
    const { state, applyCoupon, removeCoupon } = useCart()
    const [couponCode, setCouponCode] = useState("")
    const [isValidating, setIsValidating] = useState(false)
    const [error, setError] = useState("")

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            setError("Please enter a coupon code")
            return
        }

        setIsValidating(true)
        setError("")

        try {
            // Extract category IDs and product IDs from cart items
            const categoryIds: number[] = []
            const productIds: number[] = []

            state.items.forEach(item => {
                // Use productId if available (for multivendor), otherwise use id
                const productId = item.productId ? item.productId : Number(item.id)
                if (!isNaN(productId) && !productIds.includes(productId)) {
                    productIds.push(productId)
                }

                // Add category ID if available
                if (item.categoryId && !categoryIds.includes(item.categoryId)) {
                    categoryIds.push(item.categoryId)
                }
            })

            const response = await apiService.validateCoupon(
                couponCode.trim(),
                state.total,
                categoryIds.length > 0 ? categoryIds : undefined,
                productIds.length > 0 ? productIds : undefined
            )

            if (response.success && response.data) {
                const discount = response.data.discount || 0
                applyCoupon(couponCode.trim(), discount)
                setCouponCode("")
                onCouponApplied?.(couponCode.trim(), discount)
            } else {
                setError(response.error || "Invalid coupon code")
            }
        } catch (err) {
            setError("Failed to validate coupon. Please try again.")
        } finally {
            setIsValidating(false)
        }
    }

    const handleRemoveCoupon = () => {
        removeCoupon()
        setError("")
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleApplyCoupon()
        }
    }

    if (state.couponCode) {
        return (
            <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <div>
                            <p className="text-sm font-medium text-green-900 dark:text-green-100">
                                Coupon Applied
                            </p>
                            <p className="text-xs text-green-700 dark:text-green-300">
                                Code: <span className="font-mono font-semibold">{state.couponCode}</span>
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveCoupon}
                        className="h-8 text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => {
                            setCouponCode(e.target.value.toUpperCase())
                            setError("")
                        }}
                        onKeyPress={handleKeyPress}
                        disabled={isValidating}
                        className="pl-9 h-9 rounded-md"
                    />
                </div>
                <Button
                    onClick={handleApplyCoupon}
                    disabled={isValidating || !couponCode.trim()}
                    size="default"
                    className="h-9 rounded-md"
                >
                    {isValidating ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Validating
                        </>
                    ) : (
                        "Apply"
                    )}
                </Button>
            </div>
            {error && (
                <p className="text-xs text-destructive flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {error}
                </p>
            )}
        </div>
    )
}
