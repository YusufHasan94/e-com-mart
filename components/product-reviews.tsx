"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, ThumbsUp, ThumbsDown } from "lucide-react"

interface ProductReviewsProps {
  productId: string
}

// Mock reviews data
const mockReviews = [
  {
    id: 1,
    user: "GamerPro2023",
    rating: 5,
    date: "2024-01-15",
    title: "Amazing game with incredible visuals",
    content:
      "This game exceeded all my expectations. The graphics are stunning, the story is engaging, and the gameplay is smooth. Definitely worth the price!",
    helpful: 24,
    notHelpful: 2,
    verified: true,
  },
  {
    id: 2,
    user: "TechReviewer",
    rating: 4,
    date: "2024-01-10",
    title: "Great game but has some issues",
    content:
      "Overall a fantastic experience. The world is immersive and the characters are well-developed. However, I did encounter a few bugs that affected gameplay.",
    helpful: 18,
    notHelpful: 5,
    verified: true,
  },
  {
    id: 3,
    user: "CasualGamer",
    rating: 3,
    date: "2024-01-05",
    title: "Good but not great",
    content:
      "It's a decent game with good graphics, but the story felt a bit rushed. The gameplay mechanics are solid though.",
    helpful: 12,
    notHelpful: 8,
    verified: false,
  },
]

const ratingDistribution = [
  { stars: 5, count: 650, percentage: 52 },
  { stars: 4, count: 375, percentage: 30 },
  { stars: 3, count: 125, percentage: 10 },
  { stars: 2, count: 75, percentage: 6 },
  { stars: 1, count: 25, percentage: 2 },
]

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [sortBy, setSortBy] = useState("helpful")

  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Overall Rating */}
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold">4.2</div>
              <div className="flex justify-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(4.2) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <p className="text-muted-foreground">Based on 1,250 reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map((rating) => (
                <div key={rating.stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm">{rating.stars}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <Progress value={rating.percentage} className="flex-1" />
                  <span className="text-sm text-muted-foreground w-12">{rating.count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sort Options */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Customer Reviews</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Button variant={sortBy === "helpful" ? "default" : "outline"} size="sm" onClick={() => setSortBy("helpful")}>
            Most Helpful
          </Button>
          <Button variant={sortBy === "recent" ? "default" : "outline"} size="sm" onClick={() => setSortBy("recent")}>
            Most Recent
          </Button>
          <Button variant={sortBy === "rating" ? "default" : "outline"} size="sm" onClick={() => setSortBy("rating")}>
            Highest Rating
          </Button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {mockReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Review Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.user}</span>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="space-y-2">
                  <h4 className="font-medium">{review.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{review.content}</p>
                </div>

                {/* Review Actions */}
                <div className="flex items-center gap-4 pt-2">
                  <span className="text-sm text-muted-foreground">Was this helpful?</span>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <ThumbsUp className="h-3 w-3" />
                    Yes ({review.helpful})
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <ThumbsDown className="h-3 w-3" />
                    No ({review.notHelpful})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" size="lg">
          Load More Reviews
        </Button>
      </div>
    </div>
  )
}
