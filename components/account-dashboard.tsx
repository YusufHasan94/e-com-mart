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
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox as UICheckbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
  Menu,
  Info,
  Download,
  Wallet,
  ArrowUp,
  ArrowDown,
  Building,
  CheckCircle2,
  ArrowLeft,
  Plus,
  Edit,
  MoreVertical,
  Grid3x3,
  Key,
  AlertCircle,
  FileText,
  Pencil,
  Box,
  Camera,
  Power,
  ExternalLink,
  Upload,
  ArrowRight,
  Clock,
  Receipt,
  ShoppingCart,
  HelpCircle,
  Package,
  ChevronDown,
  ChevronRight,
  Sparkles,
  User,
  MessageCircle,
  RotateCcw,
  History,
  BellRing,
  Package as PackageIcon,
  CreditCard as CreditCardIcon,
  HelpCircle as HelpCircleIcon,
  Pin,
  LayoutDashboard,
  Loader2,
  XCircle,
  Trash2
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useMemo, useRef } from "react"
import { Product } from "@/lib/products"
import { products } from "@/lib/products"
import { useToast } from "@/components/ui/use-toast"

import { SidebarContent } from "@/components/sidebar-content"


import { ProfileSettings } from "@/components/profile-settings"
import { apiService } from "@/lib/api-service"

export function AccountDashboard({ initialTab = "dashboard" }: { initialTab?: string }) {
  const { user, token, isLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Define seller-only tabs
  const sellerOnlyTabs = ["offers-list", "sales-history", "requested-products", "wholesale-bids"]
  const isSellerOnlyTab = (tab: string) => sellerOnlyTabs.includes(tab)

  // Use useMemo to determine the final active tab based on user role
  const finalActiveTab = useMemo(() => {
    if (user && user.role !== "seller" && isSellerOnlyTab(initialTab)) {
      return "credit"
    }
    return initialTab
  }, [initialTab, user])

  const [activeTab, setActiveTab] = useState(finalActiveTab)
  const [wallet, setWallet] = useState<{ balance: number; currency: string } | null>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [transactionsLoading, setTransactionsLoading] = useState(false)
  const [orders, setOrders] = useState<any[]>([])
  const [purchasesTab, setPurchasesTab] = useState("orders")
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [showCount, setShowCount] = useState("25")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [balanceTab, setBalanceTab] = useState("history")
  const [balanceType, setBalanceType] = useState("all")
  const [payoutStep, setPayoutStep] = useState(1)
  const [payoutMethod, setPayoutMethod] = useState("bank-transfer-eur")
  const [instantPayout, setInstantPayout] = useState(false)
  const [topUpStep, setTopUpStep] = useState(1)
  const [topUpMethod, setTopUpMethod] = useState("paypal-eur")
  const [topUpAmount, setTopUpAmount] = useState("")

  // New States for added tabs
  const [keys, setKeys] = useState<any[]>([])
  const [keysLoading, setKeysLoading] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [notificationsLoading, setNotificationsLoading] = useState(false)
  const [addresses, setAddresses] = useState<any[]>([])
  const [addressesLoading, setAddressesLoading] = useState(false)
  const [refunds, setRefunds] = useState<any[]>([])
  const [refundsLoading, setRefundsLoading] = useState(false)
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([])
  const [recentlyViewedLoading, setRecentlyViewedLoading] = useState(false)
  const [alerts, setAlerts] = useState<any[]>([])
  const [alertsLoading, setAlertsLoading] = useState(false)

  // Dashboard Overview States
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [dashboardLoading, setDashboardLoading] = useState(false)

  // Seller States
  const [sellerOffers, setSellerOffers] = useState<any[]>([])
  const [sellerOffersLoading, setSellerOffersLoading] = useState(false)
  const [sellerOrders, setSellerOrders] = useState<any[]>([])
  const [sellerOrdersLoading, setSellerOrdersLoading] = useState(false)

  const [offersTab, setOffersTab] = useState("active")
  const [offersSearch, setOffersSearch] = useState("")
  const [offersShowCount, setOffersShowCount] = useState("25")
  const [offersSort, setOffersSort] = useState("bestselling")
  const [offersPlatform, setOffersPlatform] = useState("all")
  const [offersRegion, setOffersRegion] = useState("all")
  const [offersPrice, setOffersPrice] = useState("all")
  const [offersDistribution, setOffersDistribution] = useState("all")
  const [showSellItem, setShowSellItem] = useState(false)
  const [sellItemStep, setSellItemStep] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productSearch, setProductSearch] = useState("")
  const [showProductResults, setShowProductResults] = useState(false)
  const productSearchRef = useRef<HTMLDivElement>(null)


  // Product search results
  const productSearchResults = useMemo(() => {
    if (!productSearch.trim() || productSearch.length < 2) {
      return []
    }
    const query = productSearch.toLowerCase().trim()
    return products
      .filter((product) => {
        const titleMatch = product.title.toLowerCase().includes(query)
        const categoryMatch = product.category.toLowerCase().includes(query)
        const platformMatch = product.platform?.toLowerCase().includes(query)
        return titleMatch || categoryMatch || platformMatch
      })
      .slice(0, 8)
  }, [productSearch])

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (productSearchRef.current && !productSearchRef.current.contains(event.target as Node)) {
        setShowProductResults(false)
      }
    }

    if (showProductResults) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showProductResults])
  const [saleType, setSaleType] = useState("retail-wholesale")
  const [retailPrice, setRetailPrice] = useState("0.00")
  const [retailProfit, setRetailProfit] = useState("0.00")
  const [retailAcquisition, setRetailAcquisition] = useState("0.00")
  const [wholesale10Price, setWholesale10Price] = useState("0.00")
  const [wholesale10Profit, setWholesale10Profit] = useState("0.00")
  const [wholesale10Acquisition, setWholesale10Acquisition] = useState("0.00")
  const [wholesale100Price, setWholesale100Price] = useState("0.00")
  const [wholesale100Profit, setWholesale100Profit] = useState("0.00")
  const [wholesale100Acquisition, setWholesale100Acquisition] = useState("0.00")
  const [keyType, setKeyType] = useState("text")
  const [textKeys, setTextKeys] = useState("")
  const [agreeConditions, setAgreeConditions] = useState(false)
  const [guaranteeContent, setGuaranteeContent] = useState(false)
  const [offerStatus, setOfferStatus] = useState("inactive")
  const [salesHistoryTab, setSalesHistoryTab] = useState("history")
  const [salesHistorySearch, setSalesHistorySearch] = useState("")
  const [salesHistoryShow, setSalesHistoryShow] = useState("10")
  const [financialStatementMonth, setFinancialStatementMonth] = useState("october-2025")
  const [requestedProductsTab, setRequestedProductsTab] = useState("request-new")
  const [productName, setProductName] = useState("")
  const [productPlatform, setProductPlatform] = useState("")
  const [consoleVersion, setConsoleVersion] = useState("")
  const [productRegion, setProductRegion] = useState("")
  const [regionExceptions, setRegionExceptions] = useState("")
  const [productLanguages, setProductLanguages] = useState("")
  const [productType, setProductType] = useState("")
  const [productTypeCategory, setProductTypeCategory] = useState("")
  const [requestType, setRequestType] = useState("")
  const [sourceUrl, setSourceUrl] = useState("")
  const [additionalNotes, setAdditionalNotes] = useState("")
  const [wholesaleTab, setWholesaleTab] = useState("offers")
  const [wholesaleProductType, setWholesaleProductType] = useState("all")
  const [wholesaleGenre, setWholesaleGenre] = useState("all")
  const [wholesaleLanguage, setWholesaleLanguage] = useState("all")
  const [wholesalePlatform, setWholesalePlatform] = useState("all")
  const [wholesaleRegion, setWholesaleRegion] = useState("all")
  const [wholesalePrice, setWholesalePrice] = useState("all")
  const [wholesaleProductSearch, setWholesaleProductSearch] = useState("")
  const [wholesaleSellerSearch, setWholesaleSellerSearch] = useState("")
  const [invoiceProvidersOnly, setInvoiceProvidersOnly] = useState(false)
  const [outOfStockOffers, setOutOfStockOffers] = useState(false)
  const [wholesaleSort, setWholesaleSort] = useState("name-az")
  const [wholesaleShow, setWholesaleShow] = useState("25")
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
  const [expandedWholesaleProducts, setExpandedWholesaleProducts] = useState<Set<string>>(new Set())
  const [specialPrice, setSpecialPrice] = useState<Record<string, string>>({})
  const [specialQty, setSpecialQty] = useState<Record<string, string>>({})
  const [needInvoice, setNeedInvoice] = useState<Record<string, boolean>>({})
  const [productQty, setProductQty] = useState<Record<string, string>>({})
  const [supportTab, setSupportTab] = useState("open")
  const [supportSearch, setSupportSearch] = useState("")
  const [supportShowCount, setSupportShowCount] = useState("25")
  const [supportView, setSupportView] = useState<"tickets" | "help">("tickets")
  const [helpCategory, setHelpCategory] = useState("orders")
  const [helpSearch, setHelpSearch] = useState("")
  const [showCreateTicket, setShowCreateTicket] = useState(false)
  const [ticketTitle, setTicketTitle] = useState("")
  const [ticketCategory, setTicketCategory] = useState("")
  const [ticketPriority, setTicketPriority] = useState("normal")
  const [ticketMessage, setTicketMessage] = useState("")
  const [tickets, setTickets] = useState<Array<{
    id: string
    title: string
    category: string
    priority: string
    message: string
    status: "open" | "waiting" | "closed"
    createdAt: string
    lastUpdate: string
    handledBy?: string
  }>>([])

  const fetchWallet = async () => {
    if (token) {
      const response = await apiService.getWallet(token)
      if (response.success && response.data) {
        setWallet({
          balance: Number(response.data.balance),
          currency: response.data.currency
        })
      }
    }
  }

  const fetchTransactions = async () => {
    if (token) {
      setTransactionsLoading(true)
      try {
        const response = await apiService.getWalletTransactions(token, {
          per_page: parseInt(showCount) || 25
        })
        if (response.success && response.data) {
          const transactionsList = response.data.data || []
          const mappedTransactions = transactionsList.map((tx: any) => ({
            id: String(tx.id),
            operationType: tx.description || tx.type || "Transaction",
            details: tx.source || tx.description || "-",
            orderId: tx.order_id || "-",
            status: tx.status || "completed",
            date: tx.created_at ? new Date(tx.created_at).toLocaleString() : "-",
            expirationDate: tx.expires_at ? new Date(tx.expires_at).toLocaleString() : "-",
            value: typeof tx.amount === "string" ? parseFloat(tx.amount) : tx.amount
          }))
          setTransactions(mappedTransactions)
        }
      } catch (error) {
        console.error("Error fetching transactions:", error)
      } finally {
        setTransactionsLoading(false)
      }
    }
  }

  const fetchOrders = async () => {
    if (token) {
      const response = await apiService.getUserOrders(token)
      if (response.success && response.data) {
        const ordersList = Array.isArray(response.data) ? response.data : (response.data as any).data || []
        setOrders(ordersList)
      }
    }
  }

  const fetchKeys = async () => {
    if (token) {
      setKeysLoading(true)
      try {
        const response = await apiService.getMyKeys(token, { per_page: parseInt(showCount) || 25 })
        if (response.success && response.data) {
          const keysList = Array.isArray(response.data) ? response.data : response.data.data || []
          setKeys(keysList)
        }
      } finally {
        setKeysLoading(false)
      }
    }
  }

  const fetchNotifications = async () => {
    if (token) {
      setNotificationsLoading(true)
      try {
        const response = await apiService.getNotifications(token, parseInt(showCount) || 25)
        if (response.success && response.data) {
          const notifList = Array.isArray(response.data) ? response.data : response.data.data || []
          setNotifications(notifList)
        }
      } finally {
        setNotificationsLoading(false)
      }
    }
  }

  const fetchAddresses = async () => {
    if (token) {
      setAddressesLoading(true)
      try {
        const response = await apiService.getAddresses(token)
        if (response.success && response.data) {
          setAddresses(response.data)
        }
      } finally {
        setAddressesLoading(false)
      }
    }
  }

  const fetchRefunds = async () => {
    if (token) {
      setRefundsLoading(true)
      try {
        const response = await apiService.getRefundRequests(token)
        if (response.success && response.data) {
          const refundList = Array.isArray(response.data) ? response.data : response.data.data || []
          setRefunds(refundList)
        }
      } finally {
        setRefundsLoading(false)
      }
    }
  }

  const fetchRecentlyViewed = async () => {
    if (token) {
      setRecentlyViewedLoading(true)
      try {
        const response = await apiService.getRecentlyViewed(token)
        if (response.success && response.data) {
          setRecentlyViewed(response.data)
        }
      } finally {
        setRecentlyViewedLoading(false)
      }
    }
  }

  const fetchAlerts = async () => {
    if (token) {
      setAlertsLoading(true)
      try {
        const response = await apiService.getAlerts(token)
        if (response.success && response.data) {
          setAlerts(response.data)
        }
      } finally {
        setAlertsLoading(false)
      }
    }
  }

  const fetchDashboardData = async () => {
    if (token) {
      setDashboardLoading(true)
      try {
        const response = await apiService.getUserDashboard(token)
        if (response.success && response.data) {
          setDashboardData(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setDashboardLoading(false)
      }
    }
  }

  const fetchWishlist = async () => {
    if (token) {
      try {
        const response = await apiService.getWishlist(token)
        if (response.success && response.data) {
          const wishlistItems = Array.isArray(response.data) ? response.data : response.data.data || []
          const mappedWishlist = wishlistItems.map((item: any) => item.product || item)
          setWishlist(mappedWishlist)
        }
      } catch (error) {
        console.error("Failed to fetch wishlist", error)
      }
    }
  }

  console.log("wishlist", wishlist);

  const handleRemoveFromWishlist = async (id: number | string) => {
    if (token) {
      try {
        const response = await apiService.removeFromWishlist(token, Number(id))
        if (response.success) {
          toast({
            title: "Removed",
            description: "Item removed from wishlist.",
          })
          fetchWishlist()
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: response.error || "Failed to remove item",
          })
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred",
        })
      }
    }
  }

  const handleClearWishlist = async () => {
    if (token) {
      try {
        const response = await apiService.clearWishlist(token)
        if (response.success) {
          toast({
            title: "Cleared",
            description: "Wishlist has been cleared.",
          })
          setWishlist([])
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: response.error || "Failed to clear wishlist",
          })
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred",
        })
      }
    }
  }

  const fetchTickets = async () => {
    if (token) {
      try {
        const response = await apiService.getTickets(token, 1)
        if (response.success && response.data) {
          const ticketsList = Array.isArray(response.data) ? response.data : response.data.data || []
          setTickets(ticketsList)
        }
      } catch (error) {
        console.error("Failed to fetch tickets", error)
      }
    }
  }

  const fetchSellerOffers = async () => {
    if (token) {
      setSellerOffersLoading(true)
      try {
        const response = await apiService.getSellerOffers(token)
        if (response.success && response.data) {
          const mappedOffers = Array.isArray(response.data) ? response.data : response.data.data || []
          setSellerOffers(mappedOffers)
        }
      } catch (error) {
        console.error("Failed to fetch seller offers", error)
      } finally {
        setSellerOffersLoading(false)
      }
    }
  }

  const fetchSellerOrders = async () => {
    if (token) {
      setSellerOrdersLoading(true)
      try {
        const response = await apiService.getSellerOrders(token)
        if (response.success && response.data) {
          const mappedOrders = Array.isArray(response.data) ? response.data : response.data.data || []
          setSellerOrders(mappedOrders)
        }
      } catch (error) {
        console.error("Failed to fetch seller orders", error)
      } finally {
        setSellerOrdersLoading(false)
      }
    }
  }


  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (user) {
      // Load wishlist
      const savedWishlist = localStorage.getItem(`wishlist_${user.id}`)
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist))
      }
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (token) fetchWallet()

    if (token && activeTab === "dashboard") fetchDashboardData()

    if (token && activeTab === "credit") fetchTransactions()

    if (token && activeTab === "purchases") fetchOrders()

    if (token && activeTab === "keys") fetchKeys()

    if (token && activeTab === "notifications") fetchNotifications()

    if (token && activeTab === "addresses") fetchAddresses()

    if (token && activeTab === "refunds") fetchRefunds()

    if (token && activeTab === "recently-viewed") fetchRecentlyViewed()

    if (token && activeTab === "alerts") fetchAlerts()

    if (token && activeTab === "wishlist") fetchWishlist()

    if (token && activeTab === "support") fetchTickets()

    if (token && activeTab === "offers-list") fetchSellerOffers()

    if (token && activeTab === "sales-history") fetchSellerOrders()

  }, [token, activeTab, showCount, supportShowCount])



  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  // Mock credit balance
  const creditBalance = 303.19
  const availableBalance = 292.29
  const GameHubBalance = 0.00
  const pendingBalance = 0.00
  const totalBalance = 292.29



  // Mock wholesale products data
  const mockWholesaleProducts = [
    {
      id: "1",
      name: "#BLUD EN EU Xbox One/Series",
      image: "/placeholder.jpg",
      platform: "xbox",
      region: "EU",
      price: "22.01",
      seller: "Keybank",
      stock: 10,
      price10to99: "23.52",
      price99plus: "22.01"
    },
    {
      id: "2",
      name: "#IDARB EN United States Xbox One/Series",
      image: "/placeholder.jpg",
      platform: "xbox",
      region: "United States",
      price: "11.65",
      seller: "GameStore",
      stock: 5,
      price10to99: "12.50",
      price99plus: "11.65"
    },
    {
      id: "3",
      name: "'n Verlore Verstand EU Xbox One/Series",
      image: "/placeholder.jpg",
      platform: "xbox",
      region: "EU",
      price: "13.20",
      seller: "GameHub",
      stock: 8,
      price10to99: "14.00",
      price99plus: "13.20"
    },
    {
      id: "4",
      name: ".hack G.U. Last Recode EN/DE/FR/JA EU Steam",
      image: "/placeholder.jpg",
      platform: "steam",
      region: "EU",
      price: "2.94",
      seller: "DigitalStore",
      stock: 15,
      price10to99: "3.20",
      price99plus: "2.94"
    },
    {
      id: "5",
      name: ".hack G.U. Last Recode EN/DE/FR/JA Global Steam",
      image: "/placeholder.jpg",
      platform: "steam",
      region: "Global",
      price: "29.85",
      seller: "Keybank",
      stock: 3,
      price10to99: "31.00",
      price99plus: "29.85"
    },
    {
      id: "6",
      name: "10 Second Ninja X EN/DE/FR/RU/ES Global Steam",
      image: "/placeholder.jpg",
      platform: "steam",
      region: "Global",
      price: "1.48",
      seller: "GameStore",
      stock: 20,
      price10to99: "1.60",
      price99plus: "1.48"
    },
    {
      id: "7",
      name: "100% Orange Juice - Acceleration Pack DLC EN/JA Global Steam",
      platform: "steam",
      region: "Global",
      price: "1.54"
    }
  ]

  // Mock offers data
  const mockOffers = [
    {
      id: "1",
      name: "MS Office Professional Plus 2021 EN Global",
      iconText: "O PP 2021",
      iconColor: "bg-orange-500",
      region: "Global",
      available: "9",
      retail: "17.00",
      wholesale: "-",
      lastChanged: "10/25/25, 11:19 PM"
    },
    {
      id: "2",
      name: "Windows 11 Professional EN Global",
      iconText: "W 11",
      iconColor: "bg-purple-500",
      region: "Global",
      available: "32",
      retail: "20.00",
      wholesale: "-",
      lastChanged: "10/25/25, 11:20 PM"
    },
    {
      id: "3",
      name: "MS Office Professional Plus 2019 Global",
      iconText: "O PP",
      iconColor: "bg-orange-500",
      region: "Global",
      available: "21",
      retail: "29.95",
      wholesale: "-",
      lastChanged: "3/24/24, 1:36 AM"
    },
    {
      id: "4",
      name: "Windows 10 Home Global",
      iconText: "W 10",
      iconColor: "bg-purple-500",
      region: "Global",
      available: "4",
      retail: "5.95",
      wholesale: "-",
      lastChanged: "3/24/24, 1:36 AM"
    },
    {
      id: "5",
      name: "MS Office Professional Plus 2021 EU",
      iconText: "O PP 2021",
      iconColor: "bg-orange-500",
      region: "EU",
      available: "1",
      retail: "30.95",
      wholesale: "-",
      lastChanged: "3/24/24, 1:36 AM"
    },
    {
      id: "6",
      name: "Visio Professional 2016 EN Global",
      iconText: "V P",
      iconColor: "bg-blue-500",
      region: "Global",
      available: "2",
      retail: "22.99",
      wholesale: "-",
      lastChanged: "3/24/24, 1:36 AM"
    },
    {
      id: "7",
      name: "Visio Professional 2019 EN Global",
      iconText: "V P",
      iconColor: "bg-blue-500",
      region: "Global",
      available: "1",
      retail: "29.99",
      wholesale: "-",
      lastChanged: "3/24/24, 1:36 AM"
    }
  ]


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
              expandedMenu={expandedMenu}
              setExpandedMenu={setExpandedMenu}
              walletBalance={wallet ? `${wallet.currency} ${wallet.balance.toFixed(2)}` : undefined}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:h-screen lg:sticky lg:top-0 bg-card border-r border-border">
        <SidebarContent
          activeTab={activeTab}
          onTabChange={setActiveTab}
          expandedMenu={expandedMenu}
          setExpandedMenu={setExpandedMenu}
          walletBalance={wallet ? `${wallet.currency} ${wallet.balance.toFixed(2)}` : undefined}
        />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-background overflow-y-auto min-h-screen">
        <div className="p-3 sm:p-4 md:p-6 lg:p-8">
          {/* Dashboard Section */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 sm:space-y-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome, {user?.name || "User"}</h1>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                {[
                  { label: "Total Orders", value: dashboardData?.stats?.total_orders || 0, icon: ShoppingBag },
                  { label: "Completed", value: dashboardData?.stats?.completed_orders || 0, icon: CheckCircle2 },
                  { label: "Pending", value: dashboardData?.stats?.pending_orders || 0, icon: Clock },
                  { label: "Canceled", value: dashboardData?.stats?.canceled_orders || 0, icon: XCircle },
                  { label: "Total Spent", value: `${wallet?.currency || "$"} ${dashboardData?.stats?.total_spent || "0.00"}`, icon: CreditCard },
                ].map((stat, i) => (
                  <Card key={i} className="border border-border bg-card">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-secondary">
                          <stat.icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                          <h3 className="text-xl font-bold">{dashboardLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : stat.value}</h3>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Wallet Card */}
                <Card className="border border-border bg-card">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-muted-foreground text-sm font-medium">Wallet Balance</p>
                        <h2 className="text-3xl font-bold mt-2">
                          {dashboardLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : `${wallet?.currency || "$"} ${dashboardData?.wallet?.balance || "0.00"}`}
                        </h2>
                      </div>
                    </div>
                    <div className="mt-6 flex gap-2">
                      <Button className="flex-1" size="sm" onClick={() => setActiveTab("credit")}>
                        Deposit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => setActiveTab("credit")}>
                        History
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Secondary Stats */}
                <Card className="border border-border bg-card">
                  <CardContent className="p-6 space-y-4">
                    {[
                      { label: "Wishlist Items", value: dashboardData?.stats?.wishlist_count || 0 },
                      { label: "Open Tickets", value: dashboardData?.stats?.open_tickets || 0 },
                      { label: "Total Reviews", value: dashboardData?.stats?.reviews_count || 0 },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                        <span className="font-bold">{dashboardLoading ? "..." : item.value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>


                {/* Recent Activities */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">Recent Orders</h3>
                    <Button variant="link" size="sm" className="text-primary h-auto p-0" onClick={() => setActiveTab("purchases")}>
                      View all
                    </Button>
                  </div>
                  <Card className="border border-border bg-card">
                    <CardContent className="p-0">
                      <div className="divide-y divide-border">
                        {dashboardData?.recent_orders?.length > 0 ? (
                          dashboardData.recent_orders.map((order: any, i: number) => (
                            <div key={i} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                              <div className="flex items-center gap-4">
                                <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center">
                                  <Package className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold">Order #{order.id}</p>
                                  <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold">{order.total}</p>
                                <span className="text-[10px] uppercase font-medium text-muted-foreground">{order.status}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-12 text-center">
                            <p className="text-muted-foreground text-sm">No recent orders</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

              </div>
            </div>
          )}

          {/* Purchases Section */}
          {activeTab === "purchases" && (
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {/* Section Header */}
              <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                <ShoppingBag className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary shrink-0" />
                <h1 className="text-xl sm:text-2xl md:text-2xl font-semibold">Purchases</h1>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-row gap-2.5 sm:gap-3 md:gap-4">
                <div className="relative w-full flex justify-center items-center">
                  <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search for product..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 sm:pl-10 h-9 sm:h-9 text-base sm:text-base bg-card border-border focus:border-primary focus:ring-primary"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 md:gap-4 sm:items-center">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial min-h-10">
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="flex-1 sm:w-[180px] md:w-[200px] h-10 sm:h-10 bg-card border-border text-base sm:text-base">
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
                    <Input
                      type="date"
                      className="flex-1 sm:w-[140px] md:w-[150px] h-10 sm:h-9 text-base sm:text-base bg-card border-border"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial h-10">
                    <Select value={showCount} onValueChange={setShowCount}>
                      <SelectTrigger className="flex-1 sm:w-[70px] md:w-[80px] h-10 sm:h-10 bg-card border-border text-base sm:text-base">
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
                <TabsList className="bg-card border border-border rounded-[8px] p-0.5 sm:p-1 inline-flex w-full sm:w-auto h-9 sm:h-10">
                  <TabsTrigger
                    value="orders"
                    className="flex-1 sm:flex-initial text-sm sm:text-base px-3 sm:px-4 h-8 sm:h-9 min-h-[32px] sm:min-h-[36px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Orders
                  </TabsTrigger>
                </TabsList>



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
                            {orders.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={5} className="text-center py-6 sm:py-8 md:py-12 text-muted-foreground px-2 sm:px-4">
                                  No orders found
                                </TableCell>
                              </TableRow>
                            ) : (
                              orders.map((order) => (
                                <TableRow
                                  key={order.id}
                                  className="border-border hover:bg-accent cursor-pointer"
                                  onClick={() => router.push(`/account/orders/${order.id}`)}
                                >
                                  <TableCell className="font-medium text-foreground text-sm sm:text-sm md:text-sm px-2 sm:px-3 md:px-4 py-2 sm:py-2.5">{order.order_number}</TableCell>
                                  <TableCell className="text-muted-foreground text-sm sm:text-sm md:text-sm px-2 sm:px-3 md:px-4 py-2 sm:py-2.5">{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                  <TableCell className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5">
                                    <Badge variant={order.status === "completed" ? "default" : "secondary"}>
                                      {order.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-foreground font-medium text-sm sm:text-sm md:text-sm px-2 sm:px-3 md:px-4 py-2 sm:py-2.5">
                                    {order.currency} {order.subtotal}
                                  </TableCell>
                                  <TableCell className="text-muted-foreground text-sm sm:text-sm md:text-sm px-2 sm:px-3 md:px-4 py-2 sm:py-2.5">
                                    {order.items?.length || 0} items
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
              </Tabs>
            </div>
          )}

          {/* Keys Section */}
          {activeTab === "keys" && (
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                <Key className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary shrink-0" />
                <h1 className="text-xl sm:text-2xl md:text-2xl font-semibold">My Keys</h1>
              </div>

              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-card">
                        <TableHead className="text-muted-foreground font-medium px-4 py-3">Product</TableHead>
                        <TableHead className="text-muted-foreground font-medium px-4 py-3">Key</TableHead>
                        <TableHead className="text-muted-foreground font-medium px-4 py-3">Order #</TableHead>
                        <TableHead className="text-muted-foreground font-medium px-4 py-3">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {keysLoading ? (
                        <TableRow><TableCell colSpan={4} className="text-center py-8">Loading keys...</TableCell></TableRow>
                      ) : keys.length === 0 ? (
                        <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No keys found</TableCell></TableRow>
                      ) : (
                        keys.map((keyItem: any) => (
                          <TableRow key={keyItem.id} className="border-border hover:bg-accent/50">
                            <TableCell className="px-4 py-3 font-medium">{keyItem.product_name || "Unknown Product"}</TableCell>
                            <TableCell className="px-4 py-3">
                              <code className="bg-muted px-2 py-1 rounded text-xs select-all">
                                {keyItem.key_code || keyItem.serial_number || "********"}
                              </code>
                            </TableCell>
                            <TableCell className="px-4 py-3">{keyItem.order_number || "-"}</TableCell>
                            <TableCell className="px-4 py-3 text-muted-foreground text-sm">
                              {keyItem.created_at ? new Date(keyItem.created_at).toLocaleDateString() : "-"}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}

          {/* Wishlist Section */}
          {activeTab === "wishlist" && (
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                  <Heart className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary shrink-0" />
                  <h1 className="text-xl sm:text-2xl md:text-2xl font-semibold">Wishlist</h1>
                </div>
                {wishlist.length > 0 && (
                  <Button variant="destructive" size="sm" onClick={handleClearWishlist} className="gap-2">
                    <Trash2 className="h-4 w-4" /> Clear Wishlist
                  </Button>
                )}
              </div>

              {wishlist.length === 0 ? (
                <div className="bg-card border border-border rounded-lg p-6 sm:p-8 md:p-12 text-center">
                  <p className="text-muted-foreground text-sm sm:text-base">No items in your wishlist</p>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border hover:bg-card">
                          <TableHead className="px-4 py-3">Product</TableHead>
                          <TableHead className="px-4 py-3">Price</TableHead>
                          <TableHead className="px-4 py-3 text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {wishlist.map((product) => (
                          <TableRow key={product.id} className="border-border hover:bg-accent/50">
                            <TableCell className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.image}`} alt={product.title} className="w-12 h-12 rounded object-cover" />
                                <a href={`/product/${product.slug}`}>
                                  <span className="font-medium text-sm line-clamp-2 md:line-clamp-1 hover:text-primary">{product.title}</span>
                                </a>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 font-semibold text-primary">
                              ${product?.best_price || 0}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleRemoveFromWishlist(product.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notifications Section */}
          {activeTab === "notifications" && (
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                <Megaphone className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary shrink-0" />
                <h1 className="text-xl sm:text-2xl md:text-2xl font-semibold">Notifications</h1>
              </div>

              <div className="bg-card border border-border rounded-lg divide-y divide-border">
                {notificationsLoading ? (
                  <div className="p-8 text-center">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">No notifications</div>
                ) : (
                  notifications.map((notif: any) => (
                    <div key={notif.id} className={`p-4 hover:bg-accent/50 transition-colors ${!notif.read_at ? 'bg-primary/5' : ''}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{notif.data?.message || notif.message || "Notification"}</p>
                          <p className="text-xs text-muted-foreground">
                            {notif.created_at ? new Date(notif.created_at).toLocaleString() : ""}
                          </p>
                        </div>
                        {!notif.read_at && (
                          <Badge variant="default" className="h-2 w-2 p-0 rounded-full" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Addresses Section */}
          {activeTab === "addresses" && (
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                  <Building2 className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary shrink-0" />
                  <h1 className="text-xl sm:text-2xl md:text-2xl font-semibold">Addresses</h1>
                </div>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" /> Add Address
                </Button>
              </div>

              {addressesLoading ? (
                <div className="text-center py-12">Loading addresses...</div>
              ) : addresses.length === 0 ? (
                <div className="bg-card border border-border rounded-lg p-6 sm:p-8 md:p-12 text-center">
                  <p className="text-muted-foreground">No saved addresses found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address: any) => (
                    <Card key={address.id} className="bg-card border-border relative">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{address.name}</h3>
                          {address.is_default && <Badge variant="secondary">Default</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{address.address}</p>
                        <p className="text-sm text-muted-foreground">{address.city}, {address.state || ""} {address.postcode}</p>
                        <p className="text-sm text-muted-foreground">{address.country}</p>
                        <div className="mt-4 flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">Delete</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Refunds Section */}
          {activeTab === "refunds" && (
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                <RotateCcw className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary shrink-0" />
                <h1 className="text-xl sm:text-2xl md:text-2xl font-semibold">Refunds</h1>
              </div>

              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-card">
                        <TableHead className="px-4 py-3">Order #</TableHead>
                        <TableHead className="px-4 py-3">Reason</TableHead>
                        <TableHead className="px-4 py-3">Status</TableHead>
                        <TableHead className="px-4 py-3">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {refundsLoading ? (
                        <TableRow><TableCell colSpan={4} className="text-center py-8">Loading refunds...</TableCell></TableRow>
                      ) : refunds.length === 0 ? (
                        <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No refund requests found</TableCell></TableRow>
                      ) : (
                        refunds.map((refund: any) => (
                          <TableRow key={refund.id} className="border-border hover:bg-accent/50">
                            <TableCell className="px-4 py-3 font-medium">{refund.order_number}</TableCell>
                            <TableCell className="px-4 py-3">{refund.reason || "N/A"}</TableCell>
                            <TableCell className="px-4 py-3">
                              <Badge variant={refund.status === "approved" ? "default" : refund.status === "rejected" ? "destructive" : "secondary"}>
                                {refund.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-muted-foreground text-sm">
                              {refund.created_at ? new Date(refund.created_at).toLocaleDateString() : "-"}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}

          {/* Recently Viewed Section */}
          {activeTab === "recently-viewed" && (
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                <History className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary shrink-0" />
                <h1 className="text-xl sm:text-2xl md:text-2xl font-semibold">Recently Viewed</h1>
              </div>

              {recentlyViewedLoading ? (
                <div className="text-center py-12">Loading recently viewed products...</div>
              ) : recentlyViewed.length === 0 ? (
                <div className="bg-card border border-border rounded-lg p-6 sm:p-8 md:p-12 text-center">
                  <p className="text-muted-foreground">No recently viewed products.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {recentlyViewed.map((item: any) => {
                    const product = item.product || item;
                    return (
                      <Card key={product.id} className="bg-card border-border overflow-hidden hover:border-primary/50 transition-colors cursor-pointer" onClick={() => router.push(`/products/${product.slug}`)}>
                        <div className="aspect-video relative">
                          <img
                            src={product.image || "/placeholder-game.jpg"}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-medium text-sm line-clamp-1">{product.title}</h3>
                          <p className="text-primary font-bold mt-1">
                            {product.lowest_price?.symbol || "$"}{typeof product.lowest_price === 'object' ? product.lowest_price?.price : product.lowest_price || "0.00"}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Price Alerts Section */}
          {activeTab === "alerts" && (
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                <BellRing className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary shrink-0" />
                <h1 className="text-xl sm:text-2xl md:text-2xl font-semibold">Price Alerts</h1>
              </div>

              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-card">
                        <TableHead className="px-4 py-3">Product</TableHead>
                        <TableHead className="px-4 py-3">Type</TableHead>
                        <TableHead className="px-4 py-3">Target</TableHead>
                        <TableHead className="px-4 py-3">Status</TableHead>
                        <TableHead className="px-4 py-3 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {alertsLoading ? (
                        <TableRow><TableCell colSpan={5} className="text-center py-8">Loading alerts...</TableCell></TableRow>
                      ) : alerts.length === 0 ? (
                        <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No active price alerts.</TableCell></TableRow>
                      ) : (
                        alerts.map((alert: any) => (
                          <TableRow key={alert.id} className="border-border hover:bg-accent/50">
                            <TableCell className="px-4 py-3 font-medium">{alert.product?.title || "Product"}</TableCell>
                            <TableCell className="px-4 py-3">
                              <Badge variant="outline" className="capitalize">
                                {alert.type || "Price"}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-4 py-3 font-semibold text-primary">
                              {alert.currency_symbol || "$"}{alert.target_price || "0.00"}
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              <Badge variant={alert.is_active ? "default" : "secondary"}>
                                {alert.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-right">
                              <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}


          {/* Balance Section */}
          {activeTab === "credit" && (
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                <Wallet className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary shrink-0" />
                <h1 className="text-xl sm:text-2xl md:text-2xl font-semibold">Balance</h1>
              </div>

              {/* Balance Summary Card */}
              <div className="max-w-md">
                <Card className="bg-primary/10 border-primary/20">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <p className="font-medium text-muted-foreground uppercase tracking-wider text-xs">Total Balance</p>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="text-muted-foreground hover:text-foreground">
                            <Info className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your current account balance</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-bold text-primary">
                        {wallet?.currency === "USD" ? "$" : wallet?.currency}
                        {(wallet?.balance || 0).toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>


              {/* Balance Details Section */}
              < div className="space-y-4" >
                <Tabs value={balanceTab} onValueChange={setBalanceTab} className="w-full">
                  <TabsList className="bg-card border border-border p-0.5 sm:p-1 inline-flex w-full sm:w-auto h-9 sm:h-10">
                    <TabsTrigger
                      value="history"
                      className="flex-1 sm:flex-initial text-sm sm:text-base px-3 sm:px-4 h-8 sm:h-9 min-h-[32px] sm:min-h-[36px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      History
                    </TabsTrigger>
                    {user?.role === 'seller' && (
                      <TabsTrigger
                        value="payout"
                        className="flex-1 sm:flex-initial text-sm sm:text-base px-3 sm:px-4 h-8 sm:h-9 min-h-[32px] sm:min-h-[36px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        New Payout
                      </TabsTrigger>
                    )}
                    <TabsTrigger
                      value="topup"
                      className="flex-1 sm:flex-initial text-sm sm:text-base px-3 sm:px-4 h-8 sm:h-9 min-h-[32px] sm:min-h-[36px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Top Up
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="history" className="mt-4 space-y-4">
                    {/* Filters */}
                    <div className="flex flex-row gap-3 sm:gap-4">
                      <div className="relative w-full flex justify-center items-center">
                        <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Search for products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 sm:pl-10 h-9 text-base sm:text-base bg-card border-border focus:border-primary focus:ring-primary rounded-[8px]"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial">
                          <Input
                            type="date"
                            className="flex-1 sm:w-[140px] md:w-[150px] h-9 text-base sm:text-base bg-card border-border rounded-[8px]"
                          />
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial">
                          <Select value={balanceType} onValueChange={setBalanceType}>
                            <SelectTrigger className="flex-1 sm:w-[140px] md:w-[150px] h-9 bg-card border-border text-base sm:text-base rounded-[8px]">
                              <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="refund">Refund</SelectItem>
                              <SelectItem value="payout">Payout</SelectItem>
                              <SelectItem value="topup">Top Up</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial">
                          <Select value={showCount} onValueChange={setShowCount}>
                            <SelectTrigger className="flex-1 sm:w-[70px] md:w-[80px] h-9 bg-card border-border text-base sm:text-base rounded-[8px]">
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

                    {/* Transaction History Table */}
                    <div className="bg-card border border-border rounded-[8px] overflow-hidden">
                      <div className="overflow-x-auto -mx-1 sm:mx-0">
                        <div className="inline-block min-w-full align-middle px-1 sm:px-0">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-border hover:bg-card">
                                <TableHead className="text-muted-foreground font-medium text-sm sm:text-sm md:text-sm px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3">Operation type</TableHead>
                                <TableHead className="text-muted-foreground font-medium text-sm sm:text-sm md:text-sm px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3">Details</TableHead>
                                <TableHead className="text-muted-foreground font-medium text-sm sm:text-sm md:text-sm px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3">Order ID</TableHead>
                                <TableHead className="text-muted-foreground font-medium text-sm sm:text-sm md:text-sm px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3">Status</TableHead>
                                <TableHead className="text-muted-foreground font-medium text-sm sm:text-sm md:text-sm px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3">Date</TableHead>
                                <TableHead className="text-muted-foreground font-medium text-sm sm:text-sm md:text-sm px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3">Expiration date</TableHead>
                                <TableHead className="text-muted-foreground font-medium text-sm sm:text-sm md:text-sm px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3">Value</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {transactionsLoading ? (
                                <TableRow>
                                  <TableCell colSpan={7} className="text-center py-6 sm:py-8 md:py-12 text-muted-foreground px-2 sm:px-4">
                                    Loading transactions...
                                  </TableCell>
                                </TableRow>
                              ) : transactions.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={7} className="text-center py-6 sm:py-8 md:py-12 text-muted-foreground px-2 sm:px-4">
                                    No transactions found
                                  </TableCell>
                                </TableRow>
                              ) : (
                                transactions.map((transaction) => (
                                  <TableRow key={transaction.id} className="border-border hover:bg-accent">
                                    <TableCell className="text-foreground text-sm sm:text-sm md:text-sm px-2 sm:px-3 md:px-4 py-2 sm:py-2.5">
                                      {transaction.operationType}
                                    </TableCell>
                                    <TableCell className="text-foreground text-sm sm:text-sm md:text-sm px-2 sm:px-3 md:px-4 py-2 sm:py-2.5">
                                      {transaction.details}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm sm:text-sm md:text-sm px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 font-mono">
                                      {transaction.orderId}
                                    </TableCell>
                                    <TableCell className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5">
                                      <Badge
                                        variant={transaction.status === "completed" ? "default" : "secondary"}
                                        className="text-xs"
                                      >
                                        {transaction.status}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm sm:text-sm md:text-sm px-2 sm:px-3 md:px-4 py-2 sm:py-2.5">
                                      {transaction.date}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm sm:text-sm md:text-sm px-2 sm:px-3 md:px-4 py-2 sm:py-2.5">
                                      {transaction.expirationDate}
                                    </TableCell>
                                    <TableCell className={`text-sm sm:text-sm md:text-sm px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 font-semibold ${transaction.value >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                                      }`}>
                                      ${transaction.value >= 0 ? "+" : ""}{transaction.value.toFixed(2)}
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

                  <TabsContent value="payout" className="mt-4 space-y-6">
                    {/* Progress Steps */}
                    <div className="flex items-center justify-between max-w-2xl">
                      <div className="flex items-center gap-2 flex-1">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${payoutStep >= 1 ? 'bg-primary border-primary text-primary-foreground' : 'border-muted text-muted-foreground'
                          }`}>
                          {payoutStep > 1 ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <span className="text-sm font-semibold">I</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${payoutStep >= 1 ? 'text-primary' : 'text-muted-foreground'
                            }`}>
                            Step: Select Your Payout Method
                          </p>
                        </div>
                      </div>
                      <div className={`h-0.5 flex-1 mx-2 ${payoutStep >= 2 ? 'bg-primary' : 'bg-muted'
                        }`} />
                      <div className="flex items-center gap-2 flex-1">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${payoutStep >= 2 ? 'bg-primary border-primary text-primary-foreground' : 'border-muted text-muted-foreground'
                          }`}>
                          {payoutStep > 2 ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <span className="text-sm font-semibold">II</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${payoutStep >= 2 ? 'text-primary' : 'text-muted-foreground'
                            }`}>
                            Step: Set Your Payout Amount
                          </p>
                        </div>
                      </div>
                      <div className={`h-0.5 flex-1 mx-2 ${payoutStep >= 3 ? 'bg-primary' : 'bg-muted'
                        }`} />
                      <div className="flex items-center gap-2 flex-1">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${payoutStep >= 3 ? 'bg-primary border-primary text-primary-foreground' : 'border-muted text-muted-foreground'
                          }`}>
                          <span className="text-sm font-semibold">III</span>
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${payoutStep >= 3 ? 'text-primary' : 'text-muted-foreground'
                            }`}>
                            Step: Payout Summary
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Payout Method Selection */}
                    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 space-y-4">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">Payout Method</label>
                          <Select value={payoutMethod} onValueChange={setPayoutMethod}>
                            <SelectTrigger className="w-full sm:w-[400px] h-12 bg-card border-border text-base">
                              <div className="flex items-center gap-3">
                                <Building className="h-5 w-5 text-blue-500" />
                                <SelectValue placeholder="Select payout method" />
                              </div>
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                              <SelectItem value="bank-transfer-eur">
                                <div className="flex items-center gap-2">
                                  <Building className="h-4 w-4 text-blue-500" />
                                  Bank transfer [EUR]
                                </div>
                              </SelectItem>
                              <SelectItem value="paypal">PayPal</SelectItem>
                              <SelectItem value="skrill">Skrill</SelectItem>
                            </SelectContent>
                          </Select>
                          {payoutMethod === "bank-transfer-eur" && (
                            <div className="mt-2 flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                              <span className="text-xs text-muted-foreground">Bank transfer selected</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <Switch
                            checked={instantPayout}
                            onCheckedChange={setInstantPayout}
                            id="instant-payout"
                          />
                          <div className="flex items-center gap-2">
                            <label htmlFor="instant-payout" className="text-sm text-foreground cursor-pointer">
                              Activate Instant Payout Service
                            </label>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className="text-muted-foreground hover:text-foreground">
                                  <Info className="h-4 w-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Instant payout processes within 24 hours for an additional fee</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>

                        <div className="bg-muted/50 border border-border rounded-md p-3">
                          <p className="text-sm text-muted-foreground">
                            Payout will be processed up to 7 business days, depends on the chosen payout method.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Beneficiary and Bank Details */}
                    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase">Beneficiary name</p>
                          <p className="text-sm font-medium text-foreground">Jhon dow</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase">Beneficiary address</p>
                          <p className="text-sm font-medium text-foreground">123 Main St, Anytown, USA</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase">Bank name</p>
                          <p className="text-sm font-medium text-foreground">Bank of America</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase">Bank address</p>
                          <p className="text-sm font-medium text-foreground">123 Main St, Anytown, USA</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase">IBAN</p>
                          <p className="text-sm font-medium text-foreground font-mono">1234567890</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase">SWIFT</p>
                          <p className="text-sm font-medium text-foreground font-mono">1234567890</p>
                        </div>
                      </div>
                    </div>

                    {/* GameHub Fees */}
                    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">GameHub FEES</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-border">
                          <span className="text-sm text-muted-foreground">Processing fee</span>
                          <span className="text-sm font-semibold text-foreground">€5</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-border">
                          <span className="text-sm text-muted-foreground">SEPA fee</span>
                          <span className="text-sm font-semibold text-foreground">€5</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm text-muted-foreground">Conversion fee</span>
                          <span className="text-sm font-semibold text-foreground">1%</span>
                        </div>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-muted/30 border border-border rounded-lg p-4 sm:p-6">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        To change your payment details, please contact our customer service. To add additional payment methods,
                        please contact <span className="text-primary font-medium">merchants@GameHub.com</span> with proof of ownership.
                      </p>
                    </div>

                    {/* Next Button */}
                    <div className="flex justify-end">
                      <Button
                        onClick={() => setPayoutStep(Math.min(payoutStep + 1, 3))}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8"
                      >
                        Next
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="topup" className="mt-4 space-y-6">
                    {/* Progress Steps */}
                    <div className="flex items-center justify-between max-w-2xl">
                      <div className="flex items-center gap-2 flex-1">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${topUpStep >= 1 ? 'bg-primary border-primary text-primary-foreground' : 'border-muted text-muted-foreground'
                          }`}>
                          {topUpStep > 1 ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <span className="text-sm font-semibold">I</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${topUpStep >= 1 ? 'text-primary' : 'text-muted-foreground'
                            }`}>
                            Step: Select Your Top Up Method
                          </p>
                        </div>
                      </div>
                      <div className={`h-0.5 flex-1 mx-2 ${topUpStep >= 2 ? 'bg-primary' : 'bg-muted'
                        }`} />
                      <div className="flex items-center gap-2 flex-1">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${topUpStep >= 2 ? 'bg-primary border-primary text-primary-foreground' : 'border-muted text-muted-foreground'
                          }`}>
                          {topUpStep > 2 ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <span className="text-sm font-semibold">II</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${topUpStep >= 2 ? 'text-primary' : 'text-muted-foreground'
                            }`}>
                            Step: Set Your Top Up Amount
                          </p>
                        </div>
                      </div>
                      <div className={`h-0.5 flex-1 mx-2 ${topUpStep >= 3 ? 'bg-primary' : 'bg-muted'
                        }`} />
                      <div className="flex items-center gap-2 flex-1">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${topUpStep >= 3 ? 'bg-primary border-primary text-primary-foreground' : 'border-muted text-muted-foreground'
                          }`}>
                          <span className="text-sm font-semibold">III</span>
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${topUpStep >= 3 ? 'text-primary' : 'text-muted-foreground'
                            }`}>
                            Step: Top Up Summary
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Step 1: Select Payment Method */}
                    {topUpStep === 1 && (
                      <div className="bg-card border border-border rounded-lg p-4 sm:p-6 space-y-4">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">Top Up Method</label>
                          <Select value={topUpMethod} onValueChange={setTopUpMethod}>
                            <SelectTrigger className="w-full sm:w-[400px] h-12 bg-card border-border text-base">
                              <div className="flex items-center gap-3">
                                {topUpMethod === "paypal-eur" && (
                                  <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-xs">
                                    P
                                  </div>
                                )}
                                {topUpMethod === "credit-card" && (
                                  <CreditCard className="h-5 w-5 text-primary" />
                                )}
                                {topUpMethod === "bank-transfer" && (
                                  <Building className="h-5 w-5 text-blue-500" />
                                )}
                                <SelectValue placeholder="Select top up method" />
                              </div>
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                              <SelectItem value="paypal-eur">
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-xs">
                                    P
                                  </div>
                                  PayPal [EUR]
                                </div>
                              </SelectItem>
                              <SelectItem value="credit-card">
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4" />
                                  Credit Card
                                </div>
                              </SelectItem>
                              <SelectItem value="bank-transfer">
                                <div className="flex items-center gap-2">
                                  <Building className="h-4 w-4 text-blue-500" />
                                  Bank Transfer
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Set Amount */}
                    {topUpStep === 2 && (
                      <div className="bg-card border border-border rounded-lg p-4 sm:p-6 space-y-4">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">Amount</label>
                          <div className="flex items-center gap-3">
                            <Input
                              type="number"
                              placeholder="Enter amount"
                              value={topUpAmount}
                              onChange={(e) => setTopUpAmount(e.target.value)}
                              className="flex-1 h-12 text-lg bg-card border-border focus:border-primary focus:ring-primary"
                            />
                            <div className="flex items-center gap-2">
                              <div className="bg-muted border border-border rounded-md px-4 py-3 min-w-[100px] text-center">
                                <span className="text-sm text-muted-foreground">1000</span>
                              </div>
                              <div className="px-3 py-3 bg-muted border border-border rounded-md">
                                <span className="text-sm font-medium text-foreground">EUR</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Minimum top up amount: €10.00
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Summary */}
                    {topUpStep === 3 && (
                      <div className="bg-card border border-border rounded-lg p-4 sm:p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Top Up Summary</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between py-2 border-b border-border">
                            <span className="text-sm text-muted-foreground">Payment Method</span>
                            <span className="text-sm font-medium text-foreground">
                              {topUpMethod === "paypal-eur" && "PayPal [EUR]"}
                              {topUpMethod === "credit-card" && "Credit Card"}
                              {topUpMethod === "bank-transfer" && "Bank Transfer"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-border">
                            <span className="text-sm text-muted-foreground">Amount</span>
                            <span className="text-sm font-semibold text-foreground">
                              €{topUpAmount || "0.00"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-muted-foreground">Processing Fee</span>
                            <span className="text-sm font-semibold text-foreground">€0.00</span>
                          </div>
                          <div className="pt-3 border-t border-border">
                            <div className="flex items-center justify-between">
                              <span className="text-base font-semibold text-foreground">Total</span>
                              <span className="text-lg font-bold text-primary">
                                €{topUpAmount || "0.00"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-muted/30 border border-border rounded-lg p-4 mt-4">
                          <p className="text-sm text-muted-foreground">
                            By proceeding, you agree to our terms and conditions. The amount will be added to your account balance immediately after successful payment.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setTopUpStep(Math.max(topUpStep - 1, 1))}
                        disabled={topUpStep === 1}
                        className="flex items-center gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </Button>
                      <Button
                        onClick={async () => {
                          if (topUpStep < 3) {
                            setTopUpStep(topUpStep + 1)
                          } else {
                            // Handle final submission
                            const token = localStorage.getItem("token");
                            if (!token) {
                              toast({ title: "Error", description: "Please login to top up your wallet.", variant: "destructive" });
                              return;
                            }

                            try {
                              const response = await apiService.initiateWalletDeposit(token, {
                                amount: parseFloat(topUpAmount),
                                payment_method: topUpMethod === "paypal-eur" ? "paypal" :
                                  topUpMethod === "credit-card" ? "stripe" : "bank_transfer"
                              });

                              if (response.success && response.data) {
                                // Usually this returns a checkout URL to redirect to
                                if (response.data.checkout_url) {
                                  window.location.href = response.data.checkout_url;
                                } else {
                                  toast({ title: "Success", description: "Deposit initiated successfully." });
                                  setTopUpStep(1);
                                  setTopUpAmount("");
                                }
                              } else {
                                toast({ title: "Error", description: response.error || "Failed to initiate deposit.", variant: "destructive" });
                              }
                            } catch (error) {
                              toast({ title: "Error", description: "An error occurred. Please try again.", variant: "destructive" });

                              console.error(error);
                            }
                          }
                        }}
                        disabled={topUpStep === 1 && !topUpMethod || topUpStep === 2 && !topUpAmount}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8"
                      >
                        {topUpStep === 3 ? "Confirm & Pay" : "Next"}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div >
            </div>
          )}

          {/* Offers List Section */}
          {
            activeTab === "offers-list" && (
              <div className="space-y-4 sm:space-y-5 md:space-y-6">

                {/* Breadcrumbs */}
                <div className="text-sm text-muted-foreground">
                  My Account &gt; Sales
                </div>

                {/* Header with Title and Button */}
                <div className="flex items-center justify-between">
                  <h1 className="text-xl sm:text-2xl md:text-2xl font-semibold">Offers list</h1>
                  <Button
                    onClick={() => setShowSellItem(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Sell new item
                  </Button>
                </div>

                {!showSellItem ? (
                  <div className="space-y-4">
                    {/* Offers Status Tabs */}
                    <Tabs value={offersTab} onValueChange={setOffersTab} className="w-full">
                      <TabsList className="bg-card border border-border p-0.5 sm:p-1 inline-flex w-full sm:w-auto h-9 sm:h-10">
                        <TabsTrigger
                          value="active"
                          className="flex-1 sm:flex-initial text-sm sm:text-base px-3 sm:px-4 h-8 sm:h-9 min-h-[32px] sm:min-h-[36px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          Active
                        </TabsTrigger>
                        <TabsTrigger
                          value="inactive"
                          className="flex-1 sm:flex-initial text-sm sm:text-base px-3 sm:px-4 h-8 sm:h-9 min-h-[32px] sm:min-h-[36px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          Inactive
                        </TabsTrigger>
                        <TabsTrigger
                          value="sold"
                          className="flex-1 sm:flex-initial text-sm sm:text-base px-3 sm:px-4 h-8 sm:h-9 min-h-[32px] sm:min-h-[36px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          Sold
                        </TabsTrigger>
                        <TabsTrigger
                          value="suspended"
                          className="flex-1 sm:flex-initial text-sm sm:text-base px-3 sm:px-4 h-8 sm:h-9 min-h-[32px] sm:min-h-[36px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          Suspended
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value={offersTab} className="mt-4 space-y-4">
                        {/* Search and Filters */}
                        <div className="flex flex-col gap-3 sm:gap-4">
                          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
                            <div className="relative flex-1 w-full sm:w-auto">
                              <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                              <Input
                                type="text"
                                placeholder="Search..."
                                value={offersSearch}
                                onChange={(e) => setOffersSearch(e.target.value)}
                                className="pl-9 sm:pl-10 h-10 sm:h-11 text-base sm:text-base bg-card border-border focus:border-primary focus:ring-primary"
                              />
                            </div>

                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <span className="text-sm text-muted-foreground whitespace-nowrap">Show</span>
                                <Select value={offersShowCount} onValueChange={setOffersShowCount}>
                                  <SelectTrigger className="w-[70px] sm:w-[80px] h-10 sm:h-11 bg-card border-border text-base sm:text-base">
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

                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <span className="text-sm text-muted-foreground whitespace-nowrap">Sort</span>
                                <Select value={offersSort} onValueChange={setOffersSort}>
                                  <SelectTrigger className="w-[140px] sm:w-[150px] h-10 sm:h-11 bg-card border-border text-base sm:text-base">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-popover border-border">
                                    <SelectItem value="bestselling">Bestselling</SelectItem>
                                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                                    <SelectItem value="date-newest">Date: Newest</SelectItem>
                                    <SelectItem value="date-oldest">Date: Oldest</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <Select value={offersPlatform} onValueChange={setOffersPlatform}>
                                <SelectTrigger className="w-[120px] sm:w-[140px] h-10 sm:h-11 bg-card border-border text-base sm:text-base">
                                  <SelectValue placeholder="All platforms" />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                  <SelectItem value="all">All platforms</SelectItem>
                                  <SelectItem value="windows">Windows</SelectItem>
                                  <SelectItem value="mac">Mac</SelectItem>
                                  <SelectItem value="linux">Linux</SelectItem>
                                </SelectContent>
                              </Select>

                              <Select value={offersRegion} onValueChange={setOffersRegion}>
                                <SelectTrigger className="w-[110px] sm:w-[120px] h-10 sm:h-11 bg-card border-border text-base sm:text-base">
                                  <SelectValue placeholder="All regions" />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                  <SelectItem value="all">All regions</SelectItem>
                                  <SelectItem value="global">Global</SelectItem>
                                  <SelectItem value="eu">EU</SelectItem>
                                  <SelectItem value="us">US</SelectItem>
                                </SelectContent>
                              </Select>

                              <Select value={offersPrice} onValueChange={setOffersPrice}>
                                <SelectTrigger className="w-[100px] sm:w-[110px] h-10 sm:h-11 bg-card border-border text-base sm:text-base">
                                  <SelectValue placeholder="All prices" />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                  <SelectItem value="all">All prices</SelectItem>
                                  <SelectItem value="0-10">€0 - €10</SelectItem>
                                  <SelectItem value="10-25">€10 - €25</SelectItem>
                                  <SelectItem value="25-50">€25 - €50</SelectItem>
                                  <SelectItem value="50+">€50+</SelectItem>
                                </SelectContent>
                              </Select>

                              <Select value={offersDistribution} onValueChange={setOffersDistribution}>
                                <SelectTrigger className="w-[130px] sm:w-[140px] h-10 sm:h-11 bg-card border-border text-base sm:text-base">
                                  <SelectValue placeholder="All distributions" />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                  <SelectItem value="all">All distributions</SelectItem>
                                  <SelectItem value="key">Key</SelectItem>
                                  <SelectItem value="account">Account</SelectItem>
                                  <SelectItem value="gift">Gift Card</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        {/* Offers Table */}
                        <div className="bg-card border border-border rounded-lg overflow-hidden">
                          <div className="p-3 sm:p-4 border-b border-border">
                            <p className="text-sm text-muted-foreground">7 item(s)</p>
                          </div>
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow className="border-border hover:bg-card">
                                  <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3">Product name</TableHead>
                                  <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3">Platform</TableHead>
                                  <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3">Region</TableHead>
                                  <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3">Distributions</TableHead>
                                  <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3">Available</TableHead>
                                  <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3">Retail</TableHead>
                                  <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3">Wholesale</TableHead>
                                  <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3">Last changed</TableHead>
                                  <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3">Manual Retail Advertising</TableHead>
                                  <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3"></TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {sellerOffersLoading ? (
                                  <TableRow>
                                    <TableCell colSpan={10} className="text-center py-8">
                                      Loading offers...
                                    </TableCell>
                                  </TableRow>
                                ) : sellerOffers.length === 0 ? (
                                  <TableRow>
                                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                                      No offers found
                                    </TableCell>
                                  </TableRow>
                                ) : sellerOffers.map((offer) => (
                                  <TableRow key={offer.id} className="border-border hover:bg-accent">
                                    <TableCell className="px-3 sm:px-4 py-3">
                                      <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded flex items-center justify-center text-white font-bold text-xs bg-primary`}>
                                          {/* We can use product image here ideally */}
                                          {offer.product?.title?.substring(0, 2).toUpperCase() || "IT"}
                                        </div>
                                        <span className="text-sm font-medium text-foreground">{offer.product?.title || 'Unknown Product'}</span>
                                      </div>
                                    </TableCell>
                                    <TableCell className="px-3 sm:px-4 py-3">
                                      {/* <Grid3x3 className="h-4 w-4 text-muted-foreground" /> */}
                                      <span className="text-sm">{offer.product?.platform || "PC"}</span>
                                    </TableCell>
                                    <TableCell className="px-3 sm:px-4 py-3">
                                      <span className="text-sm text-foreground">{offer.product?.region || "Global"}</span>
                                    </TableCell>
                                    <TableCell className="px-3 sm:px-4 py-3">
                                      {offer.keys_count > 0 ? <Key className="h-4 w-4 text-primary" /> : <Key className="h-4 w-4 text-muted-foreground" />}
                                    </TableCell>
                                    <TableCell className="px-3 sm:px-4 py-3">
                                      <span className="text-sm font-medium text-foreground">{offer.keys_count || 0}</span>
                                    </TableCell>
                                    <TableCell className="px-3 sm:px-4 py-3">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-foreground">€{offer.price}</span>
                                        <button className="text-muted-foreground hover:text-foreground">
                                          <Edit className="h-3 w-3" />
                                        </button>
                                      </div>
                                    </TableCell>
                                    <TableCell className="px-3 sm:px-4 py-3">
                                      <span className="text-sm text-muted-foreground">{offer.wholesale_price || "-"}</span>
                                    </TableCell>
                                    <TableCell className="px-3 sm:px-4 py-3">
                                      <span className="text-sm text-muted-foreground">{new Date(offer.updated_at).toLocaleDateString()}</span>
                                    </TableCell>
                                    <TableCell className="px-3 sm:px-4 py-3">
                                      <AlertCircle className={`h-4 w-4 ${offer.status === 'active' ? 'text-green-500' : 'text-muted-foreground'}`} />
                                    </TableCell>
                                    <TableCell className="px-3 sm:px-4 py-3">
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <button className="text-muted-foreground hover:text-foreground">
                                            <MoreVertical className="h-4 w-4" />
                                          </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-popover border-border">
                                          <DropdownMenuItem>Edit</DropdownMenuItem>
                                          <DropdownMenuItem>Manage Keys</DropdownMenuItem>
                                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                ) : (
                  // Sell New Item Form (shown when showSellItem is true)
                  <div className="space-y-4 sm:space-y-5 md:space-y-6">
                    {/* Breadcrumbs */}
                    <div className="text-sm text-muted-foreground">
                      My Account &gt; Sales &gt; Sell new item
                    </div>

                    {/* Header */}
                    <div className="flex items-center gap-2">
                      <Pencil className="h-5 w-5 text-primary" />
                      <h1 className="text-xl sm:text-2xl md:text-2xl font-semibold">Edit offer</h1>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-md ${sellItemStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                        <span className="text-sm font-medium">1. Product & Prices</span>
                      </div>
                      <ArrowRight className={`h-4 w-4 ${sellItemStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-md ${sellItemStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                        <span className="text-sm font-medium">2. Keys & Status</span>
                      </div>
                    </div>

                    {/* Step 1: Product & Prices */}
                    {sellItemStep === 1 && (
                      <div className="space-y-6">
                        {/* Product Section */}
                        <div className="bg-card border border-border rounded-lg p-4 sm:p-6 space-y-4">
                          <div className="flex items-center gap-2">
                            <Box className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-semibold">Product</h2>
                          </div>
                          <div className="space-y-3">
                            <div className="relative" ref={productSearchRef}>
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                              <Input
                                type="text"
                                placeholder="Search for product..."
                                value={productSearch}
                                onChange={(e) => {
                                  setProductSearch(e.target.value)
                                  setShowProductResults(e.target.value.length >= 2)
                                }}
                                onFocus={() => {
                                  if (productSearch.length >= 2) {
                                    setShowProductResults(true)
                                  }
                                }}
                                className="pl-10 h-12 bg-card border-border"
                              />

                              {/* Product Search Results Dropdown */}
                              {showProductResults && productSearchResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-[400px] overflow-y-auto custom-scrollbar">
                                  <div className="py-1">
                                    {productSearchResults.map((product) => (
                                      <button
                                        key={product.id}
                                        onClick={() => {
                                          setSelectedProduct(product)
                                          setProductSearch(product.title)
                                          setShowProductResults(false)
                                        }}
                                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-accent cursor-pointer transition-colors text-left"
                                      >
                                        <div className="shrink-0 w-10 h-10 rounded overflow-hidden bg-muted">
                                          <img
                                            src={product.image}
                                            alt={product.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              (e.target as HTMLImageElement).src = "/placeholder.jpg"
                                            }}
                                          />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="text-sm font-medium text-popover-foreground truncate">
                                            {product.title}
                                          </div>
                                          <div className="text-xs text-muted-foreground truncate">
                                            {product.category} {product.platform ? `• ${product.platform}` : ""}
                                          </div>
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {selectedProduct && (
                              <div className="flex items-start gap-4 p-4 bg-muted/30 border border-border rounded-lg">
                                <div className="w-16 h-16 rounded overflow-hidden bg-muted shrink-0">
                                  <img
                                    src={selectedProduct.image}
                                    alt={selectedProduct.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = "/placeholder.jpg"
                                    }}
                                  />
                                </div>
                                <div className="flex-1 space-y-2">
                                  <div>
                                    <p className="text-sm font-semibold text-foreground mb-1">{selectedProduct.title}</p>
                                    <span className="text-xs text-muted-foreground uppercase">Region</span>
                                    <p className="text-sm font-medium text-foreground">
                                      {selectedProduct.region || "Global"} (Check restrictions)
                                    </p>
                                    <div className="flex gap-1 mt-1">
                                      {["🇬🇧", "🇩🇪", "🇫🇷", "🇮🇹", "🇪🇸", "🇵🇱", "🇯🇵", "🇰🇷", "🇧🇷", "🇺🇸", "🇦🇷", "🇲🇽", "🇸🇪", "🇹🇷", "🇨🇦", "🇨🇳"].map((flag, i) => (
                                        <span key={i} className="text-xs">{flag}</span>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-xs text-muted-foreground uppercase">Language</span>
                                    <p className="text-sm font-medium text-foreground">-</p>
                                  </div>
                                  <div>
                                    <span className="text-xs text-muted-foreground uppercase">Platform</span>
                                    <div className="flex items-center gap-2 mt-1">
                                      {selectedProduct.platform && (
                                        <>
                                          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">
                                              {selectedProduct.platform.charAt(0).toUpperCase()}
                                            </span>
                                          </div>
                                          <span className="text-sm font-medium text-foreground">{selectedProduct.platform}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => {
                                    setSelectedProduct(null)
                                    setProductSearch("")
                                  }}
                                  className="text-primary hover:text-primary/80"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Prices Section - Only show after product is selected */}
                        {selectedProduct && (
                          <div className="bg-card border border-border rounded-lg p-4 sm:p-6 space-y-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5 text-primary" />
                                <h2 className="text-lg font-semibold">Prices</h2>
                              </div>
                              <Button variant="link" className="text-primary p-0 h-auto">
                                <ExternalLink className="h-4 w-4 mr-1" />
                                View Fee Table
                              </Button>
                            </div>

                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-muted-foreground">Sale on:</span>
                                <Select value={saleType} onValueChange={setSaleType}>
                                  <SelectTrigger className="w-[200px] h-10 bg-card border-border">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-popover border-border">
                                    <SelectItem value="retail">Retail</SelectItem>
                                    <SelectItem value="wholesale">Wholesale</SelectItem>
                                    <SelectItem value="retail-wholesale">Retail & Wholesale</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Retail Pricing */}
                              {(saleType === "retail" || saleType === "retail-wholesale") && (
                                <div className="space-y-4 p-4 bg-muted/20 border border-border rounded-lg">
                                  <h3 className="text-base font-semibold">Retail</h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label className="text-sm text-muted-foreground">Final Product Price:</Label>
                                      <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">€</span>
                                        <Input
                                          type="number"
                                          value={retailPrice}
                                          onChange={(e) => setRetailPrice(e.target.value)}
                                          className="pl-8 h-10 bg-card border-border"
                                          placeholder="0.00"
                                        />
                                      </div>
                                      <p className="text-xs text-muted-foreground">Current listing prices: €31.92 - €78.28</p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-sm text-muted-foreground">Profit:</Label>
                                      <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">€</span>
                                        <Input
                                          type="number"
                                          value={retailProfit}
                                          onChange={(e) => setRetailProfit(e.target.value)}
                                          className="pl-8 h-10 bg-green-500/20 border-green-500/50 text-green-600 dark:text-green-400"
                                          placeholder="0.00"
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-sm text-muted-foreground">Acquisition cost (optional):</Label>
                                      <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">€</span>
                                        <Input
                                          type="number"
                                          value={retailAcquisition}
                                          onChange={(e) => setRetailAcquisition(e.target.value)}
                                          className="pl-8 h-10 bg-card border-border"
                                          placeholder="0.00"
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-sm text-muted-foreground">Commission:</Label>
                                      <p className="text-sm font-medium">0.00 EUR</p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-sm text-muted-foreground">Supplier's share:</Label>
                                      <p className="text-sm font-medium">EUR</p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Wholesale Pricing */}
                              {(saleType === "wholesale" || saleType === "retail-wholesale") && (
                                <div className="space-y-4">
                                  {/* 10-99 Keys */}
                                  <div className="p-4 bg-muted/20 border border-border rounded-lg space-y-4">
                                    <h3 className="text-base font-semibold">Wholesale - 10-99 Keys</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label className="text-sm text-muted-foreground">Final Product Price:</Label>
                                        <div className="relative">
                                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">€</span>
                                          <Input
                                            type="number"
                                            value={wholesale10Price}
                                            onChange={(e) => setWholesale10Price(e.target.value)}
                                            className="pl-8 h-10 bg-card border-border"
                                            placeholder="0.00"
                                          />
                                        </div>
                                        <p className="text-xs text-muted-foreground">Current listing prices: €31.92 - €78.28</p>
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-sm text-muted-foreground">Profit:</Label>
                                        <div className="relative">
                                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">€</span>
                                          <Input
                                            type="number"
                                            value={wholesale10Profit}
                                            onChange={(e) => setWholesale10Profit(e.target.value)}
                                            className="pl-8 h-10 bg-green-500/20 border-green-500/50 text-green-600 dark:text-green-400"
                                            placeholder="0.00"
                                          />
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-sm text-muted-foreground">Acquisition cost (optional):</Label>
                                        <div className="relative">
                                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">€</span>
                                          <Input
                                            type="number"
                                            value={wholesale10Acquisition}
                                            onChange={(e) => setWholesale10Acquisition(e.target.value)}
                                            className="pl-8 h-10 bg-card border-border"
                                            placeholder="0.00"
                                          />
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-sm text-muted-foreground">Commission:</Label>
                                        <p className="text-sm font-medium">0.00 EUR</p>
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-sm text-muted-foreground">Supplier's share:</Label>
                                        <p className="text-sm font-medium">EUR</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* 100+ Keys */}
                                  <div className="p-4 bg-muted/20 border border-border rounded-lg space-y-4">
                                    <h3 className="text-base font-semibold">Wholesale - 100+ Keys</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label className="text-sm text-muted-foreground">Final Product Price:</Label>
                                        <div className="relative">
                                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">€</span>
                                          <Input
                                            type="number"
                                            value={wholesale100Price}
                                            onChange={(e) => setWholesale100Price(e.target.value)}
                                            className="pl-8 h-10 bg-card border-border"
                                            placeholder="0.00"
                                          />
                                        </div>
                                        <p className="text-xs text-muted-foreground">Current listing prices: €31.92 - €78.28</p>
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-sm text-muted-foreground">Profit:</Label>
                                        <div className="relative">
                                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">€</span>
                                          <Input
                                            type="number"
                                            value={wholesale100Profit}
                                            onChange={(e) => setWholesale100Profit(e.target.value)}
                                            className="pl-8 h-10 bg-green-500/20 border-green-500/50 text-green-600 dark:text-green-400"
                                            placeholder="0.00"
                                          />
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-sm text-muted-foreground">Acquisition cost (optional):</Label>
                                        <div className="relative">
                                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">€</span>
                                          <Input
                                            type="number"
                                            value={wholesale100Acquisition}
                                            onChange={(e) => setWholesale100Acquisition(e.target.value)}
                                            className="pl-8 h-10 bg-card border-border"
                                            placeholder="0.00"
                                          />
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-sm text-muted-foreground">Commission:</Label>
                                        <p className="text-sm font-medium">0.00 EUR</p>
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-sm text-muted-foreground">Supplier's share:</Label>
                                        <p className="text-sm font-medium">EUR</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step 2: Keys & Status */}
                    {sellItemStep === 2 && (
                      <div className="space-y-6">
                        {/* Keys Section */}
                        <div className="bg-card border border-border rounded-lg p-4 sm:p-6 space-y-4">
                          <div className="flex items-center gap-2">
                            <Key className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-semibold">Keys (Choose one method at least)</h2>
                          </div>
                          {selectedProduct && (
                            <div className="flex items-center justify-between p-3 bg-muted/30 border border-border rounded-lg">
                              <span className="text-sm font-medium text-foreground">{selectedProduct.title} {selectedProduct.platform ? `• ${selectedProduct.platform}` : ""}</span>
                              <button
                                onClick={() => {
                                  setSelectedProduct(null)
                                  setProductSearch("")
                                  setSellItemStep(1)
                                }}
                                className="text-primary hover:text-primary/80"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                          <div className="space-y-4">
                            <Tabs value={keyType} onValueChange={setKeyType} className="w-full">
                              <TabsList className="bg-card border border-border p-0.5 inline-flex w-full sm:w-auto h-9">
                                <TabsTrigger
                                  value="text"
                                  className="flex-1 sm:flex-initial text-sm px-4 h-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                >
                                  Text keys
                                </TabsTrigger>
                                <TabsTrigger
                                  value="image"
                                  className="flex-1 sm:flex-initial text-sm px-4 h-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                >
                                  Image keys
                                </TabsTrigger>
                              </TabsList>
                              <TabsContent value="text" className="mt-4">
                                <div className="space-y-2">
                                  <Label className="text-sm text-muted-foreground">Enter one code per line</Label>
                                  <Textarea
                                    value={textKeys}
                                    onChange={(e) => setTextKeys(e.target.value)}
                                    placeholder="gmgift&#10;2"
                                    className="min-h-[200px] bg-card border-border font-mono text-sm"
                                  />
                                </div>
                              </TabsContent>
                              <TabsContent value="image" className="mt-4">
                                <div className="space-y-4">
                                  <div>
                                    <Label className="text-sm font-medium mb-2 block">Upload image product keys</Label>
                                    <p className="text-xs text-muted-foreground mb-2">Import files: (.jpg, .jpeg, .png, .gif, .bmp, .txt, .csv)</p>
                                    <div className="flex items-center gap-3">
                                      <div className="flex-1 p-4 border-2 border-dashed border-border rounded-lg text-center">
                                        <p className="text-sm text-muted-foreground">Select files to upload</p>
                                      </div>
                                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                        <Upload className="h-4 w-4 mr-2" />
                                        Browse
                                      </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">Maximum upload file size: 100kb</p>
                                  </div>
                                </div>
                              </TabsContent>
                            </Tabs>
                          </div>
                        </div>

                        {/* Status Section */}
                        <div className="bg-card border border-border rounded-lg p-4 sm:p-6 space-y-4">
                          <div className="flex items-center gap-2">
                            <Power className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-semibold">Status</h2>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <UICheckbox
                                checked={agreeConditions}
                                onCheckedChange={(checked) => setAgreeConditions(checked === true)}
                                id="agree-conditions"
                              />
                              <Label htmlFor="agree-conditions" className="text-sm text-foreground cursor-pointer">
                                I agree to the{" "}
                                <a href="#" className="text-primary hover:underline">General Sale Conditions</a>.
                              </Label>
                            </div>
                            <div className="flex items-start gap-3">
                              <UICheckbox
                                checked={guaranteeContent}
                                onCheckedChange={(checked) => setGuaranteeContent(checked === true)}
                                id="guarantee-content"
                              />
                              <Label htmlFor="guarantee-content" className="text-sm text-foreground cursor-pointer">
                                I guarantee that the content of my offers corresponds to the descriptions on the{" "}
                                <a href="#" className="text-primary hover:underline">product page</a>.
                              </Label>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm text-muted-foreground">Status</Label>
                              <Select value={offerStatus} onValueChange={setOfferStatus}>
                                <SelectTrigger className="w-[200px] h-10 bg-card border-border">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (sellItemStep === 1) {
                            setShowSellItem(false)
                          } else {
                            setSellItemStep(sellItemStep - 1)
                          }
                        }}
                        className="flex items-center gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </Button>
                      <div className="flex gap-3">
                        {sellItemStep < 2 && (
                          <Button
                            onClick={() => setSellItemStep(2)}
                            disabled={!selectedProduct}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                          </Button>
                        )}
                        {sellItemStep === 2 && (
                          <Button
                            onClick={() => {
                              // Handle save offer

                              setShowSellItem(false)
                              setSellItemStep(1)
                            }}
                            disabled={!agreeConditions || !guaranteeContent}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                          >
                            Save Offer
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          }

          {/* Sales History Section */}
          {
            activeTab === "sales-history" && (
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                {/* Breadcrumbs */}
                <div className="text-sm text-muted-foreground">
                  My Account &gt; Sales &gt; History
                </div>

                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <h1 className="text-xl sm:text-2xl md:text-2xl font-semibold">Sales history</h1>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Financial statement</span>
                      <Select value={financialStatementMonth} onValueChange={setFinancialStatementMonth}>
                        <SelectTrigger className="w-[160px] h-10 bg-card border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          <SelectItem value="october-2025">October 2025</SelectItem>
                          <SelectItem value="september-2025">September 2025</SelectItem>
                          <SelectItem value="august-2025">August 2025</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                {/* Tabs */}
                <Tabs value={salesHistoryTab} onValueChange={setSalesHistoryTab} className="w-full">
                  <TabsList className="bg-card border border-border p-0.5 sm:p-1 inline-flex w-full sm:w-auto h-9 sm:h-10">
                    <TabsTrigger
                      value="history"
                      className="flex-1 sm:flex-initial text-sm sm:text-base px-3 sm:px-4 h-8 sm:h-9 min-h-[32px] sm:min-h-[36px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      History
                    </TabsTrigger>
                    <TabsTrigger
                      value="hold"
                      className="flex-1 sm:flex-initial text-sm sm:text-base px-3 sm:px-4 h-8 sm:h-9 min-h-[32px] sm:min-h-[36px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Hold transactions
                    </TabsTrigger>
                    <TabsTrigger
                      value="invoice"
                      className="flex-1 sm:flex-initial text-sm sm:text-base px-3 sm:px-4 h-8 sm:h-9 min-h-[32px] sm:min-h-[36px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Invoice management
                    </TabsTrigger>
                    <TabsTrigger
                      value="direct-payment"
                      className="flex-1 sm:flex-initial text-sm sm:text-base px-3 sm:px-4 h-8 sm:h-9 min-h-[32px] sm:min-h-[36px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Direct Payment
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value={salesHistoryTab} className="mt-4 space-y-4">
                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
                      <div className="relative flex-1 w-full sm:w-auto">
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Search for order ID or product..."
                          value={salesHistorySearch}
                          onChange={(e) => setSalesHistorySearch(e.target.value)}
                          className="pr-10 h-10 sm:h-11 text-base sm:text-base bg-card border-border focus:border-primary focus:ring-primary"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Input
                          type="date"
                          className="w-[140px] sm:w-[150px] h-10 sm:h-11 text-base sm:text-base bg-card border-border"
                        />
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="text-sm text-muted-foreground whitespace-nowrap">Show</span>
                          <Select value={salesHistoryShow} onValueChange={setSalesHistoryShow}>
                            <SelectTrigger className="w-[70px] sm:w-[80px] h-10 sm:h-11 bg-card border-border text-base sm:text-base">
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

                    {/* Sales History Table */}
                    <div className="bg-card border border-border rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-border hover:bg-card">
                              <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3">Product</TableHead>
                              <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3">
                                <div className="flex items-center gap-1">
                                  Order ID
                                  <ArrowUp className="h-3 w-3" />
                                  <ArrowDown className="h-3 w-3" />
                                </div>
                              </TableHead>
                              <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3">
                                <div className="flex items-center gap-1">
                                  Rating
                                  <ArrowUp className="h-3 w-3" />
                                  <ArrowDown className="h-3 w-3" />
                                </div>
                              </TableHead>
                              <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3">
                                <div className="flex items-center gap-1">
                                  QTY
                                  <ArrowUp className="h-3 w-3" />
                                  <ArrowDown className="h-3 w-3" />
                                </div>
                              </TableHead>
                              <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3">
                                <div className="flex items-center gap-1">
                                  Net Price
                                  <ArrowUp className="h-3 w-3" />
                                  <ArrowDown className="h-3 w-3" />
                                </div>
                              </TableHead>
                              <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3">
                                <div className="flex items-center gap-1">
                                  Gross Price
                                  <ArrowUp className="h-3 w-3" />
                                  <ArrowDown className="h-3 w-3" />
                                </div>
                              </TableHead>
                              <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3">
                                <div className="flex items-center gap-1">
                                  Tax rate
                                  <ArrowUp className="h-3 w-3" />
                                  <ArrowDown className="h-3 w-3" />
                                </div>
                              </TableHead>
                              <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3">
                                <div className="flex items-center gap-1">
                                  Total
                                  <ArrowUp className="h-3 w-3" />
                                  <ArrowDown className="h-3 w-3" />
                                </div>
                              </TableHead>
                              <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3">
                                <div className="flex items-center gap-1">
                                  Commission
                                  <ArrowUp className="h-3 w-3" />
                                  <ArrowDown className="h-3 w-3" />
                                </div>
                              </TableHead>
                              <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3">
                                <div className="flex items-center gap-1">
                                  Manual Ret. adv. Bid
                                  <Info className="h-3 w-3" />
                                  <ArrowUp className="h-3 w-3" />
                                  <ArrowDown className="h-3 w-3" />
                                </div>
                              </TableHead>
                              <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3">
                                <div className="flex items-center gap-1">
                                  Profit
                                  <ArrowUp className="h-3 w-3" />
                                  <ArrowDown className="h-3 w-3" />
                                </div>
                              </TableHead>
                              <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3">
                                <div className="flex items-center gap-1">
                                  Tax
                                  <ArrowUp className="h-3 w-3" />
                                  <ArrowDown className="h-3 w-3" />
                                </div>
                              </TableHead>
                              <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3">
                                <div className="flex items-center gap-1">
                                  Date
                                  <ArrowUp className="h-3 w-3" />
                                  <ArrowDown className="h-3 w-3" />
                                </div>
                              </TableHead>
                              <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3">
                                <div className="flex items-center gap-1">
                                  Type
                                  <ArrowUp className="h-3 w-3" />
                                  <ArrowDown className="h-3 w-3" />
                                </div>
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {sellerOrdersLoading ? (
                              <TableRow>
                                <TableCell colSpan={14} className="text-center py-12 text-muted-foreground">
                                  Loading orders...
                                </TableCell>
                              </TableRow>
                            ) : sellerOrders.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={14} className="text-center py-12 text-muted-foreground">
                                  No data
                                </TableCell>
                              </TableRow>
                            ) : sellerOrders.map((order) => (
                              <TableRow key={order.id} className="border-border hover:bg-accent">
                                <TableCell className="px-3 sm:px-4 py-3">
                                  {order.product_title || 'Unknown Product'}
                                </TableCell>
                                <TableCell className="px-3 sm:px-4 py-3">
                                  {order.id}
                                </TableCell>
                                <TableCell className="px-3 sm:px-4 py-3">
                                  -
                                </TableCell>
                                <TableCell className="px-3 sm:px-4 py-3">
                                  1
                                </TableCell>
                                <TableCell className="px-3 sm:px-4 py-3">
                                  €{order.price}
                                </TableCell>
                                <TableCell className="px-3 sm:px-4 py-3">
                                  €{order.price}
                                </TableCell>
                                <TableCell className="px-3 sm:px-4 py-3">
                                  0%
                                </TableCell>
                                <TableCell className="px-3 sm:px-4 py-3">
                                  €{order.price}
                                </TableCell>
                                <TableCell className="px-3 sm:px-4 py-3">
                                  -
                                </TableCell>
                                <TableCell className="px-3 sm:px-4 py-3">
                                  -
                                </TableCell>
                                <TableCell className="px-3 sm:px-4 py-3">
                                  €{order.price}
                                </TableCell>
                                <TableCell className="px-3 sm:px-4 py-3">
                                  -
                                </TableCell>
                                <TableCell className="px-3 sm:px-4 py-3">
                                  {new Date(order.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="px-3 sm:px-4 py-3">
                                  Retail
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )
          }

          {/* Requested Products Section */}
          {
            activeTab === "requested-products" && (
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                {/* Header */}
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <h1 className="text-xl sm:text-2xl md:text-2xl font-semibold">Requested product templates</h1>
                </div>

                {/* Tabs */}
                <Tabs value={requestedProductsTab} onValueChange={setRequestedProductsTab} className="w-full">
                  <TabsList className="bg-card border border-border p-0.5 sm:p-1 inline-flex w-full sm:w-auto h-9 sm:h-10">
                    <TabsTrigger
                      value="request-new"
                      className="flex-1 sm:flex-initial text-sm sm:text-base px-3 sm:px-4 h-8 sm:h-9 min-h-[32px] sm:min-h-[36px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Request new product
                    </TabsTrigger>
                    <TabsTrigger
                      value="list"
                      className="flex-1 sm:flex-initial text-sm sm:text-base px-3 sm:px-4 h-8 sm:h-9 min-h-[32px] sm:min-h-[36px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      List of Requests
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="request-new" className="mt-4">
                    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Product Name */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Product Name <span className="text-primary">*</span>
                          </Label>
                          <Input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="Enter product name"
                            className="h-10 bg-card border-border"
                          />
                        </div>

                        {/* Platform */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Platform <span className="text-primary">*</span>
                          </Label>
                          <Select value={productPlatform} onValueChange={setProductPlatform}>
                            <SelectTrigger className="h-10 bg-card border-border">
                              <SelectValue placeholder="Choose..." />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                              <SelectItem value="steam">Steam</SelectItem>
                              <SelectItem value="epic">Epic Games</SelectItem>
                              <SelectItem value="origin">Origin</SelectItem>
                              <SelectItem value="uplay">Uplay</SelectItem>
                              <SelectItem value="gog">GOG</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Console version */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Console version</Label>
                          <Select value={consoleVersion} onValueChange={setConsoleVersion}>
                            <SelectTrigger className="h-10 bg-card border-border">
                              <SelectValue placeholder="Choose..." />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                              <SelectItem value="ps5">PlayStation 5</SelectItem>
                              <SelectItem value="ps4">PlayStation 4</SelectItem>
                              <SelectItem value="xbox-series">Xbox Series X/S</SelectItem>
                              <SelectItem value="xbox-one">Xbox One</SelectItem>
                              <SelectItem value="switch">Nintendo Switch</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Region */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Region <span className="text-primary">*</span>
                          </Label>
                          <Select value={productRegion} onValueChange={setProductRegion}>
                            <SelectTrigger className="h-10 bg-card border-border">
                              <SelectValue placeholder="Choose..." />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                              <SelectItem value="global">Global</SelectItem>
                              <SelectItem value="eu">EU</SelectItem>
                              <SelectItem value="us">US</SelectItem>
                              <SelectItem value="uk">UK</SelectItem>
                              <SelectItem value="asia">Asia</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Region exceptions */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Region exceptions</Label>
                          <Input
                            type="text"
                            value={regionExceptions}
                            onChange={(e) => setRegionExceptions(e.target.value)}
                            placeholder="Enter region exceptions"
                            className="h-10 bg-card border-border"
                          />
                        </div>

                        {/* Languages */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Languages <span className="text-primary">*</span>
                          </Label>
                          <Select value={productLanguages} onValueChange={setProductLanguages}>
                            <SelectTrigger className="h-10 bg-card border-border">
                              <SelectValue placeholder="Choose..." />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                              <SelectItem value="english">English</SelectItem>
                              <SelectItem value="multi">Multi-language</SelectItem>
                              <SelectItem value="french">French</SelectItem>
                              <SelectItem value="german">German</SelectItem>
                              <SelectItem value="spanish">Spanish</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Type */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Type <span className="text-primary">*</span>
                          </Label>
                          <Select value={requestType} onValueChange={setRequestType}>
                            <SelectTrigger className="h-10 bg-card border-border">
                              <SelectValue placeholder="Choose..." />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                              <SelectItem value="key">Key</SelectItem>
                              <SelectItem value="account">Account</SelectItem>
                              <SelectItem value="gift">Gift Card</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Product type */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Product type</Label>
                          <Select value={productTypeCategory} onValueChange={setProductTypeCategory}>
                            <SelectTrigger className="h-10 bg-card border-border">
                              <SelectValue placeholder="Choose..." />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                              <SelectItem value="game">Game</SelectItem>
                              <SelectItem value="dlc">DLC</SelectItem>
                              <SelectItem value="software">Software</SelectItem>
                              <SelectItem value="subscription">Subscription</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Source URL */}
                        <div className="space-y-2 md:col-span-2">
                          <div className="flex items-center gap-2">
                            <Label className="text-sm font-medium">Source URL</Label>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className="text-muted-foreground hover:text-foreground">
                                  <HelpCircle className="h-4 w-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Provide a URL to the product page or source</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <Input
                            type="url"
                            value={sourceUrl}
                            onChange={(e) => setSourceUrl(e.target.value)}
                            placeholder="https://..."
                            className="h-10 bg-card border-border"
                          />
                        </div>

                        {/* Additional notes */}
                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-sm font-medium">Additional notes</Label>
                          <Textarea
                            value={additionalNotes}
                            onChange={(e) => setAdditionalNotes(e.target.value)}
                            placeholder="Enter any additional information..."
                            className="min-h-[100px] bg-card border-border"
                          />
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                          <span className="text-primary">*</span> required fields
                        </p>
                        <Button
                          onClick={() => {
                            // Handle save

                          }}
                          disabled={!productName || !productPlatform || !productRegion || !productLanguages || !requestType}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="list" className="mt-4">
                    <div className="bg-card border border-border rounded-lg p-6 sm:p-8 md:p-12 text-center">
                      <p className="text-muted-foreground text-sm sm:text-base">No requests found</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )
          }

          {/* Wholesale Section */}
          {
            (activeTab === "wholesale" || activeTab === "wholesale-bids") && (
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                {/* Breadcrumbs */}
                <div className="text-sm text-muted-foreground">
                  My Account &gt; Wholesale
                </div>

                {/* Header */}
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <h1 className="text-xl sm:text-2xl md:text-2xl font-semibold">Wholesale</h1>
                </div>

                {/* Tabs */}
                <Tabs value={wholesaleTab} onValueChange={setWholesaleTab} className="w-full">
                  <TabsList className="bg-card border border-border p-0.5 sm:p-1 inline-flex w-full sm:w-auto h-9 sm:h-10">
                    <TabsTrigger
                      value="offers"
                      className="flex-1 sm:flex-initial text-sm sm:text-base px-3 sm:px-4 h-8 sm:h-9 min-h-[32px] sm:min-h-[36px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Wholesale Offers
                    </TabsTrigger>
                    <TabsTrigger
                      value="best-deals"
                      className="flex-1 sm:flex-initial text-sm sm:text-base px-3 sm:px-4 h-8 sm:h-9 min-h-[32px] sm:min-h-[36px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Wholesale Best Deals
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="offers" className="mt-4 space-y-4">
                    {/* Filters Row */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm text-muted-foreground whitespace-nowrap">Filters</span>
                      <Select value={wholesaleProductType} onValueChange={setWholesaleProductType}>
                        <SelectTrigger className="w-[140px] h-10 bg-card border-border">
                          <SelectValue placeholder="Product type" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          <SelectItem value="all">All types</SelectItem>
                          <SelectItem value="game">Games</SelectItem>
                          <SelectItem value="software">Software</SelectItem>
                          <SelectItem value="dlc">DLC</SelectItem>
                          <SelectItem value="gift-card">Gift Cards</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={wholesaleGenre} onValueChange={setWholesaleGenre}>
                        <SelectTrigger className="w-[120px] h-10 bg-card border-border">
                          <SelectValue placeholder="All genres" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          <SelectItem value="all">All genres</SelectItem>
                          <SelectItem value="action">Action</SelectItem>
                          <SelectItem value="rpg">RPG</SelectItem>
                          <SelectItem value="strategy">Strategy</SelectItem>
                          <SelectItem value="sports">Sports</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={wholesaleLanguage} onValueChange={setWholesaleLanguage}>
                        <SelectTrigger className="w-[130px] h-10 bg-card border-border">
                          <SelectValue placeholder="All languages" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          <SelectItem value="all">All languages</SelectItem>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="multi">Multi-language</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="german">German</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={wholesalePlatform} onValueChange={setWholesalePlatform}>
                        <SelectTrigger className="w-[130px] h-10 bg-card border-border">
                          <SelectValue placeholder="All platforms" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          <SelectItem value="all">All platforms</SelectItem>
                          <SelectItem value="steam">Steam</SelectItem>
                          <SelectItem value="epic">Epic Games</SelectItem>
                          <SelectItem value="xbox">Xbox</SelectItem>
                          <SelectItem value="playstation">PlayStation</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={wholesaleRegion} onValueChange={setWholesaleRegion}>
                        <SelectTrigger className="w-[120px] h-10 bg-card border-border">
                          <SelectValue placeholder="All regions" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          <SelectItem value="all">All regions</SelectItem>
                          <SelectItem value="global">Global</SelectItem>
                          <SelectItem value="eu">EU</SelectItem>
                          <SelectItem value="us">US</SelectItem>
                          <SelectItem value="uk">UK</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={wholesalePrice} onValueChange={setWholesalePrice}>
                        <SelectTrigger className="w-[110px] h-10 bg-card border-border">
                          <SelectValue placeholder="All prices" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          <SelectItem value="all">All prices</SelectItem>
                          <SelectItem value="0-10">€0 - €10</SelectItem>
                          <SelectItem value="10-25">€10 - €25</SelectItem>
                          <SelectItem value="25-50">€25 - €50</SelectItem>
                          <SelectItem value="50+">€50+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Search and Toggles */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Search for products..."
                          value={wholesaleProductSearch}
                          onChange={(e) => setWholesaleProductSearch(e.target.value)}
                          className="pl-10 h-10 bg-card border-border"
                        />
                      </div>
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Search for seller..."
                          value={wholesaleSellerSearch}
                          onChange={(e) => setWholesaleSellerSearch(e.target.value)}
                          className="pl-10 h-10 bg-card border-border"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={invoiceProvidersOnly}
                            onCheckedChange={setInvoiceProvidersOnly}
                            id="invoice-providers"
                          />
                          <label htmlFor="invoice-providers" className="text-sm text-muted-foreground cursor-pointer whitespace-nowrap">
                            Invoice Providers Only
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={outOfStockOffers}
                            onCheckedChange={setOutOfStockOffers}
                            id="out-of-stock"
                          />
                          <label htmlFor="out-of-stock" className="text-sm text-muted-foreground cursor-pointer whitespace-nowrap">
                            Out of stock Offers
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Product List Controls */}
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">10000 item(s)</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground whitespace-nowrap">Sort</span>
                          <Select value={wholesaleSort} onValueChange={setWholesaleSort}>
                            <SelectTrigger className="w-[140px] h-10 bg-card border-border">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                              <SelectItem value="name-az">Name A-Z</SelectItem>
                              <SelectItem value="name-za">Name Z-A</SelectItem>
                              <SelectItem value="price-low">Price: Low to High</SelectItem>
                              <SelectItem value="price-high">Price: High to Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground whitespace-nowrap">Show</span>
                          <Select value={wholesaleShow} onValueChange={setWholesaleShow}>
                            <SelectTrigger className="w-[70px] h-10 bg-card border-border">
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

                    {/* Wholesale Products Table */}
                    <div className="bg-card border border-border rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-border hover:bg-card">
                              <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3 w-12"></TableHead>
                              <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3">Product Name</TableHead>
                              <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3">Platform</TableHead>
                              <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3">Region</TableHead>
                              <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3">Price</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {mockWholesaleProducts.map((product) => {
                              const isExpanded = expandedWholesaleProducts.has(product.id)
                              const currentQty = productQty[product.id] || "0"
                              const currentPrice = parseFloat(product.price) * parseFloat(currentQty || "0")

                              return (
                                <>
                                  <TableRow
                                    key={product.id}
                                    className="border-border hover:bg-accent cursor-pointer"
                                    onClick={() => {
                                      const newExpanded = new Set(expandedWholesaleProducts)
                                      if (isExpanded) {
                                        newExpanded.delete(product.id)
                                      } else {
                                        newExpanded.add(product.id)
                                      }
                                      setExpandedWholesaleProducts(newExpanded)
                                    }}
                                  >
                                    <TableCell className="px-3 sm:px-4 py-3">
                                      {isExpanded ? (
                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                      )}
                                    </TableCell>
                                    <TableCell className="px-3 sm:px-4 py-3">
                                      <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center shrink-0">
                                          <span className="text-xs font-bold text-foreground">#{product.name.split(' ')[0].replace('#', '')}</span>
                                        </div>
                                        <span className="text-sm font-medium text-foreground">{product.name}</span>
                                      </div>
                                    </TableCell>
                                    <TableCell className="px-3 sm:px-4 py-3">
                                      {product.platform === "xbox" ? (
                                        <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
                                          <span className="text-white text-xs font-bold">X</span>
                                        </div>
                                      ) : (
                                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                                          <span className="text-white text-xs font-bold">S</span>
                                        </div>
                                      )}
                                    </TableCell>
                                    <TableCell className="px-3 sm:px-4 py-3">
                                      <span className="text-sm text-foreground">{product.region}</span>
                                    </TableCell>
                                    <TableCell className="px-3 sm:px-4 py-3">
                                      <span className="text-sm font-semibold text-primary">from €{product.price}</span>
                                    </TableCell>
                                  </TableRow>
                                  {isExpanded && (
                                    <TableRow key={`${product.id}-expanded`} className="border-border bg-muted/30">
                                      <TableCell colSpan={5} className="px-3 sm:px-4 py-4">
                                        <div className="space-y-6" onClick={(e) => e.stopPropagation()}>
                                          {/* Ask for a Special Price Section */}
                                          <div className="bg-card border border-border rounded-lg p-4 space-y-4">
                                            <h3 className="text-base font-semibold">Ask for a Special Price</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                              <div className="space-y-2">
                                                <Label className="text-sm font-medium">Price per item</Label>
                                                <div className="relative">
                                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">€</span>
                                                  <Input
                                                    type="number"
                                                    value={specialPrice[product.id] || ""}
                                                    onChange={(e) => setSpecialPrice({ ...specialPrice, [product.id]: e.target.value })}
                                                    placeholder="0"
                                                    className="pl-8 h-10 bg-card border-border"
                                                  />
                                                </div>
                                              </div>
                                              <div className="space-y-2">
                                                <Label className="text-sm font-medium">Qty</Label>
                                                <Input
                                                  type="number"
                                                  value={specialQty[product.id] || ""}
                                                  onChange={(e) => setSpecialQty({ ...specialQty, [product.id]: e.target.value })}
                                                  placeholder="10"
                                                  className="h-10 bg-card border-border"
                                                />
                                              </div>
                                              <div className="flex items-end">
                                                <div className="flex items-center gap-2 h-10">
                                                  <UICheckbox
                                                    id={`invoice-${product.id}`}
                                                    checked={needInvoice[product.id] || false}
                                                    onCheckedChange={(checked) => setNeedInvoice({ ...needInvoice, [product.id]: checked as boolean })}
                                                  />
                                                  <Label htmlFor={`invoice-${product.id}`} className="text-sm cursor-pointer">
                                                    I need invoice
                                                  </Label>
                                                </div>
                                              </div>
                                            </div>
                                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
                                              Send Query
                                            </Button>
                                          </div>

                                          {/* Seller Information Section */}
                                          <div className="bg-card border border-border rounded-lg p-4 space-y-4">
                                            <div className="flex items-center gap-2">
                                              <User className="h-4 w-4 text-muted-foreground" />
                                              <span className="text-sm font-medium">{product.seller || "Unknown Seller"}</span>
                                            </div>

                                            {/* Retail Price Breakdown */}
                                            <div className="space-y-2">
                                              <h4 className="text-sm font-semibold">Retail Price</h4>
                                              <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                  <span className="text-xs text-muted-foreground">10-99</span>
                                                  <p className="text-sm font-medium">€{product.price10to99 || product.price}</p>
                                                </div>
                                                <div className="space-y-1">
                                                  <span className="text-xs text-muted-foreground">99+</span>
                                                  <p className="text-sm font-medium">€{product.price99plus || product.price}</p>
                                                </div>
                                              </div>
                                            </div>

                                            {/* Stock and Quantity */}
                                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                                              <div className="space-y-2">
                                                <Label className="text-sm font-medium">In Stock</Label>
                                                <p className="text-sm font-semibold">{product.stock || 0}</p>
                                              </div>
                                              <div className="space-y-2">
                                                <Label className="text-sm font-medium">Qty</Label>
                                                <Input
                                                  type="number"
                                                  value={currentQty}
                                                  onChange={(e) => setProductQty({ ...productQty, [product.id]: e.target.value })}
                                                  min="0"
                                                  max={(product.stock || 0).toString()}
                                                  className="h-10 bg-card border-border"
                                                />
                                              </div>
                                            </div>

                                            {/* Cart Summary */}
                                            <div className="flex items-center justify-between pt-2 border-t border-border">
                                              <div className="space-y-1">
                                                <p className="text-sm text-muted-foreground">Qty: {currentQty}</p>
                                                <p className="text-sm text-muted-foreground">Price: €{currentPrice.toFixed(2)}</p>
                                              </div>
                                              <Button
                                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                                disabled={parseInt(currentQty) === 0}
                                              >
                                                <ShoppingCart className="h-4 w-4 mr-2" />
                                                Add to cart
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="best-deals" className="mt-4">
                    <div className="bg-card border border-border rounded-lg p-6 sm:p-8 md:p-12 text-center">
                      <p className="text-muted-foreground text-sm sm:text-base">Wholesale Best Deals coming soon</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )
          }

          {/* Wholesale Bids Section */}
          {
            activeTab === "wholesale-bids" && (
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                {/* Breadcrumbs */}
                <div className="text-sm text-muted-foreground">
                  My Account &gt; Wholesale &gt; Wholesale bids
                </div>

                {/* Header */}
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <h1 className="text-xl sm:text-2xl md:text-2xl font-semibold">Wholesale Bids</h1>
                </div>

                <div className="bg-card border border-border rounded-lg p-6 sm:p-8 md:p-12 text-center">
                  <p className="text-muted-foreground text-sm sm:text-base">Wholesale bids section coming soon</p>
                </div>
              </div>
            )
          }

          {/* Support Section */}
          {
            activeTab === "support" && (
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                {/* View Toggle */}
                <div className="flex items-center gap-2 mb-4">
                  <Button
                    variant={supportView === "tickets" ? "default" : "outline"}
                    onClick={() => setSupportView("tickets")}
                    className="text-sm"
                  >
                    Tickets
                  </Button>
                  <Button
                    variant={supportView === "help" ? "default" : "outline"}
                    onClick={() => setSupportView("help")}
                    className="text-sm"
                  >
                    Help Center
                  </Button>
                </div>

                {supportView === "tickets" ? (
                  <>
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <h1 className="text-xl sm:text-2xl md:text-2xl font-semibold">Support</h1>
                      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        <Dialog open={showCreateTicket} onOpenChange={setShowCreateTicket}>
                          <DialogTrigger asChild>
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                              <Plus className="h-4 w-4 mr-2" />
                              Create New Ticket
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px] bg-card border-border">
                            <DialogHeader>
                              <DialogTitle>Create New Support Ticket</DialogTitle>
                              <DialogDescription>
                                Fill in the details below to create a new support ticket. Our team will respond as soon as possible.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              <div className="space-y-2">
                                <Label htmlFor="ticket-title" className="text-sm font-medium">
                                  Title <span className="text-primary">*</span>
                                </Label>
                                <Input
                                  id="ticket-title"
                                  type="text"
                                  value={ticketTitle}
                                  onChange={(e) => setTicketTitle(e.target.value)}
                                  placeholder="Enter ticket title"
                                  className="h-10 bg-card border-border"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="ticket-category" className="text-sm font-medium">
                                    Category <span className="text-primary">*</span>
                                  </Label>
                                  <Select value={ticketCategory} onValueChange={setTicketCategory}>
                                    <SelectTrigger id="ticket-category" className="h-10 bg-card border-border">
                                      <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border">
                                      <SelectItem value="orders">Orders</SelectItem>
                                      <SelectItem value="account">Account</SelectItem>
                                      <SelectItem value="payments">Payments</SelectItem>
                                      <SelectItem value="technical">Technical Issue</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="ticket-priority" className="text-sm font-medium">
                                    Priority
                                  </Label>
                                  <Select value={ticketPriority} onValueChange={setTicketPriority}>
                                    <SelectTrigger id="ticket-priority" className="h-10 bg-card border-border">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border">
                                      <SelectItem value="low">Low</SelectItem>
                                      <SelectItem value="normal">Normal</SelectItem>
                                      <SelectItem value="high">High</SelectItem>
                                      <SelectItem value="urgent">Urgent</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="ticket-message" className="text-sm font-medium">
                                  Message <span className="text-primary">*</span>
                                </Label>
                                <Textarea
                                  id="ticket-message"
                                  value={ticketMessage}
                                  onChange={(e) => setTicketMessage(e.target.value)}
                                  placeholder="Describe your issue in detail..."
                                  className="min-h-[150px] bg-card border-border"
                                />
                              </div>
                              <div className="flex items-center justify-end gap-3 pt-4">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setShowCreateTicket(false)
                                    setTicketTitle("")
                                    setTicketCategory("")
                                    setTicketPriority("normal")
                                    setTicketMessage("")
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                  onClick={async () => {
                                    if (ticketTitle && ticketCategory && ticketMessage) {
                                      try {
                                        const response = await apiService.createTicket(token!, {
                                          subject: ticketTitle,
                                          department_id: 1, // Hardcoded for now, should ideally fetch departments
                                          priority: ticketPriority,
                                          message: ticketMessage
                                        })

                                        if (response.success) {
                                          // Refresh tickets list
                                          fetchTickets()

                                          // Reset form and close dialog
                                          setShowCreateTicket(false)
                                          setTicketTitle("")
                                          setTicketCategory("")
                                          setTicketPriority("normal")
                                          setTicketMessage("")

                                          // Switch to Open tab
                                          setSupportTab("open")
                                        }
                                      } catch (error) {
                                        console.error("Failed to create ticket:", error)
                                      }
                                    }
                                  }}
                                  disabled={!ticketTitle || !ticketCategory || !ticketMessage}
                                >
                                  Create Ticket
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <div className="relative flex-1 sm:flex-initial sm:w-[200px]">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="text"
                            value={supportSearch}
                            onChange={(e) => setSupportSearch(e.target.value)}
                            placeholder="Search by id"
                            className="pl-9 h-10 bg-card border-border"
                          />
                        </div>
                        <Select value={supportShowCount} onValueChange={setSupportShowCount}>
                          <SelectTrigger className="w-[100px] h-10 bg-card border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border">
                            <SelectItem value="10">Show 10</SelectItem>
                            <SelectItem value="25">Show 25</SelectItem>
                            <SelectItem value="50">Show 50</SelectItem>
                            <SelectItem value="100">Show 100</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Important Information Banner */}
                    <div className="bg-card border-2 border-primary rounded-lg p-4">
                      <h3 className="text-base font-semibold mb-2">Important information</h3>
                      <p className="text-sm text-muted-foreground">
                        Our Customer Service Agents work 24/7. We will reply to your request shortly. Please do not create multiple tickets regarding one issue, nor reply multiple times without our answer as it may delay our response time. Thank you in advance for your understanding.
                      </p>
                    </div>

                    {/* Support Ticket Tabs */}
                    <Tabs value={supportTab} onValueChange={setSupportTab} className="w-full">
                      <TabsList className="bg-card border border-border p-0.5 sm:p-1 inline-flex w-full sm:w-auto h-9 sm:h-10">
                        <TabsTrigger
                          value="open"
                          className="flex-1 sm:flex-initial text-sm sm:text-base px-3 sm:px-4 h-8 sm:h-9 min-h-[32px] sm:min-h-[36px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          Open
                        </TabsTrigger>
                        <TabsTrigger
                          value="waiting"
                          className="flex-1 sm:flex-initial text-sm sm:text-base px-3 sm:px-4 h-8 sm:h-9 min-h-[32px] sm:min-h-[36px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          Waiting
                        </TabsTrigger>
                        <TabsTrigger
                          value="closed"
                          className="flex-1 sm:flex-initial text-sm sm:text-base px-3 sm:px-4 h-8 sm:h-9 min-h-[32px] sm:min-h-[36px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          Closed
                        </TabsTrigger>
                        <TabsTrigger
                          value="buyer-tickets"
                          className="flex-1 sm:flex-initial text-sm sm:text-base px-3 sm:px-4 h-8 sm:h-9 min-h-[32px] sm:min-h-[36px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          Buyer Tickets
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value={supportTab} className="mt-4">
                        <div className="bg-card border border-border rounded-lg overflow-hidden">
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow className="border-border hover:bg-card">
                                  <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3">ID</TableHead>
                                  <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3">Title</TableHead>
                                  <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3">Last update</TableHead>
                                  <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3">Created at</TableHead>
                                  <TableHead className="text-muted-foreground font-medium text-sm px-3 sm:px-4 py-3">Handled by</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {(() => {
                                  // Filter tickets based on active tab and search
                                  let filteredTickets = tickets.filter(ticket => {
                                    if (supportTab === "open") return ticket.status === "open"
                                    if (supportTab === "waiting") return ticket.status === "waiting"
                                    if (supportTab === "closed") return ticket.status === "closed"
                                    if (supportTab === "buyer-tickets") return true // Show all for buyer tickets
                                    return false
                                  })

                                  // Apply search filter if search query exists
                                  if (supportSearch.trim()) {
                                    filteredTickets = filteredTickets.filter(ticket =>
                                      ticket.id.toLowerCase().includes(supportSearch.toLowerCase().trim())
                                    )
                                  }

                                  if (filteredTickets.length === 0) {
                                    return (
                                      <TableRow>
                                        <TableCell colSpan={5} className="px-3 sm:px-4 py-12 text-center">
                                          <div className="space-y-4">
                                            <p className="text-muted-foreground text-sm sm:text-base">No tickets yet, create</p>
                                            <Button
                                              onClick={() => setShowCreateTicket(true)}
                                              variant="outline"
                                              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                                            >
                                              A NEW ONE
                                            </Button>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    )
                                  }

                                  return filteredTickets.map((ticket) => (
                                    <TableRow key={ticket.id} className="border-border hover:bg-accent">
                                      <TableCell className="px-3 sm:px-4 py-3">
                                        <span className="text-sm font-medium text-foreground">{ticket.id}</span>
                                      </TableCell>
                                      <TableCell className="px-3 sm:px-4 py-3">
                                        <span className="text-sm font-medium text-foreground">{ticket.title}</span>
                                      </TableCell>
                                      <TableCell className="px-3 sm:px-4 py-3">
                                        <span className="text-sm text-muted-foreground">
                                          {new Date(ticket.lastUpdate).toLocaleDateString()} {new Date(ticket.lastUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                      </TableCell>
                                      <TableCell className="px-3 sm:px-4 py-3">
                                        <span className="text-sm text-muted-foreground">
                                          {new Date(ticket.createdAt).toLocaleDateString()} {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                      </TableCell>
                                      <TableCell className="px-3 sm:px-4 py-3">
                                        <span className="text-sm text-muted-foreground">
                                          {ticket.handledBy || "-"}
                                        </span>
                                      </TableCell>
                                    </TableRow>
                                  ))
                                })()}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </>
                ) : (
                  <>
                    {/* Help Center View */}
                    <div className="space-y-6 sm:space-y-8">
                      {/* Main Heading */}
                      <div className="text-center space-y-4">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">Encountered a problem?</h1>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto">
                          <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                              type="text"
                              value={helpSearch}
                              onChange={(e) => setHelpSearch(e.target.value)}
                              placeholder="Search for..."
                              className="pl-12 h-12 sm:h-14 text-base sm:text-lg bg-card border-border rounded-lg"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Support Message Section */}
                      <div className="text-center space-y-3">
                        <h2 className="text-xl sm:text-2xl font-semibold">We're on duty, 24/7!</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
                          Welcome to the hub! Our Support Team is here to ensure that you have the best possible experience, so please don't hesitate to reach out to us if you have any questions or concerns. We're here to help!
                        </p>
                      </div>

                      {/* Category Navigation */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        <button
                          onClick={() => setHelpCategory("orders")}
                          className={`flex flex-col items-center justify-center gap-3 p-6 rounded-lg border-2 transition-colors ${helpCategory === "orders"
                            ? "border-primary bg-primary/10"
                            : "border-border bg-card hover:border-primary/50"
                            }`}
                        >
                          <PackageIcon className={`h-8 w-8 ${helpCategory === "orders" ? "text-primary" : "text-muted-foreground"}`} />
                          <span className="text-sm font-medium">Orders</span>
                        </button>
                        <button
                          onClick={() => setHelpCategory("account")}
                          className={`flex flex-col items-center justify-center gap-3 p-6 rounded-lg border-2 transition-colors ${helpCategory === "account"
                            ? "border-primary bg-primary/10"
                            : "border-border bg-card hover:border-primary/50"
                            }`}
                        >
                          <User className={`h-8 w-8 ${helpCategory === "account" ? "text-primary" : "text-muted-foreground"}`} />
                          <span className="text-sm font-medium">Account</span>
                        </button>
                        <button
                          onClick={() => setHelpCategory("payments")}
                          className={`flex flex-col items-center justify-center gap-3 p-6 rounded-lg border-2 transition-colors ${helpCategory === "payments"
                            ? "border-primary bg-primary/10"
                            : "border-border bg-card hover:border-primary/50"
                            }`}
                        >
                          <CreditCardIcon className={`h-8 w-8 ${helpCategory === "payments" ? "text-primary" : "text-muted-foreground"}`} />
                          <span className="text-sm font-medium">Payments</span>
                        </button>
                        <button
                          onClick={() => setHelpCategory("other")}
                          className={`flex flex-col items-center justify-center gap-3 p-6 rounded-lg border-2 transition-colors ${helpCategory === "other"
                            ? "border-primary bg-primary/10"
                            : "border-border bg-card hover:border-primary/50"
                            }`}
                        >
                          <HelpCircleIcon className={`h-8 w-8 ${helpCategory === "other" ? "text-primary" : "text-muted-foreground"}`} />
                          <span className="text-sm font-medium">Other</span>
                        </button>
                      </div>

                      {/* Pinned Section */}
                      <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-2 mb-4">
                          <Pin className="h-4 w-4 text-muted-foreground" />
                          <h3 className="text-sm font-semibold">Pinned</h3>
                        </div>
                        <div className="bg-card border border-border rounded-lg p-6">
                          <p className="text-sm text-muted-foreground text-center">No pinned items</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Floating Chat Button */}
                <div className="fixed bottom-6 right-6 z-50">
                  <Button
                    size="lg"
                    className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                    onClick={() => {
                      // Handle chat

                    }}
                  >
                    <MessageCircle className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            )
          }

          {
            activeTab === "settings" && (
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <h1 className="text-xl sm:text-2xl md:text-2xl font-semibold">Account Settings</h1>
                </div>
                <ProfileSettings />
              </div>
            )
          }

          {/* Other Sections Placeholder */}
          {/* {
            activeTab !== "purchases" && activeTab !== "wishlist" && activeTab !== "credit" && activeTab !== "offers-list" && activeTab !== "sales-history" && activeTab !== "requested-products" && activeTab !== "wholesale" && activeTab !== "wholesale-bids" && activeTab !== "support" && activeTab !== "settings" && (
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                <h1 className="text-xl sm:text-2xl md:text-2xl font-semibold capitalize">{activeTab.replace(/([A-Z])/g, ' $1').trim()}</h1>
                <div className="bg-card border border-border rounded-lg p-6 sm:p-8 md:p-12 text-center">
                  <p className="text-muted-foreground text-sm sm:text-base">This section is coming soon</p>
                </div>
              </div>
            )
          } */}
        </div >
      </main >
    </div >
  )
}
