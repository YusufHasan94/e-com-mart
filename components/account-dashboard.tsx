"use client"

import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingBag, Heart, Settings, CreditCard, Package, User, Plus, Edit, Trash2, Store, ShoppingCart, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Product } from "@/lib/products"

export function AccountDashboard() {
  const { user, logout } = useAuth()
  const { state, addItem } = useCart()
  const router = useRouter()
  const [myProducts, setMyProducts] = useState<Product[]>([])
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    category: "Games",
    image: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else {
      // Load seller's products from localStorage
      if (user.role === "seller") {
        const savedProducts = localStorage.getItem(`products_${user.id}`)
        if (savedProducts) {
          setMyProducts(JSON.parse(savedProducts))
        }
      }
      // Load wishlist
      const savedWishlist = localStorage.getItem(`wishlist_${user.id}`)
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist))
      }
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const handleAddProduct = () => {
    if (!newProduct.title || !newProduct.price || !newProduct.category) {
      alert("Please fill in all required fields")
      return
    }

    const product: Product = {
      id: `product-${Date.now()}`,
      title: newProduct.title,
      category: newProduct.category,
      description: newProduct.description || "No description provided",
      image: newProduct.image || "/placeholder.jpg",
      type: "game",
      variations: [{ value: "Standard", price: parseFloat(newProduct.price), region: "Global" }],
      vendors: [{
        id: parseInt(user.id),
        name: user.name,
        rating: 5,
        reviews: 0,
        isVerified: true,
        price: parseFloat(newProduct.price),
        location: "Global",
        avgDeliveryTime: "Instant",
        support: "24/7"
      }],
      rating: 0,
      reviews: 0,
      isNew: true,
      isTrending: false,
      customerReviews: []
    }

    const updatedProducts = [...myProducts, product]
    setMyProducts(updatedProducts)
    localStorage.setItem(`products_${user.id}`, JSON.stringify(updatedProducts))
    
    // Reset form
    setNewProduct({ title: "", description: "", price: "", category: "Games", image: "" })
    setIsAddingProduct(false)
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const updatedProducts = myProducts.filter(p => p.id !== productId)
      setMyProducts(updatedProducts)
      localStorage.setItem(`products_${user.id}`, JSON.stringify(updatedProducts))
    }
  }

  const handleToggleWishlist = (product: Product) => {
    const isInWishlist = wishlist.some(p => p.id === product.id)
    let updatedWishlist: Product[]
    
    if (isInWishlist) {
      updatedWishlist = wishlist.filter(p => p.id !== product.id)
    } else {
      updatedWishlist = [...wishlist, product]
    }
    
    setWishlist(updatedWishlist)
    localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updatedWishlist))
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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="text-xl sm:text-2xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold">{user.name}</h1>
                <Badge variant={user.role === "seller" ? "default" : "secondary"}>
                  {user.role === "seller" ? <Store className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
                  {user.role === "seller" ? "Seller" : "User"}
                </Badge>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">{user.email}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={logout} className="w-full sm:w-auto">
            Logout
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {user.role === "seller" ? (
            <>
              <Card>
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Store className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xl sm:text-2xl font-bold">{myProducts.length}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">My Products</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xl sm:text-2xl font-bold">{myProducts.reduce((sum, p) => sum + p.reviews, 0)}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Total Views</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xl sm:text-2xl font-bold">
                        ${myProducts.reduce((sum, p) => sum + (p.vendors[0]?.price || 0), 0).toFixed(2)}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Total Value</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Package className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xl sm:text-2xl font-bold">
                        {myProducts.reduce((sum, p) => sum + (p.vendors[0]?.reviews || 0), 0)}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Total Reviews</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xl sm:text-2xl font-bold">{mockOrders.length}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Total Orders</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xl sm:text-2xl font-bold">{wishlist.length}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Wishlist Items</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Package className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xl sm:text-2xl font-bold">{state.itemCount}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Cart Items</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xl sm:text-2xl font-bold">
                        ${mockOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Total Spent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue={user.role === "seller" ? "products" : "orders"} className="space-y-4 sm:space-y-6">
        <TabsList className={`grid w-full ${user.role === "seller" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "grid-cols-2 sm:grid-cols-4"}`}>
          {user.role === "seller" ? (
            <>
              <TabsTrigger value="products" className="text-xs sm:text-sm">My Products</TabsTrigger>
              <TabsTrigger value="add-product" className="text-xs sm:text-sm">Add Product</TabsTrigger>
              <TabsTrigger value="orders" className="text-xs sm:text-sm">Orders</TabsTrigger>
              <TabsTrigger value="profile" className="text-xs sm:text-sm">Profile</TabsTrigger>
              <TabsTrigger value="settings" className="text-xs sm:text-sm">Settings</TabsTrigger>
            </>
          ) : (
            <>
              <TabsTrigger value="orders" className="text-xs sm:text-sm">Orders</TabsTrigger>
              <TabsTrigger value="wishlist" className="text-xs sm:text-sm">Wishlist</TabsTrigger>
              <TabsTrigger value="profile" className="text-xs sm:text-sm">Profile</TabsTrigger>
              <TabsTrigger value="settings" className="text-xs sm:text-sm">Settings</TabsTrigger>
            </>
          )}
        </TabsList>

        {/* Seller: My Products */}
        {user.role === "seller" && (
          <TabsContent value="products">
            <Card>
              <CardHeader className="px-4 sm:px-6">
                <CardTitle>My Products</CardTitle>
                <CardDescription>Manage your product listings</CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                {myProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No products yet. Add your first product!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {myProducts.map((product) => (
                      <Card key={product.id}>
                        <CardContent className="p-3 sm:p-4">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-28 sm:h-32 object-cover rounded mb-2 sm:mb-3"
                          />
                          <h3 className="font-semibold text-sm sm:text-base mb-1 line-clamp-2">{product.title}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-2">{product.category}</p>
                          <p className="text-base sm:text-lg font-bold text-primary mb-2 sm:mb-3">
                            ${product.vendors[0]?.price || 0}
                          </p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs sm:text-sm"
                              onClick={() => router.push(`/product/${product.id}`)}
                            >
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="text-xs sm:text-sm"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Seller: Add Product */}
        {user.role === "seller" && (
          <TabsContent value="add-product">
            <Card>
              <CardHeader className="px-4 sm:px-6">
                <CardTitle>Add New Product</CardTitle>
                <CardDescription>Create a new product listing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm">Product Title *</Label>
                  <Input
                    id="title"
                    value={newProduct.title}
                    onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                    placeholder="Enter product title"
                    className="text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm">Category *</Label>
                  <select
                    id="category"
                    className="w-full px-3 py-2 text-sm sm:text-base border rounded-md"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  >
                    <option value="Games">Games</option>
                    <option value="Software">Software</option>
                    <option value="Gift Cards">Gift Cards</option>
                    <option value="Subscriptions">Subscriptions</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="Enter price"
                    className="text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm">Description</Label>
                  <textarea
                    id="description"
                    className="w-full px-3 py-2 text-sm sm:text-base border rounded-md min-h-[100px] resize-y"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Enter product description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-sm">Image URL</Label>
                  <Input
                    id="image"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    placeholder="Enter image URL (or leave blank for placeholder)"
                    className="text-sm sm:text-base"
                  />
                </div>
                <Button onClick={handleAddProduct} className="w-full text-sm sm:text-base">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader className="px-4 sm:px-6">
              <CardTitle>Order History</CardTitle>
              <CardDescription>View and track your recent orders</CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="space-y-3 sm:space-y-4">
                {mockOrders.map((order) => (
                  <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 lg:p-5 border rounded-lg">
                    <div className="space-y-1 w-full sm:w-auto">
                      <p className="font-medium text-sm sm:text-base">Order {order.id}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {order.date} • {order.items} items
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
                      <Badge variant={order.status === "delivered" ? "default" : "secondary"} className="text-xs">
                        {order.status}
                      </Badge>
                      <p className="font-medium text-sm sm:text-base">${order.total}</p>
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm w-full sm:w-auto">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wishlist Tab (User only) */}
        {user.role === "user" && (
          <TabsContent value="wishlist">
            <Card>
              <CardHeader className="px-4 sm:px-6">
                <CardTitle>Wishlist</CardTitle>
                <CardDescription>Items you've saved for later</CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                {wishlist.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Your wishlist is empty</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {wishlist.map((product) => (
                      <Card key={product.id}>
                        <CardContent className="p-3 sm:p-4">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-28 sm:h-32 object-cover rounded mb-2 sm:mb-3"
                          />
                          <h3 className="font-semibold text-sm sm:text-base mb-1 line-clamp-2">{product.title}</h3>
                          <p className="text-base sm:text-lg font-bold text-primary mb-2 sm:mb-3">
                            ${product.vendors[0]?.price || 0}
                          </p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1 text-xs sm:text-sm"
                              onClick={() => {
                                const vendor = product.vendors[0]
                                addItem({
                                  id: parseInt(product.id.replace(/\D/g, '')) || Date.now(),
                                  title: product.title,
                                  price: vendor.price,
                                  image: product.image,
                                  category: product.category,
                                  platform: product.platform || 'Digital',
                                })
                              }}
                            >
                              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              Add to Cart
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs sm:text-sm"
                              onClick={() => handleToggleWishlist(product)}
                            >
                              Remove
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader className="px-4 sm:px-6">
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Manage your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-medium">Full Name</label>
                  <p className="text-sm sm:text-base text-muted-foreground break-words">{user.name}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-medium">Email Address</label>
                  <p className="text-sm sm:text-base text-muted-foreground break-words">{user.email}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-medium">Role</label>
                  <div>
                    <Badge variant={user.role === "seller" ? "default" : "secondary"} className="text-xs">
                      {user.role === "seller" ? "Seller" : "User"}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-medium">Member Since</label>
                  <p className="text-sm sm:text-base text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <Button className="mt-4 w-full sm:w-auto">
                <User className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader className="px-4 sm:px-6">
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your preferences and security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm sm:text-base">Email Notifications</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">Receive updates about your orders</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm w-full sm:w-auto">
                    Configure
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm sm:text-base">Privacy Settings</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">Control your data and privacy</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm w-full sm:w-auto">
                    Manage
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm sm:text-base">Change Password</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">Update your account password</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm w-full sm:w-auto">
                    Change
                  </Button>
                </div>
              </div>
              <Button variant="destructive" className="mt-4 sm:mt-6 w-full sm:w-auto" onClick={logout}>
                <Settings className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
