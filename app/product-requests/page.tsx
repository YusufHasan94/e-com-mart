"use client"

import { useState, useEffect } from "react"
import { apiService } from "@/lib/api-service"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus } from "lucide-react"
import { Footer } from "@/components/footer"
import { useToast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ProductRequestsPage() {
    const { user, token } = useAuth()
    const { toast } = useToast()
    const [requests, setRequests] = useState<any[]>([])
    const [activeTab, setActiveTab] = useState<"list" | "create">("list")
    const [loading, setLoading] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        product_name: "",
        platform: "",
        region: "",
        product_type: "game",
        additional_notes: ""
    })

    useEffect(() => {
        if (user && token && activeTab === "list") {
            fetchRequests()
        }
    }, [user, token, activeTab])

    const fetchRequests = async () => {
        if (!token) return
        setLoading(true)
        try {
            const response = await apiService.getProductRequests(token)
            if (response.success && response.data) {
                const data = (response.data as any).data || response.data
                setRequests(Array.isArray(data) ? data : [])
            }
        } catch (error) {
            console.error("Failed to fetch requests", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!token) return

        try {
            const response = await apiService.submitProductRequest(token, formData)

            if (response.success) {
                toast({
                    title: "Request Submitted",
                    description: "We'll verify if we can source this product."
                })
                setActiveTab("list")
                setFormData({
                    product_name: "",
                    platform: "",
                    region: "",
                    product_type: "game",
                    additional_notes: ""
                })
            } else {
                toast({ title: "Error", description: response.error, variant: "destructive" })
            }
        } catch (error) {
            console.error("Submit failed", error)
            toast({ title: "Error", description: "Failed to submit request", variant: "destructive" })
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Product Requests</h1>
                        <p className="text-muted-foreground">Request games or software we don't have yet</p>
                    </div>
                    {user && (
                        <Button onClick={() => setActiveTab(activeTab === "list" ? "create" : "list")}>
                            {activeTab === "list" ? (
                                <>
                                    <Plus className="mr-2 h-4 w-4" /> Request New Product
                                </>
                            ) : (
                                "View My Requests"
                            )}
                        </Button>
                    )}
                </div>

                {!user ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <h3 className="text-xl font-semibold mb-2">Please Log In</h3>
                            <p className="text-muted-foreground mb-4">You need to be logged in to request products.</p>
                            <Button onClick={() => window.location.href = '/login'}>Log In / Register</Button>
                        </CardContent>
                    </Card>
                ) : activeTab === "create" ? (
                    <Card className="max-w-2xl mx-auto">
                        <CardHeader>
                            <CardTitle>Request a Product</CardTitle>
                            <CardDescription>Tell us what you're looking for. We'll search our suppliers.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Product Name</label>
                                    <Input
                                        required
                                        value={formData.product_name}
                                        onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                                        placeholder="e.g. Elden Ring"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Platform</label>
                                        <Select onValueChange={(v) => setFormData({ ...formData, platform: v })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select platform" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="steam">Steam</SelectItem>
                                                <SelectItem value="xbox">Xbox</SelectItem>
                                                <SelectItem value="playstation">PlayStation</SelectItem>
                                                <SelectItem value="nintendo">Nintendo</SelectItem>
                                                <SelectItem value="origin">Origin/EA</SelectItem>
                                                <SelectItem value="ubisoft">Ubisoft Connect</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Region</label>
                                        <Select onValueChange={(v) => setFormData({ ...formData, region: v })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select region" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="global">Global</SelectItem>
                                                <SelectItem value="eu">Europe (EU)</SelectItem>
                                                <SelectItem value="na">North America</SelectItem>
                                                <SelectItem value="asia">Asia</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Product Type</label>
                                    <Select defaultValue="game" onValueChange={(v) => setFormData({ ...formData, product_type: v })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="game">Game Key</SelectItem>
                                            <SelectItem value="software">Software</SelectItem>
                                            <SelectItem value="gift_card">Gift Card</SelectItem>
                                            <SelectItem value="subscription">Subscription</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Additional Notes</label>
                                    <Textarea
                                        value={formData.additional_notes}
                                        onChange={(e) => setFormData({ ...formData, additional_notes: e.target.value })}
                                        placeholder="Any specific edition, language, etc."
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Submitting..." : "Submit Request"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Platform</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {requests.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                You haven't made any requests yet.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        requests.map((req) => (
                                            <TableRow key={req.id}>
                                                <TableCell className="font-medium">{req.product_name}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{req.platform}</Badge>
                                                    <span className="text-xs text-muted-foreground ml-2">{req.region}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        req.status === 'completed' ? 'default' :
                                                            req.status === 'rejected' ? 'destructive' : 'secondary'
                                                    }>
                                                        {req.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {new Date(req.created_at).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
            </main>
            <Footer />
        </div>
    )
}
