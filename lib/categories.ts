export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  subcategories?: SubCategory[]
}

export interface SubCategory {
  id: string
  name: string
  slug: string
  items?: string[]
}

export const categories: Category[] = [
  {
    id: "games",
    name: "Games",
    slug: "games",
    subcategories: [
      {
        id: "action",
        name: "Action",
        slug: "action",
        items: [
          "Open World",
          "Stealth",
          "Combat",
          "Third Person",
          "Adventure"
        ]
      },
      {
        id: "rpg",
        name: "RPG",
        slug: "rpg",
        items: [
          "Action RPG",
          "JRPG",
          "Western RPG",
          "MMO RPG",
          "Tactical RPG"
        ]
      },
      {
        id: "fps",
        name: "FPS",
        slug: "fps",
        items: [
          "Military",
          "Sci-Fi",
          "Horror",
          "Team Based",
          "Battle Royale"
        ]
      },
      {
        id: "sports",
        name: "Sports",
        slug: "sports",
        items: [
          "Soccer",
          "Basketball",
          "Racing",
          "Tennis",
          "Winter Sports"
        ]
      },
      {
        id: "strategy",
        name: "Strategy",
        slug: "strategy",
        items: [
          "RTS",
          "Turn-Based",
          "4X",
          "Real-Time",
          "Card Games"
        ]
      },
      {
        id: "indie",
        name: "Indie",
        slug: "indie",
        items: [
          "Platformers",
          "Puzzle",
          "Roguelike",
          "Metroidvania",
          "Story Rich"
        ]
      }
    ]
  },
  {
    id: "software",
    name: "Software",
    slug: "software",
    subcategories: [
      {
        id: "productivity",
        name: "Productivity",
        slug: "productivity",
        items: [
          "Office Suites",
          "Project Management",
          "Note Taking",
          "Calendar Tools",
          "Email Clients"
        ]
      },
      {
        id: "design",
        name: "Design & Creative",
        slug: "design",
        items: [
          "Photo Editing",
          "Video Editing",
          "3D Modeling",
          "UI/UX Design",
          "Illustration"
        ]
      },
      {
        id: "development",
        name: "Development",
        slug: "development",
        items: [
          "IDEs",
          "Code Editors",
          "Version Control",
          "API Tools",
          "Database Tools"
        ]
      },
      {
        id: "security",
        name: "Security & VPN",
        slug: "security",
        items: [
          "Antivirus",
          "VPN Services",
          "Password Managers",
          "Firewall",
          "Encryption Tools"
        ]
      },
      {
        id: "operating-system",
        name: "Operating Systems",
        slug: "operating-system",
        items: [
          "Windows",
          "Linux",
          "Virtualization",
          "Server OS",
          "Security OS"
        ]
      },
      {
        id: "utilities",
        name: "Utilities",
        slug: "utilities",
        items: [
          "File Management",
          "System Tools",
          "Backup Software",
          "Disk Utilities",
          "Performance Tools"
        ]
      }
    ]
  },
  {
    id: "gift-cards",
    name: "Gift Cards",
    slug: "gift-cards",
    subcategories: [
      {
        id: "gaming-platforms",
        name: "Gaming Platforms",
        slug: "gaming-platforms",
        items: [
          "Steam",
          "PlayStation Store",
          "Xbox Live",
          "Nintendo eShop",
          "Epic Games"
        ]
      },
      {
        id: "streaming",
        name: "Streaming Services",
        slug: "streaming",
        items: [
          "Netflix",
          "Spotify",
          "Disney+",
          "Hulu",
          "Amazon Prime"
        ]
      },
      {
        id: "retail",
        name: "Retail Stores",
        slug: "retail",
        items: [
          "Amazon",
          "Target",
          "Best Buy",
          "Walmart",
          "Apple Store"
        ]
      },
      {
        id: "digital-wallets",
        name: "Digital Wallets",
        slug: "digital-wallets",
        items: [
          "PayPal",
          "Google Pay",
          "Apple Pay",
          "Venmo",
          "Cryptocurrency"
        ]
      },
      {
        id: "subscriptions",
        name: "Subscriptions",
        slug: "subscriptions",
        items: [
          "Music Streaming",
          "Cloud Storage",
          "Premium Memberships",
          "Education",
          "News & Magazines"
        ]
      },
      {
        id: "region-specific",
        name: "Regional Cards",
        slug: "region-specific",
        items: [
          "Turkey",
          "Argentina",
          "Brazil",
          "Russia",
          "Global"
        ]
      }
    ]
  },
  {
    id: "in-game-currency",
    name: "In-Game Currency",
    slug: "in-game-currency",
    subcategories: [
      {
        id: "mmo-gold",
        name: "MMO Gold",
        slug: "mmo-gold",
        items: [
          "World of Warcraft",
          "Final Fantasy XIV",
          "Guild Wars 2",
          "Black Desert",
          "RuneScape"
        ]
      },
      {
        id: "virtual-points",
        name: "Virtual Points",
        slug: "virtual-points",
        items: [
          "V-Bucks",
          "Robux",
          "Gems",
          "Credits",
          "Coins"
        ]
      },
      {
        id: "battle-royale",
        name: "Battle Royale",
        slug: "battle-royale",
        items: [
          "Fortnite",
          "Apex Legends",
          "PUBG",
          "Warzone",
          "Valorant"
        ]
      },
      {
        id: "mobile-games",
        name: "Mobile Games",
        slug: "mobile-games",
        items: [
          "Clash Royale",
          "Brawl Stars",
          "Genshin Impact",
          "Honor of Kings",
          "Free Fire"
        ]
      }
    ]
  },
  {
    id: "dlc-addons",
    name: "DLCs & Add-Ons",
    slug: "dlc-addons",
    subcategories: [
      {
        id: "expansions",
        name: "Expansions",
        slug: "expansions",
        items: [
          "Story Expansions",
          "Season Pass",
          "Major DLC",
          "Complete Edition",
          "Remastered"
        ]
      },
      {
        id: "characters",
        name: "Characters & Skins",
        slug: "characters",
        items: [
          "Character Packs",
          "Skin Bundles",
          "Cosmetic Items",
          "Costumes",
          "Weapon Skins"
        ]
      },
      {
        id: "content-packs",
        name: "Content Packs",
        slug: "content-packs",
        items: [
          "Music Packs",
          "Art Packs",
          "Level Packs",
          "Mod Support",
          "Bonus Content"
        ]
      }
    ]
  },
  {
    id: "subscriptions",
    name: "Subscriptions",
    slug: "subscriptions",
    subcategories: [
      {
        id: "gaming",
        name: "Gaming",
        slug: "gaming",
        items: [
          "Xbox Game Pass",
          "PlayStation Plus",
          "EA Play",
          "Ubisoft+",
          "GeForce Now"
        ]
      },
      {
        id: "streaming-services",
        name: "Streaming",
        slug: "streaming-services",
        items: [
          "Netflix",
          "Disney+",
          "HBO Max",
          "Prime Video",
          "Apple TV+"
        ]
      },
      {
        id: "software",
        name: "Software",
        slug: "software",
        items: [
          "Adobe Creative Cloud",
          "Microsoft 365",
          "Figma",
          "Notion",
          "Canva Pro"
        ]
      }
    ]
  }
]

// Get all categories
export function getAllCategories(): Category[] {
  return categories
}

// Get category by slug
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(cat => cat.slug === slug)
}

// Get subcategory by parent and sub slug
export function getSubCategoryBySlug(categorySlug: string, subSlug: string): SubCategory | undefined {
  const category = getCategoryBySlug(categorySlug)
  return category?.subcategories?.find(sub => sub.slug === subSlug)
}

