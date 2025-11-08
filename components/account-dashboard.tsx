"use client"

import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { 
  ShoppingBag, 
  Heart, 
  Settings, 
  CreditCard, 
  LogOut, 
  Search, 
  Calendar,
  TrendingUp,
  Megaphone,
  Building2,
  Headphones,
  Star,
  Shield,
  Menu
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Product } from "@/lib/products"

// Sidebar Content Component (reusable for desktop and mobile)
function SidebarContent({ 
  activeTab, 
  onTabChange, 
  onItemClick 
}: { 
  activeTab: string
  onTabChange: (tab: string) => void
  onItemClick?: () => void 
}) {
  const { user, logout } = useAuth()
  
  // Mock user reputation
  const userReputation = 96.48
  // Mock credit balance
  const creditBalance = 303.19

  const navigationItems = [
    { id: "purchases", label: "Purchases", icon: ShoppingBag, active: activeTab === "purchases" },
    { id: "wishlist", label: "Wishlist", icon: Heart, active: activeTab === "wishlist" },
    { id: "credit", label: "Credit", icon: CreditCard, active: activeTab === "credit", badge: `$${creditBalance.toFixed(2)}` },
    { id: "offers", label: "Offers", icon: TrendingUp, active: activeTab === "offers" },
    { id: "retail", label: "Retail advertising", icon: Megaphone, active: activeTab === "retail" },
    { id: "wholesale", label: "Wholesale", icon: Building2, active: activeTab === "wholesale" },
    { id: "support", label: "Customer service", icon: Headphones, active: activeTab === "support" },
    { id: "settings", label: "Account settings", icon: Settings, active: activeTab === "settings" },
  ]

  const handleItemClick = (id: string) => {
    onTabChange(id)
    onItemClick?.()
  }

  return (
    <>
      {/* User Profile Section */}
      <div className="p-3 sm:p-4 md:p-6 border-b border-border">
        <div className="flex flex-col items-center gap-2 sm:gap-3">
          <Avatar className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 border-2 border-border">
            <AvatarImage src={user?.avatar || "/placeholder-user.jpg"} alt={user?.name || "User"} />
            <AvatarFallback className="bg-secondary text-foreground text-base sm:text-lg md:text-xl">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="font-semibold text-sm sm:text-base md:text-base">{user?.name || "User"}</h2>
            <div className="flex items-center justify-center gap-1 mt-1">
              <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4 text-primary fill-primary" />
              <span className="text-xs sm:text-sm md:text-sm font-medium text-primary">{userReputation}%</span>
            </div>
            <p className="text-[10px] sm:text-xs md:text-xs text-muted-foreground mt-0.5">POSITIVE FEEDBACK</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar py-2 sm:py-3 md:py-4">
        <div className="space-y-0.5 sm:space-y-1 px-2 sm:px-3">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg transition-colors text-sm sm:text-base ${
                  item.active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 min-w-0 flex-1">
                  <Icon className="h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5 flex-shrink-0" />
                  <span className="font-medium truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <Badge className="bg-primary text-primary-foreground text-xs sm:text-xs md:text-sm px-1.5 sm:px-2 md:px-2 py-0.5 ml-2 flex-shrink-0">
                    {item.badge}
                  </Badge>
                )}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-2.5 sm:p-3 md:p-4 border-t border-border">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 sm:gap-2.5 md:gap-3 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors text-sm sm:text-base"
        >
          <LogOut className="h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5" />
          <span className="font-medium">Log out</span>
        </button>
      </div>
    </>
  )
}

export function AccountDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("purchases")
  const [purchasesTab, setPurchasesTab] = useState("games")
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [showCount, setShowCount] = useState("25")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else {
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

  // Mock credit balance
  const creditBalance = 303.19

  // Mock purchases data
  const mockPurchases: any[] = []

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      {/* Mobile Menu Button */}
      <div className="lg:hidden sticky top-0 z-40 bg-background border-b border-border px-3 sm:px-4 py-3 sm:py-3.5 flex items-center justify-between">
        <h1 className="text-lg sm:text-xl font-semibold">Dashboard</h1>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9 sm:h-10 sm:w-10">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[260px] sm:w-[280px] md:w-[320px] p-0 flex flex-col">
            <SidebarContent 
              activeTab={activeTab} 
              onTabChange={(tab) => {
                setActiveTab(tab)
                setIsMobileMenuOpen(false)
              }} 
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:h-screen lg:sticky lg:top-0 bg-card border-r border-border">
        <SidebarContent 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-background overflow-y-auto min-h-screen">
        <div className="p-3 sm:p-4 md:p-6 lg:p-8">
          {/* Purchases Section */}
          {activeTab === "purchases" && (
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {/* Section Header */}
              <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                <ShoppingBag className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
                <h1 className="text-xl sm:text-2xl md:text-2xl font-semibold">Purchases</h1>
        </div>

              {/* Search and Filters */}
              <div className="flex flex-col gap-2.5 sm:gap-3 md:gap-4">
                <div className="relative w-full">
                  <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search for product..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 sm:pl-10 h-10 sm:h-11 text-base sm:text-base bg-card border-border focus:border-primary focus:ring-primary"
                  />
                    </div>
                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 md:gap-4 sm:items-center">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial">
                    <span className="text-sm sm:text-sm md:text-sm text-muted-foreground whitespace-nowrap">filter</span>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="flex-1 sm:w-[180px] md:w-[200px] h-10 sm:h-11 bg-card border-border text-base sm:text-base">
                        <SelectValue placeholder="Select filter" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="wholesale">Wholesale and retail trade</SelectItem>
                        <SelectItem value="games">Games</SelectItem>
                        <SelectItem value="software">Software</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial">
                    <Calendar className="h-4 w-4 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <Input
                      type="date"
                      className="flex-1 sm:w-[140px] md:w-[150px] h-10 sm:h-11 text-base sm:text-base bg-card border-border"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial">
                    <span className="text-sm sm:text-sm md:text-sm text-muted-foreground whitespace-nowrap">Show</span>
                    <Select value={showCount} onValueChange={setShowCount}>
                      <SelectTrigger className="flex-1 sm:w-[70px] md:w-[80px] h-10 sm:h-11 bg-card border-border text-base sm:text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                    </div>
                  </div>

              {/* Content Tabs */}
              <Tabs value={purchasesTab} onValueChange={setPurchasesTab} className="w-full">
                <TabsList className="bg-card border border-border p-0.5 sm:p-1 inline-flex w-full sm:w-auto h-9 sm:h-10">
                  <TabsTrigger
                    value="games"
                    className="flex-1 sm:flex-initial text-sm sm:text-base px-3 sm:px-4 h-8 sm:h-9 min-h-[32px] sm:min-h-[36px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Games
                  </TabsTrigger>
                  <TabsTrigger
                    value="orders"
                    className="flex-1 sm:flex-initial text-sm sm:text-base px-3 sm:px-4 h-8 sm:h-9 min-h-[32px] sm:min-h-[36px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Orders
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="games" className="mt-3 sm:mt-4 md:mt-6">
                  <div className="bg-card border border-border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto -mx-1 sm:mx-0">
                      <div className="inline-block min-w-full align-middle px-1 sm:px-0">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-border hover:bg-card">
                              <TableHead className="text-muted-foreground font-medium text-sm sm:text-sm md:text-sm px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3">Article</TableHead>
                              <TableHead className="text-muted-foreground font-medium text-sm sm:text-sm md:text-sm px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3">Protection</TableHead>
                              <TableHead className="text-muted-foreground font-medium text-sm sm:text-sm md:text-sm px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3">Purchase date</TableHead>
                              <TableHead className="text-muted-foreground font-medium text-sm sm:text-sm md:text-sm px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3">Price</TableHead>
                              <TableHead className="text-muted-foreground font-medium text-sm sm:text-sm md:text-sm px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3">Product review</TableHead>
                              <TableHead className="text-muted-foreground font-medium text-sm sm:text-sm md:text-sm px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3">Trustpilot</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {mockPurchases.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={6} className="text-center py-6 sm:py-8 md:py-12 text-muted-foreground px-2 sm:px-4">
                                  No data
                                </TableCell>
                              </TableRow>
                            ) : (
                              mockPurchases.map((purchase) => (
                                <TableRow key={purchase.id} className="border-border hover:bg-accent">
                                  <TableCell className="text-foreground text-sm sm:text-sm md:text-sm px-2 sm:px-3 md:px-4 py-2 sm:py-2.5">{purchase.article}</TableCell>
                                  <TableCell className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5">
                                    <Shield className="h-4 w-4 sm:h-4 sm:w-4 text-muted-foreground" />
                                  </TableCell>
                                  <TableCell className="text-muted-foreground text-sm sm:text-sm md:text-sm px-2 sm:px-3 md:px-4 py-2 sm:py-2.5">{purchase.date}</TableCell>
                                  <TableCell className="text-foreground font-medium text-sm sm:text-sm md:text-sm px-2 sm:px-3 md:px-4 py-2 sm:py-2.5">{purchase.price}</TableCell>
                                  <TableCell className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5">
                                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary text-sm sm:text-sm md:text-sm h-8 sm:h-9 px-2 sm:px-3">
                                      Review
                                    </Button>
                                  </TableCell>
                                  <TableCell className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5">
                                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary text-sm sm:text-sm md:text-sm h-8 sm:h-9 px-2 sm:px-3">
                                      Review
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                  </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="orders" className="mt-3 sm:mt-4 md:mt-6">
                  <div className="bg-card border border-border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto -mx-1 sm:mx-0">
                      <div className="inline-block min-w-full align-middle px-1 sm:px-0">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-border hover:bg-card">
                              <TableHead className="text-muted-foreground font-medium text-sm sm:text-sm md:text-sm px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3">Order ID</TableHead>
                              <TableHead className="text-muted-foreground font-medium text-sm sm:text-sm md:text-sm px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3">Date</TableHead>
                              <TableHead className="text-muted-foreground font-medium text-sm sm:text-sm md:text-sm px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3">Status</TableHead>
                              <TableHead className="text-muted-foreground font-medium text-sm sm:text-sm md:text-sm px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3">Total</TableHead>
                              <TableHead className="text-muted-foreground font-medium text-sm sm:text-sm md:text-sm px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3">Items</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-6 sm:py-8 md:py-12 text-muted-foreground px-2 sm:px-4">
                                No data
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                  </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
      </div>
          )}

          {/* Wishlist Section */}
          {activeTab === "wishlist" && (
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                <Heart className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
                <h1 className="text-xl sm:text-2xl md:text-2xl font-semibold">Wishlist</h1>
              </div>
                {wishlist.length === 0 ? (
                <div className="bg-card border border-border rounded-lg p-6 sm:p-8 md:p-12 text-center">
                  <p className="text-muted-foreground text-sm sm:text-base">No items in your wishlist</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {wishlist.map((product) => (
                    <div key={product.id} className="bg-card border border-border rounded-lg p-3 sm:p-4">
                      <img src={product.image} alt={product.title} className="w-full h-36 sm:h-40 md:h-48 object-cover rounded mb-3 sm:mb-4" />
                      <h3 className="font-semibold text-foreground mb-1.5 sm:mb-2 text-xs sm:text-sm md:text-base line-clamp-2">{product.title}</h3>
                      <p className="text-primary font-bold text-sm sm:text-base md:text-lg">${product.vendors[0]?.price || 0}</p>
                          </div>
                    ))}
                  </div>
                )}
            </div>
          )}

          {/* Credit Section */}
          {activeTab === "credit" && (
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                <CreditCard className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
                <h1 className="text-xl sm:text-2xl md:text-2xl font-semibold">Credit</h1>
              </div>
              <div className="bg-card border border-border rounded-lg p-5 sm:p-6 md:p-8 text-center">
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1.5 sm:mb-2">${creditBalance.toFixed(2)}</p>
                <p className="text-muted-foreground text-xs sm:text-sm md:text-base">Available Credit</p>
              </div>
                  </div>
          )}

          {/* Other Sections Placeholder */}
          {activeTab !== "purchases" && activeTab !== "wishlist" && activeTab !== "credit" && (
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <h1 className="text-xl sm:text-2xl md:text-2xl font-semibold capitalize">{activeTab.replace(/([A-Z])/g, ' $1').trim()}</h1>
              <div className="bg-card border border-border rounded-lg p-6 sm:p-8 md:p-12 text-center">
                <p className="text-muted-foreground text-sm sm:text-base">This section is coming soon</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
