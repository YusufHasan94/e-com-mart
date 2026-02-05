"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart, Monitor, Globe, Gamepad2, Layers } from "lucide-react"
import Link from "next/link"
import React from "react"
import { useCart } from "@/contexts/cart-context"

interface ProductCardHorizontalProps {
    product: {
        id: string | number
        title: string
        image: string
        salePrice: number | string
        originalPrice?: number
        discount?: number
        category?: string
        categorySlug?: string
        platform?: string
        platformSlug?: string
        rating?: number
        reviews?: number
        isNew?: boolean
        region?: string
        type?: string
        label?: { id: number; name: string; bg_color: string; text_color: string }
        [key: string]: any
    }
    className?: string
}

export function ProductCardHorizontal({ product, className = "" }: ProductCardHorizontalProps) {
    const { addItem } = useCart()

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        addItem({
            id: product.id,
            title: product.title,
            price: typeof product.salePrice === 'number' ? product.salePrice : parseFloat(product.salePrice as string) || 0,
            originalPrice: product.originalPrice,
            image: product.image,
            category: product.category || "General",
            categoryId: product.categoryId,
            platform: product.platform || "PC",
            discount: product.discount,
        })
    }

    return (
        <Card className={`card-premium group overflow-hidden rounded-[8px] ${className}`}>
            <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row h-full">
                    {/* Image Section */}
                    <Link href={`/product/${product.id}`} className="relative w-full sm:w-64 h-48 sm:h-44 flex-shrink-0 overflow-hidden bg-muted/30">
                        <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                            {product.label && (
                                <Badge
                                    className="border-0 rounded-md px-2.5 py-1 text-[12px] font-semibold shadow-lg"
                                    style={{
                                        backgroundColor: product.label.bg_color,
                                        color: product.label.text_color
                                    }}
                                >
                                    {product.label.name}
                                </Badge>
                            )}
                            {product.discount !== undefined && product.discount > 0 && (
                                <Badge className="bg-brand-500 hover:bg-brand-600 text-white border-0 rounded-md px-2.5 py-1 text-[12px] font-bold shadow-lg">
                                    -{product.discount}%
                                </Badge>
                            )}
                        </div>
                    </Link>

                    {/* Content Section */}
                    <div className="flex-1 p-5 flex flex-col justify-between">
                        <div className="space-y-2.5">
                            {/* Meta Info */}
                            <div className="flex items-center flex-wrap gap-4 text-[11px] uppercase tracking-wider font-bold text-muted-foreground opacity-60">
                                <span className="flex items-center gap-1.5">
                                    <Monitor className="h-3.5 w-3.5" />
                                    {product.category || "General"}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Globe className="h-3.5 w-3.5" />
                                    {product.region || "Global"}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Gamepad2 className="h-3.5 w-3.5" />
                                    {product.platform || "PC"}
                                </span>
                            </div>

                            {/* Title */}
                            <Link href={`/product/${product.id}`}>
                                <h3 className="font-bold text-xl text-foreground group-hover:text-brand-500 transition-colors line-clamp-1">
                                    {product.title}
                                </h3>
                            </Link>

                            {/* Rating/Reviews */}
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-bold text-foreground text-sm">{product.rating || "4.5"}</span>
                                    <span className="text-muted-foreground text-sm font-medium">({product.reviews || "0"})</span>
                                </div>
                            </div>
                        </div>

                        {/* Price and Action Section */}
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-baseline gap-2">
                                <span className="text-[12px] text-muted-foreground font-medium lowercase">from</span>
                                <span className="text-2xl font-semibold text-foreground">${product.salePrice}</span>
                                {product.originalPrice && (
                                    <span className="text-[14px] text-muted-foreground/60 line-through font-medium ml-1">${product.originalPrice.toFixed(2)}</span>
                                )}
                            </div>

                            <Button
                                onClick={handleAddToCart}
                                className="bg-brand-500 hover:bg-brand-600 text-white font-semibold h-11 px-6 rounded-[8px] gap-2 shadow-lg shadow-brand-500/20 transition-all active:scale-95 text-base"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                <span className="hidden sm:inline">Add to Cart</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
