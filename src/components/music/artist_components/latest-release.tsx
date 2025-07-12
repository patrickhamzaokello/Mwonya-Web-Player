import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Calendar } from "lucide-react"
import type { ArtistPick } from "@/lib/artist_page_types"

interface LatestReleaseProps {
  release: ArtistPick
}

export function LatestRelease({ release }: LatestReleaseProps) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-semibold text-foreground mb-8">Latest Release</h2>

        <Card className="max-w-2xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-48 h-48 rounded-lg overflow-hidden">
                  <Image
                    src={release.coverimage || "/placeholder.svg"}
                    alt={release.song_title}
                    width={192}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4" />
                  {release.out_now}
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-2">{release.song_title}</h3>

                <p className="text-muted-foreground mb-4">by {release.type}</p>

                {release.exclusive && (
                  <div className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-medium mb-4">
                    Exclusive
                  </div>
                )}

                <Button className="bg-primary hover:bg-primary/90">
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  Play Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
