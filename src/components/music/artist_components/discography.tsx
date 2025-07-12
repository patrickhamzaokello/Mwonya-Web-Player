import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ArtistAlbum } from "@/lib/artist_page_types"

interface DiscographyProps {
  albums: ArtistAlbum[]
}

export function Discography({ albums }: DiscographyProps) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-semibold text-foreground mb-8">Discography</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <Card key={album.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="aspect-square rounded-lg overflow-hidden mb-4">
                  <Image
                    src={album.artworkPath || "/placeholder.svg"}
                    alt={album.title}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground line-clamp-1">{album.title}</h3>

                  <p className="text-sm text-muted-foreground">{album.datecreated}</p>

                  <p className="text-sm text-muted-foreground line-clamp-2">{album.description}</p>

                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {album.genre}
                    </Badge>

                    <span className="text-xs text-muted-foreground">{album.totalsongplays} plays</span>
                  </div>

                  {album.exclusive && (
                    <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-400">
                      Exclusive
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
