import Image from "next/image"
import { Button } from "@/components/ui/button"
import { customUrlImageLoader } from "@/lib/utils"
import { ArrowRight, Play, ExternalLink } from "lucide-react"

interface ImageAdProps {
  title: string
  description: string
  image: string
  link: string
  type: string
}

export function ImageAd({ title, description, image, link, type }: ImageAdProps) {
  const isPlaylist = type === "playlist"
  
  return (
    <div className="group relative bg-gradient-to-br from-card to-card/80 rounded-xl overflow-hidden border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 mb-8 hover:scale-[1.02]">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative flex flex-col lg:flex-row">
        {/* Image Section */}
        <div className="lg:w-1/3 relative overflow-hidden">
          <div className="aspect-[2/1] lg:aspect-[3/2] relative">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              loader={customUrlImageLoader}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Image overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Play icon for playlists */}
            {isPlaylist && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-primary/90 backdrop-blur-sm rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                  <Play className="w-6 h-6 text-primary-foreground ml-0.5" fill="currentColor" />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Content Section */}
        <div className="lg:w-2/3 p-3 lg:p-4 flex flex-col justify-center">
          <div className="space-y-2">
            {/* Type badge */}
            <div className="inline-flex items-center gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                {isPlaylist ? "Playlist" : "Article"}
              </span>
            </div>
            
            {/* Title */}
            <h3 className="text-lg lg:text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>
            
            {/* Description */}
            <p className="text-muted-foreground text-xs lg:text-sm leading-snug line-clamp-2">
              {description}
            </p>
            
            {/* CTA Button */}
            <div className="pt-0">
              <Button 
                size="sm" 
                className="group/btn relative overflow-hidden"
                onClick={() => window.open(link, '_blank')}
              >
                <span className="flex items-center gap-2 relative z-10">
                  {isPlaylist ? (
                    <>
                      <Play className="w-4 h-4" />
                      Listen Now
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      Learn More
                    </>
                  )}
                  <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-200" />
                </span>
                
                {/* Button hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-xl opacity-50" />
      <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-lg opacity-30" />
    </div>
  )
}