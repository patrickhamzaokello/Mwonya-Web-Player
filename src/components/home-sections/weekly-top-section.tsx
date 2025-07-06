"use client"

import Image from "next/image"
import { Play, Pause, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import type { Track } from "@/lib/home_feed_types"
import { useAudio } from "@/contexts/EnhancedAudioContext"

interface WeeklyTopSectionProps {
  tracks: Track[]
  heading: string
  subheading: string
  weekArtist: string
  weekDate: string
  weekImage: string
}

export function WeeklyTopSection({
  tracks,
  heading,
  subheading,
  weekArtist,
  weekDate,
  weekImage,
}: WeeklyTopSectionProps) {
  const [playingTrack, setPlayingTrack] = useState<string | null>(null)
   const { setQueue, play } = useAudio()

  const togglePlay = (trackId: string) => {
    handplaytrack(tracks.findIndex(track => track.id === trackId))
    setPlayingTrack(playingTrack === trackId ? null : trackId)
  }

  const handplaytrack=(index: number)=>{
    if (tracks && tracks.length > 0) {
      const updatedTracks = tracks.map((track) => ({
        ...track,
        url: track.path,
        artwork: track.artworkPath,
        id: String(track.id),
        duration: Number(track.duration),
        genre: track.genre ?? undefined,
      }))

      setQueue(updatedTracks, index)
      play(updatedTracks[index])
    }
  }

  return (
    <div className="w-full mb-12">
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-1">{heading}</h2>
              <p className="text-muted-foreground text-sm">{subheading}</p>
            </div>
            <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {weekDate}
            </span>
          </div>

          {/* Featured Artist */}
          <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
            <Image
              src={weekImage || "/placeholder.svg"}
              alt={weekArtist}
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
                Artist of the Week
              </p>
              <p className="font-medium text-foreground">{weekArtist}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full h-8 px-4 text-xs"
            >
              <Play className="w-3 h-3 mr-1 fill-current" />
              Play All
            </Button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border mx-6" />

        {/* Track List */}
        <div className="p-6 pt-4">
          <div className="space-y-1">
            {tracks.slice(0, 10).map((track, index) => {
              const position = index + 1
              const isPlaying = playingTrack === track.id
              
              return (
                <div
                  key={track.id}
                  className={`
                    group flex items-center gap-4 p-3 rounded-md cursor-pointer transition-colors
                    ${isPlaying 
                      ? 'bg-primary/5 border-l-2 border-primary' 
                      : 'hover:bg-muted/50'
                    }
                  `}
                  onClick={() => togglePlay(String(track.id))}
                >
                  {/* Position */}
                  <div className="flex items-center justify-center w-6 h-6">
                    <span className={`text-sm font-medium ${
                      position <= 3 
                        ? 'text-foreground font-semibold' 
                        : 'text-muted-foreground'
                    }`}>
                      {position}
                    </span>
                  </div>

                  {/* Album Art */}
                  <div className="relative overflow-hidden rounded bg-muted">
                    <Image
                      src={(track.artworkPath as string) || "/placeholder.svg"}
                      alt={track.title}
                      width={44}
                      height={44}
                      className="aspect-square object-cover"
                    />
                    {isPlaying && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Pause className="w-4 h-4 text-white fill-current" />
                      </div>
                    )}
                  </div>

                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${
                      isPlaying ? 'text-primary' : 'text-foreground'
                    }`}>
                      {track.title}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {track.artist}
                    </p>
                  </div>

                  {/* Duration */}
                  <div className="text-sm text-muted-foreground font-mono">
                    {track.duration}
                  </div>

                  {/* More Options */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}