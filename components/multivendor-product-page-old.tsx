"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
  Filter,
  SortAsc
} from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { VendorComparison } from "@/components/vendor-comparison"
import { getProductById, Product } from "@/lib/products"

interface MultivendorProductPageProps {
  productId?: string
}

export function MultivendorProductPage({ productId }: MultivendorProductPageProps) {
  // Get product data or use default
  const product = productId ? getProductById(productId) : getProductById("netflix-gift-card")
  
  if (!product) {
    return (
      <div className="bg-background flex items-center justify-center py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
          <p className="text-sm text-muted-foreground mt-2">Product ID: {productId}</p>
        </div>
      </div>
    )
  }

  const [selectedVariation, setSelectedVariation] = useState(product.variations[0] || { value: "Standard", price: product.salePrice || 0 })
  const [sortBy, setSortBy] = useState("price")
  const [showAllVariations, setShowAllVariations] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = (vendor: any) => {
    addItem({
      id: parseInt(`${vendor.id}${selectedVariation.value.replace(/\D/g, '')}`) || vendor.id,
      title: `${product.title} ${selectedVariation.value}`,
      price: vendor.price,
      originalPrice: vendor.originalPrice,
      image: product.image,
      category: product.category,
      platform: product.platform || selectedVariation.platform || 'Digital',
      discount: vendor.discount || 0
    })
  }

  const sortedVendors = [...product.vendors].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price
      case "rating":
        return b.rating - a.rating
      case "reviews":
        return b.reviews - a.reviews
      default:
        return 0
    }
  })

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Product Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span>{product.category}</span>
            <span>›</span>
            <span>{product.platform || 'Digital'}</span>
            <span>›</span>
            <span>{product.title}</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start gap-6">
                <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{product.title} {selectedVariation.value}</h1>
                  <p className="text-muted-foreground mb-4">
                    {product.type === 'gift-card' ? 'Digital Key' : 'Digital Product'} 
                    {selectedVariation.region && ` • Region: ${selectedVariation.region}`}
                  </p>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <Badge className="bg-green-600 hover:bg-green-700">{product.category}</Badge>
                    <Badge variant="outline">{product.type === 'gift-card' ? 'Digital key' : 'Digital Product'}</Badge>
                    <Badge variant="outline">Instant Delivery</Badge>
                  </div>

                  {/* Product Variations */}
                  {product.variations && product.variations.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Select Amount</h3>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {(showAllVariations ? product.variations : product.variations.slice(0, 6)).map((variation) => (
                        <Button
                          key={variation.value}
                          variant={selectedVariation.value === variation.value ? "default" : "outline"}
                          className="h-12 flex flex-col items-center justify-center"
                          onClick={() => setSelectedVariation(variation)}
                        >
                          <span className="font-semibold">{variation.value}</span>
                          <span className="text-xs text-muted-foreground">${variation.price}</span>
                        </Button>
                      ))}
                    </div>
                    {product.variations.length > 6 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAllVariations(!showAllVariations)}
                        className="gap-2"
                      >
                        {showAllVariations ? (
                          <>
                            <ChevronUp className="h-4 w-4" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4" />
                            Show All ({product.variations.length})
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <Card className="dark:glass-effect">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">${selectedVariation.price || product.salePrice || 0}</div>
                    <div className="text-sm text-muted-foreground mb-4">Starting Price</div>
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Zap className="h-4 w-4 text-green-500" />
                        <span>Instant</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="h-4 w-4 text-blue-500" />
                        <span>Verified</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:glass-effect">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button className="w-full gap-2">
                      <Heart className="h-4 w-4" />
                      Add to Wishlist
                    </Button>
                    <Button variant="outline" className="w-full gap-2">
                      <Share2 className="h-4 w-4" />
                      Share Product
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Vendor Comparison Section */}
        <div className="mb-8">
          <VendorComparison vendors={product.vendors} onAddToCart={handleAddToCart} />
        </div>

        {/* Vendor Offers Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Available Offers</h2>
              <p className="text-muted-foreground">{sortedVendors.length} verified sellers available</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm">Sort by:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-background border border-border rounded px-3 py-1"
                >
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                  <option value="reviews">Reviews</option>
                </select>
              </div>
            </div>
          </div>

          {/* Vendor Cards */}
          <div className="space-y-4">
            {sortedVendors.map((vendor, index) => (
              <Card key={vendor.id} className="dark:card-hover dark:glass-effect">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {vendor.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold">{vendor.name}</h3>
                            {vendor.isVerified && (
                              <Badge className="bg-green-600 hover:bg-green-700 text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{vendor.rating}</span>
                              <span>({vendor.reviews.toLocaleString()} reviews)</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Globe className="h-4 w-4" />
                              <span>{vendor.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{vendor.reviews.toLocaleString()} reviews</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="outline" className="text-xs">
                          {vendor.isVerified ? 'Verified Seller' : 'Unverified Seller'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {vendor.avgDeliveryTime} Delivery
                        </Badge>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{vendor.avgDeliveryTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Truck className="h-4 w-4" />
                          <span>In Stock</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{vendor.support}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-6">
                      <div className="mb-2">
                        <div className="text-2xl font-bold text-primary">${vendor.price}</div>
                        {vendor.originalPrice && (
                          <div className="text-sm text-muted-foreground line-through">
                            ${vendor.originalPrice}
                          </div>
                        )}
                        {vendor.discount && vendor.discount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            -{vendor.discount}%
                          </Badge>
                        )}
                      </div>
                      <Button 
                        onClick={() => handleAddToCart(vendor)}
                        className="w-full gap-2 hover:animate-pulse-glow"
                      >
                        <CreditCard className="h-4 w-4" />
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="how-to-redeem">How to Redeem</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="vendor-info">Vendor Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card className="dark:glass-effect">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                <p className="text-muted-foreground mb-4">
                  {product.description}
                </p>
                
                <h4 className="font-semibold mb-2">Key Features</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
                  <li><strong>Value: {selectedVariation.value}</strong> {product.type === 'gift-card' ? 'to spend on streaming services' : 'for your digital needs'}</li>
                  <li><strong>Instant Delivery:</strong> Receive the digital code via email right after purchase</li>
                  <li><strong>Flexibility:</strong> Use it to pay for a new or existing subscription</li>
                  <li><strong>Convenience:</strong> No need for credit cards; just redeem and enjoy</li>
                </ul>

                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm">
                    <strong>Note:</strong> This digital code can only be activated in the <strong>{selectedVariation.region || 'Global'}</strong> region.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="how-to-redeem" className="mt-6">
            <Card className="dark:glass-effect">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">How to Redeem</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <h4 className="font-semibold mb-1">Receive Your Code</h4>
                      <p className="text-muted-foreground">Check your email for the digital code after your purchase.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <h4 className="font-semibold mb-1">Activate on Netflix</h4>
                      <p className="text-muted-foreground">Visit the Netflix website or app, and go to the "Account" section.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <h4 className="font-semibold mb-1">Enter the Code</h4>
                      <p className="text-muted-foreground">Select "Redeem gift card or promo code" and input your gift card code.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <div>
                      <h4 className="font-semibold mb-1">Enjoy Streaming</h4>
                      <p className="text-muted-foreground">Your account will be credited with {selectedVariation.value}, allowing you to stream movies and shows without any hassle.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <Card className="dark:glass-effect">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="vendor-info" className="mt-6">
            <Card className="dark:glass-effect">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Vendor Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {product.vendors.map((vendor) => (
                    <div key={vendor.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">
                            {vendor.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{vendor.name}</h4>
                          <p className="text-sm text-muted-foreground">{vendor.location}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Rating:</span>
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {vendor.rating} ({vendor.reviews.toLocaleString()})
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Location:</span>
                          <span>{vendor.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Reviews:</span>
                          <span>{vendor.reviews.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
