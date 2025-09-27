"use client"

import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingBag, Heart, Settings, CreditCard, Package, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function AccountDashboard() {
  const { user } = useAuth()
  const { state } = useCart()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const mockOrders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      status: "delivered",
      total: 89.97,
      items: 3,
    },
    {
      id: "ORD-002",
      date: "2024-01-10",
      status: "processing",
      total: 59.99,
      items: 1,
    },
  ]

  const mockWishlist = [
    {
      id: 1,
      title: "The Witcher 3: Wild Hunt",
      price: 39.99,
      image: "/witcher-fantasy-game.jpg",
    },
    {
      id: 2,
      title: "FIFA 24",
      price: 69.99,
      image: "/fifa-soccer-game.jpg",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="text-2xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <p className="text-sm text-muted-foreground">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{mockOrders.length}</p>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{mockWishlist.length}</p>
                  <p className="text-sm text-muted-foreground">Wishlist Items</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{state.itemCount}</p>
                  <p className="text-sm text-muted-foreground">Cart Items</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">
                    ${mockOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>View and track your recent orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">Order {order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.date} • {order.items} items
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={order.status === "delivered" ? "default" : "secondary"}>{order.status}</Badge>
                      <p className="font-medium">${order.total}</p>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wishlist">
          <Card>
            <CardHeader>
              <CardTitle>Wishlist</CardTitle>
              <CardDescription>Items you've saved for later</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockWishlist.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-3">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-32 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-lg font-bold text-primary">${item.price}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        Add to Cart
                      </Button>
                      <Button variant="outline" size="sm">
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Manage your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <p className="text-muted-foreground">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email Address</label>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Member Since</label>
                  <p className="text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Account Status</label>
                  <Badge variant="default">Active</Badge>
                </div>
              </div>
              <Button className="mt-4">
                <User className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your preferences and security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive updates about your orders</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Privacy Settings</h4>
                    <p className="text-sm text-muted-foreground">Control your data and privacy</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Change Password</h4>
                    <p className="text-sm text-muted-foreground">Update your account password</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
              </div>
              <Button variant="destructive" className="mt-6">
                <Settings className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
