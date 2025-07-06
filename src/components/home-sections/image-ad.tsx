import Image from "next/image"
import { Button } from "@/components/ui/button"

interface ImageAdProps {
  title: string
  description: string
  image: string
  link: string
  type: string
}

export function ImageAd({ title, description, image, link, type }: ImageAdProps) {
  return (
    <div className="relative bg-card rounded-lg overflow-hidden border mb-8">
      <div className="flex flex-col md:flex-row">
        <div>
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            width={400}
            height={300}
            className="w-full h-48 md:h-full object-cover"
          />
        </div>
        <div className="md:w-2/3 p-6 flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground mb-4">{description}</p>
          <Button className="w-fit">{type === "playlist" ? "Listen Now" : "Learn More"}</Button>
        </div>
      </div>
    </div>
  )
}
