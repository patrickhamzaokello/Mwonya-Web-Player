"use client";

import Image from "next/image";
import { Play, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect, useCallback } from "react";
import type { Album, Playlist } from "@/lib/home_feed_types";
import { useAudio } from "@/contexts/EnhancedAudioContext";
import { fetchPlaylistTracks } from "@/actions/playlist_tracks_data"; // You'll need to create this action
import Link from "next/link";
import { customUrlImageLoader } from "@/lib/utils";

interface FeaturedPlaylistSectionProps {
  playlists: Playlist[];
  heading: string;
}

// Custom hook for image fallback
const useImageFallback = (
  src: string,
  fallbackSrc: string = "/placeholder.svg"
) => {
  const [imgSrc, setImgSrc] = useState(() => {
    // Initialize with fallback if src is invalid
    if (!src || src.trim() === "" || src === "/placeholder.svg") {
      return fallbackSrc;
    }
    return src;
  });
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => {
    if (!hasError && imgSrc !== fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  }, [hasError, imgSrc, fallbackSrc]);

  // Reset when src changes
  useEffect(() => {
    if (src && src !== imgSrc && !hasError) {
      setImgSrc(src);
      setHasError(false);
    }
  }, [src, imgSrc, hasError]);

  return { imgSrc, handleError };
};

// Reusable Image Component with fallback
const ImageWithFallback = ({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}) => {
  const { imgSrc, handleError } = useImageFallback(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      priority={priority}
    />
  );
};

export default function FeaturedPlaylistsSection({
  playlists,
  heading,
}: FeaturedPlaylistSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [loadingAlbum, setLoadingAlbum] = useState<string | null>(null);

  const { setQueue, play } = useAudio();

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const handlePlayAlbum = async (playlistID: string) => {
    try {
      setLoadingAlbum(playlistID);

      // Fetch album tracks using a server action instead of a hook
      const tracks = await fetchPlaylistTracks(playlistID);

      if (tracks && tracks.length > 0) {
        const updatedTracks = tracks.map((track) => ({
          ...track,
          url: track.path,
          artwork: track.artworkPath,
          id: String(track.id),
          duration: Number(track.duration),
          genre: track.genre ?? undefined,
        }));

        setQueue(updatedTracks, 0);
        play(updatedTracks[0]);
      }
    } catch (error) {
      console.error("Error playing album:", error);
    } finally {
      setLoadingAlbum(null);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const containerWidth = container.clientWidth;
      const itemWidth = 250 + 24;
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
      const itemWidth = 250 + 24;
      const itemsToScroll = Math.floor(containerWidth / itemWidth);
      const scrollDistance = itemsToScroll * itemWidth;

      container.scrollBy({
        left: scrollDistance,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollButtons();
      const handleScroll = () => checkScrollButtons();
      const handleResize = () => {
        setTimeout(checkScrollButtons, 100);
      };

      container.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleResize);

      return () => {
        container.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return (
    <div className="w-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{heading}</h2>
          <p className="text-muted-foreground">
            Discover the latest music from your favorite artists
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="h-10 w-10 rounded-full bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="h-10 w-10 rounded-full bg-transparent"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="group cursor-pointer transition-transform duration-300 flex-shrink-0 w-[200px] md:w-[250px]"
            >
              <div className="relative overflow-hidden rounded-lg bg-muted">
                

<ImageWithFallback
                  src={playlist.coverurl}
                  alt={`${playlist.coverurl} album cover`}
                  width={300}
                  height={300}
                  className="aspect-square object-cover transition-all duration-300 group-hover:brightness-75"
                  priority
                />

                {/* Hover overlay with buttons */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <div className="flex gap-3">
                    <Button
                      size="icon"
                      className="bg-white/90 hover:bg-white text-black hover:text-black backdrop-blur-sm transition-all duration-200 rounded-full h-10 w-10"
                      onClick={() => handlePlayAlbum(playlist.id)}
                      disabled={loadingAlbum === playlist.id}
                    >
                      {loadingAlbum === playlist.id ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 fill-current" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50 backdrop-blur-sm transition-all duration-200 rounded-full h-10 w-10"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Album info */}
              <div className="mt-3 space-y-1">
                <Link
                  href={`/library/playlists/${playlist.id}`}
                  className="group"
                >
                  <h3 className="font-semibold text-foreground truncate group-hover:text-primary hover:underline transition-colors duration-200">
                    {playlist.name}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground truncate">
                  {playlist.owner}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
