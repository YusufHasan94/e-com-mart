"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Star,
  ShoppingCart,
  Truck,
  ShieldCheck,
  Award,
  MessageCircle,
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Filter,
  SortAsc,
  Plus,
  Minus,
  Heart,
  Share2,
  Eye,
  ChevronRight,
  ChevronLeft,
  Globe,
  Download,
  Monitor,
  Cpu,
  HardDrive,
  MemoryStick
} from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { getProductById, Product } from "@/lib/products"
import Link from "next/link"

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
  const [showAllOffers, setShowAllOffers] = useState(false)
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

  const featuredVendor = sortedVendors[0]
  const otherVendors = sortedVendors.slice(1)

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Navigation */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <span>{product.category}</span>
            <ChevronRight className="h-4 w-4" />
            <span>{product.platform || 'Digital'}</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        {/* Main Layout: 80% Content + 20% Featured Offer */}
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-6 lg:gap-8">
          {/* Main Content - 80% */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            {/* Product Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-wrap items-start gap-2 mb-3 sm:mb-4">
                <Badge className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm">{product.category}</Badge>
                <Badge variant="outline" className="text-xs sm:text-sm">{product.type === 'gift-card' ? 'Digital Key' : 'Digital Product'}</Badge>
              </div>
              
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">{product.title} {selectedVariation.value}</h1>
              
              <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-muted-foreground">({product.reviews} reviews)</span>
                </div>
              </div>

              {/* Product Image & Details */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="w-full sm:w-48 lg:w-64 h-48 sm:h-48 lg:h-64 bg-primary rounded-lg flex items-center justify-center relative group mx-auto sm:mx-0">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Button 
                    size="sm" 
                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    variant="secondary"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
                
                <div className="flex-1">
                  {/* Product Information Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    {/* Activation Info Card */}
                    <Card className="p-3 sm:p-4">
                      <CardContent className="p-0">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="font-medium text-sm">Activation</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">Can be activated in Global</p>
                        <Button variant="link" size="sm" className="p-0 h-auto text-xs">Check Restrictions</Button>
                      </CardContent>
                    </Card>

                    {/* Region Info Card */}
                    <Card className="p-3 sm:p-4">
                      <CardContent className="p-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="h-4 w-4 text-blue-500" />
                          <span className="font-medium text-sm">Region</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">Region: {selectedVariation.region || 'Global'}</p>
                        <Button variant="link" size="sm" className="p-0 h-auto text-xs">Change Region</Button>
                      </CardContent>
                    </Card>

                    {/* Platform Info Card */}
                    <Card className="p-3 sm:p-4">
                      <CardContent className="p-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Monitor className="h-4 w-4 text-purple-500" />
                          <span className="font-medium text-sm">Platform</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">Platform: {product.platform || 'Digital'}</p>
                        <Button variant="link" size="sm" className="p-0 h-auto text-xs">Activation Guide</Button>
                      </CardContent>
                    </Card>

                    {/* System Requirements Card */}
                    <Card className="p-3 sm:p-4">
                      <CardContent className="p-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Cpu className="h-4 w-4 text-orange-500" />
                          <span className="font-medium text-sm">Compatibility</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">Works on: Windows</p>
                        <Button variant="link" size="sm" className="p-0 h-auto text-xs">System Requirements</Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Service Features */}
                  <Card className="p-3 sm:p-4 mb-4 sm:mb-6">
                    <CardContent className="p-0">
                      <h3 className="font-medium text-sm mb-3">Service Features</h3>
                      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-green-500" />
                          <span className="text-xs sm:text-sm">Instant Delivery</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 text-blue-500" />
                          <span className="text-xs sm:text-sm">24/7 Support</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-purple-500" />
                          <span className="text-xs sm:text-sm">Verified Sellers</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Offers Section */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
                <h2 className="text-xl sm:text-2xl font-bold">All Offers</h2>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <SortAsc className="h-4 w-4" />
                      Sort by: {sortBy === "price" ? "Price" : sortBy === "rating" ? "Rating" : "Reviews"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortBy("price")}>Price</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("rating")}>Rating</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("reviews")}>Reviews</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-4">
                {/* All Offers */}
                <div className="space-y-3">
                  {sortedVendors.map((vendor) => (
                    <Card key={vendor.id} className={`dark:glass-effect dark:card-hover ${vendor.id === featuredVendor.id ? 'border-primary/20' : ''}`}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {vendor.id === featuredVendor.id && (
                            <Badge className="bg-blue-600 hover:bg-blue-700">Featured</Badge>
                          )}
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                            <span className="font-bold text-lg">{vendor.name.charAt(0)}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold">{vendor.name}</h3>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{vendor.rating} ({vendor.reviews} reviews)</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-end">
                            <div className="text-xl font-bold text-primary">${vendor.price}</div>
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
                          <Button onClick={() => handleAddToCart(vendor)}>Buy now</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Frequently Bought Together */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Frequently Bought Together</h2>
              <Card className="dark:glass-effect">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                        <img src={product.image} alt={product.title} className="w-full h-full object-cover rounded-lg" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{product.title}</h3>
                        <div className="text-sm text-muted-foreground">${featuredVendor.price}</div>
                      </div>
                    </div>
                    
                    <Plus className="h-6 w-6 text-muted-foreground" />
                    
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center">
                        <img src="/placeholder.jpg" alt="Bundle Item" className="w-full h-full object-cover rounded-lg" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Mystery Box</h3>
                        <div className="text-sm text-muted-foreground">$29.99</div>
                      </div>
                    </div>
                    
                    <div className="ml-auto text-right">
                      <div className="text-2xl font-bold text-primary">${featuredVendor.price + 29.99}</div>
                      <div className="text-sm text-green-600">Save $15.00</div>
                      <Button className="mt-2">Buy now</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Product Details Tabs */}
            <div className="mb-8">
              <Tabs defaultValue="description">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="system-requirements">System Requirements</TabsTrigger>
                  <TabsTrigger value="details">Other Details</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-6">
                  <Card className="dark:glass-effect">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4">{product.title}</h3>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="outline">{product.category}</Badge>
                        <Badge variant="outline">Indie</Badge>
                        <Badge variant="outline">Strategy</Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        {product.description}
                      </p>
                      <Button variant="link" className="p-0 h-auto">Read more</Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <Card className="dark:glass-effect">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                          <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                          <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                          <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                          <Star className="h-6 w-6 text-muted-foreground" />
                          <span className="text-xl font-bold ml-2">4.0</span>
                        </div>
                        <Button variant="outline">Leave a review</Button>
                      </div>
                      
                      <div className="space-y-6">
                        {product.customerReviews.map((review, index) => (
                          <div key={index} className="border-b border-border pb-4 last:border-b-0">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="font-semibold">{review.user}</div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span>{review.rating}</span>
                              </div>
                            </div>
                            <p className="text-muted-foreground">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="system-requirements" className="mt-6">
                  <Card className="dark:glass-effect">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4">System: Windows</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Minimum System Requirements</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <MemoryStick className="h-4 w-4" />
                              <span>Memory: 1 GB RAM</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <HardDrive className="h-4 w-4" />
                              <span>Storage: 50 MB available space</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Cpu className="h-4 w-4" />
                              <span>Processor: Intel Core i3</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Monitor className="h-4 w-4" />
                              <span>Graphics: OpenGL 2.1 compatible graphics card</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-3">Recommended System Requirements</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <MemoryStick className="h-4 w-4" />
                              <span>Memory: 2 GB RAM</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <HardDrive className="h-4 w-4" />
                              <span>Storage: 100 MB available space</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Cpu className="h-4 w-4" />
                              <span>Processor: Intel Core i5</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Monitor className="h-4 w-4" />
                              <span>Graphics: DirectX 11 compatible graphics card</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="details" className="mt-6">
                  <Card className="dark:glass-effect">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Additional Information</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Release Date: {new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          <span>Developer: Digital Studios</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          <span>Publisher: Global Games</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Featured Offer Card - 20% */}
          <div className="lg:col-span-2">
            <Card className="dark:glass-effect p-4 sm:p-6 sticky top-24">
              <div className="mb-3 sm:mb-4">
                <Badge className="bg-blue-600 hover:bg-blue-700 mb-2 text-xs sm:text-sm">FEATURED OFFER</Badge>
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">${featuredVendor.price}</div>
                {featuredVendor.originalPrice && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm sm:text-lg text-muted-foreground line-through">${featuredVendor.originalPrice}</span>
                    <Badge variant="destructive" className="text-xs">
                      {Math.round(((featuredVendor.originalPrice - featuredVendor.price) / featuredVendor.originalPrice) * 100)}% off
                    </Badge>
                  </div>
                )}
                <div className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">PRICE NOT FINAL</div>
              </div>
              
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <Button size="lg" className="w-full gap-2 text-sm sm:text-base" onClick={() => handleAddToCart(featuredVendor)}>
                  <ShoppingCart className="h-4 w-4" />
                  Buy now
                </Button>
                
                <div className="flex items-center gap-2">
                  <Truck className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                  <span className="text-xs sm:text-sm">Instant Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                  <span className="text-xs sm:text-sm">24/7 Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
                  <span className="text-xs sm:text-sm">Verified Sellers</span>
                </div>
              </div>
              
              <div className="text-xs sm:text-sm text-muted-foreground mb-4">
                +{otherVendors.length} other offers starting at ${Math.min(...otherVendors.map(v => v.price))}
              </div>

              {/* Vendor Info */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <span className="font-bold text-sm">{featuredVendor.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{featuredVendor.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{featuredVendor.rating} ({featuredVendor.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  View Profile
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}