"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Heart,
  Shuffle,
  Repeat,
  Repeat1,
  Loader2,
  ChevronUp,
  MoreHorizontal,
  List,
} from "lucide-react";
import { useAudio } from "@/contexts/EnhancedAudioContext";
import { cn } from "@/lib/utils";

// Custom loader for Next.js Image component
const customLoader = ({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) => {
  return src;
};

export function MiniPlayer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    isLoading,
    error,
    togglePlay,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    setRepeatMode,
    setQueue,
    removeFromQueue,
    trackLike,
    queue,
    currentIndex,
    trackUnlike,
  } = useAudio();

  if (!currentTrack) {
    return null;
  }

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (value: number[]) => {
    const time = (value[0] / 100) * duration;
    seek(time);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
  };

  const handleRepeatToggle = () => {
    const modes: Array<"off" | "all" | "one"> = ["off", "all", "one"];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  const handleLikeToggle = () => {
    console.log("Toggled like for track ID:", currentTrack.id);
    if (currentTrack.isLiked) {
      trackUnlike(currentTrack);
    } else {
      trackLike(currentTrack);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Progress Bar at the very top */}
      <div className="relative h-1 bg-background/20 backdrop-blur-sm">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-0 h-full w-full cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = (clickX / rect.width) * 100;
            handleSeek([percentage]);
          }}
        />
      </div>

      {/* Main Player */}
      <div className="bg-gradient-to-r from-background via-background/95 to-background backdrop-blur-xl border-t border-border/50 shadow-2xl">
        {/* Ambient Background */}
        <div className="absolute inset-0 opacity-5">
          {currentTrack.artwork && (
            <Image
              loader={customLoader}
              src={currentTrack.artwork}
              alt=""
              fill
              className="object-cover blur-xl scale-110"
              sizes="100vw"
            />
          )}
        </div>

        <div className="relative px-4 py-3">
          {/* Compact View */}
          <div className="flex items-center justify-between">
            {/* Track Info */}
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="relative group">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl overflow-hidden ring-1 ring-primary/20 shadow-lg">
                  {currentTrack.artwork ? (
                    <Image
                      loader={customLoader}
                      src={currentTrack.artwork}
                      alt={currentTrack.title}
                      fill
                      className="object-cover transition-transform rounded-xl duration-300 group-hover:scale-105"
                      sizes="56px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <span className="text-primary text-xl">♪</span>
                    </div>
                  )}
                </div>
                {/* Visualizer effect */}
                {isPlaying && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl blur opacity-75 animate-pulse" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate leading-tight">
                  {currentTrack.title}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {currentTrack.artist}
                </p>
                <div className="flex items-center mt-1 space-x-2">
                  <span className="text-xs text-muted-foreground/80">
                    {formatTime(currentTime)}
                  </span>
                  <div className="h-0.5 w-8 bg-primary/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/60 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground/60">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Controls */}
            <div className="flex items-center space-x-2 mx-6">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-8 p-0 transition-all duration-200",
                  isShuffled
                    ? "text-primary bg-primary/10 hover:bg-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                onClick={toggleShuffle}
              >
                <Shuffle className="h-3.5 w-3.5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                disabled={queue.length === 0 || currentIndex <= 0}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={previous}
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                variant="default"
                size="sm"
                className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                onClick={togglePlay}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                disabled={
                  queue.length === 0 || currentIndex >= queue.length - 1
                }
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={next}
              >
                <SkipForward className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-8 p-0 transition-all duration-200",
                  repeatMode !== "off"
                    ? "text-primary bg-primary/10 hover:bg-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                onClick={handleRepeatToggle}
              >
                {repeatMode === "one" ? (
                  <Repeat1 className="h-3.5 w-3.5" />
                ) : (
                  <Repeat className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-8 p-0 transition-all duration-200",
                  currentTrack.isLiked
                    ? "text-red-500 bg-red-500/10 hover:bg-red-500/20"
                    : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                )}
                onClick={handleLikeToggle}
              >
                <Heart
                  className={cn(
                    "h-4 w-4 transition-all duration-200",
                    currentTrack.isLiked && "fill-current"
                  )}
                />
              </Button>

              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                  onClick={toggleMute}
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>

                {/* Volume Slider Popover */}
                {showVolumeSlider && (
                  <div
                    className="absolute bottom-full right-0 mb-2 p-3 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-xl"
                    onMouseEnter={() => setShowVolumeSlider(true)}
                    onMouseLeave={() => setShowVolumeSlider(false)}
                  >
                    <div className="flex items-center space-x-2 w-24">
                      <Slider
                        value={[isMuted ? 0 : volume * 100]}
                        onValueChange={handleVolumeChange}
                        max={100}
                        step={1}
                        className="flex-1"
                        orientation="vertical"
                      />
                    </div>
                  </div>
                )}
              </div>
              {/* view queue button */}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                onClick={() => setShowQueue(!showQueue)}
              >
                <List className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <ChevronUp
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isExpanded && "rotate-180"
                  )}
                />
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-2 text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-md">
              {error}
            </div>
          )}

          {/* Expanded View */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-border/50 space-y-4">
              {/* Full Progress Bar */}
              <div className="space-y-2">
                <Slider
                  value={[progress]}
                  onValueChange={handleSeek}
                  max={100}
                  step={0.1}
                  className="w-full"
                  disabled={isLoading}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Additional Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-xs"
                  >
                    <MoreHorizontal className="h-3 w-3 mr-1" />
                    More
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">Volume</span>
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="w-20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* expand queue */}
          {showQueue && (
            <div className="mt-4 pt-4 border-t border-border/50 max-h-60 overflow-y-auto space-y-2">
              {queue.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No tracks in queue
                </p>
              ) : (
                queue.map((track, index) => {
                  const isCurrent = index === currentIndex;
                  return (
                    <div
                      key={track.id}
                      className={cn(
                        "flex items-center justify-between px-2 py-2  hover:bg-muted cursor-pointer",
                        isCurrent && "bg-purple-800 ring-1 ring-gray-800 text-primary"

                      )}
                    >
                      {/* Track Artwork */}
                      <div
                        className="flex items-center space-x-3 flex-1 min-w-0"
                        onClick={() => {
                          if (!isCurrent) {
                            setQueue(queue, index);
                            setShowQueue(false);
                          }
                        }}
                      >
                        <div className="w-10 h-10 relative flex-shrink-0 overflow-hidden rounded-md bg-muted">
                          {track.artwork ? (
                            <Image
                              src={track.artwork}
                              alt={track.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                              ♪
                            </div>
                          )}
                        </div>

                        {/* Track Info */}
                        <div className="min-w-0">
                          <p
                            className={cn(
                              "text-sm truncate",
                              isCurrent && "text-primary font-semibold"
                            )}
                          >
                            {track.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {track.artist}
                          </p>
                        </div>
                      </div>

                      {/* Remove Button (disabled for current track) */}
                      {!isCurrent && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive hover:bg-destructive/10"
                          onClick={() => removeFromQueue(index)}
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
