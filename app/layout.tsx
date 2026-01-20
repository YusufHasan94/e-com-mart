import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Suspense } from "react"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"
import { CurrencyProvider } from "@/contexts/currency-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { TopLoader } from "@/components/top-loader"
import { Header } from "@/components/header"
import "./globals.css"

export const metadata: Metadata = {
  title: "GameHub - Premium Gaming Marketplace",
  description: "Discover the best games, digital keys, and gaming accessories at unbeatable prices.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <TopLoader />
        <ThemeProvider>
          <AuthProvider>
            <CurrencyProvider>
              <CartProvider>
                <Header />
                <Suspense fallback={null}>{children}</Suspense>
              </CartProvider>
            </CurrencyProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
