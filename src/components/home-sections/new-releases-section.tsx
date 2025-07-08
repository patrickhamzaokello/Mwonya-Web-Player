"use client";

import Image from "next/image";
import { Play, ChevronLeft, ChevronRight, CheckCircle, Heart, MoreHorizontal, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import type { NewRelease, Track } from "@/lib/home_feed_types";
import { useAudio } from "@/contexts/EnhancedAudioContext";
import { customUrlImageLoader } from "@/lib/utils";

interface NewReleasesSectionProps {
  releases: NewRelease[];
  heading: string;
}

export function NewReleasesSection({
  releases,
  heading,
}: NewReleasesSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { setQueue, play, currentTrack, isPlaying } = useAudio();

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const containerWidth = container.clientWidth;
      const itemWidth = 450 + 32; // Increased width for prominent design
      const itemsToScroll = Math.floor(containerWidth / itemWidth);
      const scrollDistance = itemsToScroll * itemWidth;

      container.scrollBy({
        left: -scrollDistance,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const containerWidth = container.clientWidth;
      const itemWidth = 450 + 32;
      const itemsToScroll = Math.floor(containerWidth / itemWidth);
      const scrollDistance = itemsToScroll * itemWidth;

      container.scrollBy({
        left: scrollDistance,
        behavior: "smooth",
      });
    }
  };

  const handlePlayRelease = (release: NewRelease) => {
    // Fetch album tracks using a server action instead of a hook
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

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollButtons();
      const handleScroll = () => checkScrollButtons();
      const handleResize = () => setTimeout(checkScrollButtons, 100);

      container.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleResize);

      return () => {
        container.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return (
    <div className="w-full mb-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold text-foreground mb-2">{heading}</h2>
          <p className="text-lg text-muted-foreground">
            Fresh music from your favorite artists
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="h-12 w-12 rounded-full bg-background border-2 hover:bg-muted"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="h-12 w-12 rounded-full bg-background border-2 hover:bg-muted"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {releases.map((release) => (
          <div
            key={release.id}
            className="group flex-shrink-0 w-[300px] bg-card rounded-xl border hover:shadow-lg transition-all duration-300"
          >
            {/* Album Cover with Artist Info Overlay */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-t-xl bg-muted">
                <Image
                  src={release.artworkPath || "/placeholder.svg"}
                  alt={release.title}
                  width={300}
                  height={300}
                  loader={customUrlImageLoader}
                  className="w-full  object-cover transition-all duration-300 group-hover:scale-105"
                />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    size="icon"
                    className="bg-white/90 hover:bg-white text-black rounded-full h-12 w-12 shadow-lg"
                    onClick={() => handlePlayRelease(release)}
                    disabled={isPlaying && currentTrack?.id === String(release.id)}
                  >
                    <Play className="w-5 h-5 fill-current" />
                  </Button>
                </div>

                {/* Artist Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <Image
                      src={release.artistArtwork || "/placeholder.svg"}
                      alt={release.artist}
                      width={24}
                      height={24}
                       loader={customUrlImageLoader}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-white text-xs font-medium">{release.artist}</span>
                  {/* Assuming verified artists, you can add condition here */}
                  <CheckCircle className="w-3 h-3 text-blue-400" />
                </div>

                {/* Release Type Badge */}
                {release.exclusive && (
                  <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
                    Exclusive
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Release Info */}
              <div >
                <h3 className="font-bold text-lg text-foreground mb-1 truncate">{release.title}</h3>
                <p className="text-sm text-foreground hover: text-underline">{release.artist} . <span className="text-muted-foreground">{release.tag}</span></p>
              </div>
            
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
