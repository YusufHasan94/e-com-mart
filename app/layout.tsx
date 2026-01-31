import type React from "react"
import type { Metadata } from "next"
import { Roboto, Roboto_Mono } from "next/font/google"
import { Suspense } from "react"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"
import { CurrencyProvider } from "@/contexts/currency-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { TopLoader } from "@/components/top-loader"
import { Header } from "@/components/header"
import "./globals.css"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
})

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
})

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
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${roboto.variable} ${robotoMono.variable} antialiased`} suppressHydrationWarning>
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
