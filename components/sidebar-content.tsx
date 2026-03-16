"use client"

import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    ShoppingBag,
    Heart,
    Settings,
    Wallet,
    LogOut,
    TrendingUp,
    Package,
    Headphones,
    Star,
    ChevronDown,
    LayoutDashboard
} from "lucide-react"

interface SidebarContentProps {
    activeTab: string
    onTabChange: (tab: string) => void
    onItemClick?: () => void
    expandedMenu: string | null
    setExpandedMenu: (menu: string | null) => void
    walletBalance?: string
}

export function SidebarContent({
    activeTab,
    onTabChange,
    onItemClick,
    expandedMenu,
    setExpandedMenu,
    walletBalance
}: SidebarContentProps) {
    const { user, logout } = useAuth()

    // Mock user reputation
    const userReputation = 96.48

    const navigationItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, active: activeTab === "dashboard" },
        { id: "purchases", label: "Purchases", icon: ShoppingBag, active: activeTab === "purchases" },
        { id: "keys", label: "My Keys", icon: Wallet, active: activeTab === "keys" },
        { id: "wishlist", label: "Wishlist", icon: Heart, active: activeTab === "wishlist" },
        { id: "credit", label: "Balance", icon: Wallet, active: activeTab === "credit" },
        { id: "notifications", label: "Notifications", icon: Package, active: activeTab === "notifications" },
        { id: "addresses", label: "Addresses", icon: Settings, active: activeTab === "addresses" },
        { id: "refunds", label: "Refunds", icon: ShoppingBag, active: activeTab === "refunds" },
        { id: "recently-viewed", label: "Recently Viewed", icon: TrendingUp, active: activeTab === "recently-viewed" },
        { id: "alerts", label: "Price Alerts", icon: TrendingUp, active: activeTab === "alerts" },
        {
            id: "offers",
            label: "Offers",
            icon: TrendingUp,
            active: activeTab === "offers",
            hasSubMenu: true,
            subItems: [
                { id: "offers-list", label: "Offers list" },
                { id: "sales-history", label: "Sales history" },
                { id: "requested-products", label: "Requested products" }
            ]
        },
        {
            id: "wholesale",
            label: "Wholesale",
            icon: Package,
            active: activeTab === "wholesale",
            hasSubMenu: true,
            subItems: [
                { id: "wholesale-bids", label: "Wholesale bids" }
            ]
        },
        { id: "affiliate", label: "Affiliate", icon: Star, active: activeTab === "affiliate" },
        { id: "support", label: "Customer service", icon: Headphones, active: activeTab === "support" },
        { id: "settings", label: "Account settings", icon: Settings, active: activeTab === "settings" },
    ].filter(item => {
        if (["offers", "wholesale"].includes(item.id)) {
            return user?.role === "seller"
        }
        return true
    })

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
                        const hasSubMenu = 'hasSubMenu' in item && item.hasSubMenu
                        const subItems = 'subItems' in item ? item.subItems : []
                        // Check if any sub-item is active
                        const hasActiveSubItem = subItems?.some(subItem => activeTab === subItem.id) || false
                        // Expand menu if any sub-item is active or if manually expanded
                        const isExpanded = expandedMenu === item.id || (hasSubMenu && hasActiveSubItem)

                        return (
                            <div key={item.id}>
                                <button
                                    onClick={() => {
                                        if (hasSubMenu) {
                                            // If clicking on parent and a sub-item is active, just toggle expansion
                                            // Otherwise, expand and go to first sub-item
                                            if (hasActiveSubItem) {
                                                setExpandedMenu(isExpanded ? null : item.id)
                                            } else {
                                                setExpandedMenu(item.id)
                                                if (subItems && subItems.length > 0) {
                                                    handleItemClick(subItems[0].id)
                                                }
                                            }
                                        } else {
                                            handleItemClick(item.id)
                                        }
                                    }}
                                    className={`w-full flex items-center justify-between px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg transition-colors text-sm sm:text-base ${item.active && !hasActiveSubItem
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                        }`}
                                >
                                    <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 min-w-0 flex-1">
                                        <Icon className="h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5 flex-shrink-0" />
                                        <span className="font-medium truncate">{item.label}</span>
                                    </div>
                                    {/* <div className="flex items-center gap-2">
                    {item.badge && (
                      <Badge className="bg-primary text-primary-foreground text-xs sm:text-xs md:text-sm px-1.5 sm:px-2 md:px-2 py-0.5 flex-shrink-0">
                        {item.badge}
                      </Badge>
                    )}
                    {hasSubMenu && (
                      <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    )}
                  </div> */}
                                </button>
                                {hasSubMenu && isExpanded && subItems && (
                                    <div className="ml-4 mt-1 space-y-0.5">
                                        {subItems.map((subItem) => (
                                            <button
                                                key={subItem.id}
                                                onClick={() => {
                                                    handleItemClick(subItem.id)
                                                    onItemClick?.()
                                                }}
                                                className={`w-full flex items-center px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg transition-colors text-sm sm:text-base ${activeTab === subItem.id
                                                    ? "bg-primary text-primary-foreground"
                                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                    }`}
                                            >
                                                <span className="font-medium truncate">{subItem.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
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
