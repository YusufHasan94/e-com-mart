"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Star, Search } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

interface ProductFiltersProps {
  filters: {
    search: string
    category: string
    priceRange: number[]
    rating: number
    platform: string
    genre: string
  }
  onFiltersChange: (filters: any) => void
}

export function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
  const { theme } = useTheme()
  
  const categories = [
    { id: "game-keys", label: "Game Keys", count: 15420 },
    { id: "in-game-currency", label: "In-Game Currency / Points", count: 8230 },
    { id: "dlcs-addons", label: "DLCs & Add-Ons", count: 2100 },
    { id: "gift-cards", label: "Gift Cards", count: 450 },
    { id: "subscriptions", label: "Subscriptions", count: 1200 },
    { id: "software-licenses", label: "Software Licenses", count: 5230 },
    { id: "vpn-security", label: "VPNs & Security Tools", count: 850 },
    { id: "mobile-topups", label: "Mobile Top-Ups", count: 3200 },
    { id: "esims", label: "eSIMs", count: 180 },
    { id: "digital-wallet", label: "Digital Wallet Vouchers", count: 950 },
  ]

  const platforms = [
    { id: "steam", label: "Steam", count: 12500 },
    { id: "epic", label: "Epic Games", count: 3200 },
    { id: "origin", label: "Origin", count: 1800 },
    { id: "uplay", label: "Ubisoft Connect", count: 950 },
    { id: "gog", label: "GOG", count: 2100 },
  ]

  const genres = [
    { id: "action", label: "Action", count: 4500 },
    { id: "rpg", label: "RPG", count: 3200 },
    { id: "strategy", label: "Strategy", count: 2100 },
    { id: "simulation", label: "Simulation", count: 1800 },
    { id: "sports", label: "Sports", count: 1200 },
    { id: "racing", label: "Racing", count: 950 },
  ]

  const updateFilters = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <div className={`space-y-3 sm:space-y-4 lg:space-y-5 transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-card/50 backdrop-blur-sm' 
        : 'bg-card/80 backdrop-blur-sm'
    } rounded-lg p-2 sm:p-3 lg:p-4`}>
      {/* Product Search */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name..."
              value={filters.search || ""}
              onChange={(e) => updateFilters("search", e.target.value)}
              className="pl-8 sm:pl-9 h-9 sm:h-10 text-xs sm:text-sm bg-background/50 border-input/50 focus-visible:border-ring focus-visible:ring-ring/30"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card className="border-border/50 shadow-sm max-h-[200px] sm:max-h-[250px] lg:max-h-[300px] overflow-y-auto custom-scrollbar">
        <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
          <CardTitle className="text-sm sm:text-base font-semibold text-card-foreground">
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 sm:space-y-2 pt-0 px-3 sm:px-4 pb-3 sm:pb-4">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between py-0.5 sm:py-1">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Checkbox
                  id={category.id}
                  checked={filters.category === category.id}
                  onCheckedChange={(checked) => updateFilters("category", checked ? category.id : "")}
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                />
                <Label 
                  htmlFor={category.id} 
                  className="text-xs sm:text-sm font-normal cursor-pointer text-card-foreground hover:text-primary transition-colors"
                >
                  {category.label}
                </Label>
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {category.count.toLocaleString()}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card className="border-border/50 shadow-sm max-h-[200px] sm:max-h-[250px] lg:max-h-[300px] overflow-y-auto custom-scrollbar">
        <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
          <CardTitle className="text-sm sm:text-base font-semibold text-card-foreground">
            Price Range
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0 px-3 sm:px-4 pb-3 sm:pb-4">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => updateFilters("priceRange", value)}
            max={300}
            step={5}
            className="w-full"
          />
          <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground font-medium">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </CardContent>
      </Card>

      {/* Rating */}
      <Card className="border-border/50 shadow-sm max-h-[200px] sm:max-h-[250px] lg:max-h-[300px] overflow-y-auto custom-scrollbar">
        <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
          <CardTitle className="text-sm sm:text-base font-semibold text-card-foreground">
            Customer Rating
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-3 sm:px-4 pb-3 sm:pb-4">
          <RadioGroup
            value={filters.rating.toString()}
            onValueChange={(value) => updateFilters("rating", Number.parseInt(value))}
            className="space-y-1.5 sm:space-y-2"
          >
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2 sm:space-x-3 py-0.5 sm:py-1">
                <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <Label htmlFor={`rating-${rating}`} className="flex items-center gap-1 cursor-pointer text-card-foreground hover:text-primary transition-colors">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm font-medium">& Up</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Platform */}
      <Card className="border-border/50 shadow-sm max-h-[200px] sm:max-h-[250px] lg:max-h-[300px] overflow-y-auto custom-scrollbar">
        <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
          <CardTitle className="text-sm sm:text-base font-semibold text-card-foreground">
            Platform
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 sm:space-y-2 pt-0 px-3 sm:px-4 pb-3 sm:pb-4">
          {platforms.map((platform) => (
            <div key={platform.id} className="flex items-center justify-between py-0.5 sm:py-1">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Checkbox
                  id={platform.id}
                  checked={filters.platform === platform.id}
                  onCheckedChange={(checked) => updateFilters("platform", checked ? platform.id : "")}
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                />
                <Label 
                  htmlFor={platform.id} 
                  className="text-xs sm:text-sm font-normal cursor-pointer text-card-foreground hover:text-primary transition-colors"
                >
                  {platform.label}
                </Label>
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {platform.count.toLocaleString()}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Genre */}
      <Card className="border-border/50 shadow-sm max-h-[200px] sm:max-h-[250px] lg:max-h-[300px] overflow-y-auto custom-scrollbar">
        <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
          <CardTitle className="text-sm sm:text-base font-semibold text-card-foreground">
            Genre
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 sm:space-y-2 pt-0 px-3 sm:px-4 pb-3 sm:pb-4">
          {genres.map((genre) => (
            <div key={genre.id} className="flex items-center justify-between py-0.5 sm:py-1">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Checkbox
                  id={genre.id}
                  checked={filters.genre === genre.id}
                  onCheckedChange={(checked) => updateFilters("genre", checked ? genre.id : "")}
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                />
                <Label 
                  htmlFor={genre.id} 
                  className="text-xs sm:text-sm font-normal cursor-pointer text-card-foreground hover:text-primary transition-colors"
                >
                  {genre.label}
                </Label>
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {genre.count.toLocaleString()}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
