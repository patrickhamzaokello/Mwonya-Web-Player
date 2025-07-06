"use client"

import Image from "next/image"
import { Play, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef, useState, useEffect } from "react"
import type { NewRelease } from "@/lib/home_feed_types"

interface NewReleasesSectionProps {
  releases: NewRelease[]
  heading: string
}

export function NewReleasesSection({ releases, heading }: NewReleasesSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 5)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5)
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const containerWidth = container.clientWidth
      const itemWidth = 300 + 24
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
      const itemWidth = 300 + 24
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
      const handleResize = () => setTimeout(checkScrollButtons, 100)

      container.addEventListener("scroll", handleScroll)
      window.addEventListener("resize", handleResize)

      return () => {
        container.removeEventListener("scroll", handleScroll)
        window.removeEventListener("resize", handleResize)
      }
    }
  }, [])

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
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {releases.map((release) => (
          <div key={release.id} className="flex-shrink-0 w-[280px] bg-card rounded-lg p-4 border">
            <div className="relative overflow-hidden rounded-lg bg-muted mb-4">
              <Image
                src={release.artworkPath || "/placeholder.svg"}
                alt={release.title}
                width={300}
                height={300}
                className="aspect-square object-cover"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{release.heading}</p>
              <h3 className="font-semibold text-foreground truncate">{release.title}</h3>
              <p className="text-sm text-muted-foreground">{release.artist}</p>
              <p className="text-xs text-muted-foreground">{release.tag}</p>

              {release.Tracks && release.Tracks.length > 0 && (
                <div className="mt-3 space-y-2">
                  {release.Tracks.slice(0, 3).map((track) => (
                    <div key={track.id} className="flex items-center gap-2 text-sm">
                      <Button size="icon" variant="ghost" className="h-6 w-6">
                        <Play className="w-3 h-3 fill-current" />
                      </Button>
                      <span className="flex-1 truncate">{track.title}</span>
                      <span className="text-muted-foreground">{track.duration}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
