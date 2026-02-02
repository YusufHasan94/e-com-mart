import Link from "next/link"
import { AppBlog } from "@/lib/api-service"

interface BlogCardHorizontalProps {
    blog: AppBlog
}

export function BlogCardHorizontal({ blog }: BlogCardHorizontalProps) {
    return (
        <Link href={`/blog/${blog.slug}`} className="group flex flex-col sm:flex-row gap-4 sm:gap-6 bg-transparent hover:bg-muted/50 p-2 rounded-lg transition-all duration-300">
            {/* Blog Image */}
            <div className="relative w-full sm:w-1/3 aspect-[16/10] sm:aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-muted/30">
                <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.dataset.triedFallback) {
                            target.dataset.triedFallback = "true";
                            target.src = "/placeholder.jpg";
                        }
                    }}
                />
            </div>

            {/* Blog Content */}
            <div className="flex flex-col flex-1 py-1">
                <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-brand-500 transition-colors leading-tight mb-2 line-clamp-2">
                    {blog.title}
                </h3>

                <p className="text-muted-foreground text-sm line-clamp-2 mb-3 leading-relaxed">
                    {blog.excerpt}
                </p>

                <div className="mt-auto text-muted-foreground/60 text-xs font-medium">
                    {blog.date}
                </div>
            </div>
        </Link>
    )
}
