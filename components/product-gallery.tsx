"use client"

interface ProductGalleryProps {
  images: string[]
  selectedImage: number
  onImageSelect: (index: number) => void
}

export function ProductGallery({ images, selectedImage, onImageSelect }: ProductGalleryProps) {
  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-video rounded-lg overflow-hidden bg-muted">
        <img
          src={images[selectedImage] || "/placeholder.svg"}
          alt="Product image"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnail Images */}
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => onImageSelect(index)}
            className={`aspect-video rounded-lg overflow-hidden border-2 transition-colors ${
              selectedImage === index ? "border-primary" : "border-transparent hover:border-muted-foreground"
            }`}
          >
            <img
              src={image || "/placeholder.svg"}
              alt={`Product image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
