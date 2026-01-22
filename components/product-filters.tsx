"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Star, Search } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { apiService, ApiCategory, ApiPlatform } from "@/lib/api-service"

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
  const [categories, setCategories] = useState<{ id: string; label: string; count: number }[]>([])
  const [platforms, setPlatforms] = useState<{ id: string; label: string; count: number }[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [isLoadingPlatforms, setIsLoadingPlatforms] = useState(true)

  const genres = [
    { id: "action", label: "Action", count: 4500 },
    { id: "rpg", label: "RPG", count: 3200 },
    { id: "strategy", label: "Strategy", count: 2100 },
    { id: "simulation", label: "Simulation", count: 1800 },
    { id: "sports", label: "Sports", count: 1200 },
    { id: "racing", label: "Racing", count: 950 },
  ]

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true)
      const response = await apiService.getCategories()
      if (response.success && response.data) {
        setCategories(response.data.map((cat: ApiCategory) => ({
          id: cat.slug,
          label: cat.name,
          count: cat.products_count || 0
        })))
      }
      setIsLoadingCategories(false)
    }

    const fetchPlatforms = async () => {
      setIsLoadingPlatforms(true)
      const response = await apiService.getPlatforms()
      if (response.success && response.data) {
        setPlatforms(response.data.map((plat: ApiPlatform) => ({
          id: plat.slug,
          label: plat.name,
          count: plat.products_count || 0
        })))
      }
      setIsLoadingPlatforms(false)
    }

    fetchCategories()
    fetchPlatforms()
  }, [])

  const updateFilters = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <div className={`space-y-3 sm:space-y-4 lg:space-y-5 transition-colors duration-300 ${theme === 'dark'
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
      <Card className="border-border/50 shadow-sm max-h-[200px] sm:max-h-[250px] lg:max-h-[300px] flex flex-col custom-scrollbar">
        <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4 flex-shrink-0">
          <CardTitle className="text-sm sm:text-base font-semibold text-card-foreground">
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 sm:space-y-2 pt-0 px-3 sm:px-4 pb-3 sm:pb-4 flex-1 overflow-y-auto text-card-foreground">
          {isLoadingCategories ? (
            <div className="flex items-center justify-center py-4">
              <span className="text-xs text-muted-foreground animate-pulse">Loading categories...</span>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-xs text-muted-foreground py-2 text-center">No categories found</div>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between py-0.5 sm:py-1">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Checkbox
                    id={`cat-${category.id}`}
                    checked={filters.category === category.id}
                    onCheckedChange={(checked) => updateFilters("category", checked ? category.id : "")}
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                  />
                  <Label
                    htmlFor={`cat-${category.id}`}
                    className="text-xs sm:text-sm font-normal cursor-pointer hover:text-primary transition-colors"
                  >
                    {category.label}
                  </Label>
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {category.count.toLocaleString()}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card className="border-border/50 shadow-sm max-h-[200px] sm:max-h-[250px] lg:max-h-[300px] flex flex-col custom-scrollbar">
        <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4 flex-shrink-0">
          <CardTitle className="text-sm sm:text-base font-semibold text-card-foreground">
            Price Range
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-3 px-3 sm:px-4 pb-3 sm:pb-4 flex-1 overflow-y-auto">
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
      <Card className="border-border/50 shadow-sm max-h-[200px] sm:max-h-[250px] lg:max-h-[300px] flex flex-col custom-scrollbar">
        <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4 flex-shrink-0">
          <CardTitle className="text-sm sm:text-base font-semibold text-card-foreground">
            Customer Rating
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-3 sm:px-4 pb-3 sm:pb-4 flex-1 overflow-y-auto">
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
      <Card className="border-border/50 shadow-sm max-h-[200px] sm:max-h-[250px] lg:max-h-[300px] flex flex-col custom-scrollbar">
        <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4 flex-shrink-0">
          <CardTitle className="text-sm sm:text-base font-semibold text-card-foreground">
            Platform
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 sm:space-y-2 pt-0 px-3 sm:px-4 pb-3 sm:pb-4 flex-1 overflow-y-auto text-card-foreground">
          {isLoadingPlatforms ? (
            <div className="flex items-center justify-center py-4">
              <span className="text-xs text-muted-foreground animate-pulse">Loading platforms...</span>
            </div>
          ) : platforms.length === 0 ? (
            <div className="text-xs text-muted-foreground py-2 text-center">No platforms found</div>
          ) : (
            platforms.map((platform) => (
              <div key={platform.id} className="flex items-center justify-between py-0.5 sm:py-1">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Checkbox
                    id={`plat-${platform.id}`}
                    checked={filters.platform === platform.id}
                    onCheckedChange={(checked) => updateFilters("platform", checked ? platform.id : "")}
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                  />
                  <Label
                    htmlFor={`plat-${platform.id}`}
                    className="text-xs sm:text-sm font-normal cursor-pointer hover:text-primary transition-colors"
                  >
                    {platform.label}
                  </Label>
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {platform.count.toLocaleString()}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Genre */}
      <Card className="border-border/50 shadow-sm max-h-[200px] sm:max-h-[250px] lg:max-h-[300px] flex flex-col custom-scrollbar">
        <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4 flex-shrink-0">
          <CardTitle className="text-sm sm:text-base font-semibold text-card-foreground">
            Genre
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 sm:space-y-2 pt-0 px-3 sm:px-4 pb-3 sm:pb-4 flex-1 overflow-y-auto">
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
