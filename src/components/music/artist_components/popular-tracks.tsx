"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Play, MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react"
import type { Track } from "@/lib/home_feed_types"

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
  const [isExpanded, setIsExpanded] = useState(false)
  const initialDisplayCount = 5
  const displayTracks = isExpanded ? tracks : tracks.slice(0, initialDisplayCount)
  const hasMoreTracks = tracks.length > initialDisplayCount

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Popular Tracks</h2>
        <p className="text-sm text-muted-foreground mt-1">Most played songs</p>
      </div>

      <div className="space-y-1">
        {displayTracks.map((track, index) => (
          <div
            key={track.id}
            className="flex items-center gap-4 p-3 rounded-md hover:bg-muted/40 transition-all duration-200 group cursor-pointer"
          >
            {/* Track Number & Play Button */}
            <div className="w-6 flex items-center justify-center">
              <span className="text-sm font-medium text-muted-foreground group-hover:hidden">{index + 1}</span>
              <Button
                size="sm"
                variant="ghost"
                className="w-6 h-6 p-0 hidden group-hover:flex hover:bg-primary hover:text-primary-foreground"
              >
                <Play className="w-3 h-3 fill-current" />
              </Button>
            </div>

            {/* Album Art */}
            <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
              <Image
                src={track.artworkPath || "/placeholder.svg"}
                alt={track.title}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate text-sm">{track.title}</h3>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{track.album}</p>
            </div>

            {/* Plays Count */}
            <div className="hidden sm:block text-xs text-muted-foreground font-medium">
              {formatPlays(track.totalplays)}
            </div>

            {/* Duration */}
            <div className="text-xs text-muted-foreground font-mono min-w-[35px] text-right">
              {formatDuration(track.duration)}
            </div>

            {/* More Options */}
            <Button
              size="sm"
              variant="ghost"
              className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Show More/Less Button */}
      {hasMoreTracks && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-2" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                Show More ({tracks.length - initialDisplayCount} more)
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
