"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Heart,
  Share2,
  Plus,
  Music,
  Clock,
  Users,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { NewRelease } from "@/lib/home_feed_types";
import { useAudio } from "@/contexts/EnhancedAudioContext";
import { customUrlImageLoader } from "@/lib/utils";

interface MusicHeroSliderProps {
  releases: NewRelease[];
}

export function MusicHeroSlider({ releases }: MusicHeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const { setQueue, play, currentTrack, isPlaying } = useAudio();

  const heroReleases = releases || [];

  useEffect(() => {
    if (!isAutoPlaying || heroReleases.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroReleases.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, heroReleases.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroReleases.length) % heroReleases.length
    );
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroReleases.length);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const handlePlayRelease = (release: NewRelease) => {
    const tracks = release.Tracks || [];
    if (tracks && tracks.length > 0) {
      const updatedTracks = tracks.map((track) => ({
        ...track,
        url: track.path,
        id: String(track.id),
        artwork: release.artworkPath,
        duration: Number(track.duration),
        genre: track.genre ?? undefined,
      }));
      setQueue(updatedTracks, 0);
      play(updatedTracks[0]);
    }
  };

  if (!releases || heroReleases.length === 0) {
    return (
      <div className="bg-card border-border border-b h-96 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto">
            <Music className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-foreground text-xl font-semibold">
              No releases available
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              Check back later for new music
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentRelease = heroReleases[currentSlide];

  return (
    <div className="relative bg-card border-border border-b h-96 overflow-hidden">
      {/* Slides Container */}
      <div
        className="flex transition-transform duration-700 ease-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {heroReleases.map((release) => (
          <div key={release.id} className="min-w-full h-full">
            <div className="container mx-auto px-6 h-full">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 items-center h-full py-8">
                {/* Content Section */}
                <div className="space-y-6 max-w-2xl">
                  {/* Category & Status */}
               

                  {/* Main Title */}
                  <div className="space-y-2 px-0">
                   
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-muted border border-border">
                          <Image
                            src={release.artistArtwork || "/placeholder.svg"}
                            alt={release.artist}
                            width={40}
                            height={40}
                            loader={customUrlImageLoader}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-xl text-foreground font-medium">
                            {release.artist}
                          </p>
                          <div className="flex items-center gap-6 text-muted-foreground text-sm">
                            {release.Tracks && (
                              <div className="flex items-center gap-2">
                                <Music className="w-4 h-4" />
                                <span>{release.Tracks.length} tracks</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{release.tag}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
                        New Release
                      </span>
                    </div>
                    {release.exclusive && (
                      <div className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-medium">
                        Exclusive
                      </div>
                    )}
                  </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-foreground leading-tight tracking-tight">
                      {release.title}
                    </h1>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-4">
                    <Button
                      size="lg"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                      onClick={() => handlePlayRelease(release)}
                      disabled={
                        isPlaying && currentTrack?.id === String(release.id)
                      }
                    >
                      <Play className="h-5 w-5 mr-2 fill-current" />
                      {isPlaying && currentTrack?.id === String(release.id)
                        ? "Playing"
                        : "Play Album"}
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground hover:bg-muted w-12 h-12 rounded-full transition-all duration-200 hover:scale-110"
                        onClick={() => setIsLiked(!isLiked)}
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            isLiked ? "fill-current text-red-500" : ""
                          }`}
                        />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground hover:bg-muted w-12 h-12 rounded-full transition-all duration-200 hover:scale-110"
                      >
                        <Plus className="h-5 w-5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground hover:bg-muted w-12 h-12 rounded-full transition-all duration-200 hover:scale-110"
                      >
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Album Art Section */}
                <div className="flex justify-center lg:justify-end">
                  <div className="relative group">
                    {/* Main Album Art */}
                    <div className="relative">
                      <div className="w-64 h-64 lg:w-72 lg:h-72 rounded-2xl overflow-hidden bg-muted border border-border shadow-2xl">
                        <Image
                          src={release.artworkPath || "/placeholder.svg"}
                          alt={release.title}
                          width={288}
                          height={288}
                          loader={customUrlImageLoader}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Button
                            size="icon"
                            className="w-16 h-16 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-2xl transform hover:scale-110 transition-all duration-200"
                            onClick={() => handlePlayRelease(release)}
                          >
                            <Play className="h-7 w-7 ml-1 fill-current" />
                          </Button>
                        </div>
                      </div>

                     
                    </div>

                    {/* Subtle Reflection Effect */}
                    <div className="absolute top-full left-0 w-full h-16 bg-gradient-to-b from-card/20 to-transparent rounded-2xl transform scale-y-[-1] opacity-30 blur-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground hover:bg-muted w-10 h-10 rounded-full border border-border transition-all duration-200 hover:scale-110"
          onClick={toggleAutoPlay}
        >
          {isAutoPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground hover:bg-muted w-10 h-10 rounded-full border border-border transition-all duration-200 hover:scale-110"
          onClick={goToPrevious}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground hover:bg-muted w-10 h-10 rounded-full border border-border transition-all duration-200 hover:scale-110"
          onClick={goToNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-6 flex items-center gap-2">
        <span className="text-muted-foreground text-sm mr-3 font-medium">
          {currentSlide + 1} / {heroReleases.length}
        </span>
        {heroReleases.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "bg-primary w-8 shadow-lg"
                : "bg-muted hover:bg-muted-foreground w-1.5"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-border">
        <div
          className="h-full bg-primary transition-all duration-700"
          style={{
            width: `${((currentSlide + 1) / heroReleases.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
