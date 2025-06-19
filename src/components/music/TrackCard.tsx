'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Play, Pause, Heart, MoreHorizontal, Plus } from 'lucide-react';
import { Track } from '@/types/audio';
import { useAudio } from '@/contexts/EnhancedAudioContext';
import { cn, customLoader } from '@/lib/utils';

interface TrackCardProps {
  track: Track;
  showArtwork?: boolean;
  showAlbum?: boolean;
  index?: number;
}

export function TrackCard({ track, showArtwork = true, showAlbum = true, index }: TrackCardProps) {
  const { currentTrack, isPlaying, play, pause, trackLike, trackUnlike } = useAudio();
  
  const isCurrentTrack = currentTrack?.id === track.id;
  const isTrackPlaying = isCurrentTrack && isPlaying;

  const handlePlayPause = () => {
    if (isCurrentTrack) {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    } else {
      play(track);
    }
  };

  const handleLike = () => {
    if (track.isLiked) {
      trackUnlike(track);
    } else {
      trackLike(track);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={cn(
      "group hover:bg-muted/50 transition-colors cursor-pointer",
      isCurrentTrack && "bg-muted/30"
    )}>
      <CardContent className="flex items-center space-x-4 p-3">
        {/* Track Number or Play Button */}
        <div className="w-8 flex items-center justify-center">
          {showArtwork ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 group-hover:opacity-100 opacity-0 absolute inset-0 z-10"
                onClick={handlePlayPause}
              >
                {isTrackPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <span className={cn(
                "text-sm text-muted-foreground group-hover:opacity-0",
                isCurrentTrack && "text-primary"
              )}>
                {index !== undefined ? index + 1 : '♪'}
              </span>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handlePlayPause}
            >
              {isTrackPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        {/* Artwork */}
        {showArtwork && (
          <div className="relative w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
            {track.artwork ? (
              <Image
              loader={customLoader}
                src={track.artwork}
                alt={track.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-xs text-muted-foreground">♪</span>
              </div>
            )}
          </div>
        )}

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <p className={cn(
              "font-medium text-sm truncate",
              isCurrentTrack && "text-primary"
            )}>
              {track.title}
            </p>
            {track.isExplicit && (
              <span className="text-xs bg-muted text-muted-foreground px-1 rounded">E</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {track.artist}
            {showAlbum && track.album && ` • ${track.album}`}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleLike}
          >
            <Heart
              className={cn(
                'h-4 w-4',
                track.isLiked && 'fill-red-500 text-red-500'
              )}
            />
          </Button>

          <span className="text-xs text-muted-foreground w-10 text-right">
            {formatDuration(track.duration)}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => play(track)}>
                <Play className="mr-2 h-4 w-4" />
                Play
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Plus className="mr-2 h-4 w-4" />
                Add to queue
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Plus className="mr-2 h-4 w-4" />
                Add to playlist
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}