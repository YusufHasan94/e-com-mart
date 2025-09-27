"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductSortProps {
  sortBy: string
  onSortChange: (value: string) => void
}

export function ProductSort({ sortBy, onSortChange }: ProductSortProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Sort by:</span>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="featured">Featured</SelectItem>
          <SelectItem value="price-low">Price: Low to High</SelectItem>
          <SelectItem value="price-high">Price: High to Low</SelectItem>
          <SelectItem value="rating">Customer Rating</SelectItem>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="bestselling">Best Selling</SelectItem>
          <SelectItem value="discount">Biggest Discount</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
