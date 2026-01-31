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
                className={`group hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer h-full rounded-2xl border border-white/5 bg-[#1A1A1A] hover:bg-[#222222] ${className}`}
                style={style}
            >
                {/* Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-900">
                    <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />

                    {/* Left Badges (Discount) */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                        {product.discount !== undefined && product.discount > 0 && (
                            <Badge className="bg-[#4859C0] hover:bg-[#4859C0]/90 text-white border-0 rounded-md px-2.5 py-1 text-[13px] font-bold shadow-lg">
                                -{product.discount}%
                            </Badge>
                        )}
                    </div>

                    {/* Right Badges (New/Trending) */}
                    <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-2">

                        {showTrendingBadge && product.trendingRank && (
                            <Badge className="bg-purple-600 hover:bg-purple-700 gap-1 text-[11px] font-bold rounded-md px-2">
                                <Flame className="h-3 w-3" />#{product.trendingRank}
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Content */}
                <CardContent className="p-5 space-y-3">
                    {/* Platform/Category info */}
                    <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-300 transition-colors">
                        <Monitor className="w-3.5 h-3.5 opacity-60" />
                        <span className="text-[11px] uppercase tracking-wider font-bold opacity-60">{product.category || "General"}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-[15px] leading-snug text-white group-hover:text-primary transition-colors line-clamp-2 min-h-[42px]">
                        {product.title}
                    </h3>

                    {/* Price Row */}
                    <div className="flex flex-col pt-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[12px] text-gray-500 font-medium">from</span>
                            <span className="text-xl font-black text-white">
                                ${typeof product.salePrice === 'number' ? product.salePrice.toFixed(2) : product.salePrice}
                            </span>
                            {product.originalPrice && (
                                <span className="text-sm text-gray-600 line-through decoration-gray-600 font-medium ml-auto">
                                    ${product.originalPrice.toFixed(2)}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Progress Bar (Optional) */}
                    {showProgressBar && product.sold !== undefined && product.total !== undefined && (
                        <div className="space-y-1.5 pt-2">
                            <div className="flex justify-between text-[10px] uppercase font-bold tracking-tight text-gray-500">
                                <span>Sold: {product.sold}/{product.total}</span>
                                <span>{Math.round((product.sold / product.total) * 100)}%</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-1.5">
                                <div
                                    className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
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
