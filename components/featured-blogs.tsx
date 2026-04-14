"use client"

import { useState, useEffect } from "react"
import { apiService, AppBlog } from "@/lib/api-service"
import { BlogCardHorizontal } from "@/components/blog-card-horizontal"
import { ChevronRight, Loader2 } from "lucide-react"
import Link from "next/link"

export function FeaturedBlogs() {
    const [blogs, setBlogs] = useState<AppBlog[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchFeaturedBlogs() {
            try {
                const response = await apiService.getBlogs(1)
                if (response.success && response.data) {
                    const apiBlogs = response.data.data?.data || []
                    const mapped = apiBlogs.slice(0, 4).map((b: any) => apiService.mapApiBlogToBlog(b))
                    setBlogs(mapped)
                }
            } catch (error) {
                console.error("Failed to fetch featured blogs:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchFeaturedBlogs()
    }, [])

    if (isLoading) {
        return (
            <section className="py-16 bg-background">
                <div className="container mx-auto px-4 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-brand-500" />
                </div>
            </section>
        )
    }

    if (blogs.length === 0) return null

    return (
        <section className="py-16 sm:py-24 bg-background">
            <div className="container mx-auto px-4">
                {/* Section Header - Centered Style */}
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-2">
                        Blog <span className="text-brand-500 uppercase">GameHub</span>
                    </h2>
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-brand-500 hover:text-brand-600 transition-colors text-sm font-semibold uppercase tracking-wider"
                    >
                        Show all news
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                </div>

                {/* Blogs Grid - 2x2 Grid with Horizontal Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10 max-w-7xl mx-auto">
                    {blogs.map((blog) => (
                        <BlogCardHorizontal key={blog.id} blog={blog} />
                    ))}
                </div>
            </div>
        </section>
    )
}
