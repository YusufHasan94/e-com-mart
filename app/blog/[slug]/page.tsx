"use client"

import { useState, useEffect } from "react"
import { apiService } from "@/lib/api-service"
import { useParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Clock, MessageSquare, Share2 } from "lucide-react"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

export default function BlogPostPage() {
    const params = useParams()
    const { user, token } = useAuth()
    const { toast } = useToast()

    const [blog, setBlog] = useState<any | null>(null)
    const [comments, setComments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [commentText, setCommentText] = useState("")
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            if (!params.slug) return

            try {
                const blogRes = await apiService.getBlogBySlug(params.slug as string)
                if (blogRes.success && blogRes.data) {
                    setBlog(blogRes.data)

                    // Fetch comments if blog ID is available
                    if (blogRes.data.id) {
                        const commentsRes = await apiService.getBlogComments(blogRes.data.id)
                        if (commentsRes.success && commentsRes.data) {
                            const data = (commentsRes.data as any).data || commentsRes.data
                            setComments(Array.isArray(data) ? data : [])
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch blog post", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [params.slug])

    const handleSubmitComment = async () => {
        if (!commentText.trim() || !blog || !token) return

        setSubmitting(true)
        try {
            const response = await apiService.submitBlogComment(token, {
                blog_id: blog.id,
                comment: commentText
            })

            if (response.success) {
                toast({ title: "Comment submitted", description: "Your comment keeps the discussion going!" })
                setCommentText("")
                // Refresh comments
                const commentsRes = await apiService.getBlogComments(blog.id)
                if (commentsRes.success && commentsRes.data) {
                    const data = (commentsRes.data as any).data || commentsRes.data
                    setComments(Array.isArray(data) ? data : [])
                }
            } else {
                toast({ title: "Error", description: response.error, variant: "destructive" })
            }
        } catch (error) {
            console.error("Failed to submit comment", error)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-96 w-full rounded-xl" />
                <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </div>
        )
    }

    if (!blog) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold">Post not found</h1>
                <Button className="mt-4" onClick={() => window.history.back()}>Go Back</Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8">
                    {blog.category && (
                        <Badge className="mb-4">{blog.category.name}</Badge>
                    )}
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">{blog.title}</h1>

                    <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8 text-sm">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{blog.author || "Admin"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(blog.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            <span>{comments.length} Comments</span>
                        </div>
                    </div>
                </div>

                <div className="relative h-[400px] w-full mb-10 rounded-xl overflow-hidden shadow-lg">
                    <img
                        src={blog.image || "/blog-placeholder.jpg"}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                <article className="prose dark:prose-invert prose-lg max-w-none mb-12">
                    <div dangerouslySetInnerHTML={{ __html: blog.content || blog.description }} />
                </article>

                <Separator className="my-10" />

                {/* Comments Section */}
                <div className="space-y-8">
                    <h3 className="text-2xl font-bold">Comments ({comments.length})</h3>

                    {user ? (
                        <div className="bg-card p-6 rounded-lg border border-border">
                            <h4 className="font-semibold mb-4">Leave a Reply</h4>
                            <Textarea
                                placeholder="Share your thoughts..."
                                className="mb-4"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            <Button onClick={handleSubmitComment} disabled={submitting || !commentText.trim()}>
                                {submitting ? "Posting..." : "Post Comment"}
                            </Button>
                        </div>
                    ) : (
                        <div className="bg-muted p-6 rounded-lg text-center">
                            <p className="mb-4">Please log in to leave a comment.</p>
                            <Button variant="outline" onClick={() => window.location.href = '/login'}>Log In</Button>
                        </div>
                    )}

                    <div className="space-y-6">
                        {comments.map((comment, index) => (
                            <div key={comment.id || index} className="flex gap-4 p-4 rounded-lg bg-card/50">
                                <Avatar>
                                    <AvatarImage src={comment.user?.avatar} />
                                    <AvatarFallback>{comment.user?.name?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold">{comment.user?.name || "User"}</span>
                                        <span className="text-xs text-muted-foreground">{new Date(comment.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-muted-foreground">{comment.comment || comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
