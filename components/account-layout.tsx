"use client"

import { useState } from "react"
import { SidebarContent } from "@/components/sidebar-content"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useRouter } from "next/navigation"

interface AccountLayoutProps {
    children: React.ReactNode
    activeTab?: string
}

export function AccountLayout({ children, activeTab = "purchases" }: AccountLayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
    const router = useRouter()

    const handleTabChange = (tab: string) => {
        // Navigate back to the main account dashboard with the selected tab
        router.push(`/account?tab=${tab}`)
    }

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
                                handleTabChange(tab)
                                setIsMobileMenuOpen(false)
                            }}
                            expandedMenu={expandedMenu}
                            setExpandedMenu={setExpandedMenu}
                        />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:h-screen lg:sticky lg:top-0 bg-card border-r border-border">
                <SidebarContent
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    expandedMenu={expandedMenu}
                    setExpandedMenu={setExpandedMenu}
                />
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 bg-background overflow-y-auto min-h-screen">
                <div className="p-3 sm:p-4 md:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
