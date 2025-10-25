"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Star, 
  Shield, 
  Clock, 
  CheckCircle, 
  Truck, 
  Users, 
  Award,
  Zap,
  Globe,
  CreditCard,
  MessageCircle,
  X,
  ArrowRight
} from "lucide-react"
import { Vendor } from "@/lib/products"

interface VendorComparisonProps {
  vendors: Vendor[]
  onAddToCart: (vendor: Vendor) => void
}
export function VendorComparison({ vendors, onAddToCart }: VendorComparisonProps) {
  const [selectedVendors, setSelectedVendors] = useState<number[]>([])
  const [showComparison, setShowComparison] = useState(false)

  const toggleVendor = (vendorId: number) => {
    setSelectedVendors(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    )
  }

  const selectedVendorData = vendors.filter(vendor => selectedVendors.includes(vendor.id))

  return (
    <div className="space-y-6">
      {/* Vendor Selection */}
      <Card className="dark:glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Compare Vendors
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select up to 3 vendors to compare their offers and features
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vendors.map((vendor) => (
              <div 
                key={vendor.id}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedVendors.includes(vendor.id) 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => toggleVendor(vendor.id)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Checkbox 
                    checked={selectedVendors.includes(vendor.id)}
                    onChange={() => toggleVendor(vendor.id)}
                  />
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">
                      {vendor.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{vendor.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{vendor.rating}</span>
                      <span>({vendor.reviews.toLocaleString()})</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-primary">${vendor.price}</div>
                  {vendor.originalPrice && (
                    <div className="text-sm text-muted-foreground line-through">
                      ${vendor.originalPrice}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {selectedVendors.length > 0 && (
            <div className="mt-4 flex justify-center">
              <Button 
                onClick={() => setShowComparison(true)}
                className="gap-2"
              >
                Compare Selected ({selectedVendors.length})
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comparison Table */}
      {showComparison && selectedVendorData.length > 0 && (
        <Card className="dark:glass-effect">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Vendor Comparison</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowComparison(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Feature</th>
                    {selectedVendorData.map((vendor) => (
                      <th key={vendor.id} className="text-center p-3 font-semibold">
                        <div className="flex flex-col items-center">
                          <span>{vendor.name}</span>
                          <span className="text-sm text-primary font-bold">${vendor.price}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Price</td>
                    {selectedVendorData.map((vendor) => (
                      <td key={vendor.id} className="text-center p-3">
                        <div className="text-lg font-bold text-primary">${vendor.price}</div>
                        {vendor.originalPrice && (
                          <div className="text-sm text-muted-foreground line-through">
                            ${vendor.originalPrice}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Rating</td>
                    {selectedVendorData.map((vendor) => (
                      <td key={vendor.id} className="text-center p-3">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{vendor.rating}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ({vendor.reviews.toLocaleString()} reviews)
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Delivery Time</td>
                    {selectedVendorData.map((vendor) => (
                      <td key={vendor.id} className="text-center p-3">
                        <div className="flex items-center justify-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{vendor.avgDeliveryTime}</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Support</td>
                    {selectedVendorData.map((vendor) => (
                      <td key={vendor.id} className="text-center p-3">
                        <div className="flex items-center justify-center gap-1">
                          <MessageCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{vendor.support}</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Verified Seller</td>
                    {selectedVendorData.map((vendor) => (
                      <td key={vendor.id} className="text-center p-3">
                        <div className="flex items-center justify-center">
                          {vendor.isVerified ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <X className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Location</td>
                    {selectedVendorData.map((vendor) => (
                      <td key={vendor.id} className="text-center p-3">
                        <div className="flex items-center justify-center gap-1">
                          <Globe className="h-4 w-4" />
                          <span className="text-sm">{vendor.location}</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Reviews</td>
                    {selectedVendorData.map((vendor) => (
                      <td key={vendor.id} className="text-center p-3">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">{vendor.reviews.toLocaleString()}</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Action</td>
                    {selectedVendorData.map((vendor) => (
                      <td key={vendor.id} className="text-center p-3">
                        <Button size="sm" className="gap-2" onClick={() => onAddToCart(vendor)}>
                          <CreditCard className="h-4 w-4" />
                          Buy Now
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
