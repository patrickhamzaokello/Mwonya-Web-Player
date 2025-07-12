import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Play } from "lucide-react"
import type { RelatedArtist } from "@/lib/artist_page_types"

interface RelatedArtistsProps {
  artists: RelatedArtist[]
}

export function RelatedArtists({ artists }: RelatedArtistsProps) {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
          Related Artists
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {artists.map((artist) => (
            <Link key={artist.id} href={`/library/artists/${artist.id}`}>
              <Card className="group cursor-pointer border-0 bg-transparent hover:bg-card/50 transition-all duration-300 hover:scale-105">
                <CardContent className="p-0">
                  {/* Main Image Container */}
                  <div className="relative aspect-square rounded-full overflow-hidden mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300 border-2 border-background group-hover:border-primary/20">
                    <Image
                      src={artist.profilephoto || "/placeholder.svg"}
                      alt={artist.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16vw"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                        <Play className="w-6 h-6 text-black fill-current" />
                      </div>
                    </div>
                    
                    {/* Instagram-style Verification Badge */}
                    {artist.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-lg">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-1.5">
                          <CheckCircle className="w-4 h-4 text-white fill-current" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Artist Info */}
                  <div className="text-center space-y-1 px-2">
                    <h3 className="font-semibold text-foreground text-base line-clamp-1 group-hover:text-primary transition-colors">
                      {artist.name}
                    </h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {artist.genre}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}