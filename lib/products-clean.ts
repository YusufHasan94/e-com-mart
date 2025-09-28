// Product data system for multivendor marketplace
export interface ProductVariation {
  value: string
  price: number
  region?: string
  platform?: string
}

export interface Vendor {
  id: number
  name: string
  rating: number
  reviews: number
  isVerified: boolean
  price: number
  originalPrice?: number
  discount?: number
  location: string
  avgDeliveryTime: string
  support: string
}

export interface CustomerReview {
  user: string
  rating: number
  comment: string
}

export interface Product {
  id: string
  title: string
  category: string
  description: string
  image: string
  platform?: string
  region?: string
  type: "game" | "software" | "gift-card" | "subscription"
  variations: ProductVariation[]
  vendors: Vendor[]
  rating: number
  reviews: number
  isNew: boolean
  isTrending: boolean
  trendingRank?: number
  originalPrice?: number
  salePrice?: number
  discount?: number
  customerReviews: CustomerReview[]
}

// Mock product database
export const products: Product[] = [
  {
    id: "netflix-gift-card",
    title: "Netflix Gift Card",
    category: "Gift Cards",
    type: "gift-card",
    image: "/placeholder.jpg",
    description: "Dive into endless entertainment with a Netflix gift card. Perfect for binge-watching your favorite series or discovering new films, this digital code allows you to enjoy Netflix's vast library of content without a subscription.",
    platform: "Netflix",
    variations: [
      { value: "75 TRY", price: 8.99, region: "Turkey" },
      { value: "100 TRY", price: 11.49, region: "Turkey" },
      { value: "150 TRY", price: 17.29, region: "Turkey" },
      { value: "200 TRY", price: 23.38, region: "Turkey" },
      { value: "250 TRY", price: 28.79, region: "Turkey" },
      { value: "275 TRY", price: 31.59, region: "Turkey" },
      { value: "300 TRY", price: 34.49, region: "Turkey" },
      { value: "400 TRY", price: 45.99, region: "Turkey" },
      { value: "600 TRY", price: 68.99, region: "Turkey" },
      { value: "1000 TRY", price: 114.99, region: "Turkey" }
    ],
    vendors: [
      {
        id: 1,
        name: "GameStore Pro",
        rating: 4.9,
        reviews: 12500,
        isVerified: true,
        price: 23.38,
        originalPrice: 25.99,
        discount: 10,
        location: "USA",
        avgDeliveryTime: "Instant",
        support: "24/7 Live Chat"
      },
      {
        id: 2,
        name: "Digital Keys Hub",
        rating: 4.7,
        reviews: 8200,
        isVerified: true,
        price: 23.50,
        originalPrice: 26.00,
        discount: 9,
        location: "UK",
        avgDeliveryTime: "5-10 mins",
        support: "Email Support"
      },
      {
        id: 3,
        name: "Global Gaming Deals",
        rating: 4.5,
        reviews: 5100,
        isVerified: false,
        price: 24.00,
        originalPrice: 26.50,
        discount: 9,
        location: "Germany",
        avgDeliveryTime: "15-30 mins",
        support: "Ticket System"
      },
      {
        id: 4,
        name: "KeyMaster",
        rating: 4.8,
        reviews: 9800,
        isVerified: true,
        price: 23.45,
        originalPrice: 25.99,
        discount: 10,
        location: "Canada",
        avgDeliveryTime: "Instant",
        support: "24/7 Live Chat"
      },
    ],
    reviews: 25000,
    rating: 4.8,
    isNew: false,
    isTrending: true,
    trendingRank: 1,
    customerReviews: [
      { user: "Alice", rating: 5, comment: "Great value, instant delivery!" },
      { user: "Bob", rating: 4, comment: "Worked perfectly, but took a few minutes to arrive." },
      { user: "Charlie", rating: 5, comment: "Easy to redeem, highly recommend." },
    ]
  },
  {
    id: "baldurs-gate-3",
    title: "Baldur's Gate 3",
    category: "RPG",
    type: "game",
    image: "/baldurs-gate-3-fantasy-rpg-game.jpg",
    description: "Baldur's Gate 3 is a story-rich, party-based RPG set in the Dungeons & Dragons universe. Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival, and the lure of absolute power.",
    platform: "Steam",
    variations: [
      { value: "Standard Edition", price: 59.99 },
      { value: "Deluxe Edition", price: 79.99 },
    ],
    vendors: [
      {
        id: 1,
        name: "GameStore Pro",
        rating: 4.9,
        reviews: 12500,
        isVerified: true,
        price: 59.99,
        originalPrice: 59.99,
        discount: 0,
        location: "USA",
        avgDeliveryTime: "Instant",
        support: "24/7 Live Chat"
      },
      {
        id: 5,
        name: "Epic Games Store",
        rating: 4.6,
        reviews: 7000,
        isVerified: true,
        price: 58.99,
        originalPrice: 59.99,
        discount: 2,
        location: "USA",
        avgDeliveryTime: "Instant",
        support: "Email Support"
      },
    ],
    reviews: 8500,
    rating: 4.9,
    isNew: true,
    isTrending: true,
    trendingRank: 2,
    customerReviews: [
      { user: "GamerGuy", rating: 5, comment: "An absolute masterpiece! Best RPG in years." },
      { user: "RPGQueen", rating: 5, comment: "Incredible story and characters. Lost hundreds of hours." },
    ]
  },
  {
    id: "cyberpunk-2077",
    title: "Cyberpunk 2077",
    category: "RPG",
    type: "game",
    image: "/cyberpunk-futuristic-city-game.png",
    description: "Cyberpunk 2077 is an open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and ceaseless body modification.",
    platform: "Steam",
    variations: [
      { value: "Standard Edition", price: 29.99 },
      { value: "Deluxe Edition", price: 39.99 },
    ],
    vendors: [
      {
        id: 1,
        name: "GameStore Pro",
        rating: 4.9,
        reviews: 12500,
        isVerified: true,
        price: 29.99,
        originalPrice: 59.99,
        discount: 50,
        location: "USA",
        avgDeliveryTime: "Instant",
        support: "24/7 Live Chat"
      },
      {
        id: 2,
        name: "Digital Keys Hub",
        rating: 4.7,
        reviews: 8200,
        isVerified: true,
        price: 31.99,
        originalPrice: 59.99,
        discount: 47,
        location: "UK",
        avgDeliveryTime: "5-10 mins",
        support: "Email Support"
      },
      {
        id: 3,
        name: "Global Gaming Deals",
        rating: 4.5,
        reviews: 5100,
        isVerified: false,
        price: 33.99,
        originalPrice: 59.99,
        discount: 43,
        location: "Germany",
        avgDeliveryTime: "15-30 mins",
        support: "Ticket System"
      },
    ],
    reviews: 1250,
    rating: 4.2,
    isNew: false,
    isTrending: true,
    customerReviews: [
      { user: "CyberGamer", rating: 4, comment: "Great game with amazing graphics!" },
      { user: "RPGFan", rating: 5, comment: "Incredible open world experience." },
    ]
  },
  {
    id: "elden-ring",
    title: "Elden Ring",
    category: "Action RPG",
    type: "game",
    image: "/fantasy-medieval-game-world.jpg",
    description: "Elden Ring is a fantasy action-RPG adventure set in a world co-created by Hidetaka Miyazaki and George R.R. Martin.",
    platform: "Steam",
    variations: [
      { value: "Standard Edition", price: 49.99 },
      { value: "Deluxe Edition", price: 69.99 },
    ],
    vendors: [
      {
        id: 1,
        name: "GameStore Pro",
        rating: 4.9,
        reviews: 12500,
        isVerified: true,
        price: 49.99,
        originalPrice: 59.99,
        discount: 17,
        location: "USA",
        avgDeliveryTime: "Instant",
        support: "24/7 Live Chat"
      },
      {
        id: 2,
        name: "Digital Keys Hub",
        rating: 4.7,
        reviews: 8200,
        isVerified: true,
        price: 51.99,
        originalPrice: 59.99,
        discount: 13,
        location: "UK",
        avgDeliveryTime: "5-10 mins",
        support: "Email Support"
      },
    ],
    reviews: 2100,
    rating: 4.8,
    isNew: true,
    isTrending: true,
    customerReviews: [
      { user: "SoulsFan", rating: 5, comment: "Masterpiece of gaming!" },
      { user: "FantasyGamer", rating: 5, comment: "Best RPG I've ever played." },
    ]
  },
  {
    id: "microsoft-office-365",
    title: "Microsoft Office 365",
    category: "Software",
    type: "software",
    image: "/office-productivity-software.jpg",
    description: "Microsoft Office 365 is a cloud-based productivity suite that includes Word, Excel, PowerPoint, and more.",
    platform: "Microsoft",
    variations: [
      { value: "Personal (1 Year)", price: 89.99 },
      { value: "Family (1 Year)", price: 119.99 },
      { value: "Business (1 Year)", price: 149.99 },
    ],
    vendors: [
      {
        id: 1,
        name: "SoftwareHub",
        rating: 4.8,
        reviews: 9500,
        isVerified: true,
        price: 89.99,
        originalPrice: 149.99,
        discount: 40,
        location: "USA",
        avgDeliveryTime: "Instant",
        support: "24/7 Live Chat"
      },
      {
        id: 2,
        name: "Digital Office Store",
        rating: 4.6,
        reviews: 7200,
        isVerified: true,
        price: 92.99,
        originalPrice: 149.99,
        discount: 38,
        location: "Canada",
        avgDeliveryTime: "5-10 mins",
        support: "Email Support"
      },
    ],
    reviews: 850,
    rating: 4.5,
    isNew: false,
    isTrending: false,
    customerReviews: [
      { user: "OfficeUser", rating: 5, comment: "Essential productivity software!" },
      { user: "BusinessPro", rating: 4, comment: "Great value for business use." },
    ]
  },
  {
    id: "steam-gift-card",
    title: "Steam Gift Card",
    category: "Gift Card",
    type: "gift-card",
    image: "/steam-gift-card-gaming.jpg",
    description: "Steam Gift Cards are the perfect way to purchase games, software, and more on Steam.",
    platform: "Steam",
    variations: [
      { value: "$20", price: 20.00 },
      { value: "$50", price: 47.50 },
      { value: "$100", price: 95.00 },
    ],
    vendors: [
      {
        id: 1,
        name: "GameStore Pro",
        rating: 4.9,
        reviews: 12500,
        isVerified: true,
        price: 47.50,
        originalPrice: 50.00,
        discount: 5,
        location: "USA",
        avgDeliveryTime: "Instant",
        support: "24/7 Live Chat"
      },
      {
        id: 2,
        name: "Digital Keys Hub",
        rating: 4.7,
        reviews: 8200,
        isVerified: true,
        price: 48.00,
        originalPrice: 50.00,
        discount: 4,
        location: "UK",
        avgDeliveryTime: "5-10 mins",
        support: "Email Support"
      },
    ],
    reviews: 3200,
    rating: 5.0,
    isNew: false,
    isTrending: true,
    customerReviews: [
      { user: "SteamGamer", rating: 5, comment: "Perfect for Steam purchases!" },
      { user: "GiftGiver", rating: 5, comment: "Great gift for gamers." },
    ]
  },
  {
    id: "adobe-creative-suite",
    title: "Adobe Creative Suite",
    category: "Software",
    type: "software",
    image: "/creative-design-software.jpg",
    description: "Adobe Creative Suite includes Photoshop, Illustrator, InDesign, and other professional creative tools.",
    platform: "Adobe",
    variations: [
      { value: "Creative Cloud (1 Month)", price: 199.99 },
      { value: "Creative Cloud (1 Year)", price: 1999.99 },
    ],
    vendors: [
      {
        id: 1,
        name: "CreativeHub",
        rating: 4.7,
        reviews: 6800,
        isVerified: true,
        price: 199.99,
        originalPrice: 299.99,
        discount: 33,
        location: "USA",
        avgDeliveryTime: "Instant",
        support: "24/7 Live Chat"
      },
      {
        id: 2,
        name: "Design Store Pro",
        rating: 4.5,
        reviews: 4200,
        isVerified: true,
        price: 209.99,
        originalPrice: 299.99,
        discount: 30,
        location: "UK",
        avgDeliveryTime: "5-10 mins",
        support: "Email Support"
      },
    ],
    reviews: 1100,
    rating: 4.6,
    isNew: false,
    isTrending: false,
    customerReviews: [
      { user: "DesignerPro", rating: 5, comment: "Industry standard creative tools!" },
      { user: "CreativeArtist", rating: 4, comment: "Amazing software suite." },
    ]
  },
  {
    id: "call-of-duty-mw3",
    title: "Call of Duty: MW3",
    category: "FPS",
    type: "game",
    image: "/military-shooter.png",
    description: "Call of Duty: Modern Warfare 3 is a first-person shooter game with intense multiplayer action.",
    platform: "Steam",
    variations: [
      { value: "Standard Edition", price: 55.99 },
      { value: "Vault Edition", price: 79.99 },
    ],
    vendors: [
      {
        id: 1,
        name: "GameStore Pro",
        rating: 4.9,
        reviews: 12500,
        isVerified: true,
        price: 55.99,
        originalPrice: 69.99,
        discount: 20,
        location: "USA",
        avgDeliveryTime: "Instant",
        support: "24/7 Live Chat"
      },
      {
        id: 2,
        name: "Digital Keys Hub",
        rating: 4.7,
        reviews: 8200,
        isVerified: true,
        price: 57.99,
        originalPrice: 69.99,
        discount: 17,
        location: "UK",
        avgDeliveryTime: "5-10 mins",
        support: "Email Support"
      },
    ],
    reviews: 1800,
    rating: 4.3,
    isNew: true,
    isTrending: false,
    customerReviews: [
      { user: "FPSGamer", rating: 4, comment: "Great multiplayer experience!" },
      { user: "CoDFan", rating: 5, comment: "Best Call of Duty in years." },
    ]
  }
]

// Helper function to get product by ID
export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id)
}

// Helper function to get all products
export function getAllProducts(): Product[] {
  return products
}

// Helper function to get products by category
export function getProductsByCategory(category: string): Product[] {
  return products.filter(product => product.category.toLowerCase() === category.toLowerCase())
}

// Helper function to get trending products
export function getTrendingProducts(): Product[] {
  return products.filter(product => product.isTrending).sort((a, b) => (a.trendingRank || 0) - (b.trendingRank || 0))
}
