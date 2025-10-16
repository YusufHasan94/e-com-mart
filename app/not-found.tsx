"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, ArrowLeft, Search } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

export default function NotFound() {
  const router = useRouter()
  const { theme } = useTheme()

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  const handleGoHome = () => {
    router.push("/")
  }

  const handleSearchProducts = () => {
    router.push("/products")
  }

  return (
    <div className={`min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-background via-background to-secondary/20' 
        : 'bg-gradient-to-br from-background via-background to-secondary/10'
    }`}>
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className={`w-full max-w-2xl mx-auto border-border/50 shadow-lg ${
          theme === 'dark' 
            ? 'bg-card/80 backdrop-blur-sm' 
            : 'bg-card/90 backdrop-blur-sm'
        }`}>
          <CardContent className="p-8 sm:p-12 text-center">
            {/* 404 Illustration */}
            <div className="mb-8">
              <div className="text-8xl sm:text-9xl font-bold text-primary/20 mb-4">
                404
              </div>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
            </div>

            {/* Error Message */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Page Not Found
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                Oops! The page you're looking for doesn't exist or has been moved. 
                Don't worry, let's get you back on track.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button 
                onClick={handleGoBack}
                variant="default"
                size="lg"
                className="flex items-center gap-2 h-12 px-6"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
              
              <Button 
                onClick={handleGoHome}
                variant="outline"
                size="lg"
                className="flex items-center gap-2 h-12 px-6"
              >
                <Home className="h-4 w-4" />
                Go Home
              </Button>
              
              <Button 
                onClick={handleSearchProducts}
                variant="outline"
                size="lg"
                className="flex items-center gap-2 h-12 px-6"
              >
                <Search className="h-4 w-4" />
                Browse Products
              </Button>
            </div>

            {/* Additional Help */}
            <div className="mt-8 pt-6 border-t border-border/50">
              <p className="text-sm text-muted-foreground mb-4">
                Still having trouble? Try these:
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <button 
                  onClick={() => router.push("/products")}
                  className="text-primary hover:text-primary/80 transition-colors underline"
                >
                  View All Products
                </button>
                <button 
                  onClick={() => router.push("/")}
                  className="text-primary hover:text-primary/80 transition-colors underline"
                >
                  Homepage
                </button>
                <button 
                  onClick={() => router.push("/cart")}
                  className="text-primary hover:text-primary/80 transition-colors underline"
                >
                  Shopping Cart
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  )
}
