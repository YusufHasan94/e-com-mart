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

export interface ApiBillingAddress {
    name: string
    email: string
    address: string
    city: string
    country: string
    phone: string
    postcode: string
}

export interface ApiOrderItem {
    id: number
    product_id: number
    product_name: string
    seller_offer_id: number
    quantity: number
    price: number
    total: number
}

export interface ApiOrder {
    id: number
    order_number: string
    user_id: number
    status: "pending" | "processing" | "completed" | "cancelled"
    payment_status: "pending" | "paid" | "failed" | "refunded"
    total: number
    currency: string
    created_at: string
    updated_at: string
    items: ApiOrderItem[]
    billing: ApiBillingAddress
}

export interface ApiCoupon {
    id: number
    code: string
    type: "percentage" | "fixed"
    value: number
    min_purchase: number
    max_discount?: number
    expires_at?: string
    usage_limit?: number
    used_count: number
}

export interface ApiSeller {
    id: number
    store_name: string
    slug: string
    logo?: string
    banner?: string
    description?: string
    is_verified: boolean
    rating: number
    total_sales: number
    created_at: string
}

export interface ApiPaymentMethod {
    code: string
    name: string
    description?: string
    logo?: string
    is_active: boolean
    id?: number
}

export interface ApiWallet {
    balance: number
    currency: string
    pending_balance: number
}

export interface ApiWalletTransaction {
    id: number
    type: "credit" | "debit"
    amount: number | string
    description: string
    source?: string
    order_id?: string
    status?: string
    expires_at?: string | null
    created_at: string
    updated_at?: string
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
    categoryId?: number  // Category ID for coupon validation
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
    label?: { id: number; name: string; bg_color: string; text_color: string }
    customerReviews: { user: string; rating: number; comment: string; date: string }[]
    releaseDate: string
    languages: string[]
    languageSlugs: string[]
    worksOnSlugs: string[]
    developerSlug: string
}

export interface ApiBlog {
    id: number
    title: string
    slug: string
    image?: string | null
    excerpt?: string | null
    content?: string | null
    category_id?: number
    user_id?: number
    created_at: string
    updated_at: string
    category?: { name: string; slug: string }
    user?: { name: string; avatar?: string }
}

export interface AppBlog {
    id: string
    title: string
    slug: string
    image: string
    excerpt: string
    content: string
    category: string
    categorySlug: string
    author: string
    authorAvatar: string
    date: string
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



            const result = await response.json()


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
     * Get available payment methods
     */
    getPaymentMethods: async (token: string): Promise<ApiResponse<ApiPaymentMethod[]>> => {
        try {
            const response = await fetch(`${BASE_URL}/payment-methods`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                },
            })

            const result = await response.json()


            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch payment methods",
                }
            }

            return {
                success: true,
                data: result.data || result,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getPaymentMethods):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Get payment method details
     */
    getPaymentMethodDetails: async (token: string, code: string): Promise<ApiResponse<ApiPaymentMethod>> => {
        try {
            const response = await fetch(`${BASE_URL}/payment-methods/${code}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                },
            })

            const result = await response.json()


            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch payment method details",
                }
            }

            return {
                success: true,
                data: result.data || result,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getPaymentMethodDetails):", error)
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
     * Submit a product review
     */
    submitProductReview: async (
        token: string,
        productId: number,
        reviewData: {
            rating: number
            title: string
            review: string
        }
    ): Promise<ApiResponse<{ id: number }>> => {
        try {
            const response = await fetch(`${BASE_URL}/products/${productId}/reviews`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(reviewData),
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to submit review",
                }
            }

            return {
                success: true,
                data: result.data,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (submitProductReview):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Update a review
     */
    updateProductReview: async (
        token: string,
        reviewId: number,
        reviewData: {
            rating: number
            title: string
            review: string
        }
    ): Promise<ApiResponse<any>> => {
        try {
            const response = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(reviewData),
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to update review",
                }
            }

            return {
                success: true,
                data: result.data,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (updateProductReview):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Delete a review
     */
    deleteProductReview: async (token: string, reviewId: number): Promise<ApiResponse<any>> => {
        try {
            const response = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                },
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to delete review",
                }
            }

            return {
                success: true,
                data: result.data,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (deleteProductReview):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Get review summary
     */
    getReviewSummary: async (productId: number): Promise<ApiResponse<any>> => {
        try {
            const response = await fetch(`${BASE_URL}/products/${productId}/reviews/summary`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch review summary",
                }
            }

            return {
                success: true,
                data: result.data,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getReviewSummary):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * List sellers
     */
    getSellers: async (page: number = 1): Promise<ApiResponse<{ data: ApiSeller[]; pagination: any }>> => {
        try {
            const response = await fetch(`${BASE_URL}/sellers?page=${page}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch sellers",
                }
            }

            return {
                success: true,
                data: result,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getSellers):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Get seller details
     */
    getSellerDetails: async (slug: string): Promise<ApiResponse<ApiSeller>> => {
        try {
            const response = await fetch(`${BASE_URL}/sellers/${slug}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch seller details",
                }
            }

            return {
                success: true,
                data: result.data,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getSellerDetails):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Create seller store
     */
    createSellerStore: async (token: string, storeData: any): Promise<ApiResponse<any>> => {
        try {
            const response = await fetch(`${BASE_URL}/sellers`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(storeData),
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to create seller store",
                }
            }

            return {
                success: true,
                data: result.data,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (createSellerStore):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Update seller store
     */
    updateSellerStore: async (token: string, storeId: number, storeData: any): Promise<ApiResponse<any>> => {
        try {
            const response = await fetch(`${BASE_URL}/sellers/${storeId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(storeData),
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to update seller store",
                }
            }

            return {
                success: true,
                data: result.data,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (updateSellerStore):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * List withdrawal requests
     */
    getSellerWithdrawals: async (token: string, page: number = 1): Promise<ApiResponse<any>> => {
        try {
            const response = await fetch(`${BASE_URL}/seller-withdrawals?page=${page}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                },
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch withdrawals",
                }
            }

            return {
                success: true,
                data: result,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getSellerWithdrawals):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Submit withdrawal request
     */
    submitSellerWithdrawal: async (token: string, data: { amount: number; method: string; details: string }): Promise<ApiResponse<any>> => {
        try {
            const response = await fetch(`${BASE_URL}/seller-withdrawals`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to submit withdrawal",
                }
            }

            return {
                success: true,
                data: result.data,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (submitSellerWithdrawal):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Get wallet details
     */
    getWallet: async (token: string): Promise<ApiResponse<ApiWallet>> => {
        try {
            const response = await fetch(`${BASE_URL}/wallet`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer Bearer ${token}`,
                    "Accept": "application/json",
                },
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch wallet",
                }
            }

            return {
                success: true,
                data: result.data,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getWallet):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * List wallet transactions
     */
    getWalletTransactions: async (
        token: string,
        options: {
            page?: number
            type?: "credit" | "debit"
            source?: string
            per_page?: number
        } = {}
    ): Promise<ApiResponse<{ data: ApiWalletTransaction[]; pagination: any }>> => {
        try {
            const queryParams = new URLSearchParams()
            if (options.page) queryParams.append("page", String(options.page))
            if (options.type) queryParams.append("type", options.type)
            if (options.source) queryParams.append("source", options.source)
            if (options.per_page) queryParams.append("per_page", String(options.per_page))

            const queryString = queryParams.toString()
            const url = `${BASE_URL}/wallet/transactions${queryString ? `?${queryString}` : ""}`

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch transactions",
                }
            }

            // Normalize response structure
            let transactionsData: ApiWalletTransaction[] = []
            let pagination: any = {}

            if (result.data) {
                if (Array.isArray(result.data)) {
                    transactionsData = result.data
                } else if (result.data.data && Array.isArray(result.data.data)) {
                    transactionsData = result.data.data
                    pagination = {
                        current_page: result.data.current_page,
                        last_page: result.data.last_page,
                        per_page: result.data.per_page,
                        total: result.data.total
                    }
                }
            } else if (Array.isArray(result)) {
                transactionsData = result
            }

            // If pagination info is at root level
            if (result.current_page !== undefined) {
                pagination = {
                    current_page: result.current_page,
                    last_page: result.last_page,
                    per_page: result.per_page,
                    total: result.total
                }
                if (Array.isArray(result.data)) {
                    transactionsData = result.data
                }
            }

            return {
                success: true,
                data: {
                    data: transactionsData,
                    pagination
                },
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getWalletTransactions):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Get wallet settings
     */
    getWalletSettings: async (token: string): Promise<ApiResponse<any>> => {
        try {
            const response = await fetch(`${BASE_URL}/wallet/settings`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                },
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch wallet settings",
                }
            }

            return {
                success: true,
                data: result.data,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getWalletSettings):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * List transactions
     */
    getTransactions: async (token: string, page: number = 1): Promise<ApiResponse<any>> => {
        try {
            const response = await fetch(`${BASE_URL}/transactions?page=${page}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                },
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch transactions",
                }
            }

            return {
                success: true,
                data: result,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getTransactions):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Get user orders
     */
    getUserOrders: async (token: string): Promise<ApiResponse<any>> => {
        try {
            const response = await fetch(`${BASE_URL}/my-orders`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                },
            })

            const result = await response.json()


            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch orders",
                }
            }

            return {
                success: true,
                data: result.data || result,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getUserOrders):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Get transaction details
     */
    getTransactionDetails: async (token: string, id: number): Promise<ApiResponse<any>> => {
        try {
            const response = await fetch(`${BASE_URL}/transactions/${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                },
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch transaction details",
                }
            }

            return {
                success: true,
                data: result.data,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getTransactionDetails):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * List applicable taxes
     */
    getTaxes: async (): Promise<ApiResponse<any>> => {
        try {
            const response = await fetch(`${BASE_URL}/taxes`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch taxes",
                }
            }

            return {
                success: true,
                data: result.data,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getTaxes):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Calculate tax amount
     */
    calculateTax: async (token: string, data: { amount: number, seller_id?: number, country: string, state?: string, city?: string }): Promise<ApiResponse<{ tax_total: number }>> => {
        try {
            const response = await fetch(`${BASE_URL}/taxes/calculate`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(data),
            })

            const result = await response.json()


            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to calculate tax",
                }
            }

            return {
                success: true,
                data: result.data || result,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (calculateTax):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Seller tax rules
     */
    getSellerTaxRules: async (token: string): Promise<ApiResponse<any>> => {
        try {
            const response = await fetch(`${BASE_URL}/taxes/seller-rules`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                },
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch seller tax rules",
                }
            }

            return {
                success: true,
                data: result.data,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getSellerTaxRules):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * List blogs
     */
    getBlogs: async (page: number = 1): Promise<ApiResponse<any>> => {
        try {
            const response = await fetch(`${BASE_URL}/blogs?page=${page}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch blogs",
                }
            }

            return {
                success: true,
                data: result,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getBlogs):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Get blog by slug
     */
    getBlogBySlug: async (slug: string): Promise<ApiResponse<any>> => {
        try {
            const response = await fetch(`${BASE_URL}/blogs/${slug}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch blog details",
                }
            }

            return {
                success: true,
                data: result.data,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getBlogBySlug):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * List blog categories
     */
    getBlogCategories: async (): Promise<ApiResponse<any>> => {
        try {
            const response = await fetch(`${BASE_URL}/blog-categories`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch blog categories",
                }
            }

            return {
                success: true,
                data: result.data,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getBlogCategories):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Get blog category by slug
     */
    getCategoryBySlug: async (slug: string): Promise<ApiResponse<any>> => {
        try {
            const response = await fetch(`${BASE_URL}/blog-categories/${slug}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch blog category details",
                }
            }

            return {
                success: true,
                data: result.data,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getCategoryBySlug):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Get blog comments
     */
    getBlogComments: async (blogId: string | number): Promise<ApiResponse<any[]>> => {
        try {
            const response = await fetch(`${BASE_URL}/blogs/${blogId}/comments`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch blog comments",
                }
            }

            return {
                success: true,
                data: result.data || result,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getBlogComments):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Submit blog comment
     */
    submitBlogComment: async (token: string, data: { blog_id: string | number, comment: string }): Promise<ApiResponse<any>> => {
        try {
            const response = await fetch(`${BASE_URL}/blogs/${data.blog_id}/comments`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ comment: data.comment }),
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to submit comment",
                }
            }

            return {
                success: true,
                data: result.data || result,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (submitBlogComment):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },


    /**
     * List pages
     */
    getPages: async (): Promise<ApiResponse<any>> => {
        try {
            const response = await fetch(`${BASE_URL}/pages`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch pages",
                }
            }

            return {
                success: true,
                data: result.data,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getPages):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Get page by slug
     */
    getPageBySlug: async (slug: string): Promise<ApiResponse<any>> => {
        try {
            const response = await fetch(`${BASE_URL}/pages/${slug}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch page details",
                }
            }

            return {
                success: true,
                data: result.data,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getPageBySlug):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * List active sliders
     */
    getSliders: async (): Promise<ApiResponse<any>> => {
        try {
            const response = await fetch(`${BASE_URL}/sliders`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch sliders",
                }
            }

            return {
                success: true,
                data: result.data,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getSliders):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Get slider details
     */
    getSliderDetails: async (id: number): Promise<ApiResponse<any>> => {
        try {
            const response = await fetch(`${BASE_URL}/sliders/${id}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch slider details",
                }
            }

            return {
                success: true,
                data: result.data,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getSliderDetails):", error)
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
     * Create a new order (checkout)
     */
    createOrder: async (
        token: string,
        orderData: {
            currency: string
            items: { seller_offer_id: number; quantity: number }[]
            billing: ApiBillingAddress
            payment_method: string
            coupon_code?: string
        }
    ): Promise<ApiResponse<{ order_id: number; order_number: string; status: string }>> => {
        try {
            const response = await fetch(`${BASE_URL}/orders`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(orderData),
            })

            const result = await response.json()


            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to create order",
                }
            }

            return {
                success: true,
                data: result.data,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (createOrder):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Get order details
     */
    getOrderDetails: async (token: string, orderId: number): Promise<ApiResponse<ApiOrder>> => {
        try {
            const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                },
            })

            const result = await response.json()


            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch order details",
                }
            }

            return {
                success: true,
                data: result.data,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getOrderDetails):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },



    /**
     * List active coupons
     */
    getCoupons: async (): Promise<ApiResponse<ApiCoupon[]>> => {
        try {
            const response = await fetch(`${BASE_URL}/coupons`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Failed to fetch coupons",
                }
            }

            return {
                success: true,
                data: result.data,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (getCoupons):", error)
            return {
                success: false,
                error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
            }
        }
    },

    /**
     * Validate coupon
     */
    validateCoupon: async (
        code: string,
        orderAmount: number,
        categoryIds?: number[],
        productIds?: number[]
    ): Promise<ApiResponse<{ valid: boolean; discount: number }>> => {
        try {
            const payload: any = {
                code,
                order_amount: orderAmount
            }

            if (categoryIds && categoryIds.length > 0) {
                payload.category_ids = categoryIds
            }

            if (productIds && productIds.length > 0) {
                payload.product_ids = productIds
            }

            const response = await fetch(`${BASE_URL}/coupons/validate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(payload),
            })

            const result = await response.json()

            if (!response.ok) {
                return {
                    success: false,
                    error: result.message || "Invalid coupon",
                }
            }

            return {
                success: true,
                data: result.data,
                message: result.message,
            }
        } catch (error) {
            console.error("API Error (validateCoupon):", error)
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
            if (!query || query.length < 1) {
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

        // Helper to get attribute arrays that might be at root or nested
        const getAttrList = (key: string) => {
            const list = (apiProduct as any)[key] || (attrs as any)[key];
            return Array.isArray(list) ? list : [];
        };

        const categories = getAttrList('categories');
        const platforms = getAttrList('platforms');
        const regions = getAttrList('regions');
        const types = getAttrList('types');
        const languages = getAttrList('languages');
        const worksOn = getAttrList('works_on');
        const developer = (apiProduct as any).developer || attrs.developer;
        const publisher = (apiProduct as any).publisher || attrs.publisher;
        const label = (apiProduct as any).label || attrs.label;

        return {
            id: (apiProduct.id || 0).toString(),
            title: apiProduct.title || "Unknown Product",
            category: categories[0]?.name,
            categoryId: categories[0]?.id,  // Extract category ID
            description: apiProduct.description || "",
            image: getImageUrl(apiProduct.image || apiProduct.cover_image),
            gallery: (apiProduct.gallery || []).map(img => getImageUrl(img)),
            platform: platforms[0]?.name || platforms[0]?.slug,
            region: regions[0]?.name,
            type: (types[0]?.slug as any),
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
            developer: developer,
            publisher: publisher,
            label: label,
            customerReviews: [],
            releaseDate: apiProduct.created_at ? new Date(apiProduct.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            languages: languages.map((l: any) => l.name) || [],
            categorySlug: categories[0]?.slug || "",
            platformSlug: platforms[0]?.slug || "",
            typeSlug: types[0]?.slug || "",
            regionSlug: regions[0]?.slug || "",
            languageSlugs: languages.map((l: any) => l.slug) || [],
            worksOnSlugs: worksOn.map((w: any) => w.slug) || [],
            developerSlug: developer?.slug || ""
        }
    },

    /**
     * Map API blog to app blog
     */
    mapApiBlogToBlog: (apiBlog: ApiBlog): AppBlog => {
        if (!apiBlog) {
            return {
                id: "0",
                title: "Invalid Blog",
                slug: "invalid",
                image: "/placeholder-blog.jpg",
                excerpt: "",
                content: "",
                category: "Uncategorized",
                categorySlug: "uncategorized",
                author: "Admin",
                authorAvatar: "/placeholder.svg",
                date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
            }
        }

        const getImageUrl = (path: string | null | undefined) => {
            if (!path || typeof path !== 'string') return "/placeholder.jpg"
            if (path.startsWith("http")) return path
            if (path.startsWith("blogs/")) return `https://gamehub.licensesender.com/storage/${path}`
            return `https://gamehub.licensesender.com/${path}`
        }

        let blogDate = "Recently"
        try {
            const dateStr = (apiBlog as any).created_at || (apiBlog as any).published_at || (apiBlog as any).updated_at
            if (dateStr) {
                const d = new Date(dateStr)
                if (!isNaN(d.getTime())) {
                    blogDate = d.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })
                }
            }
        } catch (e) {
            // fallback to default
        }

        return {
            id: (apiBlog.id || 0).toString(),
            title: apiBlog.title || "Untitled Post",
            slug: apiBlog.slug || "",
            image: getImageUrl(apiBlog.image),
            excerpt: apiBlog.excerpt || "",
            content: apiBlog.content || "",
            category: apiBlog.category?.name || "Uncategorized",
            categorySlug: apiBlog.category?.slug || "uncategorized",
            author: (apiBlog as any).user?.name || "Admin",
            authorAvatar: (apiBlog as any).user?.avatar || "/placeholder.svg",
            date: blogDate,
        }
    }
}
