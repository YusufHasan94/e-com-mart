"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"

interface ProductFiltersProps {
  filters: {
    category: string
    priceRange: number[]
    rating: number
    platform: string
    genre: string
  }
  onFiltersChange: (filters: any) => void
}

export function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
  const categories = [
    { id: "games", label: "Games", count: 15420 },
    { id: "software", label: "Software", count: 5230 },
    { id: "gift-cards", label: "Gift Cards", count: 45 },
    { id: "dlc", label: "DLC & Add-ons", count: 2100 },
    { id: "hardware", label: "Hardware", count: 850 },
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
    <div className="space-y-6">
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={filters.category === category.id}
                  onCheckedChange={(checked) => updateFilters("category", checked ? category.id : "")}
                />
                <Label htmlFor={category.id} className="text-sm font-normal cursor-pointer">
                  {category.label}
                </Label>
              </div>
              <span className="text-xs text-muted-foreground">{category.count.toLocaleString()}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => updateFilters("priceRange", value)}
            max={300}
            step={5}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </CardContent>
      </Card>

      {/* Rating */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Customer Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={filters.rating.toString()}
            onValueChange={(value) => updateFilters("rating", Number.parseInt(value))}
          >
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                <Label htmlFor={`rating-${rating}`} className="flex items-center gap-1 cursor-pointer">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm">& Up</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Platform */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Platform</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {platforms.map((platform) => (
            <div key={platform.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={platform.id}
                  checked={filters.platform === platform.id}
                  onCheckedChange={(checked) => updateFilters("platform", checked ? platform.id : "")}
                />
                <Label htmlFor={platform.id} className="text-sm font-normal cursor-pointer">
                  {platform.label}
                </Label>
              </div>
              <span className="text-xs text-muted-foreground">{platform.count.toLocaleString()}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Genre */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Genre</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {genres.map((genre) => (
            <div key={genre.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={genre.id}
                  checked={filters.genre === genre.id}
                  onCheckedChange={(checked) => updateFilters("genre", checked ? genre.id : "")}
                />
                <Label htmlFor={genre.id} className="text-sm font-normal cursor-pointer">
                  {genre.label}
                </Label>
              </div>
              <span className="text-xs text-muted-foreground">{genre.count.toLocaleString()}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
