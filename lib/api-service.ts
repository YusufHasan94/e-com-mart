"use client"

const BASE_URL = "https://gamehub.licensesender.com/api/v1"

export interface ApiUser {
    id: string
    email: string
    name: string
    avatar?: string
    role: "user" | "seller" | "admin"
    createdAt: string
    // Add other properties if available from API
}

export interface ApiProduct {
    id: number
    title: string
    slug: string
    cover_image: string | null
    developer?: { id: number; name: string; slug: string }
    publisher?: { id: number; name: string; slug: string }
    categories?: { id: number; name: string; slug: string; pivot?: any }[]
    platforms?: { id: number; name: string; slug: string; pivot?: any }[]
    types?: { id: number; name: string; slug: string; pivot?: any }[]
    regions?: { id: number; name: string; slug: string; pivot?: any }[]
    languages?: { id: number; name: string; slug: string; pivot?: any }[]
    works_on?: { id: number; name: string; slug: string; pivot?: any }[]
    lowest_price: number | null
    sku?: string
    description?: string
    offers?: any[]
    currencies?: any[]
}

export interface ApiProductsResponse {
    status: string
    message: string
    data: {
        products: ApiProduct[]
        currency: any
        pagination: {
            total: number
            per_page: number
            current_page: number
            last_page: number
        }
    }
}

export interface ApiProductDetailsResponse {
    status: string
    message: string
    data: ApiProduct
}

export interface ApiResponse<T> {
    success: boolean
    data?: T
    message?: string
    error?: string
}

export interface AppProduct {
    id: string
    title: string
    category: string
    description: string
    image: string
    platform: string
    region: string
    type: string
    rating: number
    reviews: number
    isNew: boolean
    isTrending: boolean
    originalPrice: number
    salePrice: number
    discount: number
    variations: { value: string; price: number; platform?: string; region?: string }[]
    vendors: { id: number; name: string; price: number; rating: number; reviews: number; isVerified: boolean; originalPrice?: number; discount?: number }[]
    customerReviews: { user: string; rating: number; comment: string; date: string }[]
    releaseDate: string
}

export const apiService = {
    /**
     * Register a new user
     */
    register: async (email: string, password: string, password_confirmation: string, name: string, role: string = "user"): Promise<ApiResponse<ApiUser>> => {
        try {
            const response = await fetch(`${BASE_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ email, password, password_confirmation, name, role }),
            })

            const result = await response.json()
            console.log("API Registration Result:", result)

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Registration failed",
                }
            }

            return {
                success: true,
                data: result.user || result.data || result, // Fallback to root if not nested
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (register):", error)
            return {
                success: false,
                error: `Network error or CORS issue: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Login user (Placeholder for future implementation)
     */
    login: async (email: string, password: string): Promise<ApiResponse<ApiUser>> => {
        // For now, keeping it as a placeholder or implementing if endpoint exists
        try {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ email, password }),
            })

            const result = await response.json()
            console.log("API Login Result:", result)

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Login failed",
                }
            }

            return {
                success: true,
                data: result.user || result.data || result, // Fallback to root if not nested
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (login):", error)
            return {
                success: false,
                error: `Network error or CORS issue: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Fetch all products
     */
    getProducts: async (page: number = 1): Promise<ApiResponse<ApiProductsResponse["data"]>> => {
        try {
            const response = await fetch(`${BASE_URL}/products`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            })

            console.log("API Get Products Result:", response);

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch products",
                }
            }

            return {
                success: true,
                data: result.data,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getProducts):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Fetch product details by ID
     */
    getProductById: async (id: string | number): Promise<ApiResponse<ApiProduct>> => {
        try {
            const response = await fetch(`${BASE_URL}/products/${id}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch product details",
                }
            }

            return {
                success: true,
                data: result.data,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getProductById):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Map API Product to App Product format
     */
    mapApiProductToProduct: (apiProduct: ApiProduct): AppProduct => {
        return {
            id: apiProduct.id.toString(),
            title: apiProduct.title,
            category: apiProduct.categories?.[0]?.name || "Uncategorized",
            description: apiProduct.description || "",
            image: apiProduct.cover_image || "/placeholder.jpg",
            platform: apiProduct.platforms?.[0]?.name || apiProduct.platforms?.[0]?.slug || "Steam",
            region: apiProduct.regions?.[0]?.name || "Global",
            type: (apiProduct.types?.[0]?.slug as any) || "game",
            rating: 4.5, // Default as API doesn't provide rating yet
            reviews: Math.floor(Math.random() * 2000) + 500, // Mock reviews count
            isNew: true,
            isTrending: true,
            originalPrice: apiProduct.lowest_price ? apiProduct.lowest_price * 1.2 : 0,
            salePrice: apiProduct.lowest_price || 0,
            discount: 20,
            variations: [],
            vendors: [],
            customerReviews: [],
            releaseDate: new Date().toISOString().split('T')[0],
        }
    }
}
