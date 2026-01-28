"use client"

import { useState, useEffect } from "react"
import { apiService } from "@/lib/api-service"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Footer } from "@/components/footer"

export default function BlogPage() {
    const [blogs, setBlogs] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [blogsRes, categoriesRes] = await Promise.all([
                    apiService.getBlogs(),
                    apiService.getBlogCategories()
                ])

                if (blogsRes.success && blogsRes.data) {
                    const data = (blogsRes.data as any).data || blogsRes.data
                    setBlogs(Array.isArray(data) ? data : [])
                }

                if (categoriesRes.success && categoriesRes.data) {
                    setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : [])
                }
            } catch (error) {
                console.error("Failed to fetch blog data", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Latest News & Updates</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Stay updated with the latest trends in gaming, software, and digital products.
                    </p>
                </div>

                {/* Categories (Mock or Real) */}
                <div className="flex flex-wrap gap-2 justify-center mb-12">
                    <Button variant="default">All Posts</Button>
                    {categories.map(cat => (
                        <Button key={cat.id} variant="outline">{cat.name}</Button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        [1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="space-y-4">
                                <Skeleton className="h-48 w-full rounded-xl" />
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-20 w-full" />
                            </div>
                        ))
                    ) : blogs.length > 0 ? (
                        blogs.map((post) => (
                            <Card key={post.id} className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow">
                                <div className="h-48 relative overflow-hidden">
                                    <img
                                        src={post.image || "/blog-placeholder.jpg"}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform hover:scale-105"
                                    />
                                    {post.category && (
                                        <Badge className="absolute top-4 left-4">{post.category.name}</Badge>
                                    )}
                                </div>
                                <CardHeader className="flex-1 pb-4">
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <User className="h-3.5 w-3.5" />
                                            <span>{post.author || "Admin"}</span>
                                        </div>
                                    </div>
                                    <h2 className="text-xl font-bold line-clamp-2 hover:text-primary transition-colors">
                                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                    </h2>
                                </CardHeader>
                                <CardContent className="pb-4">
                                    <p className="text-muted-foreground line-clamp-3 text-sm">
                                        {post.short_description || post.description?.substring(0, 150) + "..."}
                                    </p>
                                </CardContent>
                                <CardFooter className="pt-0 mt-auto">
                                    <Link href={`/blog/${post.slug}`} className="w-full">
                                        <Button variant="ghost" className="w-full justify-between group px-0 hover:bg-transparent hover:text-primary">
                                            Read More
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-muted-foreground">No blog posts found.</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}
