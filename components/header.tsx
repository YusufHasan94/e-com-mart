"use client"

import { useState } from "react"
import { Search, ShoppingCart, User, Menu, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { CartDrawer } from "@/components/cart-drawer"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { state } = useCart()
  const { user, logout } = useAuth()

  console.log("Header - User state:", user)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/" className="text-xl sm:text-2xl font-bold text-primary">
                GameHub
              </Link>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
              <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
                Games
              </Link>
              <Link href="/software" className="text-sm font-medium hover:text-primary transition-colors">
                Software
              </Link>
              <Link href="/gift-cards" className="text-sm font-medium hover:text-primary transition-colors">
                Gift Cards
              </Link>
              <Link href="/deals" className="text-sm font-medium hover:text-primary transition-colors">
                Deals
              </Link>
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-md mx-4 xl:mx-6">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search for games..." className="pl-10 bg-muted/50 border-border/50 focus:border-primary" />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
              <ThemeToggle />

              {/* Cart */}
              <Button variant="ghost" size="sm" className="relative p-2 sm:p-2.5" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                {state.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-bold">
                    {state.itemCount}
                  </span>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2 sm:p-2.5">
                    {user ? (
                      <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <User className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user ? (
                    <>
                      <div className="px-2 py-1.5 text-sm font-medium">{user.name}</div>
                      <div className="px-2 py-1.5 text-xs text-muted-foreground">{user.email}</div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/account">My Account</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>My Orders</DropdownMenuItem>
                      <DropdownMenuItem>Wishlist</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/login">Sign In</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/register">Create Account</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>My Orders</DropdownMenuItem>
                      <DropdownMenuItem>Wishlist</DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <Button variant="ghost" size="sm" className="lg:hidden p-2 sm:p-2.5" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t py-4">
              <div className="flex flex-col space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder="Search for games..." className="pl-10 bg-muted/50" />
                </div>
                <nav className="flex flex-col space-y-2">
                  <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors py-2">
                    Games
                  </Link>
                  <Link href="/software" className="text-sm font-medium hover:text-primary transition-colors py-2">
                    Software
                  </Link>
                  <Link href="/gift-cards" className="text-sm font-medium hover:text-primary transition-colors py-2">
                    Gift Cards
                  </Link>
                  <Link href="/deals" className="text-sm font-medium hover:text-primary transition-colors py-2">
                    Deals
                  </Link>
                </nav>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-medium">Theme</span>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
