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
import {
  apiService,
  ApiCategory,
  ApiPlatform,
  ApiType,
  ApiRegion,
  ApiLanguage,
  ApiWorksOn,
  ApiDeveloper
} from "@/lib/api-service"

interface ProductFiltersProps {
  filters: {
    search: string
    category: string
    priceRange: number[]
    rating: number
    platform: string
    type: string
    region: string
    language: string
    works_on: string
    developer: string
  }
  onFiltersChange: (filters: any) => void
}

interface FilterOption {
  id: string
  label: string
  count: number
}

export function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
  const { theme } = useTheme()
  const [categories, setCategories] = useState<FilterOption[]>([])
  const [platforms, setPlatforms] = useState<FilterOption[]>([])
  const [types, setTypes] = useState<FilterOption[]>([])
  const [regions, setRegions] = useState<FilterOption[]>([])
  const [languages, setLanguages] = useState<FilterOption[]>([])
  const [worksOn, setWorksOn] = useState<FilterOption[]>([])
  const [developers, setDevelopers] = useState<FilterOption[]>([])

  const [isLoading, setIsLoading] = useState({
    categories: true,
    platforms: true,
    types: true,
    regions: true,
    languages: true,
    worksOn: true,
    developers: true,
    counts: true
  })

  useEffect(() => {
    const fetchData = async () => {
      // Fetch all products for count calculation
      const productsRes = await apiService.getAllProducts(200)
      const allProducts = productsRes.success && productsRes.data ? productsRes.data : []

      const counts: Record<string, Record<string, number>> = {
        categories: {},
        platforms: {},
        types: {},
        regions: {},
        languages: {},
        worksOn: {},
        developers: {}
      }

      allProducts.forEach(p => {
        const attrs = p.product_attributes || {}
        attrs.categories?.forEach(attr => counts.categories[attr.slug] = (counts.categories[attr.slug] || 0) + 1)
        attrs.platforms?.forEach(attr => counts.platforms[attr.slug] = (counts.platforms[attr.slug] || 0) + 1)
        attrs.types?.forEach(attr => counts.types[attr.slug] = (counts.types[attr.slug] || 0) + 1)
        attrs.regions?.forEach(attr => counts.regions[attr.slug] = (counts.regions[attr.slug] || 0) + 1)
        attrs.languages?.forEach(attr => counts.languages[attr.slug] = (counts.languages[attr.slug] || 0) + 1)
        attrs.works_on?.forEach(attr => counts.worksOn[attr.slug] = (counts.worksOn[attr.slug] || 0) + 1)
        if (attrs.developer?.slug) counts.developers[attrs.developer.slug] = (counts.developers[attrs.developer.slug] || 0) + 1
      })

      // Fetch attribute metadata
      const [catRes, platRes, typeRes, regRes, langRes, worksRes, devRes] = await Promise.all([
        apiService.getCategories(),
        apiService.getPlatforms(),
        apiService.getTypes(),
        apiService.getRegions(),
        apiService.getLanguages(),
        apiService.getWorksOn(),
        apiService.getDevelopers()
      ])

      if (catRes.success && catRes.data) {
        setCategories(catRes.data.map((cat: ApiCategory) => ({
          id: cat.slug,
          label: cat.name,
          count: counts.categories[cat.slug] || 0
        })))
      }
      setIsLoading(prev => ({ ...prev, categories: false }))

      if (platRes.success && platRes.data) {
        setPlatforms(platRes.data.map((plat: ApiPlatform) => ({
          id: plat.slug,
          label: plat.name,
          count: counts.platforms[plat.slug] || 0
        })))
      }
      setIsLoading(prev => ({ ...prev, platforms: false }))

      if (typeRes.success && typeRes.data) {
        setTypes(typeRes.data.map((t: ApiType) => ({
          id: t.slug,
          label: t.name,
          count: counts.types[t.slug] || 0
        })))
      }
      setIsLoading(prev => ({ ...prev, types: false }))

      if (regRes.success && regRes.data) {
        setRegions(regRes.data.map((r: ApiRegion) => ({
          id: r.slug,
          label: r.name,
          count: counts.regions[r.slug] || 0
        })))
      }
      setIsLoading(prev => ({ ...prev, regions: false }))

      if (langRes.success && langRes.data) {
        setLanguages(langRes.data.map((l: ApiLanguage) => ({
          id: l.slug,
          label: l.name,
          count: counts.languages[l.slug] || 0
        })))
      }
      setIsLoading(prev => ({ ...prev, languages: false }))

      if (worksRes.success && worksRes.data) {
        setWorksOn(worksRes.data.map((w: ApiWorksOn) => ({
          id: w.slug,
          label: w.name,
          count: counts.worksOn[w.slug] || 0
        })))
      }
      setIsLoading(prev => ({ ...prev, worksOn: false }))

      if (devRes.success && devRes.data) {
        setDevelopers(devRes.data.map((d: ApiDeveloper) => ({
          id: d.slug,
          label: d.name,
          count: counts.developers[d.slug] || 0
        })))
      }
      setIsLoading(prev => ({ ...prev, developers: false }))
    }

    fetchData()
  }, [])

  const updateFilters = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const FilterCard = ({ title, options, filterKey, loading }: { title: string, options: FilterOption[], filterKey: string, loading: boolean }) => (
    <Card className="border-border/50 shadow-sm max-h-[200px] sm:max-h-[250px] lg:max-h-[300px] flex flex-col custom-scrollbar">
      <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4 flex-shrink-0">
        <CardTitle className="text-sm sm:text-base font-semibold text-card-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5 sm:space-y-2 pt-0 px-3 sm:px-4 pb-3 sm:pb-4 flex-1 overflow-y-auto text-card-foreground">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <span className="text-xs text-muted-foreground animate-pulse">Loading {title.toLowerCase()}...</span>
          </div>
        ) : options.length === 0 ? (
          <div className="text-xs text-muted-foreground py-2 text-center">No {title.toLowerCase()} found</div>
        ) : (
          options.map((option) => (
            <div key={option.id} className="flex items-center justify-between py-0.5 sm:py-1">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Checkbox
                  id={`${filterKey}-${option.id}`}
                  checked={(filters as any)[filterKey] === option.id}
                  onCheckedChange={(checked) => updateFilters(filterKey, checked ? option.id : "")}
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                />
                <Label
                  htmlFor={`${filterKey}-${option.id}`}
                  className="text-xs sm:text-sm font-normal cursor-pointer hover:text-primary transition-colors"
                >
                  {option.label}
                </Label>
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {option.count.toLocaleString()}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )

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
      <FilterCard title="Categories" options={categories} filterKey="category" loading={isLoading.categories} />

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

      {/* Platforms */}
      <FilterCard title="Platforms" options={platforms} filterKey="platform" loading={isLoading.platforms} />

      {/* Types */}
      <FilterCard title="Types" options={types} filterKey="type" loading={isLoading.types} />

      {/* Regions */}
      <FilterCard title="Regions" options={regions} filterKey="region" loading={isLoading.regions} />

      {/* Languages */}
      <FilterCard title="Languages" options={languages} filterKey="language" loading={isLoading.languages} />

      {/* Works On */}
      <FilterCard title="Works On" options={worksOn} filterKey="works_on" loading={isLoading.worksOn} />

      {/* Developers */}
      <FilterCard title="Developers" options={developers} filterKey="developer" loading={isLoading.developers} />
    </div>
  )
}
