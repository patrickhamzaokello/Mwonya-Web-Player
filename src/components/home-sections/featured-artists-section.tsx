"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect, useCallback } from "react";
import type { Artist } from "@/lib/home_feed_types";
import { customUrlImageLoader } from "@/lib/utils";
import Link from "next/link";

interface FeaturedArtistsSectionProps {
  artists: Artist[];
  heading: string;
}

// Custom hook for image fallback
const useImageFallback = (
  src: string,
  fallbackSrc: string = "/artist_placeholder.svg"
) => {
  const [imgSrc, setImgSrc] = useState(() => {
    // Initialize with fallback if src is invalid
    if (!src || src.trim() === "" || src === "/artist_placeholder.svg") {
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

export function FeaturedArtistsSection({
  artists,
  heading,
}: FeaturedArtistsSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
      const itemWidth = 180 + 24;
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
      const itemWidth = 180 + 24;
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
    <div className="w-full mb-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">{heading}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="h-8 w-8 rounded-full bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="h-8 w-8 rounded-full bg-transparent"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {artists.map((artist) => (
          <Link key={artist.id} href={`/library/artists/${artist.id}`}>
            <div className="flex-shrink-0 w-[250px] text-center cursor-pointer group hover:scale-[1.02] transition-all duration-300 hover:bg-primary/5 rounded-lg p-4  hover:shadow-lg transform hover:translate-y-[-2px] flex flex-col items-center justify-center text-muted-foreground hover:text-foreground">
              <div className="relative overflow-hidden rounded-full bg-muted mb-3">
                <ImageWithFallback
                  src={artist.profilephoto}
                  alt={`${artist.name} artist cover`}
                  width={300}
                  height={300}
                  className="aspect-square object-cover transition-all duration-300 group-hover:brightness-90"
                  priority
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1">
                  <h3 className="font-semibold text-foreground truncate">
                    {artist.name}
                  </h3>
                  {artist.verified && (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 27 27"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M25.875 13.5019L23.13 10.3744L23.5125 6.23438L19.4513 5.31187L17.325 1.73438L13.5 3.37688L9.675 1.73438L7.54875 5.31187L3.4875 6.22313L3.87 10.3631L1.125 13.5019L3.87 16.6294L3.4875 20.7806L7.54875 21.7031L9.675 25.2806L13.5 23.6269L17.325 25.2694L19.4513 21.6919L23.5125 20.7694L23.13 16.6294L25.875 13.5019ZM11.25 19.1269L6.75 14.6269L8.33625 13.0406L11.25 15.9431L18.6638 8.52937L20.25 10.1269L11.25 19.1269Z"
                        fill="#a900ff"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
