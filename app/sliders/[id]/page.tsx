"use client"

import { useEffect, useState } from "react"
import { apiService, type ApiSlider } from "@/lib/api-service"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft, Tag, Info } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default function SliderDetailsPage({ params }: { params: { id: string } }) {
  const [slider, setSlider] = useState<ApiSlider | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    apiService.getSliderById(params.id)
      .then(res => {
        if (res.success && res.data) {
          setSlider(res.data)
        } else {
          setError(res.error || "Failed to load promotion details.")
        }
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : "An unexpected error occurred.")
      })
      .finally(() => setIsLoading(false))
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col pt-32">
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !slider) {
    return (
      <div className="min-h-screen flex flex-col pt-32">
        <main className="flex-1 flex flex-col items-center justify-center space-y-4 px-4 text-center">
          <h1 className="text-3xl font-bold">Promotion Not Found</h1>
          <p className="text-muted-foreground max-w-md">
            {error || "The promotion you are looking for does not exist or has expired."}
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col pt-[112px]">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
          <div className="absolute inset-0">
            <img
              src={slider.image}
              alt={slider.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-background via-background/40 to-transparent" />
          </div>

          <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-12">
            <Button asChild variant="outline" className="w-fit mb-6 bg-background/50 backdrop-blur-sm border-white/10 hover:bg-background/80 transition-colors">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>

            {slider.badge && (
              <span className="w-fit bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-md mb-4 shadow-lg">
                {slider.badge}
              </span>
            )}

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-xl mb-4 max-w-4xl tracking-tight">
              {slider.title}
            </h1>

            {slider.description && (
              <p className="text-lg md:text-xl text-white/90 drop-shadow-md max-w-3xl leading-relaxed font-medium">
                {slider.description}
              </p>
            )}
          </div>
        </section>

        {/* Details Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-card border rounded-xl p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-primary">
                  <Info className="h-5 w-5" />
                  <h2 className="text-xl font-bold text-card-foreground">Promotion Details</h2>
                </div>

                <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-muted-foreground break-words flex flex-col gap-4">
                  {slider.description ? (
                    <p className="leading-relaxed whitespace-pre-line">{slider.description}</p>
                  ) : (
                    <p className="italic">No additional details are available for this promotion.</p>
                  )}

                  {slider.link && (
                    <div className="mt-8">
                      <Button asChild size="lg" className="w-full sm:w-auto font-semibold">
                        <Link href={slider.link}>
                          Take advantage of this offer
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-muted/30 border rounded-xl p-6 border-border/50">
                <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                  <Tag className="h-5 w-5 text-primary" />
                  Key Information
                </h3>

                <dl className="space-y-4">
                  <div className="flex flex-col gap-1 border-b border-border/50 pb-3">
                    <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                    <dd className="font-medium text-emerald-500 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Active Promotion
                    </dd>
                  </div>

                  {(slider.price || slider.discount) && (
                    <div className="flex flex-col gap-1 border-b border-border/50 pb-3">
                      <dt className="text-sm font-medium text-muted-foreground">Special Offer</dt>
                      <dd className="font-bold text-xl text-primary flex items-baseline gap-2">
                        {slider.discount && <span>{slider.discount}% OFF</span>}
                        {slider.price && <span className={slider.discount ? "text-sm text-muted-foreground line-through font-normal" : ""}>${slider.price}</span>}
                      </dd>
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <dt className="text-sm font-medium text-muted-foreground">Campaign ID</dt>
                    <dd className="font-medium font-mono text-sm">#{slider.id}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
