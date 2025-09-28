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

      <div className="container mx-auto px-4 py-8">
        {/* Product Header */}
        <div className="mb-8">
          <div className="flex items-start gap-2 mb-4">
            <Badge className="bg-green-600 hover:bg-green-700">{product.category}</Badge>
            <Badge variant="outline">{product.type === 'gift-card' ? 'Digital Key' : 'Digital Product'}</Badge>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{product.title} {selectedVariation.value}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <Star className="h-5 w-5 text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product Image & Details */}
            <div className="lg:col-span-2">
              <div className="flex gap-6">
                <div className="w-64 h-64 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center relative group">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover rounded-xl"
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
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Can be activated in Global</span>
                      <Button variant="link" size="sm" className="p-0 h-auto">Check Restrictions</Button>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4" />
                      <span>Region: {selectedVariation.region || 'Global'}</span>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Monitor className="h-4 w-4" />
                      <span>Platform: {product.platform || 'Digital'}</span>
                      <Button variant="link" size="sm" className="p-0 h-auto">Activation Guide</Button>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Cpu className="h-4 w-4" />
                      <span>Works on: Windows</span>
                      <Button variant="link" size="sm" className="p-0 h-auto">System Requirements</Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
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
                      <span className="text-sm">Verified Sellers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Offer & Purchase Box */}
            <div className="lg:col-span-1">
              <Card className="dark:glass-effect p-6 sticky top-4">
                <div className="mb-4">
                  <Badge className="bg-blue-600 hover:bg-blue-700 mb-2">FEATURED OFFER</Badge>
                  <div className="text-3xl font-bold text-primary mb-1">${featuredVendor.price}</div>
                  {featuredVendor.originalPrice && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg text-muted-foreground line-through">${featuredVendor.originalPrice}</span>
                      <Badge variant="destructive" className="text-xs">
                        {Math.round(((featuredVendor.originalPrice - featuredVendor.price) / featuredVendor.originalPrice) * 100)}% off
                      </Badge>
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground mb-4">PRICE NOT FINAL</div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <Button size="lg" className="w-full gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Buy now
                  </Button>
                  
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
                    <span className="text-sm">Verified Sellers</span>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  +{otherVendors.length} offers starting at ${Math.min(...otherVendors.map(v => v.price))}
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Offers Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Offers</h2>
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
            {/* Featured Offer */}
            <Card className="dark:glass-effect border-primary/20">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge className="bg-blue-600 hover:bg-blue-700">Driffle's choice</Badge>
                  <div>
                    <h3 className="font-semibold">{product.title} {selectedVariation.value}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{featuredVendor.rating} ({featuredVendor.reviews})</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <div className="text-xl font-bold text-primary">${featuredVendor.price}</div>
                    {featuredVendor.originalPrice && (
                      <div className="text-sm text-muted-foreground line-through">
                        ${featuredVendor.originalPrice}
                      </div>
                    )}
                  </div>
                  <Button onClick={() => handleAddToCart(featuredVendor)}>Buy now</Button>
                </div>
              </CardContent>
            </Card>

            {/* Other Offers */}
            <div className="text-sm text-muted-foreground mb-4">
              {otherVendors.length} other offers
            </div>
            
            <div className="space-y-3">
              {(showAllOffers ? otherVendors : otherVendors.slice(0, 3)).map((vendor) => (
                <Card key={vendor.id} className="dark:glass-effect dark:card-hover">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <span className="font-bold text-lg">{vendor.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{vendor.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{vendor.rating}</span>
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
            
            {otherVendors.length > 3 && (
              <Button 
                variant="outline" 
                onClick={() => setShowAllOffers(!showAllOffers)}
                className="w-full"
              >
                {showAllOffers ? 'Show Less' : `Load ${otherVendors.length - 3} more offers`}
              </Button>
            )}
          </div>
        </div>

        {/* Frequently Bought Together */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Frequently Bought Together</h2>
          <Card className="dark:glass-effect">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{product.title}</h3>
                    <div className="text-sm text-muted-foreground">${featuredVendor.price}</div>
                  </div>
                </div>
                
                <Plus className="h-6 w-6 text-muted-foreground" />
                
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
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
                          <span>Graphics: Dedicated graphics card</span>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Release date:</span>
                        <span>2024-02-20</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Publishers:</span>
                        <span>Playstack</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Developers:</span>
                        <span>LocalThunk</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Languages:</span>
                        <span>English</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Trending Products */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Trending Products</h2>
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4">
              {[
                { id: "steam-wallet-india", title: "Steam Wallet 99 INR Gift Card", region: "India", price: 142.01 },
                { id: "netflix-turkey", title: "Netflix 200 TRY Gift Card", region: "Turkey", price: 2642.74 },
                { id: "playstation-poland", title: "PlayStation Store 100 PLN Gift Card", region: "Poland", price: 3433.71 },
                { id: "palworld", title: "Palworld (Global) (PC)", region: "Global", price: 3426.61, discount: 16 },
                { id: "roblox-robux", title: "Roblox - 200 Robux", region: "Global", price: 440.22 }
              ].map((item) => (
                <Link key={item.id} href={`/product/${item.id}`}>
                  <Card className="w-64 dark:glass-effect dark:card-hover cursor-pointer">
                    <CardContent className="p-4">
                      <div className="w-full h-32 bg-gradient-to-br from-primary to-accent rounded-lg mb-3 flex items-center justify-center">
                        <img src="/placeholder.jpg" alt={item.title} className="w-full h-full object-cover rounded-lg" />
                      </div>
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2">{item.title}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{item.region}</span>
                        <div className="text-right">
                          <div className="font-bold text-primary">${item.price}</div>
                          {item.discount && (
                            <Badge variant="destructive" className="text-xs">-{item.discount}%</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
