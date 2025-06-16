"use client"

import Image from "next/image"
import Link from "next/link"
import { formatDuration } from "@/lib/utils"
import { Play, MoreHorizontal, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAudio } from "@/contexts/AudioContext"
import { Track } from "@/lib/actions"
import { customLoader } from "@/lib/utils"

interface TrendingTracksProps {
  data: {
    heading: string
    type: "trend"
    Tracks: Track[]
  }
}

export function TrendingTracks({ data }: TrendingTracksProps) {
  const { playTrack } = useAudio()
  // Apple Music typically shows 5-8 items in a horizontal scroll
  const displayTracks = data.Tracks.slice(0, 8)

  const handlePlayTrack = (track: Track) => {
    playTrack({
      ...track,
      id: track.id.toString(),
      genreID: track.genreID?.toString() || "",
      explicit: false,
      lyrics: null,
      artworkPath: track.artworkPath || "",
      albumID: track.albumID || ""
    })
  }

  return (
    <div className="mb-10">
      {/* Apple Music style section header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold tracking-tight">{data.heading}</h2>
        <Link 
          href="/trending" 
          className="flex items-center text-sm font-medium text-primary"
        >
          See All
          <ChevronRight className="h-4 w-4 ml-0.5" />
        </Link>
      </div>

      {/* Horizontal scrollable track cards - Apple Music style */}
      <div className="relative -mx-4 px-4">
        <div className="flex overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory">
          {displayTracks.map((track) => (
            <div 
              key={track.id} 
              className="min-w-[160px] w-[160px] mr-4 snap-start first:pl-0 last:pr-4"
            >
              <div className="group relative">
                {/* Artwork */}
                <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-3 shadow-sm">
                  <Image
                    src={track.artworkPath || "/placeholder.svg"}
                    alt={track.title}
                    width={160}
                    height={160}
                    className="object-cover"
                    loader={customLoader}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="rounded-full h-11 w-11 bg-white/30 backdrop-blur-md border-0 hover:bg-white/40 shadow-lg"
                      onClick={() => handlePlayTrack(track)}
                    >
                      <Play className="h-5 w-5 fill-white text-white" />
                    </Button>
                  </div>
                  
                  {/* More menu - Apple Music has this on hover */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="h-7 w-7 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/40">
                          <MoreHorizontal className="h-4 w-4 text-white" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuItem>Play Next</DropdownMenuItem>
                        <DropdownMenuItem>Play Later</DropdownMenuItem>
                        <DropdownMenuItem>Add to Library</DropdownMenuItem>
                        <DropdownMenuItem>Add to Playlist</DropdownMenuItem>
                        <DropdownMenuItem>Show Artist</DropdownMenuItem>
                        <DropdownMenuItem>Show Album</DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                {/* Track title - Apple Music truncates long titles */}
                <h3 className="font-medium text-sm line-clamp-1">{track.title}</h3>
                
                {/* Artist name - slightly smaller and muted */}
                <Link
                  href={`/artist/${track.artistID}`}
                  className="text-xs text-muted-foreground hover:text-primary line-clamp-1 mt-0.5"
                >
                  {track.artist}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Apple Music also often includes a "Charts" section with numbered rankings */}
      <Card className="mt-8 bg-transparent border-none">
        <h3 className="text-lg font-medium mb-2">Top Charts</h3>
        <div className="space-y-1">
          {data.Tracks.slice(0, 5).map((track, index) => (
            <div 
              key={`chart-${track.id}`} 
              className="group flex items-center gap-3 rounded-md p-2 hover:bg-muted/50 transition-colors"
            >
              <div className="flex w-6 items-center justify-center text-sm font-medium text-muted-foreground">
                <span>{index + 1}</span>
              </div>
              <div className="relative h-10 w-10 overflow-hidden rounded-md">
                <Image
                  src={track.artworkPath || "/placeholder.svg"}
                  alt={track.title}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="line-clamp-1 text-sm font-medium">{track.title}</div>
                <Link
                  href={`/artist/${track.artistID}`}
                  className="line-clamp-1 text-xs text-muted-foreground hover:underline"
                >
                  {track.artist}
                </Link>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handlePlayTrack(track)}
              >
                <Play className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}