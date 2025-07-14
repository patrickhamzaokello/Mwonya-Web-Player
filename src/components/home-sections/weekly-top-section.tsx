"use client"

import Image from "next/image"
import { Play, Pause, MoreHorizontal, TrendingUp, Calendar } from "lucide-react"
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

  const handplaytrack = (index: number) => {
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

  const playAllTracks = () => {
    if (tracks && tracks.length > 0) {
      handplaytrack(0)
      
    }
  }

  const formatDuration = (duration: any) => {
    if (typeof duration === 'string') return duration
    if (typeof duration === 'number') {
      const minutes = Math.floor(duration / 60)
      const seconds = Math.floor(duration % 60)
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
    return '0:00'
  }

  return (
    <div className="w-full mb-8">
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {/* Compact Header */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">{heading}</h2>
                <p className="text-sm text-muted-foreground">{subheading}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{weekDate}</span>
              </div>
              <Button 
                onClick={playAllTracks}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 h-9 rounded-md font-medium"
                
              >
                <Play className="w-4 h-4 mr-2 fill-current" />
                Play All
              </Button>
            </div>
          </div>
        </div>

        {/* Featured Artist Banner */}
        <div className="px-6 py-4 bg-muted/30 border-b border-border">
          <div className="flex items-center gap-4">
            <Image
              src={weekImage || "/placeholder.svg"}
              alt={weekArtist}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <div className="flex-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Artist of the Week
              </span>
              <p className="font-medium text-foreground mt-0.5">{weekArtist}</p>
            </div>
          </div>
        </div>

        {/* Compact Track List */}
        <div className="divide-y divide-border">
          {tracks.slice(0, 10).map((track, index) => {
            const position = index + 1
            const isPlaying = playingTrack === track.id
            
            return (
              <div
                key={track.id}
                className={`
                  group flex items-center gap-4 px-6 py-3 hover:bg-muted/50 cursor-pointer transition-colors
                  ${isPlaying ? 'bg-primary/5 border-l-4 border-primary' : ''}
                `}
                onClick={() => togglePlay(String(track.id))}
              >
                {/* Ranking Position */}
                <div className="flex items-center justify-center w-8">
                  <span className={`text-sm font-bold ${
                    position <= 3 
                      ? 'text-primary' 
                      : position <= 5 
                        ? 'text-foreground' 
                        : 'text-muted-foreground'
                  }`}>
                    {position}
                  </span>
                </div>

                {/* Album Art with Play Indicator */}
                <div className="relative">
                  <Image
                    src={(track.artworkPath as string) || "/placeholder.svg"}
                    alt={track.title}
                    width={48}
                    height={48}
                    className="rounded-md object-cover w-15 h-15"
                  />
                  {isPlaying && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                      <Pause className="w-5 h-5 text-white fill-current" />
                    </div>
                  )}
                </div>

                {/* Track Information */}
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${
                    isPlaying ? 'text-primary' : 'text-foreground'
                  }`}>
                    {track.title}
                  </p>
                  <p className="text-sm text-muted-foreground truncate mt-0.5">
                    {track.artist}
                  </p>
                </div>

                {/* Duration */}
                <div className="text-sm text-muted-foreground font-mono min-w-[40px] text-right">
                  {formatDuration(track.duration)}
                </div>

                {/* Action Menu */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 hover:bg-muted"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer Stats */}
        <div className="px-6 py-3 bg-muted/30 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing top 10 tracks</span>
            <span>{tracks.length} total tracks this week</span>
          </div>
        </div>
      </div>
    </div>
  )
}