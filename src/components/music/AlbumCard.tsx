'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause } from 'lucide-react';
import { Album } from '@/types/audio';
import { useAudio } from '@/contexts/EnhancedAudioContext';
import { customLoader } from '@/lib/utils';

interface AlbumCardProps {
  album: Album;
  size?: 'sm' | 'md' | 'lg';
}

export function AlbumCard({ album, size = 'md' }: AlbumCardProps) {
  const { setQueue, play, currentTrack, isPlaying } = useAudio();
  
  const isAlbumPlaying = album.tracks.some(track => track.id === currentTrack?.id) && isPlaying;

  const handlePlay = () => {
    if (album.tracks.length > 0) {
      setQueue(album.tracks, 0);
      play(album.tracks[0]);
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
            {album.artwork ? (
              <Image
               loader={customLoader}
                src={album.artwork}
                alt={album.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-2xl text-muted-foreground">♪</span>
              </div>
            )}
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="secondary"
                size="sm"
                className="rounded-full h-12 w-12"
                onClick={handlePlay}
              >
                {isAlbumPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <Link href={`/album/${album.id}`}>
            <h3 className="font-medium text-sm truncate hover:underline">
              {album.title}
            </h3>
          </Link>
          <Link href={`/artist/${album.artistId}`}>
            <p className="text-xs text-muted-foreground truncate hover:underline">
              {album.artist}
            </p>
          </Link>
          {album.releaseDate && (
            <p className="text-xs text-muted-foreground">
              {album.releaseDate.getFullYear()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}