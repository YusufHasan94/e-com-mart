"use client"

import { useState, useEffect } from "react"
import { apiService, AppBlog } from "@/lib/api-service"
import { BlogCard } from "@/components/blog-card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function BlogPage() {
    const [blogs, setBlogs] = useState<AppBlog[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        fetchBlogs()
    }, [currentPage])

    const fetchBlogs = async () => {
        setIsLoading(true)
        try {
            const response = await apiService.getBlogs(currentPage)
            if (response.success && response.data) {
                // Based on the API structure observed earlier
                // Correctly access the nested data array from the API response
                const apiBlogs = response.data.data?.data || []
                const mapped = apiBlogs.map((b: any) => apiService.mapApiBlogToBlog(b))
                setBlogs(mapped)

                // Handle pagination structure
                const pagination = response.data.data
                if (pagination) {
                    setTotalPages(pagination.last_page || 1)
                }
            } else {
                setError(response.error || "Failed to load blogs")
            }
        } catch (err) {
            setError("An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen flex flex-col">

            <main className="flex-1 bg-background">
                {/* Banner */}
                <div className="bg-[#2A2A2A] py-16 sm:py-24 border-b border-border/50">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
                            Our <span className="text-primary">Blog</span>
                        </h1>
                        <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
                            Stay updated with the latest gaming news, tips, and updates from the GameHub community.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-xl mx-auto relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search articles..."
                                className="pl-12 h-12 bg-card/50 backdrop-blur-md border-border/50 text-white focus:border-primary rounded-full shadow-lg"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 py-12 sm:py-16">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-24">
                            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                            <p className="text-muted-foreground">Loading articles...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-24">
                            <p className="text-red-500 mb-4">{error}</p>
                            <Button onClick={() => fetchBlogs()}>Try Again</Button>
                        </div>
                    ) : filteredBlogs.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {filteredBlogs.map((blog) => (
                                    <BlogCard key={blog.id} blog={blog} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-12 gap-2">
                                    <Button
                                        variant="outline"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                    >
                                        Previous
                                    </Button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <Button
                                            key={page}
                                            variant={currentPage === page ? "default" : "outline"}
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </Button>
                                    ))}
                                    <Button
                                        variant="outline"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-24">
                            <p className="text-muted-foreground text-lg mb-4">
                                No articles found matching "{searchQuery}"
                            </p>
                            <Button variant="outline" onClick={() => setSearchQuery("")}>
                                Clear Search
                            </Button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
