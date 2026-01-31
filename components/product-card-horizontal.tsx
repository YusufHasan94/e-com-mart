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
            platform: product.platform || "PC",
            discount: product.discount,
        })
    }

    return (
        <Card className={`group hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-2xl border border-white/5 bg-[#1A1A1A] hover:bg-[#222222] ${className}`}>
            <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row h-full">
                    {/* Image Section */}
                    <Link href={`/product/${product.id}`} className="relative w-full sm:w-64 h-48 sm:h-44 flex-shrink-0 overflow-hidden">
                        <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                            {product.discount !== undefined && product.discount > 0 && (
                                <Badge className="bg-[#4859C0] hover:bg-[#4859C0]/90 text-white border-0 rounded-md px-2.5 py-1 text-[12px] font-bold shadow-lg">
                                    -{product.discount}%
                                </Badge>
                            )}

                        </div>
                    </Link>

                    {/* Content Section */}
                    <div className="flex-1 p-5 flex flex-col justify-between">
                        <div className="space-y-2.5">
                            {/* Meta Info */}
                            <div className="flex items-center flex-wrap gap-4 text-[11px] uppercase tracking-wider font-bold text-gray-400 opacity-60">
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
                                <h3 className="font-bold text-xl text-white group-hover:text-primary transition-colors line-clamp-1">
                                    {product.title}
                                </h3>
                            </Link>

                            {/* Rating/Reviews */}
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-bold text-white text-sm">{product.rating || "4.5"}</span>
                                    <span className="text-gray-500 text-sm font-medium">({product.reviews || "0"})</span>
                                </div>
                            </div>
                        </div>

                        {/* Price and Action Section */}
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-baseline gap-2">
                                <span className="text-[12px] text-gray-500 font-medium lowercase">from</span>
                                <span className="text-2xl font-black text-white">${product.salePrice}</span>
                                {product.originalPrice && (
                                    <span className="text-[14px] text-gray-600 line-through font-medium ml-1">${product.originalPrice.toFixed(2)}</span>
                                )}
                            </div>

                            <Button
                                onClick={handleAddToCart}
                                className="bg-primary hover:bg-primary/90 text-white font-bold h-11 px-6 rounded-xl gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95"
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
