"use client"

import Image from "next/image"
import { Play, Share2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef, useState, useEffect } from "react"
import {  Track } from "@/lib/home_feed_types"
import { useAudio } from "@/contexts/EnhancedAudioContext"
interface FeaturedTracksSectionProps {
  tracks: Track[]
  heading: string
}

export default function FeaturedTracksSection({ tracks, heading }: FeaturedTracksSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const { setQueue, play, currentTrack, isPlaying } = useAudio();


  
  const handlePlayTrending = (track: Track) => {
    // rename key path to url in the track
    const updatedTrack = { ...track, url: track.path, artwork: track.artworkPath }
    if (tracks?.length > 0) {
      play({ 
        ...updatedTrack, 
        id: String(updatedTrack.id), 
        duration: Number(updatedTrack.duration), 
        genre: updatedTrack.genre ?? undefined 
      });
    }
  };

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 5) // Small threshold to account for rounding
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5)
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const containerWidth = container.clientWidth
      const itemWidth = 250 + 24 // item width + gap
      const itemsToScroll = Math.floor(containerWidth / itemWidth)
      const scrollDistance = itemsToScroll * itemWidth

      container.scrollBy({
        left: -scrollDistance,
        behavior: "smooth",
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const containerWidth = container.clientWidth
      const itemWidth = 250 + 24 // item width + gap
      const itemsToScroll = Math.floor(containerWidth / itemWidth)
      const scrollDistance = itemsToScroll * itemWidth

      container.scrollBy({
        left: scrollDistance,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      checkScrollButtons()

      const handleScroll = () => checkScrollButtons()
      const handleResize = () => {
        setTimeout(checkScrollButtons, 100) // Small delay to ensure layout is updated
      }

      container.addEventListener("scroll", handleScroll)
      window.addEventListener("resize", handleResize)

      return () => {
        container.removeEventListener("scroll", handleScroll)
        window.removeEventListener("resize", handleResize)
      }
    }
  }, [])

  return (
    <div className="w-full ">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{heading}</h2>
          <p className="text-muted-foreground">Discover the latest music from your favorite artists</p>
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
          {tracks.map((track) => (
            <div
              key={track.id}
              className="group cursor-pointer transition-transform duration-300 flex-shrink-0 w-[200px] md:w-[250px]"
            >
              <div className="relative overflow-hidden rounded-lg bg-muted">
                <Image
                  src={track.artworkPath || "/placeholder.svg"}
                  alt={`${track.title} by ${track.artist}`}
                  width={300}
                  height={300}
                  className="aspect-square object-cover transition-all duration-300 group-hover:brightness-75"
                />

                {/* Hover overlay with buttons */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <div className="flex gap-3">
                    <Button
                      size="icon"
                      className="bg-white/90 hover:bg-white text-black hover:text-black backdrop-blur-sm transition-all duration-200 rounded-full h-10 w-10"
                      onClick={() => handlePlayTrending(track)}
                    >
                      <Play className="w-4 h-4 fill-current" />
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
                <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-200">
                  {track.title}
                </h3>
                <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
