"use client"

import { useAudio } from "@/contexts/AudioContext"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import {
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Repeat1,
  Volume2,
  X,
  Heart,
  Share2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatTime } from "@/lib/utils"

const FullScreenPlayer = ({ onClose }: { onClose: () => void }) => {
  const {
    isPlaying,
    currentTrack,
    togglePlay,
    currentTime,
    duration,
    playPreviousTrack,
    playNextTrack,
    setVolume,
    volume,
    nextTrack,
    previousTrack,
    isBuffering,
    seek
  } = useAudio()

  // States for additional functionality
  const [isShuffleOn, setIsShuffleOn] = useState(false)
  const [repeatMode, setRepeatMode] = useState(0) // 0: no repeat, 1: repeat all, 2: repeat one
  const [isLiked, setIsLiked] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)


interface ProgressClickEvent extends React.MouseEvent<HTMLDivElement> {
    clientX: number;
}

const handleProgressClick = (e: ProgressClickEvent): void => {
    if (!progressRef.current || !duration) return;

    const rect = progressRef.current.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    const newTime = position * Number(duration);
    seek(newTime);
};

  const handleProgressDragStart = () => {
    setIsDragging(true)
  }

  const handleProgressDragEnd = () => {
    setIsDragging(false)
  }

interface ProgressDragEvent extends MouseEvent {
    clientX: number;
}

const handleProgressDrag = (e: ProgressDragEvent): void => {
    if (!isDragging || !progressRef.current || !duration) return;

    const rect = progressRef.current.getBoundingClientRect();
    const position = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = position * Number(duration);
    seek(newTime);
};

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleProgressDrag)
      window.addEventListener("mouseup", handleProgressDragEnd)
    }

    return () => {
      window.removeEventListener("mousemove", handleProgressDrag)
      window.removeEventListener("mouseup", handleProgressDragEnd)
    }
  }, [isDragging])

const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setVolume(Number.parseFloat(e.target.value))
}

  const toggleShuffle = () => {
    setIsShuffleOn(!isShuffleOn)
  }

  const toggleRepeat = () => {
    setRepeatMode((repeatMode + 1) % 3)
  }

  const toggleLike = () => {
    setIsLiked(!isLiked)
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between">
        <button onClick={onClose} className="text-foreground hover:text-primary transition-colors">
          <X size={24} />
        </button>
        <h2 className="text-lg font-semibold text-foreground">Now Playing</h2>
        <div className="w-6"></div> {/* Empty div for balanced layout */}
      </div>

      {/* Album Art */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="relative w-full max-w-md aspect-square rounded-md overflow-hidden shadow-lg">
          {currentTrack?.artworkPath ? (
            <Image
              src={currentTrack.artworkPath || "/placeholder.svg"}
              alt={currentTrack.title}
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-4xl font-bold text-foreground opacity-30">MWONYA</span>
            </div>
          )}
        </div>
      </div>

      {/* Track Info */}
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {currentTrack?.title || "No track selected"}
            </h1>
            <p className="text-primary">
              {currentTrack?.artist || "Unknown artist"}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={toggleLike}
              className={cn("hover:scale-110 transition-transform", isLiked ? "text-primary" : "text-muted-foreground")}
            >
              <Heart size={22} className={isLiked ? "fill-primary" : ""} />
            </button>
            <button className="text-muted-foreground hover:text-foreground hover:scale-110 transition-all">
              <Share2 size={22} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center w-full gap-2 mb-4">
          <span className="text-sm text-muted-foreground w-12">{formatTime(currentTime)}</span>

          <div
            ref={progressRef}
            className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden cursor-pointer group relative"
            onClick={handleProgressClick}
            onMouseDown={handleProgressDragStart}
          >
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${Number(duration) > 0 ? (currentTime / Number(duration)) * 100 : 0}%` }}
            />
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity",
                isDragging && "opacity-100",
              )}
              style={{
                left: `calc(${Number(duration) > 0 ? (currentTime / Number(duration)) * 100 : 0}% - 6px)`,
                display: Number(duration) > 0 ? "block" : "none",
              }}
            />
          </div>

          <span className="text-sm text-muted-foreground w-12 text-right">{formatTime(Number(duration))}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={toggleShuffle}
            className={cn("p-2 text-muted-foreground hover:text-foreground transition-colors", isShuffleOn && "text-primary")}
            aria-label="Shuffle"
          >
            <Shuffle size={20} />
          </button>

          <div className="flex items-center gap-6">
            <button
              onClick={playPreviousTrack}
              disabled={!previousTrack}
              className={cn(
                "p-2 text-muted-foreground hover:text-foreground transition-colors",
                !previousTrack && "opacity-50 cursor-not-allowed",
              )}
              aria-label="Previous"
            >
              <SkipBack size={24} />
            </button>

            <button
              onClick={togglePlay}
              disabled={isBuffering}
              className={cn(
                "w-16 h-16 flex items-center justify-center rounded-full transition-all",
                isBuffering ? "bg-muted text-primary" : "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isBuffering ? (
                <div className="relative w-8 h-8">
                  <div className="absolute inset-0 border-3 border-primary-foreground border-t-transparent rounded-full animate-spin opacity-80"></div>
                  <div className="absolute inset-0 border-3 border-transparent border-t-primary-foreground rounded-full animate-spin opacity-80"
                    style={{ animationDuration: "2s", animationDirection: "reverse" }}></div>
                </div>
              ) : isPlaying ? (
                <Pause size={28} />
              ) : (
                <Play size={28} className="ml-1" />
              )}
            </button>

            <button
              onClick={playNextTrack}
              disabled={!nextTrack}
              className={cn(
                "p-2 text-muted-foreground hover:text-foreground transition-colors",
                !nextTrack && "opacity-50 cursor-not-allowed",
              )}
              aria-label="Next"
            >
              <SkipForward size={24} />
            </button>
          </div>

          <button
            onClick={toggleRepeat}
            className={cn(
              "p-2 text-muted-foreground hover:text-foreground transition-colors",
              repeatMode > 0 && "text-primary",
            )}
            aria-label={repeatMode === 0 ? "Repeat Off" : repeatMode === 1 ? "Repeat All" : "Repeat One"}
          >
            {repeatMode === 2 ? <Repeat1 size={20} /> : <Repeat size={20} />}
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Volume2 size={18} className="text-muted-foreground" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-40 h-1.5 appearance-none bg-muted rounded-full outline-none 
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 
              [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full 
              [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}

export default FullScreenPlayer