"use client"

import { useState, useEffect } from "react"
import { apiService } from "@/lib/api-service"
import { useParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Clock, MessageSquare, Share2, Loader2 } from "lucide-react"
import { Footer } from "@/components/footer"
import Link from "next/link"
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

    const getImageUrl = (path: string | null | undefined) => {
        if (!path) return "/placeholder.jpg"
        if (path.startsWith("http")) return path
        if (path.startsWith("blogs/")) return `https://gamehub.licensesender.com/storage/${path}`
        return `https://gamehub.licensesender.com/${path}`
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#121212] flex flex-col">
                <div className="flex-1 container mx-auto px-4 py-12 max-w-4xl space-y-8">
                    <Skeleton className="h-12 w-3/4 bg-white/5" />
                    <Skeleton className="h-[400px] w-full rounded-xl bg-white/5" />
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-full bg-white/5" />
                        <Skeleton className="h-4 w-full bg-white/5" />
                        <Skeleton className="h-4 w-2/3 bg-white/5" />
                    </div>
                </div>
            </div>
        )
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-white mb-4">Post not found</h1>
                <Button onClick={() => window.history.back()}>Go Back</Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#121212] flex flex-col text-white">
            <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
                <div className="mb-10 text-center">
                    {blog.category && (
                        <Badge className="mb-6 px-4 py-1 uppercase tracking-widest text-[10px] font-bold">
                            {blog.category.name}
                        </Badge>
                    )}
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-8 leading-tight">
                        {blog.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400 mb-12 text-sm">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            <span>{blog.user?.name || blog.author || "Admin"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>{new Date(blog.created_at || blog.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-primary" />
                            <span>{comments.length} Comments</span>
                        </div>
                    </div>
                </div>

                <div className="relative aspect-[21/9] w-full mb-12 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                    <img
                        src={getImageUrl(blog.image)}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (!target.dataset.triedFallback) {
                                target.dataset.triedFallback = "true";
                                target.src = "/placeholder.jpg";
                            }
                        }}
                    />
                </div>

                <article className="prose prose-invert prose-orange max-w-none mb-16 px-2 sm:px-0">
                    <div
                        className="text-gray-300 leading-relaxed space-y-6 text-lg"
                        dangerouslySetInnerHTML={{ __html: blog.content || blog.description }}
                    />
                </article>

                <Separator className="my-10" />

                {/* Comments Section */}
                <div className="space-y-10">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold">Comments ({comments.length})</h3>
                    </div>

                    <div className="space-y-8 mt-12">
                        {comments.length === 0 ? (
                            <p className="text-center text-gray-500 py-8 italic">No comments yet. Be the first to share your thoughts!</p>
                        ) : (
                            comments.map((comment, index) => (
                                <div key={comment.id || index} className="flex gap-5 group">
                                    <Avatar className="h-12 w-12 ring-2 ring-white/10 transition-transform group-hover:scale-105">
                                        <AvatarImage src={comment.user?.avatar} />
                                        <AvatarFallback className="bg-primary/20 text-primary font-bold">
                                            {comment.user?.name?.charAt(0) || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-white text-base">
                                                {comment.user?.name || "Anonymous Guest"}
                                            </span>
                                            <span className="text-[10px] uppercase tracking-tighter text-gray-500 font-medium">
                                                {new Date(comment.created_at || new Date()).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div className="text-gray-400 bg-white/5 px-5 py-4 rounded-2xl border border-white/5 leading-relaxed">
                                            {comment.comment || comment.content}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {user ? (
                        <div className="bg-white/5 p-8 rounded-2xl border border-white/10 shadow-xl">
                            <h4 className="text-lg font-semibold mb-4 text-white">Leave a Reply</h4>
                            <Textarea
                                placeholder="Share your thoughts... What do you think about this article?"
                                className="mb-6 bg-black/20 border-white/10 focus:border-primary/50 text-white min-h-[120px] rounded-xl"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            <div className="flex justify-end">
                                <Button
                                    onClick={handleSubmitComment}
                                    disabled={submitting || !commentText.trim()}
                                    className="px-8"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Posting...
                                        </>
                                    ) : "Post Comment"}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white/5 p-10 rounded-2xl border border-white/10 text-center">
                            <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 mb-6">Want to join the discussion? Log in to share your thoughts.</p>
                            <Link href="/login">
                                <Button variant="outline" className="border-primary/50 hover:bg-primary text-white">
                                    Log In to Comment
                                </Button>
                            </Link>
                        </div>
                    )}


                </div>
            </main>
            <Footer />
        </div>
    )
}
