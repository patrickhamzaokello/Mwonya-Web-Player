"use client"

import type React from "react"

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
  ListMusic,
  MessageSquare,
  Star,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SidebarTrigger } from "./ui/sidebar"
import FullScreenPlayer from "./ControlFullscreen"

const ControlBar = () => {
  const {
    isPlaying,
    currentTrack,
    togglePlay,
    currentTime,
    duration,
    playPreviousTrack,
    playNextTrack,
    setVolume,
    setCurrentTime,
    volume,
    nextTrack,
    previousTrack,
    isBuffering,
    seek,
  } = useAudio()

  const user = {
    name: "Pkasemer",
    image: "https://assets.mwonya.com/images/daylistcover.png",
  }

  // States for additional functionality
  const [isShuffleOn, setIsShuffleOn] = useState(false)
  const [repeatMode, setRepeatMode] = useState(0) // 0: no repeat, 1: repeat all, 2: repeat one
  const [showLyrics, setShowLyrics] = useState(false)
  const [showQueue, setShowQueue] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [showFullScreenPlayer, setShowFullScreenPlayer] = useState(false) // New state for fullscreen player

  const progressRef = useRef<HTMLDivElement>(null)

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !duration) return;

    const rect = progressRef.current.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    const newTime = position * Number(duration);
    seek(newTime); // Use seek instead of setCurrentTime
  };

  const handleProgressDragStart = () => {
    setIsDragging(true)
  }

  const handleProgressDragEnd = () => {
    setIsDragging(false)
  }

  const handleProgressDrag = (e: MouseEvent) => {
    if (!isDragging || !progressRef.current || !duration) return;

    const rect = progressRef.current.getBoundingClientRect();
    const position = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = position * Number(duration);
    seek(newTime); // Use seek instead of setCurrentTime
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

  useEffect(() => {
    return () => {
      setShowFullScreenPlayer(false);
    };
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number.parseFloat(e.target.value))
  }

  const toggleShuffle = () => {
    setIsShuffleOn(!isShuffleOn)
    // Implement shuffle functionality in AudioContext
  }

  const toggleRepeat = () => {
    setRepeatMode((repeatMode + 1) % 3)
    // Implement repeat functionality in AudioContext
  }

  const toggleLyrics = () => {
    setShowLyrics(!showLyrics)
  }

  const toggleQueue = () => {
    setShowQueue(!showQueue)
  }

  const toggleLike = () => {
    setIsLiked(!isLiked)
  }

  // Toggle fullscreen player
  const toggleFullScreenPlayer = () => {
    setShowFullScreenPlayer(!showFullScreenPlayer)
  }

  // Close fullscreen player
  const closeFullScreenPlayer = () => {
    setShowFullScreenPlayer(false)
  }

  return (
    <>
      {showFullScreenPlayer && <FullScreenPlayer onClose={closeFullScreenPlayer} />}
      <div className="bg-background border-b border-border flex items-center justify-between sticky bottom-0 z-10 w-full h-[64px] px-4">
        {/* Left Section - Sidebar Toggle */}
        <div className="flex-shrink-0 w-10">
          <SidebarTrigger />
        </div>

        {/* Media Controls */}
        <div className="flex items-center gap-3 flex-shrink-0 lg:gap-4">
          <button
            onClick={toggleShuffle}
            className={cn("text-muted-foreground hover:text-foreground transition-colors", isShuffleOn && "text-primary")}
            aria-label="Shuffle"
          >
            <Shuffle size={16} />
          </button>

          <button
            onClick={playPreviousTrack}
            disabled={!previousTrack}
            className={cn(
              "text-muted-foreground hover:text-foreground transition-colors",
              !previousTrack && "opacity-50 cursor-not-allowed",
            )}
            aria-label="Previous"
          >
            <SkipBack size={18} />
          </button>

          <button
            onClick={togglePlay}
            disabled={isBuffering}
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-full transition-all",
              isBuffering ? "text-primary" : "text-foreground hover:bg-accent",
              isPlaying && !isBuffering && "bg-primary/10"
            )}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isBuffering ? (
              <div className="relative w-6 h-6">
                <div className="absolute inset-0 border-2 border-current border-t-transparent rounded-full animate-spin opacity-60"></div>
                <div className="absolute inset-0 border-2 border-transparent border-t-current rounded-full animate-spin opacity-60"
                  style={{ animationDuration: "2s", animationDirection: "reverse" }}></div>
              </div>
            ) : isPlaying ? (
              <Pause size={20} fill="currentColor" className="scale-110" />
            ) : (
              <Play size={20} fill="currentColor" className="ml-0.5 scale-110" />
            )}
          </button>

          <button
            onClick={playNextTrack}
            disabled={!nextTrack}
            className={cn(
              "text-muted-foreground hover:text-foreground transition-colors",
              !nextTrack && "opacity-50 cursor-not-allowed",
            )}
            aria-label="Next"
          >
            <SkipForward size={18} />
          </button>

          <button
            onClick={toggleRepeat}
            className={cn(
              "text-muted-foreground hover:text-foreground transition-colors",
              repeatMode > 0 && "text-primary",
            )}
            aria-label={repeatMode === 0 ? "Repeat Off" : repeatMode === 1 ? "Repeat All" : "Repeat One"}
          >
            {repeatMode === 2 ? <Repeat1 size={16} /> : <Repeat size={16} />}
          </button>
        </div>

        {/* Center Section - Track Info and Progress */}
        <div className="flex items-center flex-1 mx-4 min-w-0">
          {/* Album Art */}
          <div
            className="w-10 h-10 bg-muted rounded-sm overflow-hidden flex-shrink-0 mr-3 cursor-pointer hover:opacity-80 transition-opacity hidden sm:block"
            onClick={toggleFullScreenPlayer}
          >
            {currentTrack?.artworkPath && (
              <Image
                src={currentTrack.artworkPath || "/placeholder.svg"}
                alt={currentTrack.title}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            )}
          </div>

          {/* Track Info and Progress */}
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1 w-full">
              <div className="flex items-center overflow-hidden">
                <h3 className="text-sm font-medium text-foreground truncate max-w-xs">
                  {currentTrack?.title || "No track selected"}
                </h3>
                {currentTrack && (
                  <>
                    <span className="text-primary mx-1 flex-shrink-0">-</span>
                    <p className="text-sm text-primary truncate">{currentTrack.artist}</p>
                  </>
                )}
              </div>

              {currentTrack && (
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <button
                    onClick={toggleLike}
                    className={cn(
                      "text-muted-foreground hover:text-foreground transition-colors",
                      isLiked && "text-primary",
                    )}
                    aria-label={isLiked ? "Unlike" : "Like"}
                  >
                    <Star size={16} className={isLiked ? "fill-primary" : ""} />
                  </button>
                  <span className="text-xs font-medium bg-primary text-primary-foreground px-2 py-0.5 rounded hidden sm:inline-block">
                    MWONYA
                  </span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="flex items-center w-full gap-2">
              <span className="text-xs text-muted-foreground w-8 flex-shrink-0">{formatTime(currentTime)}</span>

              <div
                ref={progressRef}
                className="flex-1 h-1 bg-muted rounded-full overflow-hidden cursor-pointer group relative"
                onClick={handleProgressClick}
                onMouseDown={handleProgressDragStart}
              >
                <div
                  className="h-full bg-foreground group-hover:bg-primary transition-colors"
                  style={{ width: `${Number(duration) > 0 ? (currentTime / Number(duration)) * 100 : 0}%` }}
                />
                <div
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-foreground group-hover:bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity",
                    isDragging && "opacity-100",
                  )}
                  style={{
                    left: `calc(${Number(duration) > 0 ? (currentTime / Number(duration)) * 100 : 0}% - 5px)`,
                    display: Number(duration) > 0 ? "block" : "none",
                  }}
                />
              </div>

              <span className="text-xs text-muted-foreground w-8 text-right flex-shrink-0">{formatTime(Number(duration))}</span>
            </div>
          </div>
        </div>

        {/* Right Section - Volume and Additional Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={toggleLyrics}
            className={cn("text-muted-foreground hover:text-foreground transition-colors hidden sm:block", showLyrics && "text-primary")}
            aria-label="Comments"
          >
            <MessageSquare size={18} />
          </button>

          <button
            onClick={toggleQueue}
            className={cn("text-muted-foreground hover:text-foreground transition-colors", showQueue && "text-primary")}
            aria-label="Queue"
          >
            <ListMusic size={18} />
          </button>

          <div className="flex items-center gap-1 ml-1 hidden md:flex">
            <Volume2 size={16} className="text-muted-foreground" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 appearance-none bg-muted rounded-full outline-none 
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 
              [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full 
              [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>

          {user && (
            <div className="w-8 h-8 rounded-full overflow-hidden cursor-pointer border border-border hover:border-muted-foreground transition-colors ml-2">
              {user.image ? (
                <Image
                  src={user.image || "/placeholder.svg"}
                  alt={user.name}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-xs font-bold text-foreground">{user.name[0]}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ControlBar