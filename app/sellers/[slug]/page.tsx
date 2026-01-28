"use client"

import { useState, useEffect } from "react"
import { apiService, ApiSeller } from "@/lib/api-service"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Store, MapPin, Calendar, Share2, Flag } from "lucide-react"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"

export default function SellerDetailsPage() {
    const params = useParams()
    const [seller, setSeller] = useState<ApiSeller | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSeller = async () => {
            if (!params.slug) return

            try {
                const response = await apiService.getSellerDetails(params.slug as string)
                if (response.success && response.data) {
                    setSeller(response.data)
                }
            } catch (error) {
                console.error("Failed to fetch seller details", error)
            } finally {
                setLoading(false)
            }
        }
        fetchSeller()
    }, [params.slug])

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 space-y-8">
                <Skeleton className="h-64 w-full rounded-xl" />
                <div className="space-y-4">
                    <Skeleton className="h-12 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </div>
        )
    }

    if (!seller) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold">Seller not found</h1>
                <Button className="mt-4" onClick={() => window.history.back()}>Go Back</Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <div className="h-64 md:h-80 relative bg-muted">
                {seller.banner ? (
                    <img src={seller.banner} alt="Banner" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Store className="h-24 w-24 text-muted-foreground/20" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>

            <main className="flex-1 container mx-auto px-4 -mt-20 relative z-10">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Sidebar / Info */}
                    <Card className="w-full md:w-80 shadow-xl border-border">
                        <CardContent className="p-6 text-center">
                            <Avatar className="h-32 w-32 mx-auto border-4 border-background shadow-lg -mt-16">
                                <AvatarImage src={seller.logo} />
                                <AvatarFallback className="text-3xl">{seller.store_name?.charAt(0)}</AvatarFallback>
                            </Avatar>

                            <h1 className="text-2xl font-bold mt-4">{seller.store_name}</h1>

                            <div className="flex items-center justify-center gap-2 mt-2">
                                <div className="flex items-center text-yellow-500">
                                    <Star className="h-4 w-4 fill-current" />
                                    <span className="ml-1 font-semibold">{seller.rating?.toFixed(1)}</span>
                                </div>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground">{seller.total_sales} Sales</span>
                            </div>

                            {seller.is_verified && (
                                <Badge className="mt-4" variant="secondary">Verified Seller</Badge>
                            )}

                            <div className="mt-6 space-y-3 text-left">
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>Joined {new Date(seller.created_at).toLocaleDateString()}</span>
                                </div>
                                {/* Add more details here later */}
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-6">
                                <Button variant="outline" className="w-full">
                                    <Share2 className="h-4 w-4 mr-2" /> Share
                                </Button>
                                <Button variant="outline" className="w-full">
                                    <Flag className="h-4 w-4 mr-2" /> Report
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Content */}
                    <div className="flex-1 space-y-6 pt-20 md:pt-0">
                        <div className="bg-card p-6 rounded-lg border border-border">
                            <h2 className="text-xl font-bold mb-4">About Store</h2>
                            <div className="prose dark:prose-invert max-w-none">
                                <p>{seller.description || "No description provided."}</p>
                            </div>
                        </div>

                        {/* Products Tab Placeholders */}
                        <div className="bg-card p-6 rounded-lg border border-border min-h-[400px]">
                            <h2 className="text-xl font-bold mb-6">Latest Products</h2>
                            <div className="text-center py-12 text-muted-foreground">
                                <p>Load products matching seller_id here...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
