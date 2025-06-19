'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause } from 'lucide-react';
import { Playlist } from '@/types/audio';
import { useAudio } from '@/contexts/EnhancedAudioContext';
import { customLoader } from '@/lib/utils';

interface PlaylistCardProps {
  playlist: Playlist;
  size?: 'sm' | 'md' | 'lg';
}

export function PlaylistCard({ playlist, size = 'md' }: PlaylistCardProps) {
  const { setQueue, play, currentTrack, isPlaying } = useAudio();
  
  const isPlaylistPlaying = playlist.tracks.some(track => track.id === currentTrack?.id) && isPlaying;

  const handlePlay = () => {
    if (playlist.tracks.length > 0) {
      setQueue(playlist.tracks, 0);
      play(playlist.tracks[0]);
    }
  };

  const sizeClasses = {
    sm: 'w-32',
    md: 'w-40',
    lg: 'w-48',
  };

  const imageSizes = {
    sm: 'w-32 h-32',
    md: 'w-40 h-40',
    lg: 'w-48 h-48',
  };

  return (
    <Card className={`${sizeClasses[size]} group hover:bg-muted/50 transition-colors`}>
      <CardContent className="p-4">
        <div className="relative mb-3">
          <div className={`${imageSizes[size]} bg-muted rounded-lg overflow-hidden relative`}>
            {playlist.artwork ? (
              <Image
               loader={customLoader}
                src={playlist.artwork}
                alt={playlist.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                <span className="text-2xl text-primary">♪</span>
              </div>
            )}
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="secondary"
                size="sm"
                className="rounded-full h-12 w-12"
                onClick={handlePlay}
                disabled={playlist.tracks.length === 0}
              >
                {isPlaylistPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <Link href={`/playlist/${playlist.id}`}>
            <h3 className="font-medium text-sm truncate hover:underline">
              {playlist.name}
            </h3>
          </Link>
          {playlist.description && (
            <p className="text-xs text-muted-foreground truncate">
              {playlist.description}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {playlist.tracks.length} {playlist.tracks.length === 1 ? 'song' : 'songs'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}