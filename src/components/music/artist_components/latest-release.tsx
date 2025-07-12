import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Play, Calendar, Sparkles } from "lucide-react"
import type { ArtistPick } from "@/lib/artist_page_types"

interface LatestReleaseProps {
  release: ArtistPick
}

export function LatestRelease({ release }: LatestReleaseProps) {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground tracking-tight">Latest Release</h2>
        <p className="text-base text-muted-foreground/80 mt-2">New music from this artist</p>
      </div>

      {/* Main Content - Flex Layout */}
      <div className="flex flex-col sm:flex-row gap-8">
        {/* Cover Art */}
        <div className="flex-shrink-0">
          <div className="relative group">
            <div className="w-56 h-56 rounded-xl overflow-hidden bg-muted shadow-2xl ring-1 ring-black/5">
              <Image
                src={release.coverimage || "/placeholder.svg"}
                alt={release.song_title}
                width={224}
                height={224}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl flex items-center justify-center">
              <Button size="lg" className="bg-white/95 hover:bg-white text-black rounded-full w-14 h-14 p-0 shadow-xl backdrop-blur-sm">
                <Play className="w-6 h-6 fill-current ml-0.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Release Info */}
        <div className="flex-1 flex flex-col justify-center min-h-56">
          <div className="space-y-3">
            {/* Release Date and Status */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground/90">
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                <span className="font-medium">{release.out_now}</span>
              </div>
              {release.exclusive && (
                <>
                  <div className="w-1 h-1 bg-muted-foreground/50 rounded-full" />
                  <div className="flex items-center gap-2 text-amber-600">
                    <Sparkles className="w-3 h-3" />
                    <span className="font-semibold">Exclusive</span>
                  </div>
                </>
              )}
            </div>

            {/* Title and Artist */}
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground leading-tight tracking-tight">
                {release.song_title}
              </h3>
              <p className="text-sm text-muted-foreground font-medium">by {release.type}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}