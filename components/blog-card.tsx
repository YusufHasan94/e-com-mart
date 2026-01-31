import Link from "next/link"
import { Calendar, User, ChevronRight } from "lucide-react"
import { AppBlog } from "@/lib/api-service"

interface BlogCardProps {
    blog: AppBlog
}

export function BlogCard({ blog }: BlogCardProps) {

    return (
        <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 flex flex-col h-full">
            {/* Blog Image */}
            <div className="relative aspect-[16/9] overflow-hidden">
                <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        // Use a data attribute as a simple flag to prevent multiple fallback attempts
                        if (!target.dataset.triedFallback) {
                            target.dataset.triedFallback = "true";
                            target.src = "/placeholder.jpg";
                        }
                    }}
                />
                <div className="absolute top-4 left-4">
                    <span className="bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-bold px-3 py-1 rounded-[4px] uppercase tracking-wider">
                        {blog.category}
                    </span>
                </div>
            </div>

            {/* Blog Content */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {blog.date}
                    </div>
                    <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {blog.author}
                    </div>
                </div>

                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                </h3>

                <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                    {blog.excerpt}
                </p>

                <Link
                    href={`/blog/${blog.slug}`}
                    className="inline-flex items-center text-primary font-semibold text-sm hover:gap-2 transition-all group/link"
                >
                    Read More
                    <ChevronRight className="h-4 w-4 transition-transform" />
                </Link>
            </div>
        </div>
    )
}
