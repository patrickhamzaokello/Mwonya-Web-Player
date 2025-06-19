'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Play, Pause } from 'lucide-react';
import { api } from '@/lib/api';
import { useAudio } from '@/contexts/EnhancedAudioContext';
import { TrackCard } from '@/components/music/TrackCard';
import { AlbumCard } from '@/components/music/AlbumCard';
import { PlaylistCard } from '@/components/music/PlaylistCard';
import { useAuth } from '@/contexts/AuthContext';
import { customLoader } from '@/lib/utils';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const { setQueue, play, currentTrack, isPlaying } = useAudio();
  const [homeData, setHomeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadHomeData();
    }
  }, [isAuthenticated]);

  const loadHomeData = async () => {
    try {
      const data = await api.getHomeContent();
      setHomeData(data);
    } catch (error) {
      console.error('Failed to load home content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Will be handled by AppShell redirect
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handlePlayTrending = () => {
    if (homeData?.trendingTracks?.length > 0) {
      setQueue(homeData.trendingTracks, 0);
      play(homeData.trendingTracks[0]);
    }
  };

  const isTrendingPlaying = homeData?.trendingTracks?.some(
    (track: any) => track.id === currentTrack?.id
  ) && isPlaying;

  return (
    <div className="h-full overflow-auto">
      <div className="space-y-8 p-6">
        {/* Hero Section */}
        <section className="relative rounded-xl overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="absolute inset-0">
            <Image
            loader={customLoader}
              src={homeData?.hero?.backgroundImage || 'https://picsum.photos/1200/400?random=100'}
              alt="Hero background"
              fill
              className="object-cover opacity-30"
            />
          </div>
          <div className="relative p-8 md:p-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {homeData?.hero?.title || 'Welcome to Music'}
            </h1>
            <p className="text-lg md:text-xl mb-6 max-w-2xl opacity-90">
              {homeData?.hero?.subtitle || 'Discover your next favorite song'}
            </p>
            <Button size="lg" variant="secondary" onClick={handlePlayTrending}>
              <Play className="mr-2 h-5 w-5" />
              Play Trending Now
            </Button>
          </div>
        </section>

        {/* Trending Tracks */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Trending Now</h2>
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 rounded-full"
              onClick={handlePlayTrending}
            >
              {isTrendingPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
          </div>
          <div className="space-y-1">
            {homeData?.trendingTracks?.slice(0, 6).map((track: any, index: number) => (
              <TrackCard
                key={track.id}
                track={track}
                index={index}
                showArtwork={true}
                showAlbum={true}
              />
            ))}
          </div>
        </section>

        {/* New Releases */}
        <section>
          <h2 className="text-2xl font-bold mb-6">New Releases</h2>
          <ScrollArea>
            <div className="flex space-x-4 pb-4">
              {homeData?.newReleases?.map((album: any) => (
                <AlbumCard key={album.id} album={album} size="md" />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>

        {/* Featured Playlists */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Featured Playlists</h2>
          <ScrollArea>
            <div className="flex space-x-4 pb-4">
              {homeData?.featuredPlaylists?.map((playlist: any) => (
                <PlaylistCard key={playlist.id} playlist={playlist} size="md" />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>

        {/* Top Artists */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Top Artists</h2>
          <ScrollArea>
            <div className="flex space-x-4 pb-4">
              {homeData?.topArtists?.map((artist: any) => (
                <div key={artist.id} className="w-40 group">
                  <div className="relative">
                    <div className="w-40 h-40 bg-muted rounded-full overflow-hidden mb-3">
                      <Image
                           loader={customLoader}
                        src={artist.avatar}
                        alt={artist.name}
                        width={160}
                        height={160}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-sm truncate">{artist.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {artist.monthlyListeners?.toLocaleString()} monthly listeners
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>
      </div>
    </div>
  );
}
