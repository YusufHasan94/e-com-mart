"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame, Monitor } from "lucide-react"
import Link from "next/link"
import React from "react"

interface ProductCardProps {
    product: {
        id: string | number
        title: string
        image: string
        salePrice: number | string
        originalPrice?: number
        discount?: number
        sold?: number
        total?: number
        trendingRank?: number
        label?: { id: number; name: string; bg_color: string; text_color: string }
        [key: string]: any
        category?: string
    }
    showProgressBar?: boolean
    showTrendingBadge?: boolean
    className?: string
    style?: React.CSSProperties
}

export function ProductCard({
    product,
    showProgressBar = false,
    showTrendingBadge = false,
    className = "",
    style
}: ProductCardProps) {
    return (
        <Link href={`/product/${product.id}`} className="block h-full">
            <Card
                className={`card-premium group overflow-hidden h-full rounded-[8px] ${className}`}
                style={style}
            >
                {/* Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-muted/30">
                    <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />

                    {/* Left Badges (Label/Discount) */}
                    <div className="absolute top-3 left-3 z-10 flex flex-row-reverse gap-2">
                        {product.label && (
                            <Badge 
                                className="border-0 rounded-md p-1 text-[16px] font-semibold shadow-lg"
                                style={{ 
                                    backgroundColor: product.label.bg_color, 
                                    color: product.label.text_color 
                                }}
                            >
                                {product.label.name}
                            </Badge>
                        )}
                        {product.discount !== undefined && product.discount > 0 && (
                            <Badge className="bg-brand-500 hover:bg-brand-600 text-white border-0 rounded-md p-1 text-[16px] font-base shadow-lg">
                                -{product.discount}%
                            </Badge>
                        )}
                    </div>

                    {/* Right Badges (New/Trending) */}
                    <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-2">
                        {showTrendingBadge && product.trendingRank && (
                            <Badge className="bg-primary/90 hover:bg-primary gap-1 text-[11px] font-base rounded-md px-2">
                                <Flame className="h-3 w-3" />#{product.trendingRank}
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Content */}
                <CardContent className="p-5 space-y-3">
                    {/* Platform/Category info */}
                    <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                        <Monitor className="w-3.5 h-3.5 opacity-60" />
                        <span className="text-[11px] uppercase tracking-wider font-semibold opacity-60">{product.category || "General"}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-[18px] leading-snug text-foreground group-hover:text-brand-500 transition-colors line-clamp-2 min-h-[42px]">
                        {product.title}
                    </h3>

                    {/* Price Row */}
                    <div className="flex flex-col pt-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[12px] text-muted-foreground font-medium">from</span>
                            <span className="text-xl font-semibold text-foreground">
                                ${typeof product.salePrice === 'number' ? product.salePrice.toFixed(2) : product.salePrice}
                            </span>
                            {product.originalPrice && (
                                <span className="text-sm text-muted-foreground/60 line-through font-medium">
                                    ${product.originalPrice.toFixed(2)}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Progress Bar (Optional) */}
                    {showProgressBar && product.sold !== undefined && product.total !== undefined && (
                        <div className="space-y-1.5 pt-2">
                            <div className="flex justify-between text-[10px] uppercase font-semibold tracking-tight text-muted-foreground">
                                <span>Sold: {product.sold}/{product.total}</span>
                                <span>{Math.round((product.sold / product.total) * 100)}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="bg-brand-500 h-full rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${(product.sold / product.total) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    )
}
