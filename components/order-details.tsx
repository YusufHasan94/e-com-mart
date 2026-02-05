"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { apiService, ApiOrder } from "@/lib/api-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Loader2, Package, Calendar, CreditCard, User, Mail, Phone, MapPin, ExternalLink } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface OrderDetailsProps {
    orderId: string
}

export function OrderDetails({ orderId }: OrderDetailsProps) {
    const [data, setData] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { token } = useAuth()
    const router = useRouter()

    useEffect(() => {
        const fetchOrder = async () => {
            if (!token) return

            setLoading(true)
            try {
                const response = await apiService.getOrderDetails(token, Number(orderId))
                if (response.success && response.data) {
                    setData(response.data)
                } else {
                    setError(response.error || "Failed to fetch order details")
                }
            } catch (err) {
                console.error("Error fetching order:", err)
                setError("An unexpected error occurred")
            } finally {
                setLoading(false)
            }
        }

        fetchOrder()
    }, [orderId, token])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading order details...</p>
            </div>
        )
    }

    if (error || !data || !data.order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="bg-destructive/10 p-4 rounded-full">
                    <ArrowLeft className="h-8 w-8 text-destructive" />
                </div>
                <h2 className="text-xl font-semibold">Order Not Found</h2>
                <p className="text-muted-foreground">{error || "The order you're looking for doesn't exist."}</p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        )
    }

    const { order, items, addresses, meta } = data
    const billing = addresses?.billing
    const client = meta?.client

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "pending": return "bg-[#FF9800] text-white"
            case "completed": return "bg-green-500 text-white"
            case "cancelled": return "bg-red-500 text-white"
            default: return "bg-secondary text-secondary-foreground"
        }
    }

    const getPaymentStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "pending": return "bg-[#00BCD4] text-white"
            case "paid": return "bg-green-500 text-white"
            case "failed": return "bg-red-500 text-white"
            default: return "bg-secondary text-secondary-foreground"
        }
    }

    const formattedDate = new Date(order.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    })

    const formatNumber = (val: any) => {
        if (typeof val === 'number') return val.toFixed(2)
        if (typeof val === 'string') {
            const num = parseFloat(val.replace(/[^0-9.]/g, ''))
            return isNaN(num) ? "0.00" : num.toFixed(2)
        }
        return "0.00"
    }

    const getItemName = (item: any) => {
        return item.product?.title || "Unknown Product"
    }

    const getItemImage = (item: any) => {
        const image = item.product?.image
        if (!image) return null
        if (typeof image === 'string') {
            if (image.startsWith('http')) return image
            return `https://gamehub.licensesender.com/storage/${image.replace(/^storage\//, '')}`
        }
        return null
    }

    return (
        <div className="max-w-[1440px] px-5 mx-auto space-y-6 pb-12">
            {/* Header */}
            <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-semibold text-foreground/90">Order #{order.order_number}</h1>
                    <div className="flex gap-2">
                        <Badge className={cn("border-0 font-bold", getStatusColor(order.status))}>
                            {order.status?.toUpperCase()}
                        </Badge>
                        <Badge className={cn("border-0 font-bold", getPaymentStatusColor(order.payment_status))}>
                            {order.payment_status?.toUpperCase()}
                        </Badge>
                    </div>
                </div>
                <div className="text-[13px] text-muted-foreground leading-relaxed">
                    Payment via {order.payment_method || 'cryptomus'}. Placed on {formattedDate}.
                </div>
            </div>

            {/* Order Items Section */}
            <Card className="border-border/50 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/30 border-b py-4 px-6">
                    <CardTitle className="text-lg font-medium">Order Items</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="p-0">
                        {/* Table Header */}
                        <div className="grid grid-cols-[1fr_100px_80px_100px] gap-4 px-6 py-4 border-b text-[13px] font-semibold text-muted-foreground uppercase tracking-wider">
                            <div>Product</div>
                            <div className="text-right">Price</div>
                            <div className="text-center">Qty</div>
                            <div className="text-right">Subtotal</div>
                        </div>

                        {/* Items */}
                        <div className="divide-y">
                            {items?.map((item: any) => (
                                <div key={item.id} className="p-6 space-y-4">
                                    <div className="grid grid-cols-[1fr_100px_80px_100px] gap-4 items-start">
                                        <div className="flex gap-4">
                                            <div className="w-16 h-16 rounded border bg-muted flex-shrink-0 overflow-hidden">
                                                {getItemImage(item) ? (
                                                    <img src={getItemImage(item)!} alt={item.product?.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="h-8 w-8 text-muted-foreground/50" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                <Link
                                                    href={`/product/${item.product?.id}`}
                                                    className="font-semibold text-[15px] text-primary hover:underline block leading-tight"
                                                >
                                                    {item.product?.title || "Unknown Product"}
                                                </Link>
                                                <p className="text-[13px] text-muted-foreground">
                                                    Seller: {item.seller_name || item.seller?.store_name || "GameHub Store"}
                                                </p>
                                                <div className="flex gap-3 text-[12px] font-medium pt-0.5">
                                                    <span className="text-green-600">Seller Net: ${formatNumber(item.seller_net || (Number(item.price || 0) * 0.9))}</span>
                                                    <span className="text-red-500">Platform Fee: ${formatNumber(item.platform_fee || (Number(item.price || 0) * 0.1))}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right pt-1 text-[15px]">${formatNumber(item.price)}</div>
                                        <div className="text-center pt-1 text-[15px]">{item.quantity}</div>
                                        <div className="text-right pt-1 font-semibold text-[15px]">${formatNumber(item.subtotal || item.total)}</div>
                                    </div>
                                    <div className="text-[13px] text-muted-foreground bg-muted/20 p-2 px-3 rounded">
                                        Delivery: <span className="text-foreground/80">{item.delivery?.[0]?.method || 'Auto'}</span> | Status: <span className="text-foreground/80">{item.delivery?.[0]?.status || 'Pending'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Subtotal row */}
                        <div className="bg-muted/10 border-t py-4 px-6 flex flex-col items-end space-y-2">
                            <div className="grid grid-cols-2 gap-x-24 text-[15px]">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="text-right font-bold text-foreground/80">${formatNumber(order.subtotal || 0)}</span>
                            </div>
                            {/* If there are more cost components, they can be added here */}
                            <div className="grid grid-cols-2 gap-x-24 text-[15px]">
                                <span className="text-muted-foreground font-medium">Discount</span>
                                <span className="text-right font-medium text-red-500">-${formatNumber(order.discount || 0)}</span>
                            </div>
                            {Number(order.tax_amount) > 0 && (
                                <div className="grid grid-cols-2 gap-x-24 text-[15px]">
                                    <span className="text-muted-foreground font-medium">Tax</span>
                                    <span className="text-right font-medium text-foreground/80">${formatNumber(order.tax_amount)}</span>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-x-24 text-[15px]">
                                <span className="font-medium">Total</span>
                                <span className="text-right font-bold text-primary">${formatNumber(order.total_amount || order.total || 0)}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Order Delivery Section */}
            <Card className="border-border/50 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/30 border-b py-4 px-6">
                    <CardTitle className="text-lg font-medium">Order Delivery</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[14px]">
                            <thead>
                                <tr className="border-b bg-muted/10 uppercase text-[12px] tracking-wider font-semibold text-muted-foreground">
                                    <th className="px-6 py-4">#</th>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4 whitespace-nowrap">Delivery Type</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 whitespace-nowrap">Delivered Items</th>
                                    <th className="px-6 py-4 whitespace-nowrap">Delivered At</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {items?.map((item: any, index: number) => (
                                    <tr key={item.id} className="hover:bg-muted/5">
                                        <td className="px-6 py-4 font-medium">{index + 1}</td>
                                        <td className="px-6 py-4 min-w-[200px]">
                                            <div className="font-medium">{item.product?.title || "Unknown Product"}</div>
                                            {item.seller_name && <div className="text-[12px] text-muted-foreground">via {item.seller_name}</div>}
                                        </td>
                                        <td className="px-6 py-4 capitalize">{item.delivery?.[0]?.method || 'auto'}</td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className="font-normal border-muted-foreground/30 capitalize">
                                                {item.delivery?.[0]?.status || 'pending'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-center">{item.delivered_items || 0}</td>
                                        <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                                            {item.delivery?.[0]?.delivered_at ? new Date(item.delivery[0].delivered_at).toLocaleDateString() : '---'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Support/Billing card below if needed or just Help */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {billing && (
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="py-3 px-6 border-b bg-muted/10">
                            <CardTitle className="text-sm font-semibold">Billing Information</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 text-[13px] space-y-2">
                            <p className="font-medium">{billing.name}</p>
                            <p className="text-muted-foreground">{billing.email}</p>
                            <p className="text-muted-foreground">{billing.phone}</p>
                            <p className="text-muted-foreground">{billing.address}, {billing.city}, {billing.country}</p>
                        </CardContent>
                    </Card>
                )}

                <Card className="bg-primary/5 border-primary/10">
                    <CardContent className="p-6 flex flex-col justify-between h-full">
                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-2.5 rounded-full">
                                <HelpCircle className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-sm">Need help with this order?</p>
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                    Our support team is available 24/7. Contact us for any issues regarding delivery or payments.
                                </p>
                            </div>
                        </div>
                        <Link href="/account?tab=support" className="mt-4">
                            <Button variant="outline" size="sm" className="w-full bg-background">Contact Support</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function HelpCircle(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
        </svg>
    )
}
