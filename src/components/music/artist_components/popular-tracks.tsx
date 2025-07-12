import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Play, MoreHorizontal, Clock } from "lucide-react"
import type { Track } from "@/lib/artist_page_types"

interface PopularTracksProps {
  tracks: Track[]
}

function formatDuration(seconds: string | number): string {
  const totalSeconds = typeof seconds === "string" ? Number.parseInt(seconds) : seconds
  const minutes = Math.floor(totalSeconds / 60)
  const remainingSeconds = totalSeconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

function formatPlays(plays: number): string {
  if (plays >= 1000000) {
    return `${(plays / 1000000).toFixed(1)}M`
  } else if (plays >= 1000) {
    return `${(plays / 1000).toFixed(1)}K`
  }
  return plays.toString()
}

export function PopularTracks({ tracks }: PopularTracksProps) {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-semibold text-foreground mb-8">Popular</h2>

        <div className="space-y-2">
          {tracks.map((track, index) => (
            <div
              key={track.id}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              {/* Track Number */}
              <div className="w-8 text-center">
                <span className="text-muted-foreground group-hover:hidden">{index + 1}</span>
                <Button size="sm" variant="ghost" className="w-8 h-8 p-0 hidden group-hover:flex">
                  <Play className="w-4 h-4 fill-current" />
                </Button>
              </div>

              {/* Album Art */}
              <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                <Image
                  src={track.artworkPath || "/placeholder.svg"}
                  alt={track.title}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">{track.title}</h3>
                <p className="text-sm text-muted-foreground truncate">{track.album}</p>
              </div>

              {/* Plays */}
              <div className="hidden md:block text-sm text-muted-foreground">{formatPlays(track.totalplays)} plays</div>

              {/* Duration */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {formatDuration(track.duration)}
              </div>

              {/* More Options */}
              <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
