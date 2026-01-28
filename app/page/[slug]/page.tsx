"use client"

import { useState, useEffect } from "react"
import { apiService } from "@/lib/api-service"
import { useParams } from "next/navigation"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function GenericPage() {
    const params = useParams()
    const [page, setPage] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPage = async () => {
            if (!params.slug) return

            try {
                const response = await apiService.getPageBySlug(params.slug as string)
                if (response.success && response.data) {
                    setPage(response.data)
                }
            } catch (error) {
                console.error("Failed to fetch page", error)
            } finally {
                setLoading(false)
            }
        }
        fetchPage()
    }, [params.slug])

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
                <Skeleton className="h-12 w-1/2" />
                <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </div>
        )
    }

    if (!page) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold">Page not found</h1>
                <Button className="mt-4" onClick={() => window.history.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                </Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="text-4xl font-bold tracking-tight mb-8">{page.title}</h1>

                <div className="prose dark:prose-invert prose-lg max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: page.content || page.body }} />
                </div>
            </main>
            <Footer />
        </div>
    )
}
