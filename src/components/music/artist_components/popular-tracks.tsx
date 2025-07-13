"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Play, MoreHorizontal, ChevronDown, ChevronUp, Pause, Volume2 } from "lucide-react"
import type { Track } from "@/lib/home_feed_types"
import { useAudio } from "@/contexts/EnhancedAudioContext"

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

// Custom hook for image fallback
function useImageFallback(src: string, fallbackSrc: string = "/placeholder.svg") {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImgSrc(fallbackSrc)
    }
  }

  return { imgSrc, handleError }
}

// TrackImage component to handle individual track artwork
function TrackImage({ track, isCurrentTrack, isPlaying }: { track: Track; isCurrentTrack: boolean; isPlaying: boolean }) {
  const { imgSrc, handleError } = useImageFallback(
    track.artworkPath,
    "/placeholder.svg"
  )

  return (
    <div className={`w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-muted relative ${
      isCurrentTrack ? 'ring-2 ring-primary' : ''
    }`}>
      <Image
        src={imgSrc}
        alt={track.title}
        width={40}
        height={40}
        className={`w-full h-full object-cover transition-opacity ${
          isCurrentTrack && isPlaying ? 'opacity-70' : 'opacity-100'
        }`}
        onError={handleError}
      />
      {/* Playing indicator overlay */}
      {isCurrentTrack && isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Volume2 className="w-4 h-4 text-primary animate-pulse" />
        </div>
      )}
    </div>
  )
}

export function PopularTracks({ tracks }: PopularTracksProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const initialDisplayCount = 5
  const displayTracks = isExpanded ? tracks : tracks.slice(0, initialDisplayCount)
  const hasMoreTracks = tracks.length > initialDisplayCount
  // Audio context integration
  const { setQueue, play, pause, currentTrack, isPlaying } = useAudio();

  const handlePlayTrack = (index: number) => {
    if ((tracks ?? []).length > 0) {
      // Set the album tracks as queue starting from the selected track
        const formattedTracks = tracks.map((track) => ({
          ...track,
          url: track.path,
          artwork: track.artworkPath,
          id: String(track.id),
          duration: Number(track.duration),
          genre: track.genre ?? undefined,
        }));
        setQueue(formattedTracks, index);
      play(formattedTracks[index]);
    }
  };

  const handlePlayPause = (track: any, index: number) => {
    const isCurrentTrack = currentTrack?.id === String(track.id);
    
    if (isCurrentTrack && isPlaying) {
      pause();
    } else if (isCurrentTrack && !isPlaying) {
      play(track);
    } else {
      handlePlayTrack(index);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Popular Tracks</h2>
        <p className="text-sm text-muted-foreground mt-1">Most played songs</p>
      </div>

      <div className="space-y-1">
        {displayTracks.map((track, index) => {
          const isCurrentTrack = currentTrack?.id === String(track.id);
          const showPlayingIndicator = isCurrentTrack && isPlaying;
          
          return (
            <div
              key={track.id}
              className={`flex items-center gap-4 p-3 rounded-md hover:bg-muted/40 transition-all duration-200 group cursor-pointer ${
                isCurrentTrack ? 'bg-primary/5 border-l-2 border-primary' : ''
              }`}
            >
              {/* Track Number & Play Button */}
              <div className="w-6 flex items-center justify-center">
                <span className={`text-sm font-medium group-hover:hidden ${
                  isCurrentTrack ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {showPlayingIndicator ? (
                    <div className="flex items-center justify-center">
                      <div className="w-3 h-3 flex items-center justify-center">
                        <div className="flex space-x-0.5">
                          <div className="w-0.5 h-2 bg-primary animate-pulse"></div>
                          <div className="w-0.5 h-3 bg-primary animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-0.5 h-2 bg-primary animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    index + 1
                  )}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-6 h-6 p-0 hidden group-hover:flex hover:bg-primary hover:text-primary-foreground"
                  onClick={() => handlePlayPause(track, index)}
                >
                  {isCurrentTrack && isPlaying ? (
                    <Pause className="w-3 h-3 fill-current" />
                  ) : (
                    <Play className="w-3 h-3 fill-current" />
                  )}
                </Button>
              </div>

              {/* Album Art with Error Handling */}
              <TrackImage track={track} isCurrentTrack={isCurrentTrack} isPlaying={isPlaying} />

              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium truncate text-sm ${
                  isCurrentTrack ? 'text-primary' : 'text-foreground'
                }`}>
                  {track.title}
                </h3>
                <p className={`text-xs truncate mt-0.5 ${
                  isCurrentTrack ? 'text-primary/70' : 'text-muted-foreground'
                }`}>
                  {track.album}
                </p>
              </div>

              {/* Plays Count */}
              <div className={`hidden sm:block text-xs font-medium ${
                isCurrentTrack ? 'text-primary/70' : 'text-muted-foreground'
              }`}>
                {formatPlays(track.totalplays)}
              </div>

              {/* Duration */}
              <div className={`text-xs font-mono min-w-[35px] text-right ${
                isCurrentTrack ? 'text-primary/70' : 'text-muted-foreground'
              }`}>
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
          )
        })}
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