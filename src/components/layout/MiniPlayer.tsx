"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  X,
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
    trackUnlike,
    trackPlay,
    trackSkip,
    queue,
    currentIndex,
  } = useAudio();

  // Memoized values for performance
  const progress = useMemo(() => {
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  }, [currentTime, duration]);

  const formatTime = useCallback((time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  const canGoNext = useMemo(() => {
    return queue.length > 0 && currentIndex < queue.length - 1;
  }, [queue.length, currentIndex]);

  const canGoPrevious = useMemo(() => {
    return queue.length > 0 && currentIndex > 0;
  }, [queue.length, currentIndex]);

  // Enhanced handlers with analytics
  const handleSeek = useCallback((value: number[]) => {
    const time = (value[0] / 100) * duration;
    seek(time);
  }, [duration, seek]);

  const handleVolumeChange = useCallback((value: number[]) => {
    setVolume(value[0] / 100);
  }, [setVolume]);

  const handleRepeatToggle = useCallback(() => {
    const modes: Array<"off" | "all" | "one"> = ["off", "all", "one"];
    const currentModeIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentModeIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  }, [repeatMode, setRepeatMode]);

  const handleLikeToggle = useCallback(() => {
    if (!currentTrack) return;
    
    if (currentTrack.isLiked) {
      trackUnlike(currentTrack);
    } else {
      trackLike(currentTrack);
    }
  }, [currentTrack, trackLike, trackUnlike]);

  const handleNext = useCallback(() => {
    if (currentTrack) {
      trackSkip(currentTrack);
    }
    next();
  }, [currentTrack, trackSkip, next]);

  const handlePrevious = useCallback(() => {
    if (currentTrack) {
      trackSkip(currentTrack);
    }
    previous();
  }, [currentTrack, trackSkip, previous]);

  const handleTrackSelect = useCallback((track: any, index: number) => {
    if (index !== currentIndex) {
      trackPlay(track, 'queue', 'mini-player');
      setQueue(queue, index);
      setShowQueue(false);
    }
  }, [currentIndex, trackPlay, setQueue, queue]);

  const handleProgressClick = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    handleSeek([percentage]);
  }, [handleSeek]);

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't handle keyboard shortcuts when user is typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Don't handle if any modal or dropdown is open
      if (document.querySelector('[role="dialog"]') || document.querySelector('[role="menu"]')) {
        return;
      }

      switch(e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (e.shiftKey) {
            // Shift + Left = Previous track
            if (canGoPrevious) {
              handlePrevious();
            }
          } else {
            // Left = Seek backward 10 seconds
            const newTime = Math.max(0, currentTime - 10);
            seek(newTime);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (e.shiftKey) {
            // Shift + Right = Next track
            if (canGoNext) {
              handleNext();
            }
          } else {
            // Right = Seek forward 10 seconds
            const newTime = Math.min(duration, currentTime + 10);
            seek(newTime);
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          // Up = Volume up
          const newVolumeUp = Math.min(1, volume + 0.1);
          setVolume(newVolumeUp);
          break;
        case 'ArrowDown':
          e.preventDefault();
          // Down = Volume down
          const newVolumeDown = Math.max(0, volume - 0.1);
          setVolume(newVolumeDown);
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMute();
          break;
        case 's':
        case 'S':
          e.preventDefault();
          toggleShuffle();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          handleRepeatToggle();
          break;
        case 'l':
        case 'L':
          e.preventDefault();
          handleLikeToggle();
          break;
        case 'q':
        case 'Q':
          e.preventDefault();
          setShowQueue(!showQueue);
          break;
        case 'Escape':
          e.preventDefault();
          setShowQueue(false);
          setIsExpanded(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [
    togglePlay,
    handleNext,
    handlePrevious,
    currentTime,
    duration,
    volume,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    handleRepeatToggle,
    handleLikeToggle,
    showQueue,
    setShowQueue,
    canGoNext,
    canGoPrevious,
  ]);

  // Don't render if no current track
  if (!currentTrack) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Progress Bar at the very top */}
      <div className="relative h-1 bg-background/20 backdrop-blur-sm">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-0 h-full w-full cursor-pointer group"
          onClick={handleProgressClick}
        >
          {/* Hover indicator */}
          <div 
            className="absolute top-0 left-0 h-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
            style={{ width: `${progress}%` }} 
          />
        </div>
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
                title="Toggle Shuffle (S)"
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
                title="Previous Track (Shift + ←)"
                disabled={!canGoPrevious}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handlePrevious}
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                variant="default"
                size="sm"
                title="Play/Pause (Space)"
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
                title="Next Track (Shift + →)"
                disabled={!canGoNext}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleNext}
              >
                <SkipForward className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                title="Toggle Repeat (R)"
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
                title="Like/Unlike Track (L)"
                className={cn(
                  "h-8 w-8 p-0 transition-all duration-200 group",
                  currentTrack.isLiked
                    ? "text-red-500 bg-red-500/10 hover:bg-red-500/20"
                    : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                )}
                onClick={handleLikeToggle}
              >
                <Heart
                  className={cn(
                    "h-4 w-4 transition-all duration-200 group-hover:scale-110",
                    currentTrack.isLiked && "fill-current"
                  )}
                />
              </Button>

              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  title="Volume Control (M to mute, ↑↓ to adjust)"
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
                    <div className="flex flex-col items-center space-y-2 h-24">
                      <span className="text-xs text-muted-foreground">
                        {Math.round((isMuted ? 0 : volume) * 100)}%
                      </span>
                      <Slider
                        value={[isMuted ? 0 : volume * 100]}
                        onValueChange={handleVolumeChange}
                        max={100}
                        step={1}
                        className="h-16"
                        orientation="vertical"
                      />
                    </div>
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                title="View Queue (Q)"
                className={cn(
                  "h-8 w-8 p-0 transition-all duration-200",
                  showQueue
                    ? "text-primary bg-primary/10 hover:bg-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                onClick={() => setShowQueue(!showQueue)}
              >
                <List className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                title="Expand Player"
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
            <div className="mt-2 flex items-center justify-between text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-md">
              <span>{error}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 text-destructive hover:text-destructive/80"
                onClick={() => {
                  // Clear error - you might need to add this method to your context
                  console.log("Clear error");
                }}
              >
                <X className="h-3 w-3" />
              </Button>
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

              {/* Keyboard Shortcuts Help */}
              <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded space-y-1">
                <p className="font-medium">Keyboard Shortcuts:</p>
                <div className="grid grid-cols-2 gap-1">
                  <span>Space: Play/Pause</span>
                  <span>M: Mute/Unmute</span>
                  <span>←/→: Seek ±10s</span>
                  <span>↑/↓: Volume ±10%</span>
                  <span>Shift+←/→: Prev/Next</span>
                  <span>S: Shuffle</span>
                  <span>R: Repeat</span>
                  <span>L: Like</span>
                  <span>Q: Queue</span>
                  <span>Esc: Close</span>
                </div>
              </div>
            </div>
          )}

          {/* Queue View */}
          {showQueue && (
            <div className="mt-4 pt-4 border-t border-border/50 max-h-60 overflow-y-auto space-y-2">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Queue ({queue.length} tracks)</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setShowQueue(false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              
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
                        "flex items-center justify-between px-2 py-2 hover:bg-muted cursor-pointer group rounded-md",
                        isCurrent && "bg-purple-800 ring-1 ring-gray-800 text-primary"
                      )}
                    >
                      <div
                        className="flex items-center space-x-3 flex-1 min-w-0"
                        onClick={() => handleTrackSelect(track, index)}
                      >
                        <div className="w-10 h-10 relative flex-shrink-0 overflow-hidden rounded-md bg-muted">
                          {track.artwork ? (
                            <Image
                              loader={customLoader}
                              src={track.artwork}
                              alt={track.title}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                              ♪
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
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

                        {isCurrent && (
                          <div className="flex items-center">
                            {isPlaying ? (
                              <div className="flex space-x-1">
                                <div className="w-1 h-3 bg-primary animate-pulse" />
                                <div className="w-1 h-3 bg-primary animate-pulse" style={{ animationDelay: '0.1s' }} />
                                <div className="w-1 h-3 bg-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
                              </div>
                            ) : (
                              <Pause className="h-3 w-3 text-primary" />
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (track.isLiked) {
                              trackUnlike(track);
                            } else {
                              trackLike(track);
                            }
                          }}
                        >
                          <Heart className={cn("h-3 w-3", track.isLiked && "fill-current text-red-500")} />
                        </Button>
                        
                        {!isCurrent && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive hover:bg-destructive/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromQueue(index);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
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