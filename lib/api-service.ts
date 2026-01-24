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

export interface ApiCurrency {
    id: number
    name: string
    code: string
    symbol: string
    exchange_rate: string | number
    is_default: boolean
    status: number
}

export interface ApiCategory {
    id: number
    name: string
    slug: string
    products_count?: number
}

export interface ApiPlatform {
    id: number
    name: string
    slug: string
    products_count?: number
}

export interface ApiType {
    id: number
    name: string
    slug: string
    products_count?: number
}

export interface ApiRegion {
    id: number
    name: string
    slug: string
    products_count?: number
}

export interface ApiLanguage {
    id: number
    name: string
    slug: string
    products_count?: number
}

export interface ApiWorksOn {
    id: number
    name: string
    slug: string
    products_count?: number
}

export interface ApiDeveloper {
    id: number
    name: string
    slug: string
    products_count?: number
}

export interface ApiOffer {
    id: number
    seller: {
        id: number
        store_name: string
        slug: string
        logo: string
        is_verified: boolean
        rating: number
        total_sales: number
    }
    prices: Record<string, { symbol: string, price: number }>
    stock: number
    promoted: boolean
}

export interface ApiProduct {
    id: number
    title: string
    slug: string
    image?: string | null
    cover_image?: string | null
    gallery?: string[] | null
    sku?: string
    description?: string
    extra_attributes?: { key: string; value: string }[]
    product_attributes: {
        categories?: { id: number; name: string; slug: string; pivot?: any }[]
        platforms?: { id: number; name: string; slug: string; pivot?: any }[]
        types?: { id: number; name: string; slug: string; pivot?: any }[]
        regions?: { id: number; name: string; slug: string; pivot?: any }[]
        languages?: { id: number; name: string; slug: string; pivot?: any }[]
        works_on?: { id: number; name: string; slug: string; pivot?: any }[]
        developer?: { id: number; name: string; slug: string }
        publisher?: { id: number; name: string; slug: string }
        label?: { id: number; name: string; bg_color: string; text_color: string }
    }
    lowest_price?: number | string | { price: number; currency?: string; symbol?: string; price_name?: string } | null
    system_requirements?: {
        minimum: { key: string; value: string }[]
        recommended: { key: string; value: string }[]
    }
    delivery_type?: string
    status?: string
    is_featured?: boolean
    meta_title?: string
    meta_description?: string
    offers?: ApiOffer[]
    currencies?: any[]
    created_at?: string
    updated_at?: string
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
    data: {
        product: ApiProduct
        offers: ApiOffer[]
    }
}

export interface ApiReview {
    id: number
    product_id: number
    user_id: number
    rating: number
    title: string
    review: string
    status: "approved" | "pending" | "rejected"
    is_verified_purchase: number
    ip_address?: string
    user_agent?: string
    created_at: string
    updated_at: string
    user: {
        id: number
        name: string
        avatar?: string
    }
}

export interface ApiReviewsResponse {
    current_page: number
    data: ApiReview[]
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    links: { url: string | null; label: string; page: number | null; active: boolean }[]
    next_page_url: string | null
    path: string
    per_page: number
    prev_page_url: string | null
    to: number
    total: number
}

export interface ApiProductRequest {
    id: number
    user_id: number
    product_name: string
    description?: string
    status: "pending" | "approved" | "rejected" | "completed"
    admin_notes?: string
    created_at: string
    updated_at: string
    user?: {
        id: number
        name: string
        email?: string
        avatar?: string
    }
}

export interface ApiProductRequestsResponse {
    current_page: number
    data: ApiProductRequest[]
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    links: { url: string | null; label: string; page: number | null; active: boolean }[]
    next_page_url: string | null
    path: string
    per_page: number
    prev_page_url: string | null
    to: number
    total: number
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
    categorySlug: string
    description: string
    image: string
    gallery: string[]
    platform: string
    platformSlug: string
    region: string
    regionSlug: string
    type: string
    typeSlug: string
    rating: number
    reviews: number
    isNew: boolean
    isTrending: boolean
    originalPrice: number
    salePrice: number
    discount: number
    deliveryType: string
    variations: { value: string; price: number; platform?: string; region?: string }[]
    vendors: {
        id: number
        name: string
        price: number
        rating: number
        reviews: number
        isVerified: boolean
        originalPrice?: number
        discount?: number
        stock?: number
        isPromoted?: boolean
        logo?: string
    }[]
    systemRequirements?: {
        minimum: { key: string; value: string }[]
        recommended: { key: string; value: string }[]
    }
    developer?: { id: number; name: string; slug: string }
    publisher?: { id: number; name: string; slug: string }
    customerReviews: { user: string; rating: number; comment: string; date: string }[]
    releaseDate: string
    languages: string[]
    languageSlugs: string[]
    worksOnSlugs: string[]
    developerSlug: string
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
     * Login user
     */
    login: async (email: string, password: string): Promise<ApiResponse<{ user: ApiUser; access_token: string }>> => {
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
                data: result, // Expecting { access_token, user, ... }
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
     * Get basic authenticated user (Verify token)
     */
    getMe: async (token: string): Promise<ApiResponse<ApiUser>> => {
        try {
            const response = await fetch(`${BASE_URL}/auth/me`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                },
            })

            const result = await response.json()
            console.log("API Auth Me Result:", result)

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to verify session",
                }
            }

            return {
                success: true,
                data: result.data || result, // Extract user object correctly
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getMe):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Get full user profile
     */
    getProfile: async (token: string): Promise<ApiResponse<any>> => {
        try {
            const response = await fetch(`${BASE_URL}/profile`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                },
            })

            const result = await response.json()
            console.log("API Profile Result:", result)

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch profile",
                }
            }

            return {
                success: true,
                data: result.data || result,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getProfile):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Update user profile
     */
    updateProfile: async (token: string, profileData: any): Promise<ApiResponse<any>> => {
        try {
            const response = await fetch(`${BASE_URL}/profile`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(profileData),
            })

            const result = await response.json()
            console.log("API Update Profile Result:", result)

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to update profile",
                }
            }

            return {
                success: true,
                data: result.data || result,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (updateProfile):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Logout user
     */
    logout: async (token: string): Promise<ApiResponse<any>> => {
        try {
            const response = await fetch(`${BASE_URL}/auth/logout`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                },
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Logout failed",
                }
            }

            return {
                success: true,
                data: result,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (logout):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Get trending products
     */
    getTrendingProducts: async (): Promise<ApiResponse<ApiProduct[]>> => {
        try {
            const response = await fetch(`${BASE_URL}/products/trending`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            })

            const result = await response.json()
            console.log("API Trending Products Result:", result)

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch trending products",
                }
            }

            return {
                success: true,
                data: Array.isArray(result.data) ? result.data : [],
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getTrendingProducts):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Fetch all products with filtering and search options
     */
    getProducts: async (options: {
        search?: string,
        category_id?: number | string,
        platform_id?: number | string,
        type_id?: number | string,
        region_id?: number | string,
        language_id?: number | string,
        works_on_id?: number | string,
        developer_id?: number | string,
        per_page?: number,
        page?: number,
        sort?: string
    } = {}): Promise<ApiResponse<ApiProductsResponse["data"]>> => {
        try {
            const queryParams = new URLSearchParams()
            if (options.search) queryParams.append("search", options.search)
            if (options.category_id) queryParams.append("category_id", String(options.category_id))
            if (options.platform_id) queryParams.append("platform_id", String(options.platform_id))
            if (options.type_id) queryParams.append("type_id", String(options.type_id))
            if (options.region_id) queryParams.append("region_id", String(options.region_id))
            if (options.language_id) queryParams.append("language_id", String(options.language_id))
            if (options.works_on_id) queryParams.append("works_on_id", String(options.works_on_id))
            if (options.developer_id) queryParams.append("developer_id", String(options.developer_id))
            if (options.per_page) queryParams.append("per_page", String(options.per_page))
            if (options.page) queryParams.append("page", String(options.page))
            if (options.sort) queryParams.append("sort", options.sort)

            const queryString = queryParams.toString()
            const url = `${BASE_URL}/products${queryString ? `?${queryString}` : ""}`

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            })

            console.log("API Get Products URL:", url);

            const result = await response.json()
            console.log("API Get Products JSON:", result)

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch products",
                }
            }

            // Normalize data: ensure we return an object with a products array
            let normalizedData: ApiProductsResponse["data"] = {
                products: [],
                currency: null,
                pagination: {
                    total: 0,
                    per_page: options.per_page ? Number(options.per_page) : 12,
                    current_page: options.page ? Number(options.page) : 1,
                    last_page: 1
                }
            };

            // Heuristically find the product array and pagination info
            if (result.data) {
                if (Array.isArray(result.data)) {
                    normalizedData.products = result.data;
                    normalizedData.pagination.total = result.data.length;
                } else if (typeof result.data === 'object') {
                    normalizedData.products = result.data.products || result.data.data || result.data.items || [];
                    normalizedData.pagination.current_page = result.data.current_page || result.data.pagination?.current_page || 1;
                    normalizedData.pagination.last_page = result.data.last_page || result.data.pagination?.last_page || 1;
                    normalizedData.pagination.total = result.data.total || result.data.pagination?.total || normalizedData.products.length;
                    normalizedData.currency = result.data.currency || result.currency;
                }
            } else if (Array.isArray(result)) {
                normalizedData.products = result;
                normalizedData.pagination.total = result.length;
            } else if (result.products && Array.isArray(result.products)) {
                normalizedData.products = result.products;
                normalizedData.pagination.total = result.total || result.products.length;
            }

            return {
                success: true,
                data: normalizedData,
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
     * Fetch all products (for client-side count aggregation)
     */
    getAllProducts: async (limit: number = 100): Promise<ApiResponse<ApiProduct[]>> => {
        try {
            const response = await apiService.getProducts({ per_page: limit })
            if (!response.success || !response.data) {
                return { success: false, error: response.error || "Failed to fetch all products" }
            }
            return {
                success: true,
                data: response.data.products || [],
                message: response.message
            }
        } catch (error) {
            console.error("API Error (getAllProducts):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`
            }
        }
    },

    /**
     * Fetch product details by ID
     */
    getProductById: async (id: string | number): Promise<ApiResponse<ApiProductDetailsResponse["data"]>> => {
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
     * Fetch related products for a given product ID
     */
    getRelatedProducts: async (id: string | number): Promise<ApiResponse<ApiProduct[]>> => {
        try {
            const response = await fetch(`${BASE_URL}/products/${id}/related`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch related products",
                }
            }

            return {
                success: true,
                data: Array.isArray(result.data) ? result.data : result.data?.products || [],
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getRelatedProducts):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Fetch reviews for a specific product
     */
    getProductReviews: async (productId: string | number, page: number = 1, perPage: number = 10): Promise<ApiResponse<ApiReviewsResponse>> => {
        try {
            const queryParams = new URLSearchParams()
            queryParams.append("page", String(page))
            if (perPage !== 10) queryParams.append("per_page", String(perPage))

            const queryString = queryParams.toString()
            const url = `${BASE_URL}/products/${productId}/reviews${queryString ? `?${queryString}` : ""}`

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            })

            const result = await response.json()
            console.log("API Product Reviews Result:", result)

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch product reviews",
                }
            }

            return {
                success: true,
                data: result,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getProductReviews):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Fetch product requests (requires authentication)
     */
    getProductRequests: async (
        token: string,
        options: {
            status?: "pending" | "approved" | "rejected" | "completed",
            page?: number,
            per_page?: number
        } = {}
    ): Promise<ApiResponse<ApiProductRequestsResponse>> => {
        try {
            const queryParams = new URLSearchParams()
            if (options.status) queryParams.append("status", options.status)
            if (options.page) queryParams.append("page", String(options.page))
            if (options.per_page) queryParams.append("per_page", String(options.per_page))

            const queryString = queryParams.toString()
            const url = `${BASE_URL}/product-requests${queryString ? `?${queryString}` : ""}`

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            })

            const result = await response.json()
            console.log("API Product Requests Result:", result)

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch product requests",
                }
            }

            return {
                success: true,
                data: result,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getProductRequests):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Submit a new product request (requires authentication)
     */
    submitProductRequest: async (
        token: string,
        requestData: {
            category_id: number
            platform_id: number
            type_id: number
            region_id: number
            language_id: number
            works_on_id: number
            title: string
            description: string
            source_url?: string
        }
    ): Promise<ApiResponse<{ id: number; status: string }>> => {
        try {
            const response = await fetch(`${BASE_URL}/product-requests`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(requestData),
            })

            const result = await response.json()
            console.log("API Submit Product Request Result:", result)

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to submit product request",
                }
            }

            return {
                success: true,
                data: result.data,
                message: result.message || "Product request submitted successfully",
            }
        } catch (error) {
            console.error("API Error (submitProductRequest):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Fetch all currencies
     */
    getCurrencies: async (): Promise<ApiResponse<ApiCurrency[]>> => {
        try {
            const response = await fetch(`${BASE_URL}/currencies`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            })

            const result = await response.json()
            console.log("API Currencies Result:", result)

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch currencies",
                }
            }

            // Normalize data: handle both direct array and { currencies: [...] } or { data: [...] } patterns
            let currenciesData = result.data;
            if (currenciesData && !Array.isArray(currenciesData)) {
                currenciesData = currenciesData.currencies || currenciesData.data || currenciesData;
            }

            return {
                success: true,
                data: Array.isArray(currenciesData) ? currenciesData : [],
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getCurrencies):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Fetch all product categories
     */
    getCategories: async (): Promise<ApiResponse<ApiCategory[]>> => {
        try {
            const response = await fetch(`${BASE_URL}/product-attributes/categories`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            })

            const result = await response.json()
            console.log("API Categories Result:", result)

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch categories",
                }
            }

            return {
                success: true,
                data: Array.isArray(result.data) ? result.data : result.data?.categories || [],
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getCategories):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Fetch all product platforms
     */
    getPlatforms: async (): Promise<ApiResponse<ApiPlatform[]>> => {
        try {
            const response = await fetch(`${BASE_URL}/product-attributes/platforms`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            })

            const result = await response.json()
            console.log("API Platforms Result:", result)

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch platforms",
                }
            }

            return {
                success: true,
                data: Array.isArray(result.data) ? result.data : result.data?.platforms || [],
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getPlatforms):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Fetch all product types
     */
    getTypes: async (): Promise<ApiResponse<ApiType[]>> => {
        try {
            const response = await fetch(`${BASE_URL}/product-attributes/types`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            })

            const result = await response.json()
            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch types",
                }
            }

            return {
                success: true,
                data: Array.isArray(result.data) ? result.data : result.data?.types || [],
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getTypes):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Fetch all product regions
     */
    getRegions: async (): Promise<ApiResponse<ApiRegion[]>> => {
        try {
            const response = await fetch(`${BASE_URL}/product-attributes/regions`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            })

            const result = await response.json()
            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch regions",
                }
            }

            return {
                success: true,
                data: Array.isArray(result.data) ? result.data : result.data?.regions || [],
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getRegions):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Fetch all product languages
     */
    getLanguages: async (): Promise<ApiResponse<ApiLanguage[]>> => {
        try {
            const response = await fetch(`${BASE_URL}/product-attributes/languages`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            })

            const result = await response.json()
            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch languages",
                }
            }

            return {
                success: true,
                data: Array.isArray(result.data) ? result.data : result.data?.languages || [],
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getLanguages):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Fetch all product works_on
     */
    getWorksOn: async (): Promise<ApiResponse<ApiWorksOn[]>> => {
        try {
            const response = await fetch(`${BASE_URL}/product-attributes/works-on`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            })

            const result = await response.json()
            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch works_on",
                }
            }

            return {
                success: true,
                data: Array.isArray(result.data) ? result.data : result.data?.works_on || [],
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getWorksOn):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Fetch all product developers
     */
    getDevelopers: async (): Promise<ApiResponse<ApiDeveloper[]>> => {
        try {
            const response = await fetch(`${BASE_URL}/product-attributes/developers`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            })

            const result = await response.json()
            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch developers",
                }
            }

            return {
                success: true,
                data: Array.isArray(result.data) ? result.data : result.data?.developers || [],
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getDevelopers):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Search products by keyword
     */
    searchProducts: async (query: string): Promise<ApiResponse<ApiProduct[]>> => {
        try {
            if (!query || query.length < 2) {
                return { success: true, data: [] }
            }

            const response = await apiService.getProducts({ search: query })

            if (!response.success) {
                return {
                    success: false,
                    error: response.error || "Search failed",
                }
            }

            return {
                success: true,
                data: response.data?.products || [],
                message: response.message,
            }
        } catch (error) {
            console.error("API Error (searchProducts):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Map API Product to App Product format
     */
    mapApiProductToProduct: (apiProduct: ApiProduct, apiOffers: ApiOffer[] = []): AppProduct => {
        if (!apiProduct) {
            console.error("mapApiProductToProduct: apiProduct is null or undefined");
            throw new Error("Invalid product data");
        }

        const getImageUrl = (path: string | null | undefined) => {
            if (!path) return "/placeholder.jpg"
            if (path.startsWith("http")) return path
            return `https://gamehub.licensesender.com/${path}`
        }

        // Use apiProduct.offers if apiOffers is not provided
        const finalOffers = apiOffers.length > 0 ? apiOffers : (apiProduct.offers || [])

        // Calculate best price from offers
        let bestPrice = 0
        if (finalOffers.length > 0) {
            const prices = finalOffers.map(offer => {
                if (offer.prices) {
                    const p = offer.prices["USD"] || offer.prices["EUR"] || Object.values(offer.prices)[0]
                    return p ? p.price : Infinity
                }
                // Fallback for offers structured differently
                return (offer as any).retail_price ? parseFloat((offer as any).retail_price) : (offer as any).price || Infinity
            })
            const minPrice = Math.min(...prices)
            if (minPrice !== Infinity) bestPrice = minPrice
        }

        // Fallback to lowest_price field
        if (bestPrice === 0) {
            if (typeof apiProduct.lowest_price === 'object' && apiProduct.lowest_price !== null) {
                bestPrice = apiProduct.lowest_price.price || 0
            } else if (typeof apiProduct.lowest_price === 'string') {
                bestPrice = parseFloat(apiProduct.lowest_price) || 0
            } else if (typeof apiProduct.lowest_price === 'number') {
                bestPrice = apiProduct.lowest_price
            }
        }

        const mapOffersToVendors = (offersList: ApiOffer[]) => {
            return offersList.map(offer => {
                let price = 0;
                let originalPrice = 0;

                if (offer.prices) {
                    const priceObj = offer.prices["USD"] || offer.prices["EUR"] || Object.values(offer.prices)[0]
                    price = priceObj ? priceObj.price : 0
                } else if ((offer as any).retail_price) {
                    price = parseFloat((offer as any).retail_price)
                } else if ((offer as any).price) {
                    price = (offer as any).price
                }

                originalPrice = price > 0 ? price * 1.2 : 0;

                return {
                    id: offer.seller.id,
                    name: offer.seller.store_name,
                    price: price,
                    rating: offer.seller.rating,
                    reviews: offer.seller.total_sales,
                    isVerified: offer.seller.is_verified,
                    originalPrice: originalPrice,
                    discount: 20,
                    stock: offer.stock || 0,
                    isPromoted: offer.promoted || (offer as any).is_promoted || false,
                    logo: getImageUrl(offer.seller.logo)
                }
            })
        }

        const variations = (apiProduct.extra_attributes || []).map(attr => ({
            value: attr.value,
            price: bestPrice // Since API doesn't specify price per attribute yet
        }))

        if (variations.length === 0) {
            variations.push({ value: "Standard Edition", price: bestPrice })
        }

        const attrs = apiProduct.product_attributes || {};

        return {
            id: (apiProduct.id || 0).toString(),
            title: apiProduct.title || "Unknown Product",
            category: attrs.categories?.[0]?.name || "Uncategorized",
            description: apiProduct.description || "",
            image: getImageUrl(apiProduct.image || apiProduct.cover_image),
            gallery: (apiProduct.gallery || []).map(img => getImageUrl(img)),
            platform: attrs.platforms?.[0]?.name || attrs.platforms?.[0]?.slug || "Steam",
            region: attrs.regions?.[0]?.name || "Global",
            type: (attrs.types?.[0]?.slug as any) || "game",
            rating: 4.5,
            reviews: Math.floor(Math.random() * 2000) + 500,
            isNew: true,
            isTrending: true,
            originalPrice: bestPrice > 0 ? bestPrice * 1.2 : 0,
            salePrice: bestPrice,
            discount: 20,
            deliveryType: apiProduct.delivery_type || "Instant Delivery",
            variations: variations,
            vendors: mapOffersToVendors(finalOffers),
            systemRequirements: apiProduct.system_requirements,
            developer: attrs.developer,
            publisher: attrs.publisher,
            customerReviews: [],
            releaseDate: apiProduct.created_at ? new Date(apiProduct.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            languages: attrs.languages?.map(l => l.name) || [],
            categorySlug: attrs.categories?.[0]?.slug || "",
            platformSlug: attrs.platforms?.[0]?.slug || "",
            typeSlug: attrs.types?.[0]?.slug || "",
            regionSlug: attrs.regions?.[0]?.slug || "",
            languageSlugs: attrs.languages?.map(l => l.slug) || [],
            worksOnSlugs: attrs.works_on?.map(w => w.slug) || [],
            developerSlug: attrs.developer?.slug || ""
        }
    }
}
