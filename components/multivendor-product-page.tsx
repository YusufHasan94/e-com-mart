"use client"

import { useState, useEffect } from "react"
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
  MemoryStick,
  Loader2
} from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { apiService, type AppProduct } from "@/lib/api-service"
import Link from "next/link"
import { RelatedProducts } from "./related-products"

interface MultivendorProductPageProps {
  productId?: string
}

export function MultivendorProductPage({ productId }: MultivendorProductPageProps) {
  const [product, setProduct] = useState<AppProduct | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedVariation, setSelectedVariation] = useState<any>(null)
  const [sortBy, setSortBy] = useState("price")
  const [showAllVariations, setShowAllVariations] = useState(false)
  const [showAllOffers, setShowAllOffers] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const response = await apiService.getProductById(productId)
        if (response.success && response.data) {
          console.log("Raw Product API Response data:", response.data);
          try {
            const { product: apiProduct, offers: apiOffers } = response.data;
            const mappedProduct = apiService.mapApiProductToProduct(apiProduct, apiOffers)
            console.log("Mapped Product:", mappedProduct);
            setProduct(mappedProduct)
            if (mappedProduct.variations && mappedProduct.variations.length > 0) {
              setSelectedVariation(mappedProduct.variations[0])
            }
          } catch (mapError) {
            console.error("Mapping Error:", mapError);
            setIsLoading(false);
          }
        } else {
          console.error("API response was not successful or data is missing", response);
        }
      } catch (error) {
        console.error("Failed to fetch product", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

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
    // Primary sort: Promoted first
    if (a.isPromoted && !b.isPromoted) return -1
    if (!a.isPromoted && b.isPromoted) return 1

    // Secondary sort: user selected criteria
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

  const promotedOffers = sortedVendors.filter(v => v.isPromoted)
  const regularOffers = sortedVendors.filter(v => !v.isPromoted)

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
        {/* Product Header - First on mobile only */}
        <div className="mb-6 sm:mb-8 lg:hidden">
          <div className="flex flex-wrap items-start gap-2 mb-3 sm:mb-4">
            <Badge className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm">{product.category}</Badge>
            <Badge variant="outline" className="text-xs sm:text-sm">{product.type === 'gift-card' ? 'Digital Key' : 'Digital Product'}</Badge>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{product.title} {selectedVariation?.value && selectedVariation.value !== 'Standard Edition' ? selectedVariation.value : ''}</h1>

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

          {/* Product Image */}
          <div className="w-full h-48 sm:h-64 bg-primary rounded-lg flex items-center justify-center relative group mb-4">
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
        </div>

        {/* Featured Offer Card - Mobile: Sticky at bottom */}
        {featuredVendor && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t shadow-lg">
            <Card className="dark:glass-effect p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={`${featuredVendor.isPromoted ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'} text-xs uppercase tracking-wider`}>
                      {featuredVendor.isPromoted ? 'Promoted Deal' : 'Best Offer'}
                    </Badge>
                    <div className="text-lg font-bold text-primary">${featuredVendor.price}</div>
                  </div>
                  {featuredVendor.originalPrice && (
                    <div className="text-xs text-muted-foreground line-through">${featuredVendor.originalPrice}</div>
                  )}
                </div>
                <Button size="lg" className="flex-shrink-0 gap-2 text-sm" onClick={() => handleAddToCart(featuredVendor)}>
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Main Layout: 80% Content + 20% Featured Offer */}
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 sm:gap-6 lg:gap-8 pb-20 lg:pb-0">
          {/* Main Content - 80% */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Product Header - Desktop Only */}
            <div className="hidden lg:block mb-6 sm:mb-8">
              <div className="flex flex-wrap items-start gap-2 mb-3 sm:mb-4">
                <Badge className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm">{product.category}</Badge>
                <Badge variant="outline" className="text-xs sm:text-sm">{product.type === 'gift-card' ? 'Digital Key' : 'Digital Product'}</Badge>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">{product.title} {selectedVariation?.value && selectedVariation.value !== 'Standard Edition' ? selectedVariation.value : ''}</h1>

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
                  {/* Product Information - Simple */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    {/* Activation */}
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-sm mb-1">Activation</div>
                        <p className="text-sm text-muted-foreground">Can be activated in Global</p>
                        <Button variant="link" size="sm" className="p-0 h-auto text-xs mt-1">Check Restrictions</Button>
                      </div>
                    </div>

                    {/* Region */}
                    <div className="flex items-start gap-3">
                      <Globe className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-sm mb-1">Region</div>
                        <p className="text-sm text-muted-foreground">{product.region || 'Global'}</p>
                        <Button variant="link" size="sm" className="p-0 h-auto text-xs mt-1">Change Region</Button>
                      </div>
                    </div>

                    {/* Platform */}
                    <div className="flex items-start gap-3">
                      <Monitor className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-sm mb-1">Platform</div>
                        <p className="text-sm text-muted-foreground">{product.platform || 'Digital'}</p>
                        <Button variant="link" size="sm" className="p-0 h-auto text-xs mt-1">Activation Guide</Button>
                      </div>
                    </div>

                    {/* Compatibility */}
                    <div className="flex items-start gap-3">
                      <Cpu className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-sm mb-1">Compatibility</div>
                        <p className="text-sm text-muted-foreground">Windows</p>
                        <Button variant="link" size="sm" className="p-0 h-auto text-xs mt-1">System Requirements</Button>
                      </div>
                    </div>
                  </div>

                  {/* Variations/Editions Selector */}
                  {product.variations.length > 1 && (
                    <div className="mb-6">
                      <div className="font-medium text-sm mb-3">Select Edition</div>
                      <div className="flex flex-wrap gap-2">
                        {product.variations.map((v) => (
                          <Button
                            key={v.value}
                            variant={selectedVariation?.value === v.value ? "default" : "outline"}
                            size="sm"
                            className="text-xs"
                            onClick={() => setSelectedVariation(v)}
                          >
                            {v.value}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Service Features */}
                  <div className="mb-4 sm:mb-6">
                    <div className="font-medium text-sm mb-3">Service Features</div>
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Instant Delivery</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">24/7 Support</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">{product.deliveryType}</span>
                      </div>
                    </div>
                  </div>
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

              <div className="space-y-8">
                {/* Promoted Offers Section */}
                {promotedOffers.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-1 bg-purple-600 rounded-full" />
                      <h3 className="font-bold text-lg sm:text-xl">Promoted Offers</h3>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                        Top Choice
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {promotedOffers.map((vendor) => (
                        <Card key={vendor.id} className={`relative dark:glass-effect dark:card-hover border-purple-100 dark:border-purple-900/30 ${vendor.id === featuredVendor?.id ? 'border-primary/50' : ''}`}>
                          <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3 sm:gap-4 flex-1 w-full sm:w-auto">
                              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                                {vendor.logo ? (
                                  <img src={vendor.logo} alt={vendor.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="font-bold text-lg">{vendor.name.charAt(0)}</span>
                                )}
                                {vendor.isVerified && (
                                  <span className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5">
                                    <ShieldCheck className="w-2.5 h-2.5 text-white" />
                                  </span>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-sm sm:text-base truncate">{vendor.name}</h3>
                                  <Badge variant="secondary" className="text-[10px] h-5 px-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                    Promoted
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                                  <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                                  <span className="truncate">{vendor.rating} ({vendor.reviews} reviews)</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                              <div className="flex flex-col items-start sm:items-end">
                                <div className="text-lg sm:text-xl font-bold text-primary">${vendor.price}</div>
                                {vendor.stock !== undefined && vendor.stock < 10 && (
                                  <span className="text-[10px] text-red-500 font-medium">Only {vendor.stock} left</span>
                                )}
                              </div>
                              <Button onClick={() => handleAddToCart(vendor)} className="flex-shrink-0 text-xs sm:text-sm bg-purple-600 hover:bg-purple-700">Add to Cart</Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Regular Offers Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-1 bg-blue-600 rounded-full" />
                    <h3 className="font-bold text-lg sm:text-xl">All Offers</h3>
                    <span className="text-sm text-muted-foreground">({regularOffers.length} available)</span>
                  </div>
                  <div className="space-y-3">
                    {regularOffers.length > 0 ? (
                      regularOffers.map((vendor) => (
                        <Card key={vendor.id} className={`relative dark:glass-effect dark:card-hover ${vendor.id === featuredVendor?.id ? 'border-primary/50' : ''}`}>
                          <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3 sm:gap-4 flex-1 w-full sm:w-auto">
                              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                                {vendor.logo ? (
                                  <img src={vendor.logo} alt={vendor.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="font-bold text-lg">{vendor.name.charAt(0)}</span>
                                )}
                                {vendor.isVerified && (
                                  <span className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5">
                                    <ShieldCheck className="w-2.5 h-2.5 text-white" />
                                  </span>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-sm sm:text-base truncate">{vendor.name}</h3>
                                <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                                  <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                                  <span className="truncate">{vendor.rating} ({vendor.reviews} reviews)</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                              <div className="flex flex-col items-start sm:items-end">
                                <div className="text-lg sm:text-xl font-bold text-primary">${vendor.price}</div>
                                {vendor.stock !== undefined && vendor.stock < 10 && (
                                  <span className="text-[10px] text-red-500 font-medium">Only {vendor.stock} left</span>
                                )}
                              </div>
                              <Button onClick={() => handleAddToCart(vendor)} className="flex-shrink-0 text-xs sm:text-sm">Add to Cart</Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8 bg-muted/10 rounded-lg border border-dashed">
                        <p className="text-muted-foreground text-sm">No regular offers available.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>



            {/* Product Details Cards */}
            <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-6">

              {/* Description Card */}
              <Card className="dark:glass-effect">
                <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
                  <CardTitle className="text-lg sm:text-xl font-semibold">Description</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{product.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {product.category && <Badge variant="outline">{product.category}</Badge>}
                    {product.platform && <Badge variant="outline">{product.platform}</Badge>}
                    {product.region && <Badge variant="outline">{product.region}</Badge>}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {product.description}
                  </p>
                  <Button variant="link" className="p-0 h-auto">Read more</Button>
                </CardContent>
              </Card>

              {/* Reviews Card */}
              <Card className="dark:glass-effect">
                <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
                  <CardTitle className="text-lg sm:text-xl font-semibold">Reviews</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Star className="h-5 w-5 sm:h-6 sm:w-6 fill-yellow-400 text-yellow-400" />
                      <Star className="h-5 w-5 sm:h-6 sm:w-6 fill-yellow-400 text-yellow-400" />
                      <Star className="h-5 w-5 sm:h-6 sm:w-6 fill-yellow-400 text-yellow-400" />
                      <Star className="h-5 w-5 sm:h-6 sm:w-6 fill-yellow-400 text-yellow-400" />
                      <Star className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                      <span className="text-lg sm:text-xl font-bold ml-2">4.0</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">Leave a review</Button>
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

              {/* System Requirements Card */}
              <Card className="dark:glass-effect">
                <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
                  <CardTitle className="text-lg sm:text-xl font-semibold">System Requirements</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">System: Windows</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Minimum System Requirements</h4>
                      <div className="space-y-2 text-sm">
                        {product.systemRequirements?.minimum.map((req, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            <span><strong>{req.key}:</strong> {req.value}</span>
                          </div>
                        )) || <p className="text-muted-foreground">Not specified</p>}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Recommended System Requirements</h4>
                      <div className="space-y-2 text-sm">
                        {product.systemRequirements?.recommended.map((req, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-muted-foreground" />
                            <span><strong>{req.key}:</strong> {req.value}</span>
                          </div>
                        )) || <p className="text-muted-foreground">Not specified</p>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Other Details Card */}
              <Card className="dark:glass-effect">
                <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
                  <CardTitle className="text-lg sm:text-xl font-semibold">Other Details</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Additional Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Release Date: {new Date(product.releaseDate).toLocaleDateString()}</span>
                    </div>
                    {product.developer?.name && (
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        <span>Developer: {product.developer.name}</span>
                      </div>
                    )}
                    {product.publisher?.name && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span>Publisher: {product.publisher.name}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Featured Offer Card - Desktop: Right side, sticky at top */}
          <div className="hidden lg:block lg:col-span-2 lg:sticky lg:top-24 lg:h-fit">
            {featuredVendor ? (
              <Card className="dark:glass-effect p-4 sm:p-5">
                <div className="mb-3 sm:mb-4">
                  <Badge className={`${featuredVendor.isPromoted ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'} mb-2 text-xs sm:text-sm uppercase tracking-wider`}>
                    {featuredVendor.isPromoted ? 'Promoted Deal' : 'Featured Offer'}
                  </Badge>
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
                    Add to Cart
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

                {otherVendors.length > 0 && (
                  <div className="text-xs sm:text-sm text-muted-foreground mb-4">
                    +{otherVendors.length} other offers starting at ${Math.min(...otherVendors.map(v => v.price))}
                  </div>
                )}

                {/* Vendor Info */}
                <div className="border-t pt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                      {featuredVendor.logo ? (
                        <img
                          src={featuredVendor.logo}
                          alt={featuredVendor.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <span className="font-bold text-lg">{featuredVendor.name.charAt(0)}</span>
                      )}
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
            ) : (
              <Card className="dark:glass-effect p-4 sm:p-5 border-dashed">
                <div className="text-center py-6">
                  <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">Coming Soon</h3>
                  <p className="text-xs text-muted-foreground">No sellers are currently offering this product.</p>
                  <Button variant="outline" className="w-full mt-4 text-xs">Notify Me</Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 border-t border-border mt-12 mb-20">
        <RelatedProducts currentProductId={productId || ""} />
      </div>
    </div>
  )
}