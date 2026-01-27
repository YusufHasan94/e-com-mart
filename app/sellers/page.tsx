"use client"

import { useState, useEffect } from "react"
import { apiService, ApiSeller } from "@/lib/api-service"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Store, MapPin } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Footer } from "@/components/footer"

export default function SellersPage() {
    const [sellers, setSellers] = useState<ApiSeller[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    useEffect(() => {
        const fetchSellers = async () => {
            try {
                const response = await apiService.getSellers()
                if (response.success && response.data) {
                    // Handle pagination wrapper if exists
                    const data = (response.data as any).data || response.data
                    setSellers(Array.isArray(data) ? data : [])
                }
            } catch (error) {
                console.error("Failed to fetch sellers", error)
            } finally {
                setLoading(false)
            }
        }
        fetchSellers()
    }, [])

    const filteredSellers = sellers.filter(seller =>
        seller.store_name?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Our Sellers</h1>
                        <p className="text-muted-foreground mt-2">Find trusted sellers and official stores</p>
                    </div>
                    <div className="w-full md:w-72">
                        <Input
                            placeholder="Search sellers..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Card key={i} className="animate-pulse">
                                <CardHeader className="h-24 bg-muted/50 rounded-t-lg" />
                                <CardContent className="h-32 p-6" />
                            </Card>
                        ))}
                    </div>
                ) : filteredSellers.length === 0 ? (
                    <div className="text-center py-12">
                        <Store className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold">No sellers found</h3>
                        <p className="text-muted-foreground">Try adjusting your search terms</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSellers.map((seller) => (
                            <Card key={seller.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="h-24 bg-primary/10 relative">
                                    {seller.banner && (
                                        <img src={seller.banner} alt="Banner" className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <CardContent className="pt-0 -mt-10 px-6">
                                    <div className="flex justify-between items-end">
                                        <Avatar className="h-20 w-20 border-4 border-background shadow-md">
                                            <AvatarImage src={seller.logo} />
                                            <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                                                {seller.store_name?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="mb-2 flex items-center gap-1">
                                            <Star className="h-4 w-4 fill-primary text-primary" />
                                            <span className="font-semibold">{seller.rating?.toFixed(1) || "New"}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-lg">{seller.store_name}</h3>
                                            {seller.is_verified && (
                                                <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Verified</Badge>
                                            )}
                                        </div>

                                        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                                            {seller.description || "No description available"}
                                        </p>

                                        <div className="flex items-center text-sm text-muted-foreground gap-4 pt-2">
                                            <div className="flex items-center gap-1">
                                                <Store className="h-3.5 w-3.5" />
                                                <span>{seller.total_sales > 100 ? '100+' : seller.total_sales} Sales</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-muted/30 p-4">
                                    <Link href={`/sellers/${seller.slug}`} className="w-full">
                                        <Button className="w-full" variant="outline">Visit Store</Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    )
}
